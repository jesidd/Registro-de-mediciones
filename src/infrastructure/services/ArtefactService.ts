import type { Artefact } from "../../domain/entities/Artefact";
import type { ArtefactRepository } from "../../domain/repositories/ArtefactRepository";
import AxiosClient from "../api/AxiosClient";

export class ArtefactService implements ArtefactRepository {

    async getArtefactByID(id: number): Promise<Artefact>{
        const response = await AxiosClient.get(`artefacto/${id}`);
        return response.data
    }

    async getAreaTotal(Artefact_id: number): Promise<number>{
        const response = await AxiosClient.get(`artefacto/${Artefact_id}/cubicacion-total`);
        return response.data["totalMetrosCuadrados"];
    }

    async getArtefactByMeasurementID(Measurement_ID: number): Promise<Artefact[]>{
        const response = await AxiosClient.get(`artefacto/medicion/${Measurement_ID}`);
        return response.data;
    }

    async setArtefact(Artefact: Artefact): Promise<Artefact>{
        const response = await AxiosClient.post(`artefacto/api/artefactos`,Artefact);
        return response.data;
    }

    async updateArtefact(Artefact: Artefact): Promise<Artefact>{
        const response = await AxiosClient.put(`artefacto/${Artefact.id}`,Artefact);
        return response.data;
    }

    async deleteArtefact(Artefact_id: number): Promise<number>{
        const response = await AxiosClient.delete(`artefacto/${Artefact_id}`);
        return response.status;
    }
  
}

export default ArtefactService