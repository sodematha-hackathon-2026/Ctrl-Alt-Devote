import axios from 'axios';
import { authService } from './authService';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear token and redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                authService.logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
