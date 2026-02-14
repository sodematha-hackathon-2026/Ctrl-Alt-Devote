import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NewsArticle {
    id: string; // or number, backend usually sends number/string
    title: string;
    content: string;
    date?: string; // or createdAt
    imageURL?: string;
    isPublished?: boolean;
}

export const newsService = {
    getAllNews: async (): Promise<NewsArticle[]> => {
        // News feature has been scrapped from the backend
        return [];
    }
};
