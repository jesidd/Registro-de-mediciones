import type { Measurement } from "./Measurement";

export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoCliente: 'Constructora'| 'Empresa'|'Cliente Particular';
  direccion: string;
  gasto: number;
  compras: Measurement[];
}
