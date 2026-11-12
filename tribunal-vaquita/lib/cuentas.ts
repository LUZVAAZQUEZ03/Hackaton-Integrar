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