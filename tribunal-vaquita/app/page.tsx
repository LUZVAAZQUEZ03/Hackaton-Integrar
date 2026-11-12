"use client";

import { useState } from "react";
import { Formulario } from "@/components/Formulario";
import { calcularDeudas, elegirGanador } from "@/lib/cuentas";
import { emitirFallo } from "@/lib/jueces";
import { Participante, Fallo, Deuda } from "@/lib/tipos";
import { Fallo as FalloComponent } from "@/components/Fallo";
import { CartaExencion } from "@/components/CartaExencion";

type FasePagina = "formulario" | "fallo" | "carta" | "sorteo" | "ruleta" | "acta";

export default function Página() {
  const [fase, setFase] = useState<FasePagina>("formulario");
  const [fallo, setFallo] = useState<Fallo | null>(null);
  const [ganador, setGanador] = useState<Participante | null>(null);
  const [otros, setOthers] = useState<string[]>([]);

  const convocar = (ps: Participante[]) => {
    const de = calcularDeudas(ps);
    const ga = elegirGanador(ps);
    setFallo(emitirFallo(de));
    setGanador(ga);
    setOthers(ps.filter((p) => p.id !== ga.id).map((p) => p.nombre));
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
          otros={otros}
          onNominar={(_nombre: string) => {
            void _nombre;
            // Lógica de nominar - ir a acta
            setFase("acta");
          }}
          onDejarAlDestino={() => {
            // Lógica de dejar al destino - ir a sorteo/ruleta
            setFase("sorteo");
          }}
        />
      )}
    </main>
  );
}