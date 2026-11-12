export type Participante = {
  id: string;
  nombre: string;
  aportado: number;
};

export type Deuda = {
  deudor: string;
  acreedor: string;
  monto: number;
};

export type Fallo = {
  juez: string;
  emoji: string;
  expediente: string;
  lineas: string[];
  cierre: string;
};