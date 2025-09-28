import axios from 'axios';
import { getToken, removeToken } from '../utils/storage/Token';

const AxiosClient = axios.create({
    baseURL: 'https://medividrios-production.up.railway.app/api/',
    timeout: 20000, // 20 seconds timeout
});

// Interceptor de solicitud para agregar el token si no es una ruta pública
AxiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    const publicPaths = ["/","mediciones"]; //rutas pública 
    const isPublic = publicPaths.some((path) => config.url?.includes(path));

    if (token && !isPublic) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }else if (!token && !isPublic) {
        // Si no hay token y la ruta no es pública, redirigir a login
        window.location.href = "/";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores de autenticación
AxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      removeToken();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosClient;


