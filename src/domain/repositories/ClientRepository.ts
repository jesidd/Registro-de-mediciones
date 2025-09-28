import type { Client } from '../entities/Client';

export interface ClientRepository {
  getClients(): Promise<Client[]>;
  getClientById(id: number): Promise<Client>;
  createClient(client: Client): Promise<Client>;
  updateClient(client: Client): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  getTotalClientsByType(type: string): Promise<number>; 
}