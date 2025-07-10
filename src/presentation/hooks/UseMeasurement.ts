import { useCallback } from "react";
import { MeasurementUseCaseInstance } from "../../infrastructure/di/MeasurementDI";
import type { Measurement } from "../../domain/entities/Measurement";

export default function UseMeasurement() {
  const getMeasurements = useCallback(() => {
    return MeasurementUseCaseInstance.getMeasurements();
  }, []);

  const getMeasurementById = useCallback((Measurement_id: number) => {
    return MeasurementUseCaseInstance.getMeasurementById(Measurement_id);
  }, []);

  const getMeasurementByClientId = useCallback((client_id: number) => {
    return MeasurementUseCaseInstance.getMeasurementByClientId(client_id);
  }, []);

  const getAreaTotal = useCallback((Measurement_id: number) => {
    return MeasurementUseCaseInstance.getAreaTotal(Measurement_id);
  }, []);

  const createMeasurement = useCallback((Measurement: Measurement) => {
    return MeasurementUseCaseInstance.createMeasurement(Measurement);
  }, []);

  const updateMeasurement = useCallback((Measurement: Measurement) => {
    return MeasurementUseCaseInstance.updateMeasurement(Measurement);
  }, []);

  const deleteMeasurement = useCallback((Measurement_id: number) => {
    return MeasurementUseCaseInstance.deleteMeasurement(Measurement_id);
  }, []);

  return {
    getMeasurements,
    getMeasurementById,
    getMeasurementByClientId,
    getAreaTotal,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement
  };
}
