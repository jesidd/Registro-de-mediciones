import type { Artefact } from "../entities/Artefact";
import type { ArtefactRepository } from "../repositories/ArtefactRepository"

export default class ArtefactUseCase {

    private readonly ArtefactRepo: ArtefactRepository

    constructor (ArtefactRepo: ArtefactRepository){
        this.ArtefactRepo = ArtefactRepo;
    }
  
    async getArtefactByID(id: number): Promise<Artefact>{
        return this.ArtefactRepo.getArtefactByID(id);
    }

    async getAreaTotal(Artefact_id: number): Promise<number>{
        return this.ArtefactRepo.getAreaTotal(Artefact_id);
    }

    async getArtefactByMeasurementID(Measurement_ID: number): Promise<Artefact>{
        return this.ArtefactRepo.getArtefactByMeasurementID(Measurement_ID);
    }

    async setArtefact(Artefact: Artefact): Promise<Artefact>{
        return this.ArtefactRepo.setArtefact(Artefact);
    }

    async updateArtefact(Artefact: Artefact): Promise<Artefact>{
        return this.ArtefactRepo.updateArtefact(Artefact);
    }

    async deleteArtefact(Artefact_id: number): Promise<number>{
        return this.ArtefactRepo.deleteArtefact(Artefact_id);
    }
}

