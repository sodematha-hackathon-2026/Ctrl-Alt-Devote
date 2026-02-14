import { create } from 'zustand';
import { authService } from '../api/authService';

interface User {
    id?: string;
    phoneNumber: string;
    fullName?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isVolunteer?: boolean;
    volunteerRequest?: boolean;
    isAdmin?: boolean;
    gothra?: string;
    nakshatra?: string;
    rashi?: string;
    hobbiesOrTalents?: string;
    pastExperience?: string;
    // ... other user fields
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    tempPhoneNumber: string | null;

    // Actions
    loadUser: () => Promise<void>;
    refreshUser: () => Promise<void>;
    sendOtp: (phoneNumber: string) => Promise<void>;
    verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
    updateProfile: (user: Partial<User>) => Promise<void>;
    signOut: () => Promise<void>;
    getToken: () => Promise<string | null>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoading: true,
    error: null,
    tempPhoneNumber: null,

    loadUser: async () => {
        set({ isLoading: true });
        try {
            const token = await authService.getToken();
            if (token) {
                const profile = await authService.getMe();
                set({ user: profile });
            }
        } catch (e) {
            // Silently handle session load failures (user might not be logged in)
            if (__DEV__) {
                console.log("User session not available");
            }
            await authService.logout();
            set({ user: null });
        } finally {
            set({ isLoading: false });
        }
    },

    refreshUser: async () => {
        // Silent refresh - no loading state
        try {
            const token = await authService.getToken();
            if (token) {
                const profile = await authService.getMe();
                set({ user: profile });

                set({ user: profile });
            }
        } catch (e) {
            console.log("Silent refresh failed", e);
        }
    },

    sendOtp: async (phoneNumber: string) => {
        set({ error: null, isLoading: true });
        try {
            await authService.sendOtp(phoneNumber);
            set({ tempPhoneNumber: phoneNumber, isLoading: false });
        } catch (err: any) {
            console.error("Error sending OTP", err);
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    verifyOtp: async (phoneNumber: string, otp: string) => {
        set({ error: null, isLoading: true });
        try {
            const { token, isNewUser } = await authService.verifyOtp(phoneNumber, otp);
            await authService.saveToken(token);

            // Try to fetch profile, if new user handle gracefully
            let profile: User;
            try {
                profile = await authService.getMe();
            } catch (e) {
                // If getMe fails for a new user, we at least set the phone number
                profile = { phoneNumber };
            }

            // Set user and isLoading atomically to prevent navigation flash
            set({ user: profile, isLoading: false, tempPhoneNumber: null });
        } catch (err: any) {
            console.error("[AUTH] Error verifying OTP", err);
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    updateProfile: async (userData: Partial<User>) => {
        set({ error: null, isLoading: true });
        try {
            const updatedUser = await authService.register(userData);
            set({ user: updatedUser, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
            set({ user: null, isLoading: false });
        } catch (error) {
            console.error('Error signing out:', error);
            set({ isLoading: false });
        }
    },

    getToken: async () => {
        return await authService.getToken();
    },

    clearError: () => set({ error: null }),
}));
