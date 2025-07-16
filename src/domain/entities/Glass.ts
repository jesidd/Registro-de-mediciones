export interface Glass {
  id: number;
  ancho_cm: number;
  alto_cm: number;
  espesor: number;
  precioM2: number;
  color: "Laminado" | "Templado" | "Flotado" | "Reflectivo" | "Martillado";
  tipo: string;
  artefactoId: number;
}

export const glassTypes = [
  "Laminado",
  "Templado",
  "Flotado",
  "Reflectivo",
  "Martillado",
];
