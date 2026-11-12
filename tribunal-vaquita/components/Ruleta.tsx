"use client";

import { useState } from "react";
import { SEGMENTOS } from "@/lib/ruleta";

export function Ruleta({
  sorteado,
  onResultado,
}: {
  sorteado: string;
  onResultado: (seg: string) => void;
}) {
  const [girando, setGirando] = useState(false);
  const n = SEGMENTOS.length;

  const girar = () => {
    if (girando) return;
    setGirando(true);

    const idx = Math.floor(Math.random() * n);
    const segmento = SEGMENTOS[idx].id;

    setTimeout(() => {
      setGirando(false);
      onResultado(segmento);
    }, 5000);
  };

  const angularStep = 360 / n;

  return (
    <div>
      <p>Le toca a <b>{sorteado}</b>. ¡Que gire la ruleta!</p>
      <div className="ruleta-puntero">▼</div>
      <div className="ruleta" style={{ background: `conic-gradient(${SEGMENTOS.map((s, i) => `${s.color} ${i * angularStep}deg ${(i + 1) * angularStep}deg`).join(", "))}` }}>
        {SEGMENTOS.map((s) => (
          <span key={s.id} className="ruleta-etiqueta" style={{ transform: `rotate(${SEGMENTOS.indexOf(s) * angularStep + angularStep / 2}deg)` }}>
            {s.etiqueta}
          </span>
        ))
      </div>
      <button onClick={girar} disabled={girando}>
        {girando ? "Girando..." : "🎰 ¡GIRAR!"}
      </button>
    </div>
  );
}