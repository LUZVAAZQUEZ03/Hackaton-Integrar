import { Fallo, Deuda } from "./tipos";

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type Juez = { nombre: string; emoji: string; apertura: string[]; castigo: string[]; cierre: string[] };

export const JUECES: Juez[] = [
  {
    nombre: "Dr. Severo Ledesma", emoji: "👨‍⚖️",
    apertura: ["Visto y considerando", "Habiendo oído a las partes", "Por unanimidad de un solo voto"],
    castigo: ["lavar los platos por un mes", "invitar la próxima ronda", "presentarse en ayunas al próximo asado"],
    cierre: ["Caso cerrado. No se admiten reclamos.", "La sentencia es firme. Cúmplase."],
  },
  {
    nombre: "Dra. Dramática Funes", emoji: "🎭",
    apertura: ["¡Cielos! Qué escándalo contable", "Nunca vi algo así en mis años de toga", "Que tiemble el grupo de WhatsApp"],
    castigo: ["quedar en la historia como el que no puso", "pagar con intereses y con lágrimas"],
    cierre: ["¡Que se haga justicia, aunque se caiga el cielo!", "Esta corte se retira a llorar."],
  },
  {
    nombre: "Juez Abuelo Ramón", emoji: "😴",
    apertura: ["Eh... ¿qué estábamos viendo? Ah, sí", "Zzz... perdón, decía que", "Cuando yo era joven esto se arreglaba con un apretón de manos, pero bueno"],
    castigo: ["traerme un cafecito", "pagar y no hacerme perder la siesta"],
    cierre: ["Y ahora, si me disculpan... zzz.", "Fallo dictado. ¿Alguien vio mis anteojos?"],
  },
  {
    nombre: "Relator Martínez", emoji: "🎙️",
    apertura: ["¡Atención, atención, que se viene el fallo!", "¡Y llegamos a los minutos finales de esta vaquita!", "¡Se abre el marcador de las deudas!"],
    castigo: ["transferir YA, sin VAR ni excusas", "poner la plata como un campeón"],
    cierre: ["¡Gooool de la justicia!", "¡Final del partido, señoras y señores!"],
  },
];

export function emitirFallo(deudas: Deuda[]): Fallo {
  const j = pick(JUECES);
  const prob = (Math.random() * 60 + 30).toFixed(1).replace(".", ",");
  return {
    juez: j.nombre,
    emoji: j.emoji,
    expediente: `EXP-${Math.floor(Math.random() * 9000 + 1000)}`,
    lineas: deudas.map(
      (d) =>
        `${pick(j.apertura)}, ${d.deudor} deberá abonar $${d.monto} a ${d.acreedor}, bajo apercibimiento de ${pick(j.castigo)}. (${prob}% de probabilidad de que ${d.deudor} se haga el distraído.)`
    ),
    cierre: pick(j.cierre),
  };
}