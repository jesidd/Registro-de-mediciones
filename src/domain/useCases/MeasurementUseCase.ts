import type { Measurement } from "../entities/Measurement";
import type { MeasurementRepository } from "../repositories/MeasurementRepository";

export default class MeasurementUseCase {

    private readonly MeasurementRepo: MeasurementRepository;

    constructor(MeasurementRepo: MeasurementRepository){
        this.MeasurementRepo = MeasurementRepo;
    }
  
    async getMeasurements(): Promise<Measurement[]>{
        const measurements = await this.MeasurementRepo.getMeasurements();
        return measurements;
    }

    async getMeasurementById(Measurement_ID: number): Promise<Measurement>{
        const measurement = await this.MeasurementRepo.getMeasurementById(Measurement_ID);
        return measurement;
    }

    async getMeasurementByClientId(Client_ID: number): Promise<Measurement>{
        const measurement = await this.MeasurementRepo.getMeasurementByClientId(Client_ID);
        return measurement;
    }

    async getAreaTotal(Measurement_ID: number): Promise<Measurement>{
        const AreaTotal = await this.MeasurementRepo.getAreaTotal(Measurement_ID);
        return AreaTotal;
    }

    async createMeasurement(Measurement: Measurement): Promise<Measurement>{
        const measurement = await this.MeasurementRepo.createMeasurement(Measurement);
        return measurement;
    }

    async updateMeasurement(Measurement: Measurement): Promise<Measurement> {
        const measurement = await this.MeasurementRepo.updateMeasurement(Measurement);
        return measurement;
    }

    async deleteMeasurement(Measurement_ID: number): Promise<number>{
        const status_code = await this.MeasurementRepo.deleteMeasurement(Measurement_ID);
        return status_code;
    }
}


