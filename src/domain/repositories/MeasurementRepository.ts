import type { Measurement } from "../entities/Measurement";

export interface MeasurementRepository {
  getMeasurements(): Promise<Measurement[]>;
  getMeasurementById(Measurement_ID: number): Promise<Measurement>;
  getMeasurementByClientId(Client_ID: number): Promise<Measurement>;
  getAreaTotal(Measurement_ID: number): Promise<Measurement>;
  createMeasurement(Measurement: Measurement): Promise<Measurement>;
  updateMeasurement(Measurement: Measurement): Promise<Measurement>;
  deleteMeasurement(Measurement_ID: number): Promise<number>;
}
