import apiClient from './apiClient';

export const uploadFileToS3 = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    } catch (error) {
        console.error('Error uploading file to server:', error);
        throw error;
    }
};
