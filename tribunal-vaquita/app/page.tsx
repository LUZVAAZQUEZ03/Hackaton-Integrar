"use client";

import { useState } from "react";
import { Formulario } from "@/components/Formulario";
import { calcularDeudas, elegirGanador } from "@/lib/cuentas";
import { emitirFallo } from "@/lib/jueces";
import { Participante, Fallo, Deuda } from "@/lib/tipos";
import { Fallo as FalloComponent } from "@/components/Fallo";
import { CartaExencion } from "@/components/CartaExencion";
import { SEGMENTOS, sortearAmigo, resolver } from "@/lib/ruleta";

type FasePagina = "formulario" | "fallo" | "carta" | "sorteo" | "ruleta" | "acta";

export default function Página() {
  const [fase, setFase] = useState<FasePagina>("formulario");
  const [fallo, setFallo] = useState<Fallo | null>(null);
  const [ganador, setGanador] = useState<Participante | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [sorteado, setSorteado] = useState<Participante | null>(null);
  const [decreto, setDecreto] = useState<string>("");
  const [premioInvalidado, setPremioInvalidado] = useState(false);
  const [definenLosAmigos, setDefinenLosAmigos] = useState(false);

  const convocar = (ps: Participante[]) => {
    const de = calcularDeudas(ps);
    const ga = elegirGanador(ps);
    setFallo(emitirFallo(de));
    setGanador(ga);
    setParticipantes(ps);
    setFase("fallo");
  };

  const apelar = () => {
    const de = fallo
      ? fallo.lineas.map((l) => {
          const match = l.match(/deberá abonar \$[\d.]+ a (.+?),/);
          const deudorMatch = l.match(/([^ ]+) deberá abonar/);
          return {
            deudor: deudorMatch ? deudorMatch[1] : "",
            acreedor: match ? match[1] : "",
            monto: 0,
          } as Deuda;
        })
      : [];
    setFallo(emitirFallo(de));
  };

  const abrirCarta = () => {
    setFase("carta");
  };

  const onNominar = (nombre: string) => {
    setFase("acta");
  };

  const onDejarAlDestino = () => {
    setSorteado(sortearAmigo(participantes, ganador!.id));
    setFase("sorteo");
  };

  const onFinSorteo = () => {
    setFase("ruleta");
  };

  const onResultado = (segmentoId: string) => {
    const g = ganador ?? { id: "", nombre: "", aportado: 0 };
    const ps = participantes.map((p: any) => ({ id: p.id, nombre: p.nombre, aportado: p.aportado }));
    const gAny = ganador ?? { id: "", nombre: "", aportado: 0 };
    const r = resolver(segmentoId, ps, gAny, sorteado!);
    setDecreto(r.texto);
    setPremioInvalidado(r.premioInvalidado);
    setDefinenLosAmigos(r.definenLosAmigos);
    setFase("acta");
  };

  return (
    <main className="contenedor">
      {fase === "formulario" && (
        <Formulario onSubmit={convocar} />
      )}
      {fase === "fallo" && fallo && (
        <div>
          {ganador && <p><strong>Quien más puso:</strong> {ganador.nombre}</p>}
          <FalloComponent fallo={fallo} onApelar={apelar} />
          <button onClick={abrirCarta} className="btn-apelar">
            🔥 Abrir carta de exención
          </button>
        </div>
      )}
      {fase === "carta" && (
        <CartaExencion
          ganador={ganador!.nombre}
          otros={participantes.filter((p) => p.id !== (ganador?.id ?? "")).map((p) => p.nombre)}
          onNominar={onNominar}
          onDejarAlDestino={onDejarAlDestino}
        />
      )}
      {fase === "sorteo" && sorteado && (
        <div>
          <h2>⚖️ Sorteo del destino</h2>
          <p>Se sortea a un amigo entre los demás participantes.</p>
          <Sorteo
            candidatos={participantes.filter((p) => p.id !== (ganador?.id ?? "")).map((p) => p.nombre)}
            sorteado={sorteado!.nombre}
            onFin={onFinSorteo}
          />
        </div>
      )}
      {fase === "ruleta" && sorteado && (
        <div>
          <p>Le toca a <b>{sorteado!.nombre}</b>. ¡Que gire la ruleta!</p>
          <Ruleta
            sorteado={sorteado!.nombre}
            onResultado={onResultado}
          />
        </div>
      )}
      {fase === "acta" && (
        <div className="acta-final">
          <h2>DECRETO FINAL</h2>
          <p>{decreto}</p>
          {premioInvalidado && <p><strong>⚠️ Premio invalidado: la carta de exención queda sin efecto.</strong></p>}
          {definenLosAmigos && <p><strong>📝 Nota:</strong> Algunos segmentos requieren definir entre los amigos quién es el de más edad o quiénes tienen perro.</p>}
          <button onClick={() => setFase("formulario")}>Nuevo caso</button>
          <button onClick={() => window.print()}>Imprimir acta</button>
        </div>
      )}
    </main>
  );
}