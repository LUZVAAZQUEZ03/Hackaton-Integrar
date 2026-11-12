# ⚖️ El Tribunal de la Vaquita

**Hackatón 2026 · La Feria de Soluciones Improbables**

| Campo | Valor |
|---|---|
| **Pabellón** | Molestias Cotidianas |
| **Ingrediente improbable** | Veredicto inapelable |
| **Stack** | React + Next.js (App Router, TypeScript) |
| **Backend** | No — todo corre en el cliente |
| **Base de datos** | No — estado en `useState` |
| **Login** | No |

---

## El problema

En cualquier grupo de amigos que junta plata para un regalo, una cena o una vaquita, **nunca queda claro cuánto puso cada uno ni quién le debe a quién**. El Tribunal de la Vaquita resuelve eso con un fallo judicial inapelable.

## La solución

Un tribunal que recibe los aportes, calcula las deudas con la menor cantidad de pagos y emite un fallo con un juez distinto cada vez. Quien más puso recibe una **carta de exención** (con explosión pixelada, confeti y sonidos) y puede nominar a quien pague su próxima cuenta. Si no quiere decidir, el tribunal sortea a un amigo y una **ruleta** define qué paga (o si se salva).

---

## Cómo ejecutar la app

### Requisitos previos

- [Node.js](https://nodejs.org/) 18.17 o superior
- npm (viene con Node.js)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/LUZVAAZQUEZ03/Hackaton-Integrar.git
cd Hackaton-Integrar/tribunal-vaquita

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

### Ver la app

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

### Probar en un minuto

1. Tocá **"Cargar ejemplo"** — precarga 3 participantes (Ana $500, Beto $300, Carlos $200)
2. Tocá **"Convocar al tribunal"** — calcula deudas y emite el fallo
3. Ver el fallo del juez con la lista de pagos

---

## Estructura del proyecto

```
tribunal-vaquita/
├── app/
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Orquestador: maneja las fases con useState
│   └── globals.css         # Animaciones + estilos
├── components/
│   ├── Formulario.tsx      # Pantalla 1: lista dinámica de participantes
│   ├── Fallo.tsx           # Pantalla 2: fallo del juez + deudas
│   ├── CartaExencion.tsx   # Pantalla 3: carta escandalosa
│   ├── ExplosionPixelada.tsx  # Explosión en canvas 80×60
│   ├── Sorteo.tsx          # Pantalla 4b: sorteo tipo tragamonedas
│   ├── Ruleta.tsx          # Pantalla 4b: ruleta de 5 segmentos
│   └── ActaFinal.tsx       # Pantalla 5: decreto imprimible
├── lib/
│   ├── tipos.ts            # Tipos: Participante, Deuda, Fallo
│   ├── cuentas.ts          # Lógica de saldos y deudas (pura, testeable)
│   ├── jueces.ts           # 4 jueces con pools de frases + emitirFallo
│   ├── ruleta.ts           # Segmentos + resolver resultado
│   └── sonidos.ts          # Web Audio API (redoble, explosión, fanfarria, tick)
└── package.json
```

---

## Flujo de la aplicación

```
[1. Formulario] → [2. Fallo del juez + deudas] → [3. Carta de exención]
                                                         │
                            ┌────────────────────────────┴───────────────────────────┐
                            ▼                                                        ▼
                  [4a. Nominar a alguien]                              [4b. "Que decida el destino"]
                  (elige quién paga su próxima cuenta)                 SORTEO de un amigo + RULETA (5 opciones)
                            │                                                        │
                            └──────────────────────► [5. Decreto final imprimible] ◄┘
```

### Pantalla 1 · Formulario
- Lista dinámica de participantes (mínimo 3)
- Cada fila: **nombre** y **monto que puso**
- Botón **"Cargar ejemplo"** para datos de prueba
- Botón **"Convocar al tribunal"**

### Pantalla 2 · Fallo
- Se sortea un **juez** (nombre, emoji, expediente)
- Se muestra la lista de pagos (quién le paga cuánto a quién)
- Botón **"Apelar"** — vuelve a sortear juez y texto, con los mismos montos

### Pantalla 3 · Carta de exención
- El ganador es **quien puso más plata** (empate → sorteo)
- Botón **"🔥 ABRIR CARTA DEL TRIBUNAL 🔥"** dispara la secuencia escandalosa
- La carta dice que el ganador queda **exento de la próxima vaquita**
- Dos botones: **"Nominar a alguien"** y **"No quiero decidir, que decida el destino"**

### Pantalla 4a · Nominar
- `<select>` con los demás participantes
- Resultado: `⚖️ Por decreto, {nominado} pagará la cuenta de {ganador}.`

### Pantalla 4b · Sorteo + ruleta
- **Sorteo**: animación tipo tragamonedas con redoble
- **Ruleta**: 5 segmentos que deciden qué paga el sorteado
- Si sale **¡Salvado!**, el sorteado queda exento y el ganador pierde su premio

### Pantalla 5 · Decreto final
- Resumen: fallo, carta y destino de la próxima cuenta
- Formato "acta oficial" con borde doble, sello y firma
- Imprimible con `window.print()`

---

## Lógica de las cuentas

```ts
// Cada uno debería haber puesto: total / cantidad
// Saldo = aportado - cuotaJusta
// Saldo positivo → le deben
// Saldo negativo → debe

// Se emparejan el que más debe con el que más tiene a favor
// hasta saldar todo con la menor cantidad de pagos.
```

---

## Los 5 segmentos de la ruleta

| # | Segmento | Resultado |
|---|---|---|
| 1 | 💸 **La de todos** | El sorteado paga la cuenta de todos los demás |
| 2 | 👑 **La del que más pagó** | El sorteado paga la cuenta del ganador |
| 3 | 👴 **La del más grande** | El sorteado paga la cuenta del amigo de más edad (los amigos definen quién) |
| 4 | 🐶 **La del amigo con perro** | El sorteado paga la cuenta de todos los que tengan perro (los amigos definen quiénes) |
| 5 | 🛟 **¡Salvado!** | El sorteado queda exento; el ganador paga la siguiente comida y su carta queda invalidada |

---

## Checklist de la hackatón

- [x] **Recibe algo:** formulario con nombres y montos
- [x] **Hace algo con eso:** calcula saldos y deudas, sortea juez y ruleta
- [x] **Devuelve algo visible:** fallo, carta y decreto que cambian según los datos
- [x] **Incluye el ingrediente improbable:** veredicto inapelable + carta oficial
- [x] **Se prueba en un minuto:** botón "Cargar ejemplo" y textos claros
- [ ] Repo en GitHub con commits frecuentes, README y SHA del último commit anotado

---

## Herramientas de IA utilizadas

| Herramienta | Para qué |
|---|---|
| opencode (Claude 3.5 Sonnet) | Generación de código, estructura del proyecto, README |

---

## Fase actual

**Fase 1 — Estructura base** ✅
- Proyecto Next.js creado
- `lib/tipos.ts`, `lib/cuentas.ts`, `lib/jueces.ts`
- `components/Formulario.tsx`
- `app/page.tsx` con flujo formulario → fallo
- Lógica de cálculo de deudas funcional
- Botón "Cargar ejemplo" funcional
- Juez simplificado (1 juez)

**Próximas fases:**
- Fase 2: 4 jueces con pools de frases + botón Apelar
- Fase 3: Carta de exención (sonidos, explosión, confeti)
- Fase 4: Nominar, sorteo y ruleta
- Fase 5: Acta final imprimible

---

## Licencia

Proyecto creado para el Hackatón 2026 — La Feria de Soluciones Improbables.
