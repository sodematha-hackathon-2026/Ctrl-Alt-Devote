import { Platform } from 'react-native';

export const requestStoragePermission = async (): Promise<boolean> => {
    return true; // Web doesn't need explicit storage permissions for downloading files
};

export const saveFile = async (fileName: string, content: string, mimeType: string = 'text/plain'): Promise<void> => {
    try {
        const element = document.createElement('a');
        const file = new Blob([content], { type: mimeType });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
};
