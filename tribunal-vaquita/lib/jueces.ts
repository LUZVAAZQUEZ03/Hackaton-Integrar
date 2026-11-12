import { Fallo, Deuda } from "./tipos";

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
type Juez = { nombre: string; emoji: string; apertura: string[]; cierre: string[] };

export const JUECES: Juez[] = [
  { nombre: "Dra. Balanza", emoji: "⚖️", apertura: ["Visto y considerando", "En nombre de la vaquita"], cierre: ["Caso concluido.", "La justicia ha hablado."] },
  { nombre: "Juez Bigotes", emoji: "🐮", apertura: ["Habiendo revisado los comprobantes", "Por orden del tribunal"], cierre: ["Que conste en actas.", "Se levanta la sesion."] },
  { nombre: "Magistrada Mate", emoji: "🧉", apertura: ["Considerando el espiritu del grupo", "Luego de una profunda deliberacion"], cierre: ["No hay mas que discutir.", "Fallo firme y definitivo."] },
  { nombre: "Fiscal del Asado", emoji: "🥩", apertura: ["Con la parrilla como testigo", "Atendiendo a la evidencia"], cierre: ["A comer y a pagar.", "El expediente queda cerrado."] },
];

export function emitirFallo(deudas: Deuda[]): Fallo {
  const j = pick(JUECES);
  return { juez: j.nombre, emoji: j.emoji, expediente: `EXP-${Math.floor(1000 + Math.random() * 9000)}`, lineas: deudas.map((d) => `${pick(j.apertura)}, ${d.deudor} debera abonar $${d.monto} a ${d.acreedor}.`), cierre: pick(j.cierre) };
}
