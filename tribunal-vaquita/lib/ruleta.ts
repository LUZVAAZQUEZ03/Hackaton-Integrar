import { Participante } from "./tipos";

export type SegmentoId = "todos" | "ganador" | "viejo" | "perro" | "salvado";
export type Segmento = { id: SegmentoId; etiqueta: string; color: string };

export const SEGMENTOS: Segmento[] = [
  { id: "todos", etiqueta: "La de todos", color: "#b71c1c" },
  { id: "ganador", etiqueta: "La del que mas pago", color: "#e53935" },
  { id: "viejo", etiqueta: "La del mas grande", color: "#ff3d00" },
  { id: "perro", etiqueta: "La del amigo con perro", color: "#ff6d00" },
  { id: "salvado", etiqueta: "Salvado", color: "#ff9100" },
];

export function sortearAmigo(participantes: Participante[], ganadorId: string) {
  const candidatos = participantes.filter((p) => p.id !== ganadorId);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

export function resolver(segmentoId: string, participantes: Participante[], ganador: Participante, sorteado: Participante) {
  const demas = participantes.filter((p) => p.id !== sorteado.id);
  const s = sorteado.nombre;
  const g = ganador.nombre;
  const textos: Record<string, string> = {
    todos: `${s} pagara la cuenta de TODOS (${demas.map((p) => p.nombre).join(", ")}). El destino no perdona.`,
    ganador: `${s} pagara la cuenta de ${g}, que fue quien mas puso. Justicia poetica.`,
    viejo: `${s} pagara la cuenta del amigo de mas edad. Ustedes saben quien es.`,
    perro: `${s} pagara la cuenta de todos los amigos que tengan perro.`,
    salvado: `${s} se salva y queda exento. La siguiente comida la pagara ${g}. La carta queda INVALIDADA.`,
  };
  return { texto: textos[segmentoId] || "", segmento: segmentoId, salvado: segmentoId === "salvado", premioInvalidado: segmentoId === "salvado", definenLosAmigos: segmentoId === "viejo" || segmentoId === "perro" };
}
