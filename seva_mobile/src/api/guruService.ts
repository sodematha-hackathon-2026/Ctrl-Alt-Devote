import { Swamiji } from '../data/guruParampara';
import { API_URL } from './config';

export const guruService = {
    getAllGurus: async (): Promise<Swamiji[]> => {
        try {
            const response = await fetch(`${API_URL}/content/guru`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching gurus:', error);
            throw error;
        }
    }
};
