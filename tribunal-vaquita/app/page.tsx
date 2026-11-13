"use client";

import { useState } from "react";
import { Formulario } from "@/components/Formulario";
import { Fallo as FalloComponent } from "@/components/Fallo";
import { CartaExencion } from "@/components/CartaExencion";
import { Sorteo } from "@/components/Sorteo";
import { Ruleta } from "@/components/Ruleta";
import { calcularDeudas, elegirGanador } from "@/lib/cuentas";
import { emitirFallo } from "@/lib/jueces";
import { resolver, sortearAmigo } from "@/lib/ruleta";
import { Deuda, Fallo, Participante } from "@/lib/tipos";

type Fase = "formulario" | "fallo" | "carta" | "sorteo" | "ruleta" | "acta";

export default function Pagina() {
  const [fase, setFase] = useState<Fase>("formulario");
  const [fallo, setFallo] = useState<Fallo | null>(null);
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [ganador, setGanador] = useState<Participante | null>(null);
  const [sorteado, setSorteado] = useState<Participante | null>(null);
  const [decreto, setDecreto] = useState("");
  const [premioInvalidado, setPremioInvalidado] = useState(false);
  const [definenLosAmigos, setDefinenLosAmigos] = useState(false);

  const convocar = (ps: Participante[]) => {
    const nuevasDeudas = calcularDeudas(ps);
    setParticipantes(ps); setDeudas(nuevasDeudas); setGanador(elegirGanador(ps));
    setFallo(emitirFallo(nuevasDeudas)); setFase("fallo");
  };
  const apelar = () => setFallo(emitirFallo(deudas));
  const abrirCarta = () => setFase("carta");
  const nominar = (nombre: string) => { setDecreto(`${nombre} pagara la proxima cuenta de ${ganador?.nombre}.`); setFase("acta"); };
  const dejarAlDestino = () => { setSorteado(sortearAmigo(participantes, ganador!.id)); setFase("sorteo"); };
  const resultado = (id: string) => {
    if (!ganador || !sorteado) return;
    const falloRuleta = resolver(id, participantes, ganador, sorteado);
    setDecreto(falloRuleta.texto); setPremioInvalidado(falloRuleta.premioInvalidado); setDefinenLosAmigos(falloRuleta.definenLosAmigos); setFase("acta");
  };

  return <main className="contenedor">
    <header className="marca"><span className="marca-icono">⚖</span><div><p>TRIBUNAL</p><h1>de la Vaquita</h1></div></header>
    {fase === "formulario" && <Formulario onSubmit={convocar} />}
    {fase === "fallo" && fallo && <section className="pantalla"><p className="ganador">Quien mas puso: <strong>{ganador?.nombre}</strong></p><FalloComponent fallo={fallo} onApelar={apelar} /><button className="btn-carta" onClick={abrirCarta}>Abrir carta de exencion</button></section>}
    {fase === "carta" && ganador && <CartaExencion ganador={ganador.nombre} otros={participantes.filter((p) => p.id !== ganador.id).map((p) => p.nombre)} onNominar={nominar} onDejarAlDestino={dejarAlDestino} />}
    {fase === "sorteo" && sorteado && <section className="pantalla"><h2>Sorteo del destino</h2><p>El tribunal elige quien enfrentara la ruleta.</p><Sorteo candidatos={participantes.filter((p) => p.id !== ganador?.id).map((p) => p.nombre)} sorteado={sorteado.nombre} onFin={() => setFase("ruleta")} /></section>}
    {fase === "ruleta" && sorteado && <section className="pantalla"><p>Le toca a <strong>{sorteado.nombre}</strong></p><Ruleta sorteado={sorteado.nombre} onResultado={resultado} /></section>}
    {fase === "acta" && <section className="acta-final"><div className="acta-documento"><p className="acta-membrete">TRIBUNAL DE LA VAQUITA</p><h2>ACTA OFICIAL DE VEREDICTO</h2><p>Expediente: {fallo?.expediente}</p><h3>Fallo del tribunal</h3><p><strong>Juez:</strong> {fallo?.juez} {fallo?.emoji}</p><ul>{fallo?.lineas.map((linea, i) => <li key={i}>{linea}</li>)}</ul><p>{fallo?.cierre}</p><h3>Decreto final</h3><p>{decreto}</p>{premioInvalidado && <p><strong>La carta de exencion queda invalidada.</strong></p>}{definenLosAmigos && <p><strong>Los amigos deben definir el criterio de este segmento.</strong></p>}<div className="acta-firma"><span>Con firma y sello</span><strong>La Justicia Vaquiteril</strong><small>Tribunal de la Vaquita</small></div></div><div className="acta-acciones"><button onClick={() => setFase("formulario")}>Nuevo caso</button><button onClick={() => window.print()}>Imprimir acta</button></div></section>}
  </main>;
}
