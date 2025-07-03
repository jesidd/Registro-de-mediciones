import type { User } from "../entities/User";


export interface AuthRepository {
  login(email: string, password: string): Promise<string>;
  getUser(id: User["id"]): Promise<User>;
  logout(id: User["id"]): Promise<void>;
}
