import type { Client } from "../../domain/entities/Client";
import type { ClientRepository } from "../../domain/repositories/ClientRepository";
import AxiosClient from "../api/AxiosClient";

export class ClientService implements ClientRepository{
    async getClients(): Promise<Client[]> {
        const response = await AxiosClient.get('/cliente');
        return response.data;
    }

    async getClientById(id: number): Promise<Client | null> {
        const response = await AxiosClient.get(`/cliente`, { params: { id } });
        return response.data.length > 0 ? response.data[0] : null;
    }

    async createClient(client: Client): Promise<Client> {
        const response = await AxiosClient.post('/cliente', client);
        return response.data;
    }

    async updateClient(client: Client): Promise<Client> {
        const response = await AxiosClient.put(`/cliente/${client.id}`, client);
        return response.data;
    }

    async deleteClient(id: number): Promise<void> {
        await AxiosClient.delete(`/cliente/${id}`);
    }

    async getTotalClientsByType(type: string): Promise<number> {
        const response = await AxiosClient.get(`/cliente/tipo/${type}`);
        return response.data.length;
    }
}