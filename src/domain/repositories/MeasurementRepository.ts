import type { Measurement } from "../entities/Measurement";

export interface MeasurementRepository {
  getMeasurements(): Promise<Measurement[]>;
  getMeasurementById(id: number): Promise<Measurement>;
  getMeasurementByClientId(id: number): Promise<Measurement>;
  getAreaTotal(id: number): Promise<Measurement>;
  createMeasurement(Measurement: Measurement): Promise<Measurement>;
  updateMeasurement(Measurement: Measurement): Promise<Measurement>;
  deleteMeasurement(id: number): Promise<number>;
}
