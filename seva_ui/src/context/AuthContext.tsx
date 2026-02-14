import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (phoneNumber: string, otp: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = authService.getToken();
            if (token) {
                try {
                    const profile = await authService.getCurrentUser();
                    setUser(profile);
                } catch (err) {
                    console.error('Failed to load user profile', err);
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (phoneNumber: string, otp: string) => {
        setLoading(true);
        setError(null);
        try {
            const { token, isNewUser } = await authService.verifyOtp(phoneNumber, otp);

            if (isNewUser) {
                throw new Error('Access Denied: Admin account not registered.');
            }

            authService.saveToken(token);

            const profile = await authService.getCurrentUser();

            // Strict Admin Check
            if (profile.role !== 'ADMIN') {
                authService.logout();
                throw new Error('Access Denied: Admin privileges required.');
            }

            setUser(profile);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        window.location.href = '/login';
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
                clearError,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
