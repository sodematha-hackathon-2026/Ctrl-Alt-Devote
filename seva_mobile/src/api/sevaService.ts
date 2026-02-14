import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Seva {
    id: string;
    titleEnglish: string;
    titleKannada?: string;
    amount: number;
    description?: string;
    imageUrl?: string;
    category: 'SODE' | 'UDUPI_PARYAYA';
    isActive: boolean;
}

export interface SevaBookingRequest {
    seva: { id: string };
    sevaDate: string | Date;
    devoteeName: string;
    devoteeRashi: string;
    devoteeNakshatra: string;
    devoteeGothra: string;
    amountPaid: number;
    prasadaDeliveryMode: 'IN_PERSON' | 'POST';
}

export const sevaService = {
    getAllSevas: async (category?: string): Promise<Seva[]> => {
        try {
            const url = category ? `${API_URL}/bookings/sevas?category=${category}` : `${API_URL}/bookings/sevas`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sevas');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching sevas:', error);
            return [];
        }
    },

    initiateSevaBooking: async (bookingData: SevaBookingRequest, token: string, userId: string): Promise<any> => {
        const response = await fetch(`${API_URL}/bookings/seva/initiate?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });
        if (!response.ok) throw new Error('Failed to initiate booking');
        return await response.json();
    },

    completeSevaBooking: async (bookingId: string, paymentId: string, signature: string, token: string): Promise<any> => {
        const response = await fetch(`${API_URL}/bookings/seva/complete?bookingId=${bookingId}&paymentId=${paymentId}&signature=${signature}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to complete booking');
        return await response.json();
    },

    // Deprecated but kept for backward compatibility if needed
    // Deprecated but kept for backward compatibility if needed
    bookSeva: async (bookingData: SevaBookingRequest, token: string, userId: string): Promise<any> => {
        try {
            const response = await fetch(`${API_URL}/bookings/seva?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Booking failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Error booking seva:', error);
            throw error;
        }
    }
};
