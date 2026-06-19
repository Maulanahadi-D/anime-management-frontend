import axios from 'axios';
import useAuthStore from '../store/authStore'; 

const API = axios.create({
  // Murni baca dari ENV Vercel tanpa backup localhost bawa sial
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      const { logout } = useAuthStore.getState();

      if (typeof logout === 'function') {
        logout();
      } else {
        localStorage.removeItem('token');
      }

      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API; // 👈 Export huruf besar