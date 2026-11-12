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