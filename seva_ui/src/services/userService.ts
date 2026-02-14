import apiClient from './apiClient';
import type { PaginatedUsers, User } from '../types/types';

export const userService = {
    getAllUsers: async (page: number = 0, size: number = 20): Promise<PaginatedUsers> => {
        const response = await apiClient.get('/admin/users', {
            params: { page, size },
        });
        return response.data;
    },

    exportUsers: async (): Promise<User[]> => {
        const response = await apiClient.get('/admin/users/export');
        return response.data;
    },

    toggleVolunteer: async (id: string, isVolunteer: boolean): Promise<User> => {
        const response = await apiClient.put(`/admin/users/${id}/volunteer`, null, {
            params: { isVolunteer },
        });
        return response.data;
    },

    promoteToAdmin: async (id: string, secret: string): Promise<User> => {
        const response = await apiClient.put(`/admin/users/${id}/promote`, null, {
            params: { secret },
        });
        return response.data;
    },
};
