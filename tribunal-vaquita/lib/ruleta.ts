export type SegmentoId = "todos" | "ganador" | "viejo" | "perro" | "salvado";

export type Segmento = {
  id: SegmentoId;
  etiqueta: string;
  color: string;
};

export const SEGMENTOS: Segmento[] = [
  { id: "todos", etiqueta: "💸 La de todos", color: "#b71c1c" },
  { id: "ganador", etiqueta: "👑 La del que más pagó", color: "#e53935" },
  { id: "viejo", etiqueta: "👴 La del más grande", color: "#ff3d00" },
  { id: "perro", etiqueta: "🐶 La del amigo con perro", color: "#ff6d00" },
  { id: "salvado", etiqueta: "🛟 ¡Salvado!", color: "#ff9100" },
];

export function sortearAmigo(participantes: any[], ganadorId: string) {
  const candidatos = participantes.filter((p: any) => p.id !== ganadorId);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

export function resolver(segmentoId: string, participantes: any[], ganador: any, sorteado: any) {
  const demas = participantes.filter((p: any) => p.id !== sorteado.id);
  const s = sorteado.nombre;
  const g = ganador.nombre;
  const textos: Record<string, string> = {
    todos: `${s} pagará la cuenta de TODOS (${demas.map((p: any) => p.nombre).join(", ")}). El destino no perdona.`,
    ganador: `${s} pagará la cuenta de ${g}, que fue quien más puso. Justicia poética.`,
    viejo: `${s} pagará la cuenta del amigo de más edad. El Tribunal confía en que ustedes sabrán quién es: respeto a los mayores.`,
    perro: `${s} pagará la cuenta de todos los amigos que tengan perro. Que se presenten los dueños; los perros miran con aprobación.`,
    salvado: `¡${s} se salva y queda exento de pagar! En su lugar, la siguiente comida la pagará ${g}, quien más puso esta vez. Su carta de exención queda INVALIDADA.`,
  };
  return {
    texto: textos[segmentoId] || "",
    segmento: segmentoId,
    salvado: segmentoId === "salvado",
    premioInvalidado: segmentoId === "salvado",
    definenLosAmigos: segmentoId === "viejo" || segmentoId === "perro",
  };
}