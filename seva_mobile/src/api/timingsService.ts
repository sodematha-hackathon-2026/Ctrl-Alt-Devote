import { API_URL } from './config';

export interface Timing {
    id: number;
    location: string;
    darshanTime: string;
    prasadaTime: string;
    isActive: boolean;
}

const DEFAULT_TIMINGS: Timing[] = [
    {
        id: 1,
        location: 'Sode',
        darshanTime: '5:00 am - 8:30 am',
        prasadaTime: '11:30 am',
        isActive: true
    },
    {
        id: 2,
        location: 'Evening',
        darshanTime: '5:00 pm - 7:30 pm',
        prasadaTime: '7:30 pm',
        isActive: true
    }
];

export const timingsService = {
    getAllTimings: async (): Promise<Timing[]> => {
        try {
            const response = await fetch(`${API_URL}/content/timings`);
            if (!response.ok) {
                console.warn('Failed to fetch timings, using default.');
                return DEFAULT_TIMINGS;
            }
            return await response.json();
        } catch (error) {
            console.warn('Error fetching timings, using default:', error);
            // Fallback to default timings if API fails (e.g., backend not ready)
            return DEFAULT_TIMINGS;
        }
    }
};
