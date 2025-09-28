export interface Glass {
  id: number;
  ancho_cm: number;
  alto_cm: number;
  espesor: number;
  precioM2: number;
  color: string;
  tipo: "Laminado" | "Templado" | "Flotado" | "Reflectivo" | "Martillado";
  artefactoId: number;
}

export const glassTypes = [
  "Laminado",
  "Templado",
  "Flotado",
  "Reflectivo",
  "Martillado",
];
