"use client";

import { useEffect, useRef } from "react";

const COLORES = ["#b71c1c", "#e53935", "#ff3d00", "#ff6d00", "#ff9100", "#ffab00"];

export function ExplosionPixelada({ onFin }: { onFin?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const onFinRef = useRef(onFin);
  useEffect(() => {
    onFinRef.current = onFin;
  }, [onFin]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const W = 80,
      H = 60;
    canvas.width = W;
    canvas.height = H;

    const ps = Array.from({ length: 160 }, () => {
      const a = Math.random() * Math.PI * 2;
      const v = Math.random() * 1.6 + 0.3;
      return {
        x: W / 2,
        y: H / 2,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        vida: 25 + Math.random() * 35,
        tam: Math.random() < 0.3 ? 3 : 2,
        c: COLORES[Math.floor(Math.random() * COLORES.length)],
      };
    });

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      let vivas = false;
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.vida--;
        if (p.vida > 0) {
          vivas = true;
          ctx.fillStyle = p.c;
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.tam, p.tam);
        }
      }
      if (vivas) raf = requestAnimationFrame(loop);
      else onFinRef.current?.();
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        imageRendering: "pixelated",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}