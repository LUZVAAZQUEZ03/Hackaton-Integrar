"use client";

import type { Fallo } from "@/lib/tipos";

export function Fallo({ fallo, onApelar }: { fallo: Fallo; onApelar: () => void }) {
  return (
    <div className="fallo">
      <h2>Fallo del Tribunal</h2>
      <p>
        <strong>Juez:</strong> {fallo.juez} {fallo.emoji}
      </p>
      <p><strong>Expediente:</strong> {fallo.expediente}</p>
      <p>{fallo.cierre}</p>
      <ul>
        {fallo.lineas.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      <button onClick={onApelar} className="btn-apelar">
        Apelar
      </button>
    </div>
  );
}