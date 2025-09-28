import type { Glass } from "./Glass";

export interface Artefact { 
  id: number,
  nombre: string,
  medicionId: number,
  descripcion: string,
  vidrios: Glass[]
}
