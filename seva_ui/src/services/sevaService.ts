import apiClient from './apiClient';
import type { SevaBooking } from '../types/types';

export const sevaService = {
    getAllBookings: async (): Promise<SevaBooking[]> => {
        const response = await apiClient.get('/bookings/seva/all');
        return response.data;
    },
};
