import apiClient from './apiClient';
import { VolunteerOpportunity, VolunteerApplication } from '../types/types';

const BASE_URL = '/volunteer-opportunities';

export const volunteerService = {
    // Get all open opportunities (public)
    getOpenOpportunities: async (): Promise<VolunteerOpportunity[]> => {
        const response = await apiClient.get(BASE_URL);
        return response.data;
    },

    // Get all opportunities (admin)
    getAllOpportunities: async (): Promise<VolunteerOpportunity[]> => {
        const response = await apiClient.get(`${BASE_URL}/all`);
        return response.data;
    },

    // Create opportunity
    createOpportunity: async (opportunity: Partial<VolunteerOpportunity>): Promise<VolunteerOpportunity> => {
        const response = await apiClient.post(BASE_URL, opportunity);
        return response.data;
    },

    // Update opportunity
    updateOpportunity: async (id: string, opportunity: Partial<VolunteerOpportunity>): Promise<VolunteerOpportunity> => {
        const response = await apiClient.put(`${BASE_URL}/${id}`, opportunity);
        return response.data;
    },

    // Delete opportunity
    deleteOpportunity: async (id: string): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/${id}`);
    },

    // Apply for opportunity
    applyForOpportunity: async (id: string): Promise<void> => {
        await apiClient.post(`${BASE_URL}/${id}/apply`, {});
    },

    // Get applications for an opportunity (admin)
    getApplications: async (id: string): Promise<VolunteerApplication[]> => {
        const response = await apiClient.get(`${BASE_URL}/${id}/applications`);
        return response.data;
    },

    // Update application status (admin)
    updateApplicationStatus: async (applicationId: string, status: VolunteerApplication['status']): Promise<VolunteerApplication> => {
        const response = await apiClient.put(`${BASE_URL}/applications/${applicationId}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    // Register as a volunteer
    registerVolunteer: async (data: any): Promise<any> => {
        const response = await apiClient.post('/volunteers/register', data);
        return response.data;
    }
};
