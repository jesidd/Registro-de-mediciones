import { useCallback } from "react";
import { ArtefactUseCaseInstance } from "../../infrastructure/di/ArtefactDI";
import type { Artefact } from "../../domain/entities/Artefact";



export default function UseArtefact() {
  const getArtefactByID = useCallback((artefact_id: number) =>{
    return ArtefactUseCaseInstance.getArtefactByID(artefact_id);
  }, []);

  const getAreaTotal = useCallback((artefact_id: number) =>{
    return ArtefactUseCaseInstance.getAreaTotal(artefact_id);
  }, []);

  const getArtefactByMeasurementID = useCallback((Measurement_id: number) =>{
    return ArtefactUseCaseInstance.getArtefactByMeasurementID(Measurement_id);
  }, []);

  const setArtefact = useCallback((Artefact: Artefact) =>{
    return ArtefactUseCaseInstance.setArtefact(Artefact);
  }, []);

  const updateArtefact = useCallback((Artefact: Artefact) =>{
    return ArtefactUseCaseInstance.updateArtefact(Artefact);
  }, []);

  const deleteArtefact = useCallback((Artefact_id: number) =>{
    return ArtefactUseCaseInstance.deleteArtefact(Artefact_id);
  }, []);

  return{
    getArtefactByID,
    getAreaTotal,
    getArtefactByMeasurementID,
    setArtefact,
    updateArtefact,
    deleteArtefact
  }
}
