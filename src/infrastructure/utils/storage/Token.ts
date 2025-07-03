/* sessionStorage guarda los datos solo durante la sesión actual
   localStorage guarda los datos de forma persistente (incluso si se cierra el navegador) */

let useSession = false; // false: guarda en localStorage, true: guarda en sessionStorage


export const setUseSession = (value: boolean) => {
  useSession = value;
};

// Guarda el token en localStorage o sessionStorage según el valor de useSession
export const setToken = (token: string): void => {
  if (useSession) {
    sessionStorage.setItem('token', token);
  } else {
    localStorage.setItem('token', token);
  }
};

// Obtiene el token desde localStorage o sessionStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Elimina el token de ambos lugares
export const removeToken = (): void => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};