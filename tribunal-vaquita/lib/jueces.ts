const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type Juez = { nombre: string; emoji: string; apertura: string[]; castigo: string[]; cierre: string[] };

export const JUECES: Juez[] = [
  {
    nombre: "Dr. Simplificado", emoji: "👨‍⚖️",
    apertura: ["Visto y considerando"],
    castigo: ["pagar la cuenta"],
    cierre: ["Caso concluido."],
  },
];

export function emitirFallo(deudas: any[]): Fallo {
  const j = pick(JUECES);
  const prob = "50.0";
  return {
    juez: j.nombre,
    emoji: j.emoji,
    expediente: "EXP-1000",
    lineas: deudas.map(
      (d) =>
        `${pick(j.apertura)}, ${d.deudor} deberá abonar $${d.monto} a ${d.acreedor}. (${prob}% de probabilidad)`
    ),
    cierre: pick(j.cierre),
  };
}