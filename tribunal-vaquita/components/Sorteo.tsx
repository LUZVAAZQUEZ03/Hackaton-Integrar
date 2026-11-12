"use client";

import { useEffect, useState } from "react";
import { redoble, tick } from "@/lib/sonidos";

export function Sorteo({
  candidatos,
  sorteado,
  onFin,
}: {
  candidatos: string[];
  sorteado: string;
  onFin: () => void;
}) {
  const [mostrado, setMostrado] = useState(candidatos[0]);
  const [terminado, setTerminado] = useState(false);

  useEffect(() => {
    redoble(2.5);
    let t = 0, paso = 70, i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    while (t < 2400) {
      const nombre = candidatos[i % candidatos.length];
      timers.push(setTimeout(() => { setMostrado(nombre); tick(); }, t));
      t += paso;
      paso *= 1.12;
      i++;
    }
    timers.push(setTimeout(() => {
      setMostrado(sorteado);
      setTerminado(true);
      setTimeout(onFin, 1200);
    }, t + 100));
    return () => timers.forEach(clearTimeout);
  }, [candidatos, sorteado, onFin]);

  return (
    <div className="sorteo">
      <p>⚖️ El Tribunal toma el control…</p>
      <h2 className={terminado ? "sorteado" : "temblor"}>
        {mostrado}</h2>
      {terminado && <p>¡El destino te eligió!</p>}
    </div>
  );
}