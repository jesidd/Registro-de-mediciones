import type { User } from "../../domain/entities/User";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import AxiosClient from "../api/AxiosClient";

export class AuthService implements AuthRepository{
    async login(email: string, password: string): Promise<string> {
        const response = await AxiosClient.post('/auth/login', {email, password});
        return response.data.token;
    }

    async getUser(id: User["id"]): Promise<User> {
        const response = await AxiosClient.get('/auth/user', { params: { id } });
        return response.data;
    }

    async logout(id: User["id"]): Promise<void> {
        await AxiosClient.post('/auth/logout', {params: { id } });
    }
}