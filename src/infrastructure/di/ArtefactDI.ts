import ArtefactUseCase from "../../domain/useCases/ArtefactUseCase";
import {ArtefactService} from "../services/ArtefactService";



const ArtefactRepo = new ArtefactService();
export const ArtefactUseCaseInstance = new ArtefactUseCase(ArtefactRepo);
