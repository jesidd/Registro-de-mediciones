import type { Artefact } from "../entities/Artefact";


export interface ArtefactRepository{
    getArtefactByID(id: number): Promise<Artefact>;
    getAreaTotal(Artefact_id: number): Promise<number>;
    getArtefactByMeasurementID(Measurement_ID: number): Promise<Artefact[]>;
    setArtefact(Artefact: Artefact): Promise<Artefact>;
    updateArtefact(Artefact: Artefact): Promise<Artefact>;
    deleteArtefact(Artefact_id: number): Promise<number>;
}