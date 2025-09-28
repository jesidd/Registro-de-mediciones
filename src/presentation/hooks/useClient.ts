import { useCallback } from "react";
import { clientUseCase } from "../../infrastructure/di/ClientDI";
import type { Client } from "../../domain/entities/Client";

export default function useClient() {
  const getClients = useCallback(() => {
    return clientUseCase.getClients();
  }, []);

  const getClientById = useCallback((client_id: number) => {
    return clientUseCase.getClientById(client_id);
  }, []);

  const createClient = useCallback((client: Client) => {
    return clientUseCase.createClient(client);
  }, []);

  const updateClient = useCallback((client: Client) => {
    return clientUseCase.updateClient(client);
  }, []);

  const deleteClient = useCallback((id: number) => {
    return clientUseCase.deleteClient(id);
  }, []);

  const getTotalClientsByType = useCallback((type: string) => {
    return clientUseCase.getTotalClientsByType(type);
  }, []);

  return {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getTotalClientsByType,
  };
}
