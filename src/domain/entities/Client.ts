import type { Measurement } from "./Measurement";

export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoCliente: 'CONSTRUCTORA'| 'EMPRESA'|'CLIENTE_PARTICULAR';
  direccion: string;
  gasto: number;
  compras: Measurement[];
}
