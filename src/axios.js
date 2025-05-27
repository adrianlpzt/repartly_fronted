import axios from 'axios';
import { isTokenExpired } from './utils/jwt';
import { useAuthStore } from './stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    if (isTokenExpired(token)) {
      const authStore = useAuthStore();
      authStore.logout();
      return Promise.reject(new Error('Token expirado'));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

export default api;
