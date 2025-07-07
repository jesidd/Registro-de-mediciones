import { useCallback } from "react";
import { clientUseCase } from "../../infrastructure/di/ClientDI";
import type { Client } from "../../domain/entities/Client";


export default function UseClient() {
  
    const getClients = useCallback(() => {
        return clientUseCase.getClients();
    }, []);


    const createClient = useCallback((client:Client) => {
        return clientUseCase.createClient(client);
    }, []);

    const updateClient = useCallback((client:Client) => {
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
        createClient,
        updateClient,
        deleteClient,
        getTotalClientsByType
    };
}

