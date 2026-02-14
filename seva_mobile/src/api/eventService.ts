import { API_URL } from './config';

export interface Event {
    id: number;
    title: string;
    description?: string;
    date: string;
    tithi?: string;
    imageURL?: string;
    category?: string;
}

export const eventService = {
    getAllEvents: async (): Promise<Event[]> => {
        try {
            const response = await fetch(`${API_URL}/content/events`);
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }
};
