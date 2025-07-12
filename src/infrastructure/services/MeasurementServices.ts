import type { MeasurementRepository } from "../../domain/repositories/MeasurementRepository";
import AxiosClient from "../api/AxiosClient";
import type { Measurement } from "../../domain/entities/Measurement";

export class MeasurementServices implements MeasurementRepository  {

    async getMeasurements(): Promise<Measurement[]> {
        const response = await AxiosClient.get('mediciones');
        return response.data;
    }

    async getMeasurementById(Measurement_ID: number): Promise<Measurement> {
        const response = await AxiosClient.get(`mediciones/${Measurement_ID}`);
        return response.data;
    }

    async getMeasurementByClientId(Client_ID: number): Promise<Measurement> {
        const response = await AxiosClient.get(`mediciones/cliente/${Client_ID}`);
        return response.data;
    }

    async getAreaTotal(Measurement_ID: number): Promise<Measurement> {
        const response = await AxiosClient.get(`mediciones/${Measurement_ID}/cubicacion-total`);
        return response.data;
    }

    async createMeasurement(Measurement: Measurement): Promise<Measurement> {
        const response = await AxiosClient.post('mediciones',Measurement);
        return response.data;
    }

    async updateMeasurement(Measurement: Measurement): Promise<Measurement> {
        const response = await AxiosClient.put(`mediciones/${Measurement.id}`,Measurement);
        return response.data;
    }

    async deleteMeasurement(Measurement_ID: number): Promise<number> {
        const response = await AxiosClient.delete(`mediciones/${Measurement_ID}`);
        return response.status;
    }

    async getCostoMesearument(Measurement_ID: number): Promise<number> {
        const response = await AxiosClient.get(`mediciones/mediciones/${Measurement_ID}/costo`);
        return response.data["costoVidrio"];
    }
}

