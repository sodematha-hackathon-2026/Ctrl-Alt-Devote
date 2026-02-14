import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const AUTH_TOKEN_KEY = 'auth_token';

interface AuthResponse {
    token: string;
    isNewUser: boolean;
}

interface User {
    id?: string;
    phoneNumber: string;
    fullName?: string;
    email?: string;
    role?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isVolunteer?: boolean;
}

export const authService = {
    async sendOtp(phoneNumber: string): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/auth/send-otp?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Failed to send OTP');
        }
        return response.json();
    },

    async verifyOtp(phoneNumber: string, otp: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/verify-otp?phoneNumber=${encodeURIComponent(phoneNumber)}&otp=${encodeURIComponent(otp)}`, {
            method: 'POST',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid OTP');
        }
        return response.json();
    },

    async register(user: Partial<User>): Promise<User> {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to register: ${response.status} ${text}`);
        }
        return response.json();
    },

    async getMe(): Promise<User> {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            await this.logout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return response.json();
    },

    async saveToken(token: string): Promise<void> {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    },

    async getToken(): Promise<string | null> {
        return AsyncStorage.getItem(AUTH_TOKEN_KEY);
    },

    async logout(): Promise<void> {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
};
