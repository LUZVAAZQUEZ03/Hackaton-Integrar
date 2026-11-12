"use client";
import { useState } from "react";
import { SEGMENTOS } from "@/lib/ruleta";

export function Ruleta({ sorteado, onResultado }: { sorteado: string; onResultado: (seg: string) => void }) {
  const [girando, setGirando] = useState(false);
  const n = SEGMENTOS.length;
  const paso = 360 / n;
  const girar = () => {
    if (girando) return;
    setGirando(true);
    const resultado = SEGMENTOS[Math.floor(Math.random() * n)].id;
    setTimeout(() => { setGirando(false); onResultado(resultado); }, 5000);
  };
  const fondo = `conic-gradient(${SEGMENTOS.map((s, i) => `${s.color} ${i * paso}deg ${(i + 1) * paso}deg`).join(", ")})`;
  return <div>
    <p>Le toca a <b>{sorteado}</b>. Que gire la ruleta.</p>
    <div className="ruleta-puntero">▼</div>
    <div className={`ruleta${girando ? " girando" : ""}`} style={{ background: fondo }}>
      {SEGMENTOS.map((s, i) => <span key={s.id} className="ruleta-etiqueta" style={{ transform: `rotate(${i * paso + paso / 2}deg)` }}>{s.etiqueta}</span>)}
    </div>
    <button onClick={girar} disabled={girando}>{girando ? "Girando..." : "🎰 ¡GIRAR!"}</button>
  </div>;
}
