import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthHeader = async (): Promise<HeadersInit> => {
    const token = await AsyncStorage.getItem('auth_token');
    return token
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };
};

export const alankaraService = {
    getLatestAlankara: async () => {
        try {
            const response = await fetch(`${API_URL}/alankara/latest`);
            if (response.status === 204) return null;
            if (!response.ok) throw new Error('Failed to fetch alankara');
            return response.json();
        } catch (error) {
            console.error('Error fetching latest alankara:', error);
            return null;
        }
    },

    uploadAlankara: async (imageUrl: string) => {
        try {
            const headers = await getAuthHeader();
            const response = await fetch(`${API_URL}/admin/alankara`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ imageUrl })
            });
            if (!response.ok) throw new Error('Failed to upload alankara');
            return response.json();
        } catch (error) {
            console.error('Error uploading alankara:', error);
            throw error;
        }
    },

    checkUploadStatus: async () => {
        try {
            const headers = await getAuthHeader();
            const response = await fetch(`${API_URL}/admin/alankara/status`, {
                headers
            });
            if (!response.ok) throw new Error('Failed to check status');
            return response.json();
        } catch (error) {
            console.error('Error checking upload status:', error);
            return { uploadedToday: false };
        }
    }
};
