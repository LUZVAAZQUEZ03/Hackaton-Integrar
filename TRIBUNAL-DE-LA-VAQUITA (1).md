# ⚖️ Tribunal de la Vaquita — Especificación para el agente

> Hackatón 2026 · La Feria de Soluciones Improbables · **90 minutos**, individual, IA permitida.
> Stack: **React + Next.js (App Router, TypeScript)**. Sin backend, sin base de datos, sin login.

## 0. Instrucciones para el agente

Sos un asistente de programación. Construí el proyecto descripto abajo respetando estas reglas:

1. **Prioridad absoluta: que ande de punta a punta.** Primero la cuenta y un fallo simple, después los jueces, después la carta, después la ruleta. Hacé un commit cada vez que algo funcione.
2. **Una sola página** (`app/page.tsx`) con estado en `useState`. Nada de API routes ni base de datos.
3. **Todo lo aleatorio se ejecuta dentro de eventos (clics) o `useEffect`**, nunca directo en el render (evita errores de hidratación en Next.js).
4. **Sin assets externos**: los sonidos salen de Web Audio API, la explosión de un `<canvas>` chiquito escalado, el confeti de `canvas-confetti`.
5. **Código simple y comentado**: la dueña del proyecto tiene que poder explicar qué hace cada parte el martes 17/11.
6. Español rioplatense en toda la interfaz y en los textos del tribunal.
7. Si algo no entra en el tiempo, **achicá**: la ruleta puede quedar para el final.

## 1. Ficha del invento

| Campo | Valor |
|---|---|
| **Nombre** | El Tribunal de la Vaquita |
| **Pabellón** | Molestias Cotidianas |
| **Quién** | Cualquier grupo de amigos que junta plata para un regalo, una cena o una vaquita |
| **Problema** | Nunca queda claro cuánto puso cada uno ni quién le debe a quién |
| **Entrada** | Nombre y monto aportado de cada participante (el total se calcula con la suma) |
| **Proceso** | Calcula el saldo de cada persona, resuelve las deudas con la menor cantidad de pagos y un juez emite el fallo |
| **Salida** | El fallo del juez, la lista de pagos, el expediente y la carta de exención para quien más puso |
| **Ingredientes** | Veredicto inapelable (el fallo) · Comprobante oficial (la carta) · Personaje que opina (los jueces) · Botón de emergencia (nominar / ruleta) |

> La regla pide **un** ingrediente. El principal es **veredicto inapelable**. Los demás son decoración que refuerza el mismo concepto. En el README y en la exposición, presentá primero el principal.

## 2. Flujo de la aplicación

```
[1. Formulario] → [2. Fallo del juez + deudas] → [3. Carta escandalosa para quien más puso]
                                                         │
                            ┌────────────────────────────┴───────────────────────────┐
                            ▼                                                        ▼
                  [4a. Nominar a alguien]                              [4b. "Que decida el destino"]
                  (elige quién paga su próxima cuenta)                 SORTEO de un amigo + RULETA (5 opciones)
                            │                                                        │
                            └──────────────────────► [5. Decreto final imprimible] ◄┘
```

### Pantalla 1 · Formulario
- Lista dinámica de participantes (mínimo 3). Cada fila: **nombre** y **monto que puso**. Nada más: la edad y los perros los deciden los amigos entre ellos.
- Botón "Convocar al tribunal".
- Validar: nombres no vacíos y no repetidos, montos ≥ 0.
- Un botón "Cargar ejemplo" que complete datos de prueba (sirve para la demo y para testear en un minuto).

### Pantalla 2 · Fallo
- Se sortea un **juez** y se muestra su nombre, su avatar emoji y un **número de expediente** al azar.
- Se muestra la lista de pagos (quién le paga cuánto a quién), con frases del juez.
- Botón **"Apelar"**: vuelve a sortear otro juez y otro texto, **con los mismos montos**.

### Pantalla 3 · Carta de exención
- El ganador es **quien puso más plata**. Si hay empate, se sortea entre los empatados.
- Botón "🔥 ABRIR CARTA DEL TRIBUNAL 🔥" dispara la secuencia escandalosa (sección 6).
- La carta dice que el ganador queda **exento de la próxima vaquita**, con una frase certificada por el tribunal y un código tipo `EXENCION-4821`.
- Debajo hay dos botones: **"Nominar a alguien"** y **"No quiero decidir, que decida el destino"**.

### Pantalla 4a · Nominar
- Un `<select>` con los demás participantes y botón "Nominar a pagar". Resultado: `⚖️ Por decreto, {nominado} pagará la cuenta de {ganador}.`

### Pantalla 4b · Sorteo + ruleta
- Si el ganador no quiere decidir, el tribunal toma el control: primero **sortea a un amigo** (animación tipo tragamonedas con redoble) y después gira la **ruleta** con 5 segmentos (sección 8) que decide qué paga ese amigo.
- Si sale **¡Salvado!**, el sorteado queda exento y la siguiente comida la paga quien más puso, invalidando su premio.
- El resultado se muestra como decreto y se registra en el acta.

### Pantalla 5 · Decreto final
- Resumen: fallo, carta y destino de la próxima cuenta, en formato "acta oficial" con borde doble, sello y firma, imprimible con `window.print()` (usá `@media print` para ocultar botones).

## 3. Estructura de archivos

```
app/
  layout.tsx
  page.tsx                  # orquestador: maneja las fases con useState
  globals.css               # animaciones + estilos de la carta y la ruleta
components/
  Formulario.tsx
  Fallo.tsx
  CartaExencion.tsx
  ExplosionPixelada.tsx
  Sorteo.tsx
  Ruleta.tsx
  ActaFinal.tsx
lib/
  tipos.ts
  cuentas.ts                # saldos y deudas (lógica pura, testeable)
  jueces.ts                 # jueces, pools de frases y emitirFallo
  ruleta.ts                 # construcción de segmentos y resolución del resultado
  sonidos.ts                # Web Audio API
```

Instalación:

```bash
npx create-next-app@latest tribunal-vaquita --ts --app --eslint --no-tailwind --src-dir=false --import-alias "@/*"
cd tribunal-vaquita
npm i canvas-confetti
npm i -D @types/canvas-confetti
npm run dev
```

## 4. Modelo de datos

```ts
// lib/tipos.ts
export type Participante = {
  id: string;
  nombre: string;
  aportado: number;      // plata que puso
};

export type Deuda = { deudor: string; acreedor: string; monto: number };

export type Fallo = {
  juez: string;
  emoji: string;
  expediente: string;
  lineas: string[];      // una frase por deuda
  cierre: string;
};
```

## 5. Lógica de las cuentas (`lib/cuentas.ts`)

Regla: cada uno debería haber puesto `total / cantidad`. El **saldo** es `aportado - cuotaJusta`. Saldo positivo = le deben; negativo = debe. Después se emparejan el que más debe con el que más tiene a favor hasta saldar todo.

```ts
import { Participante, Deuda } from "./tipos";

export function calcularDeudas(ps: Participante[]): Deuda[] {
  const total = ps.reduce((s, p) => s + p.aportado, 0);
  const cuota = total / ps.length;

  const saldos = ps.map((p) => ({ nombre: p.nombre, saldo: round(p.aportado - cuota) }));
  const deudores = saldos.filter((s) => s.saldo < 0).sort((a, b) => a.saldo - b.saldo);
  const acreedores = saldos.filter((s) => s.saldo > 0).sort((a, b) => b.saldo - a.saldo);

  const deudas: Deuda[] = [];
  let i = 0, j = 0;
  while (i < deudores.length && j < acreedores.length) {
    const monto = round(Math.min(-deudores[i].saldo, acreedores[j].saldo));
    if (monto > 0) deudas.push({ deudor: deudores[i].nombre, acreedor: acreedores[j].nombre, monto });
    deudores[i].saldo = round(deudores[i].saldo + monto);
    acreedores[j].saldo = round(acreedores[j].saldo - monto);
    if (deudores[i].saldo === 0) i++;
    if (acreedores[j].saldo === 0) j++;
  }
  return deudas;
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Gana quien puso más plata. Si hay empate, se sortea entre los empatados. */
export function elegirGanador(ps: Participante[]): Participante {
  const max = Math.max(...ps.map((p) => p.aportado));
  const empatados = ps.filter((p) => p.aportado === max);
  return empatados[Math.floor(Math.random() * empatados.length)];
}
```

Casos que tiene que manejar: todos pusieron lo mismo (sin deudas: el juez lo dice con un fallo especial: "Caso cerrado, aquí no hay deudores"), y montos con decimales.

## 6. Jueces y fallos variables (`lib/jueces.ts`)

La **cuenta** nunca cambia. Lo que cambia es **cómo lo dice el tribunal**: se sortea un juez con personalidad y cada uno tiene sus propios pools de frases.

```ts
import { Deuda, Fallo } from "./tipos";

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
```

El botón **Apelar** simplemente vuelve a llamar a `emitirFallo` con las mismas deudas y guarda el resultado en el estado.

## 7. La carta escandalosa

Secuencia de 3 tiempos, disparada desde un **clic** (los navegadores solo permiten sonido tras una interacción):

1. **Suspenso (1,5 s):** la pantalla tiembla y suena un redoble.
2. **Explosión:** flash, ruido de explosión, explosión pixelada en rojos y naranjas y confeti.
3. **Revelación:** la carta entra con zoom y rebote.

### 7.1 Sonidos sin archivos (`lib/sonidos.ts`)

```ts
let ctx: AudioContext | null = null;
let silenciado = false;
const getCtx = () => (ctx ??= new AudioContext());
export const setSilencio = (v: boolean) => { silenciado = v; };

export function redoble(duracion = 1.5) {
  if (silenciado) return;
  const c = getCtx();
  for (let t = 0; t < duracion; t += 0.07) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = 120;
    gain.gain.setValueAtTime(0.15 + t * 0.1, c.currentTime + t);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.06);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime + t);
    osc.stop(c.currentTime + t + 0.07);
  }
}

export function explosion() {
  if (silenciado) return;
  const c = getCtx();
  const dur = 1.3;
  const buffer = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filtro = c.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.setValueAtTime(2500, c.currentTime);
  filtro.frequency.exponentialRampToValueAtTime(80, c.currentTime + dur);
  src.connect(filtro).connect(c.destination);
  src.start();
}

export function fanfarria() {
  if (silenciado) return;
  const c = getCtx();
  [523, 659, 784, 1047].forEach((f, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.12, c.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.12 + 0.3);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime + i * 0.12);
    osc.stop(c.currentTime + i * 0.12 + 0.35);
  });
}

/** Click corto para la ruleta. */
export function tick() {
  if (silenciado) return;
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.value = 900;
  gain.gain.setValueAtTime(0.08, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.06);
}
```

Agregar un botón 🔇 / 🔊 fijo en una esquina que llame a `setSilencio`, por si la demo es en un lugar con gente.

### 7.2 Explosión pixelada (`components/ExplosionPixelada.tsx`)

El truco: dibujar en un canvas **chiquito** (80×60) y estirarlo a pantalla completa con `image-rendering: pixelated`. Cada partícula se ve como un cuadradote.

```tsx
"use client";
import { useEffect, useRef } from "react";

const COLORES = ["#b71c1c", "#e53935", "#ff3d00", "#ff6d00", "#ff9100", "#ffab00"];

export function ExplosionPixelada({ onFin }: { onFin?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const onFinRef = useRef(onFin);
  onFinRef.current = onFin;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const W = 80, H = 60;
    canvas.width = W;
    canvas.height = H;

    const ps = Array.from({ length: 160 }, () => {
      const a = Math.random() * Math.PI * 2;
      const v = Math.random() * 1.6 + 0.3;
      return {
        x: W / 2, y: H / 2,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
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
        p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.vida--;
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
        position: "fixed", inset: 0, width: "100vw", height: "100vh",
        imageRendering: "pixelated", pointerEvents: "none", zIndex: 50,
      }}
    />
  );
}
```

### 7.3 La carta (`components/CartaExencion.tsx`)

Props: `ganador`, `otros` (nombres), `onNominar(nombre)` y `onDejarAlDestino()`.

```tsx
"use client";
import { useState } from "react";
import confetti from "canvas-confetti";
import { redoble, explosion, fanfarria } from "@/lib/sonidos";
import { ExplosionPixelada } from "./ExplosionPixelada";

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

const FRASES = [
  "Por la presente se certifica que este ciudadano pagó cuando nadie quería.",
  "El Tribunal reconoce una generosidad sospechosamente heroica.",
  "Quien pone primero, cena tranquilo. Así lo dispone esta corte.",
];

type Fase = "cerrada" | "suspenso" | "boom" | "revelada";

export function CartaExencion({
  ganador, otros, onNominar, onDejarAlDestino,
}: {
  ganador: string;
  otros: string[];
  onNominar: (nombre: string) => void;
  onDejarAlDestino: () => void;
}) {
  const [fase, setFase] = useState<Fase>("cerrada");
  const [frase, setFrase] = useState("");
  const [codigo, setCodigo] = useState("");
  const [elegido, setElegido] = useState(otros[0] ?? "");

  const abrir = () => {
    setFase("suspenso");
    redoble(1.5);
    setTimeout(() => {
      setFase("boom");
      explosion();
      fanfarria();
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
      setFrase(pick(FRASES));
      setCodigo(`EXENCION-${Math.floor(Math.random() * 9000 + 1000)}`);
      setTimeout(() => setFase("revelada"), 700);
    }, 1500);
  };

  return (
    <div className={fase === "suspenso" ? "temblor" : ""}>
      {fase === "cerrada" && <button onClick={abrir}>🔥 ABRIR CARTA DEL TRIBUNAL 🔥</button>}
      {fase === "boom" && <ExplosionPixelada />}
      {fase === "revelada" && (
        <div className="carta">
          <h2>CARTA DE EXENCIÓN</h2>
          <p>Otorgada a <b>{ganador}</b> para la próxima vaquita.</p>
          <p><i>{frase}</i></p>
          <p className="codigo">{codigo}</p>

          <select value={elegido} onChange={(e) => setElegido(e.target.value)}>
            {otros.map((o) => <option key={o}>{o}</option>)}
          </select>
          <button onClick={() => onNominar(elegido)}>Nominar a pagar</button>
          <button onClick={onDejarAlDestino}>🎲 No quiero decidir: que decida el destino</button>
        </div>
      )}
    </div>
  );
}
```

### 7.4 CSS (`app/globals.css`)

```css
@keyframes temblor {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-6px, 4px) rotate(-0.5deg); }
  50% { transform: translate(6px, -4px) rotate(0.5deg); }
  75% { transform: translate(-4px, -6px); }
}
.temblor { animation: temblor 0.12s infinite; }

@keyframes entrada {
  0% { transform: scale(0) rotate(-20deg); opacity: 0; }
  70% { transform: scale(1.15) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); }
}
.carta {
  animation: entrada 0.6s ease-out;
  border: 6px double #b71c1c;
  background: #fff8e1;
  padding: 2rem;
  text-align: center;
}
.codigo { font-family: monospace; letter-spacing: 0.2em; color: #b71c1c; }

@media print {
  button, select { display: none; }
}
```

## 8. Sorteo + ruleta del destino

Se activa cuando el ganador (quien puso más) **no quiere decidir** a quién nominar. Entonces el tribunal toma el control en **dos pasos**:

1. **Sorteo:** se elige al azar a **un amigo** entre los demás (el "sorteado"). Es quien tiene que pagar la próxima cuenta, salvo que la ruleta lo salve.
2. **Ruleta:** gira y decide **qué paga el sorteado** (5 opciones).

### 8.1 Los 5 segmentos (qué le toca al sorteado)

| # | Segmento | Resultado |
|---|---|---|
| 1 | 💸 **La de todos** | El sorteado paga la cuenta de **todos** los demás |
| 2 | 👑 **La del que más pagó** | El sorteado paga la cuenta del **ganador** (quien más puso) |
| 3 | 👴 **La del amigo con más edad** | El sorteado paga la cuenta del **amigo de más edad** (lo definen los amigos entre ellos) |
| 4 | 🐶 **La del amigo con perro** | El sorteado paga la cuenta de **todos los amigos que tengan perro** (si son varios, la de todos; lo definen los amigos entre ellos) |
| 5 | 🛟 **¡Salvado!** | El sorteado **queda exento de pagar**. En su lugar, la siguiente comida la paga **quien más pagó en esta oportunidad** (el ganador), y **su premio queda invalidado** (la carta de exención pierde efecto) |

### 8.2 Reglas y casos borde

- **Sorteado:** se elige al azar (todos con la misma probabilidad) entre los participantes **menos el ganador**.
- **El formulario solo pide nombre y monto.** La edad y los perros **no se cargan en la app**: cuando sale el segmento 3 o el 4, el tribunal anuncia el decreto y **los amigos definen entre ellos** quién es el de más edad y quiénes tienen perro (si son varios, pagan todos los que tengan).
- "Los demás" en el segmento 1 = todos los participantes **menos el sorteado** (el ganador **sí** cuenta, porque su cuenta también puede tocarle pagar).
- **Segmento 5:** el ganador pierde la exención. El decreto debe decir que el premio queda **invalidado**.
- Como los segmentos ya no dependen de datos, la ruleta tiene **siempre los mismos 5 segmentos** y se define como una constante.
- Los segmentos son de **igual tamaño** (probabilidad uniforme).
- La lógica es **pura** y vive en `lib/ruleta.ts` para poder probarla sin la interfaz.

### 8.3 Lógica (`lib/ruleta.ts`)

```ts
import { Participante } from "./tipos";

export type SegmentoId = "todos" | "ganador" | "viejo" | "perro" | "salvado";
export type Segmento = { id: SegmentoId; etiqueta: string; color: string };

export type Resultado = {
  segmento: Segmento;
  sorteado: string;
  pagaLaCuentaDe: string[];     // vacío si lo definen los amigos o si se salvó
  definenLosAmigos: boolean;    // true en "más edad" y "perro"
  salvado: boolean;             // true si la ruleta lo salvó
  premioInvalidado: boolean;    // true si el ganador pierde su exención
  texto: string;
};

/** Los 5 segmentos son fijos. */
export const SEGMENTOS: Segmento[] = [
  { id: "todos", etiqueta: "💸 La de todos", color: "#b71c1c" },
  { id: "ganador", etiqueta: "👑 La del que más pagó", color: "#e53935" },
  { id: "viejo", etiqueta: "👴 La del más grande", color: "#ff3d00" },
  { id: "perro", etiqueta: "🐶 La del amigo con perro", color: "#ff6d00" },
  { id: "salvado", etiqueta: "🛟 ¡Salvado!", color: "#ff9100" },
];

/** Sorteo: elige un amigo entre todos menos el ganador. */
export function sortearAmigo(ps: Participante[], ganador: Participante): Participante {
  const candidatos = ps.filter((p) => p.id !== ganador.id);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

/** Resuelve qué le toca al sorteado según el segmento donde cayó la ruleta. */
export function resolver(
  seg: Segmento, ps: Participante[], ganador: Participante, sorteado: Participante
): Resultado {
  const demas = ps.filter((p) => p.id !== sorteado.id);
  const s = sorteado.nombre;
  const g = ganador.nombre;
  const base = {
    segmento: seg, sorteado: s, pagaLaCuentaDe: [] as string[],
    definenLosAmigos: false, salvado: false, premioInvalidado: false,
  };

  switch (seg.id) {
    case "todos": {
      const nombres = demas.map((p) => p.nombre);
      return { ...base, pagaLaCuentaDe: nombres,
        texto: `${s} pagará la cuenta de TODOS (${nombres.join(", ")}). El destino no perdona.` };
    }
    case "ganador":
      return { ...base, pagaLaCuentaDe: [g],
        texto: `${s} pagará la cuenta de ${g}, que fue quien más puso. Justicia poética.` };
    case "viejo":
      return { ...base, definenLosAmigos: true,
        texto: `${s} pagará la cuenta del amigo de más edad. El Tribunal confía en que ustedes sabrán quién es: respeto a los mayores.` };
    case "perro":
      return { ...base, definenLosAmigos: true,
        texto: `${s} pagará la cuenta de todos los amigos que tengan perro. Que se presenten los dueños; los perros miran con aprobación.` };
    case "salvado":
      return { ...base, salvado: true, premioInvalidado: true,
        texto: `¡${s} se salva y queda exento de pagar! En su lugar, la siguiente comida la pagará ${g}, quien más puso esta vez. Su carta de exención queda INVALIDADA.` };
  }
}
```

### 8.4 Componente del sorteo (`components/Sorteo.tsx`)

Tipo "tragamonedas": los nombres de los candidatos van pasando rápido y se frenan en el sorteado. El sorteado se decide **antes** (con `sortearAmigo`) y esto es solo la animación. Dura ~2,5 s.

```tsx
"use client";
import { useEffect, useState } from "react";
import { redoble, tick } from "@/lib/sonidos";

export function Sorteo({
  candidatos, sorteado, onFin,
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
      t += paso; paso *= 1.12; i++;
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
      <h2 className={terminado ? "sorteado" : "temblor"}>{mostrado}</h2>
      {terminado && <p>¡El destino te eligió!</p>}
    </div>
  );
}
```

> **Nota para el agente:** pasá `candidatos` y `onFin` memoizados (`useMemo` / `useCallback`) desde el padre para que el efecto no se reinicie en cada render.

### 8.5 Componente de la ruleta (`components/Ruleta.tsx`)

Rueda dibujada con `conic-gradient` y rotación CSS. El puntero está fijo arriba. Los segmentos van en sentido horario desde arriba: el centro del segmento `i` está en `i * ang + ang / 2`.

```tsx
"use client";
import { useState } from "react";
import { Segmento } from "@/lib/ruleta";
import { redoble, tick } from "@/lib/sonidos";

export function Ruleta({
  segmentos, sorteado, onResultado,
}: {
  segmentos: Segmento[];
  sorteado: string;
  onResultado: (s: Segmento) => void;
}) {
  const [rotacion, setRotacion] = useState(0);
  const [girando, setGirando] = useState(false);
  const n = segmentos.length;
  const ang = 360 / n;
  const DURACION = 5000;

  const fondo = `conic-gradient(from 0deg, ${segmentos
    .map((s, i) => `${s.color} ${i * ang}deg ${(i + 1) * ang}deg`)
    .join(", ")})`;

  const girar = () => {
    if (girando) return;
    setGirando(true);
    redoble(1.2);

    const idx = Math.floor(Math.random() * n);
    const centro = idx * ang + ang / 2;
    // Para que el segmento idx quede bajo el puntero (arriba), la rotación final debe ser ≡ 360 - centro (mod 360)
    const resto = (360 - centro - (rotacion % 360) + 720) % 360;
    setRotacion(rotacion + 360 * 6 + resto);

    // Ticks que se van espaciando, como una ruleta real
    let t = 0, paso = 60;
    while (t < DURACION - 300) {
      setTimeout(tick, t);
      paso *= 1.06;
      t += paso;
    }

    setTimeout(() => {
      setGirando(false);
      onResultado(segmentos[idx]);
    }, DURACION + 100);
  };

  return (
    <div className="ruleta-wrap">
      <p>Le toca a <b>{sorteado}</b>. ¡Que gire la ruleta!</p>
      <div className="ruleta-puntero">▼</div>
      <div
        className="ruleta"
        style={{
          background: fondo,
          transform: `rotate(${rotacion}deg)`,
          transition: girando ? `transform ${DURACION}ms cubic-bezier(0.12, 0.8, 0.1, 1)` : "none",
        }}
      >
        {segmentos.map((s, i) => (
          <span
            key={s.id}
            className="ruleta-etiqueta"
            style={{ transform: `rotate(${i * ang + ang / 2}deg) translateY(-105px)` }}
          >
            {s.etiqueta}
          </span>
        ))}
      </div>
      <button onClick={girar} disabled={girando}>
        {girando ? "Girando..." : "🎰 ¡GIRAR!"}
      </button>
    </div>
  );
}
```

```css
.ruleta-wrap { position: relative; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.ruleta-puntero { font-size: 2rem; color: #b71c1c; position: relative; z-index: 2; margin-bottom: -1.2rem; }
.ruleta {
  position: relative; width: 300px; height: 300px; border-radius: 50%;
  border: 8px solid #3e2723; box-shadow: 0 0 30px #ff6d00;
}
.ruleta-etiqueta {
  position: absolute; top: 50%; left: 50%; width: 110px; margin-left: -55px;
  text-align: center; font-size: 0.72rem; font-weight: bold; color: #fff;
  text-shadow: 1px 1px 2px #000; transform-origin: 0 0;
}
.sorteo { text-align: center; }
.sorteado { font-size: 2.5rem; color: #b71c1c; animation: entrada 0.5s ease-out; }
```

> **Nota para el agente:** las etiquetas rotan con la rueda y pueden quedar de cabeza. Para la demo está bien. Si sobra tiempo, mostrá la lista de segmentos al costado como leyenda.

### 8.6 Desenlace

1. Clic en "🎲 No quiero decidir": se llama a `sortearAmigo` (queda guardado en el estado como `sorteado`) y se muestra `<Sorteo />`.
2. Al terminar el sorteo se muestra `<Ruleta />` con la constante `SEGMENTOS`.
3. Al terminar el giro, `resolver(segmento, participantes, ganador, sorteado)` genera el texto del decreto.
4. Se dispara `confetti` y `fanfarria()` y se pasa al **Acta final**. Si `premioInvalidado` es `true`, el acta muestra la carta de exención **tachada** con un sello rojo de "INVALIDADA". Si `definenLosAmigos` es `true`, el acta agrega la leyenda "A definir entre los amigos".

## 9. Orquestador (`app/page.tsx`)

Estado mínimo:

```ts
type FasePagina = "formulario" | "fallo" | "carta" | "sorteo" | "ruleta" | "acta";

const [fase, setFase] = useState<FasePagina>("formulario");
const [participantes, setParticipantes] = useState<Participante[]>([]);
const [deudas, setDeudas] = useState<Deuda[]>([]);
const [fallo, setFallo] = useState<Fallo | null>(null);
const [ganador, setGanador] = useState<Participante | null>(null);
const [sorteado, setSorteado] = useState<Participante | null>(null);
const [decreto, setDecreto] = useState<string>("");
const [premioInvalidado, setPremioInvalidado] = useState(false);
```

- `convocar()` (al enviar el formulario): `calcularDeudas`, `emitirFallo`, `elegirGanador` y pasa a `"fallo"`.
- `apelar()`: `setFallo(emitirFallo(deudas))`.
- `onNominar(nombre)`: `setDecreto(...)` y pasa a `"acta"`.
- `onDejarAlDestino()`: `setSorteado(sortearAmigo(participantes, ganador))` y pasa a `"sorteo"`.
- `onFinSorteo()` (memoizado con `useCallback`): pasa a `"ruleta"`.
- `onResultado(seg)`: `const r = resolver(seg, participantes, ganador, sorteado)`, `setDecreto(r.texto)`, `setPremioInvalidado(r.premioInvalidado)` y pasa a `"acta"`.
- Poné `"use client"` al inicio de `page.tsx`.

## 10. Checklist de la hackatón

- [ ] **Recibe algo:** formulario con nombres y montos
- [ ] **Hace algo con eso:** calcula saldos y deudas, sortea juez y ruleta
- [ ] **Devuelve algo visible:** fallo, carta y decreto que cambian según los datos
- [ ] **Incluye el ingrediente improbable:** se nota a simple vista (veredicto inapelable + carta oficial)
- [ ] **Se prueba en un minuto:** botón "Cargar ejemplo" y textos claros
- [ ] Repo en GitHub con commits frecuentes, README y SHA del último commit anotado

## 11. Plan de 90 minutos

| Minutos | Qué | Señal de que vas bien |
|---|---|---|
| 0–10 | Idea cerrada (esta spec) | Podés contarla en una oración |
| 10–20 | Crear proyecto, repo, ficha en el README y primer commit | El repo existe en GitHub |
| 20–45 | `cuentas.ts`, formulario y un fallo con un solo juez | Funciona de punta a punta, aunque sea feo |
| 45–60 | Los 4 jueces, pools de frases y botón Apelar | El fallo cambia en cada apelación |
| 60–75 | Carta escandalosa (sonidos, explosión, confeti) | Un compañero entiende sin ayuda |
| 75–85 | Nominar, sorteo y ruleta | El sorteo elige a alguien y la ruleta muestra el decreto |
| 85–90 | Probar, README, commit y push finales, anotar el SHA | Lo que ves en GitHub es lo último |

**Si al minuto 30 no anda nada**, quedate con: formulario + cuentas + un fallo. La carta y la ruleta son la frutilla del postre.
**No cambies de idea después del minuto 30.**

## 12. Plantilla de README

````markdown
# El Tribunal de la Vaquita

**Pabellón:** Molestias Cotidianas
**Ingrediente improbable:** Veredicto inapelable

## El problema
En cualquier grupo de amigos que junta plata para un regalo o una comida, nunca queda claro cuánto puso cada uno ni quién le debe a quién.

## La solución
Un tribunal que recibe los aportes, calcula las deudas con la menor cantidad de pagos y emite un fallo con un juez distinto cada vez. Quien más puso recibe una carta de exención (con explosión pixelada, confeti y sonidos) y puede nominar a quien pague su próxima cuenta. Si no quiere decidir, el tribunal sortea a un amigo y una ruleta define qué paga (o si se salva).

## Cómo probarlo
1. `npm install` y `npm run dev`
2. Abrí http://localhost:3000 y tocá "Cargar ejemplo"
3. Tocá "Convocar al tribunal", abrí la carta y elegí entre nominar o la ruleta del destino

## Herramientas de IA utilizadas
(Completar: cuáles usaste y para qué.)
````

## 13. Para explicar el martes 17/11

Tené claro estas tres cosas (la consigna las pide):

1. **Qué hace cada parte:** `cuentas.ts` calcula saldos y deudas; `jueces.ts` genera el fallo; `CartaExencion` y `ExplosionPixelada` hacen el show; `ruleta.ts`, `Sorteo.tsx` y `Ruleta.tsx` deciden el destino.
2. **Cómo se ejecuta y se prueba:** `npm run dev` y el botón "Cargar ejemplo".
3. **Qué decisiones tomaste vos y cuáles sugirió la IA:** anotalo en el README apenas termines, mientras lo tenés fresco.
