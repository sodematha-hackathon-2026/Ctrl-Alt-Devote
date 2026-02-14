import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RoomBooking {
    id: string;
    userId: string;
    userName?: string; 
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number; 
    numberOfRooms: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'APPROVED' | 'REJECTED'; // Added APPROVED/REJECTED
    referenceId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SevaBooking {
    id: string;
    userId: string;
    sevaId: string;
    sevaTitle: string;
    sevaDate: string;
    devoteeName: string;
    devoteeRashi?: string;
    devoteeNakshatra?: string;
    devoteeGothra?: string;
    amountPaid: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    prasadaDeliveryMode: 'IN_PERSON' | 'POST';
    referenceId?: string;
    createdAt: string;
    updatedAt: string;
}

export const bookingService = {
    // Get user's room booking history
    getRoomBookings: async (token: string, userId: string): Promise<RoomBooking[]> => {
        try {
            const response = await fetch(`${API_URL}/bookings/room/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.warn('Room bookings endpoint not available, returning empty array');
                return [];
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching room bookings:', error);
            return [];
        }
    },

    // Get user's seva booking history
    getSevaBookings: async (token: string, userId: string): Promise<SevaBooking[]> => {
        try {
            const response = await fetch(`${API_URL}/bookings/seva/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.warn('Seva bookings endpoint not available, returning empty array');
                return [];
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching seva bookings:', error);
            return [];
        }
    },

    // Cancel room booking
    cancelRoomBooking: async (bookingId: string, token: string): Promise<any> => {
        try {
            const response = await fetch(`${API_URL}/bookings/room/${bookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel room booking');
            }
            return await response.json();
        } catch (error) {
            console.error('Error cancelling room booking:', error);
            throw error;
        }
    },

    // Cancel seva booking
    cancelSevaBooking: async (bookingId: string, token: string): Promise<any> => {
        try {
            const response = await fetch(`${API_URL}/bookings/seva/${bookingId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel seva booking');
            }
            return await response.json();
        } catch (error) {
            console.error('Error cancelling seva booking:', error);
            throw error;
        }
    },

    // Admin: Get all room bookings for approval
    getAllRoomBookings: async (token: string): Promise<RoomBooking[]> => {
        try {
            const response = await fetch(`${API_URL}/bookings/all`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch all room bookings');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching all room bookings:', error);
            return [];
        }
    },

    // Admin: Approve room booking
    approveRoomBooking: async (bookingId: string, token: string): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/bookings/${bookingId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to approve room booking');
            }
        } catch (error) {
            console.error('Error approving room booking:', error);
            throw error;
        }
    },

    // Admin: Reject room booking
    rejectRoomBooking: async (bookingId: string, token: string): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/bookings/${bookingId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reject room booking');
            }
        } catch (error) {
            console.error('Error rejecting room booking:', error);
            throw error;
        }
    }
};
