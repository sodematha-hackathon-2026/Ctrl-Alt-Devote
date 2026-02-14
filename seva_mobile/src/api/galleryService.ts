import { API_URL } from './config';

export interface Album {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl: string;
    createdAt?: string;
}

export interface MediaItem {
    id: number;
    url: string;
    type: 'PHOTO' | 'VIDEO' | 'IMAGE';
    caption?: string;
}

export const galleryService = {
    getAllAlbums: async (): Promise<Album[]> => {
        try {
            const url = `${API_URL}/content/gallery/albums`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error('Albums response not OK:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Albums error response body:', errorText);
                return [];
            }

            const albums = await response.json();

            // Map coverImage from backend to thumbnailUrl for frontend compatibility
            const mappedAlbums = albums.map((album: any) => {
                const mapped = {
                    ...album,
                    thumbnailUrl: album.coverImage || album.thumbnailUrl || ''
                };
                return mapped;
            });

            return mappedAlbums;
        } catch (error) {
            console.error('Error fetching albums:', error);
            return [];
        }
    },

    getAlbumMedia: async (albumId: number): Promise<MediaItem[]> => {
        try {
            const url = `${API_URL}/content/gallery/albums/${albumId}/media`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                return [];
            }

            const data = await response.json();

            // Ensure we return an array
            if (Array.isArray(data)) {
                // Filter out any null/undefined items and ensure each has required fields
                const validItems = data.filter(item => item && item.url).map(item => ({
                    id: item.id,
                    url: item.url,
                    type: item.type || 'PHOTO', // Default to PHOTO if type is missing
                    caption: item.caption || undefined
                }));
                return validItems;
            }
            return [];
        } catch (error) {
            console.error('Error fetching album media:', error);
            return [];
        }
    }
};
