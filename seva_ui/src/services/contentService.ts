import apiClient from './apiClient';
import type { NewsArticle, Event, Branch, Guru, FlashUpdate, Timings, Album, MediaItem } from '../types/types';

export const contentService = {
    async getLatestDailyAlankara() {
        const response = await apiClient.get('/admin/daily-alankara/latest');
        return response.data;
    },

    async uploadDailyAlankara(imageUrl: string) {
        const response = await apiClient.post('/admin/daily-alankara', { imageUrl });
        return response.data;
    },

    // News
    createNews: async (news: NewsArticle): Promise<NewsArticle> => {
        const response = await apiClient.post('/admin/news', news);
        return response.data;
    },

    updateNews: async (id: number, news: NewsArticle): Promise<NewsArticle> => {
        const response = await apiClient.put(`/admin/news/${id}`, news);
        return response.data;
    },

    deleteNews: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/news/${id}`);
    },

    // Events
    getAllEvents: async (): Promise<Event[]> => {
        const response = await apiClient.get('/content/events');
        return response.data;
    },

    createEvent: async (event: Event): Promise<Event> => {
        const response = await apiClient.post('/admin/events', event);
        return response.data;
    },

    updateEvent: async (id: number, event: Event): Promise<Event> => {
        const response = await apiClient.put(`/admin/events/${id}`, event);
        return response.data;
    },

    deleteEvent: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/events/${id}`);
    },

    // Branches
    createBranch: async (branch: Branch): Promise<Branch> => {
        const response = await apiClient.post('/admin/branches', branch);
        return response.data;
    },

    updateBranch: async (id: string, branch: Branch): Promise<Branch> => {
        const response = await apiClient.put(`/admin/branches/${id}`, branch);
        return response.data;
    },

    deleteBranch: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/branches/${id}`);
    },

    // Gurus
    createGuru: async (guru: Guru): Promise<Guru> => {
        const response = await apiClient.post('/admin/gurus', guru);
        return response.data;
    },

    updateGuru: async (id: number, guru: Guru): Promise<Guru> => {
        const response = await apiClient.put(`/admin/gurus/${id}`, guru);
        return response.data;
    },

    deleteGuru: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/gurus/${id}`);
    },

    // Flash Updates
    createFlashUpdate: async (flashUpdate: FlashUpdate): Promise<FlashUpdate> => {
        const response = await apiClient.post('/admin/flash-updates', flashUpdate);
        return response.data;
    },

    updateFlashUpdate: async (id: number, flashUpdate: FlashUpdate): Promise<FlashUpdate> => {
        const response = await apiClient.put(`/admin/flash-updates/${id}`, flashUpdate);
        return response.data;
    },

    deleteFlashUpdate: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/flash-updates/${id}`);
    },

    // Timings
    getAllTimings: async (): Promise<Timings[]> => {
        const response = await apiClient.get('/admin/timings');
        return response.data;
    },

    createTimings: async (timings: Timings): Promise<Timings> => {
        const response = await apiClient.post('/admin/timings', timings);
        return response.data;
    },

    updateTimings: async (id: number, timings: Timings): Promise<Timings> => {
        const response = await apiClient.put(`/admin/timings/${id}`, timings);
        return response.data;
    },

    // Gallery
    getAllAlbums: async (): Promise<Album[]> => {
        const response = await apiClient.get('/content/gallery/albums');
        return response.data;
    },

    createAlbum: async (album: Album): Promise<Album> => {
        const response = await apiClient.post('/admin/gallery/albums', album);
        return response.data;
    },

    updateAlbum: async (id: number, album: Album): Promise<Album> => {
        const response = await apiClient.put(`/admin/gallery/albums/${id}`, album);
        return response.data;
    },

    deleteAlbum: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/gallery/albums/${id}`);
    },

    addMediaToAlbum: async (albumId: number, media: MediaItem): Promise<MediaItem> => {
        const response = await apiClient.post(`/admin/gallery/albums/${albumId}/media`, media);
        return response.data;
    },

    deleteMediaItem: async (id: number): Promise<void> => {
        await apiClient.delete(`/admin/gallery/media/${id}`);
    },

    getAlbumMedia: async (albumId: number): Promise<MediaItem[]> => {
        const response = await apiClient.get(`/admin/gallery/albums/${albumId}/media`);
        return response.data;
    },
};
