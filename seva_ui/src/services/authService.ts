import apiClient from './apiClient';
import type { User } from '../types/types';

const AUTH_TOKEN_KEY = 'admin_auth_token';

interface AuthResponse {
    token: string;
    isNewUser: boolean;
}

export const authService = {
    async sendOtp(phoneNumber: string): Promise<{ message: string }> {
        const response = await apiClient.post(`/auth/send-otp?phoneNumber=${encodeURIComponent(phoneNumber)}`);
        return response.data;
    },

    async verifyOtp(phoneNumber: string, otp: string): Promise<AuthResponse> {
        const response = await apiClient.post(`/auth/verify-otp?phoneNumber=${encodeURIComponent(phoneNumber)}&otp=${encodeURIComponent(otp)}`);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    saveToken(token: string): void {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },

    getToken(): string | null {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    logout(): void {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    },

    async updateProfile(userData: Partial<User>): Promise<User> {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    }
};
