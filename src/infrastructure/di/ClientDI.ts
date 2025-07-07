import ClientUseCase from "../../domain/useCases/ClientUseCase";
import { ClientService } from "../services/ClientService";

const ClientRepo = new ClientService();
export const clientUseCase = new ClientUseCase(ClientRepo);