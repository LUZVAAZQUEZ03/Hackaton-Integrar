"use client";

import { Formulario } from "@/components/Formulario";
import { calcularDeudas } from "@/lib/cuentas";
import { elegirGanador } from "@/lib/cuentas";
import { emitirFallo } from "@/lib/jueces";
import { Participante } from "@/lib/tipos";
import { Fallo } from "@/lib/tipos";

type FasePagina = "formulario" | "fallo" | "carta" | "sorteo" | "ruleta" | "acta";

export default function Página() {
  const [fase, setFase] = useState<FasePagina>("formulario");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [fallo, setFallo] = useState<Fallo | null>(null);
  const [ganador, setGanador] = useState<Participante | null>(null);

  const convocar = () => {
    const de = calcularDeudas(participantes);
    const ga = elegirGanador(participantes);
    const falloActual = emitirFalla(de);
    setDeudas(de);
    setFallo(falloActual);
    setGanador(ga);
    setFase("fallo");
  };

  return (
    <main className="contenedor">
      {fase === "formulario" && (
        <Formulario onSubmit={convocar} />
      )}
      {fase === "fallo" && (
        <div className="fallo">
          <h2>Fallo del Tribunal</h2>
          <p><strong>Juez:</strong> {fallo.juez} {fallo.emoji}</p>
          <p><strong>Expediente:</strong> {fallo.expediente}</p>
          <p>{fallo.cierre}</p>
          <ul>
            {fallo.lineas.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <button onClick={() => setFase("formulario")}>Nuevo caso</button>
        </div>
      )}
    </main>
  );
}