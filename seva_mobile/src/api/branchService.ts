import { API_URL } from './config';

export interface Branch {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    mapLink: string;
    latitude: number;
    longitude: number;
}

export const getBranches = async (): Promise<Branch[]> => {
    try {
        const response = await fetch(`${API_URL}/branches`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching branches:', error);
        throw error;
    }
};
