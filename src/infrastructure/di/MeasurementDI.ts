import  MeasurementUseCase  from "../../domain/useCases/MeasurementUseCase";
import { MeasurementServices } from "../services/MeasurementServices";


const MeasurementRepo = new MeasurementServices();
export const MeasurementUseCaseInstance = new MeasurementUseCase(MeasurementRepo);

