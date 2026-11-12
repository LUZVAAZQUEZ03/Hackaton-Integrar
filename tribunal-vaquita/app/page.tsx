"use client";

import { useState } from "react";
import { Formulario } from "@/components/Formulario";
import { calcularDeudas, elegirGanador } from "@/lib/cuentas";
import { emitirFallo } from "@/lib/jueces";
import { Participante, Fallo } from "@/lib/tipos";

type FasePagina = "formulario" | "fallo" | "carta" | "sorteo" | "ruleta" | "acta";

export default function Página() {
  const [fase, setFase] = useState<FasePagina>("formulario");
  const [fallo, setFallo] = useState<Fallo | null>(null);
  const [ganador, setGanador] = useState<Participante | null>(null);

  const convocar = (ps: Participante[]) => {
    const de = calcularDeudas(ps);
    const ga = elegirGanador(ps);
    setFallo(emitirFallo(de));
    setGanador(ga);
    setFase("fallo");
  };

  return (
    <main className="contenedor">
      {fase === "formulario" && (
        <Formulario onSubmit={convocar} />
      )}
      {fase === "fallo" && fallo && (
        <div className="fallo">
          <h2>Fallo del Tribunal</h2>
          <p><strong>Juez:</strong> {fallo.juez} {fallo.emoji}</p>
          <p><strong>Expediente:</strong> {fallo.expediente}</p>
          {ganador && <p><strong>Quien más puso:</strong> {ganador.nombre}</p>}
          <p>{fallo.cierre}</p>
          <ul>
            {fallo.lineas.map((l: string, i: number) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <button onClick={() => setFase("formulario")}>Nuevo caso</button>
        </div>
      )}
    </main>
  );
}