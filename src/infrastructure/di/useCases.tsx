import { AuthUseCase } from "../../domain/useCases/AuthUseCase";
import { AuthService } from "../../infrastructure/services/AuthService";

const authRepo = new AuthService();
export const authUseCase = new AuthUseCase(authRepo);
