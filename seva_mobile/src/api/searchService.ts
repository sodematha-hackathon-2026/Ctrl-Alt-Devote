import { API_URL } from './config';
import { NewsArticle } from './newsService';

export interface Guru {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    mathaName?: string;
}

export interface Event {
    id: number;
    title: string;
    description?: string;
    date?: string;
    location?: string;
}

export interface Branch {
    id: string; // UUID
    name: string;
    address?: string;
    city?: string;
    state?: string;
}

export interface SearchResults {
    news: NewsArticle[];
    gurus: Guru[];
    events: Event[];
    branches: Branch[];
}

export const searchService = {
    searchGlobal: async (query: string): Promise<SearchResults> => {
        try {
            const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Search error:', error);
            // Return empty results on error to avoid crashing UI
            return { news: [], gurus: [], events: [], branches: [] };
        }
    }
};
