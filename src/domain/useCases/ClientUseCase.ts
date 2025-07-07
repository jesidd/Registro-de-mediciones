import type { Client } from '../entities/Client';
import type { ClientRepository } from '../repositories/ClientRepository';

export default class ClientUseCase {

    private readonly clientRepo: ClientRepository;

    constructor(clientRepo: ClientRepository) {
        this.clientRepo = clientRepo;
    }
    
    async getClients(): Promise<Client[]> {
        return this.clientRepo.getClients();
    }

    async getClientById(id: number): Promise<Client | null> {
        return this.clientRepo.getClientById(id);
    }
    
    async createClient(client: Client): Promise<Client> {
        return this.clientRepo.createClient(client);
    }
    
    async updateClient(client: Client): Promise<Client> {
        return this.clientRepo.updateClient(client);
    }
    
    async deleteClient(id: number): Promise<void> {
        return this.clientRepo.deleteClient(id);
    }
    
    async getTotalClientsByType(type: string): Promise<number> {
        return this.clientRepo.getTotalClientsByType(type);
    }
}
