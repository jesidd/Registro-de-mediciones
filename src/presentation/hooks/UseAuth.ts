import { authUseCase } from "../../infrastructure/di/AuthDI";
import { setToken, removeToken, setUseSession } from "../../infrastructure/utils/storage/Token";
import { useCallback } from "react";


export function useAuth() {

  /**
   * This hook provides authentication functionalities such as login and logout.
   * It uses the AuthUseCase to perform these actions and manages the token storage.
   */

  const keepSession = useCallback((rememberMe: boolean) => {
    setUseSession(rememberMe);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const token = await authUseCase.login(email, password);
    setToken(token); 
  }, []);

  const logout = useCallback(async (id: number) => {
    await authUseCase.logout(id); 
    removeToken(); 
  }, []);

  return { login, logout, keepSession };
}
