import { StorageAccessFramework, documentDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        return permissions.granted;
    }
    return true; // iOS doesn't require explicit storage permissions for sharing files created by the app
};

export const saveFile = async (fileName: string, content: string, mimeType: string = 'text/plain'): Promise<void> => {
    try {
        if (Platform.OS === 'android') {
            const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const uri = await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, mimeType);
                await writeAsStringAsync(uri, content, { encoding: 'utf8' });
            } else {
                throw new Error('Storage permission denied');
            }
        } else {
            const fileUri = (documentDirectory || '') + fileName;
            await writeAsStringAsync(fileUri, content, { encoding: 'utf8' });
            await Sharing.shareAsync(fileUri);
        }
    } catch (error) {
        console.error('Error saving file:', error);
        throw error;
    }
};
