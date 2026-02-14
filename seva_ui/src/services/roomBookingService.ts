import apiClient from './apiClient';
import type { RoomBooking } from '../types/types';

export const roomBookingService = {
    getAllBookings: async (): Promise<RoomBooking[]> => {
        const response = await apiClient.get('/bookings/all');
        return response.data;
    },

    approveBooking: async (bookingId: string): Promise<void> => {
        await apiClient.put(`/bookings/${bookingId}/approve`);
    },

    rejectBooking: async (bookingId: string): Promise<void> => {
        await apiClient.put(`/bookings/${bookingId}/reject`);
    },
};
