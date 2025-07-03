import type { AuthRepository } from '../repositories/AuthRepository';
import type { User } from '../entities/User';

export class AuthUseCase {

  private readonly authRepo: AuthRepository;

  constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;
  }

  async login(email: string, password: string): Promise<string> {
    const token = await this.authRepo.login(email, password);
    return token;
  }

  async logout(id: User["id"]): Promise<void> {
    await this.authRepo.logout(id);
  }

  async getUser(id: User["id"]): Promise<User> {
    return await this.authRepo.getUser(id);
  }
}
