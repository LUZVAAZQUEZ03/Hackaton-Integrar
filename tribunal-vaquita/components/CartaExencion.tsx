"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { redoble, explosion, fanfarria } from "@/lib/sonidos";
import { ExplosionPixelada } from "./ExplosionPixelada";

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

const FRASES = [
  "Por la presente se certifica que este ciudadano pagó cuando nadie quería.",
  "El Tribunal reconoce una generosidad sospechosamente heroica.",
  "Quien pone primero, cena tranquilo. Así lo dispone esta corte.",
];

type Fase = "cerrada" | "suspenso" | "boom" | "revelada";

export function CartaExencion({
  ganador,
  otros,
  onNominar,
  onDejarAlDestino,
}: {
  ganador: string;
  otros: string[];
  onNominar: (nombre: string) => void;
  onDejarAlDestino: () => void;
}) {
  const [fase, setFase] = useState<Fase>("cerrada");
  const [frase, setFrase] = useState("");
  const [codigo, setCodigo] = useState("");
  const [elegido, setElegido] = useState(otros[0] ?? "");

  const abrir = () => {
    setFase("suspenso");
    redoble(1.5);
    setTimeout(() => {
      setFase("boom");
      explosion();
      fanfarria();
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
      setFrase(pick(FRASES));
      setCodigo(`EXENCION-${Math.floor(Math.random() * 9000 + 1000)}`);
      setTimeout(() => setFase("revelada"), 700);
    }, 1500);
  };

  return (
    <div className={fase === "suspenso" ? "temblor" : ""}>
      {fase === "cerrada" && <button onClick={abrir}>🔥 ABRIR CARTA DEL TRIBUNAL 🔥</button>}
      {fase === "boom" && <ExplosionPixelada onFin={() => setFase("revelada")} />}
      {fase === "revelada" && (
        <div className="carta">
          <h2>CARTA DE EXENCIÓN</h2>
          <p>Otorgada a <b>{ganador}</b> para la próxima vaquita.</p>
          <p><i>{frase}</i></p>
          <p className="codigo">{codigo}</p>

          <select value={elegido} onChange={(e) => setElegido(e.target.value)}>
            {otros.map((o) => <option key={o}>{o}</option>)}
          </select>
          <button onClick={() => onNominar(elegido)}>Nominar a pagar</button>
          <button onClick={onDejarAlDestino}>🎲 No quiero decidir: que decida el destino</button>
        </div>
      )}
    </div>
  );
}