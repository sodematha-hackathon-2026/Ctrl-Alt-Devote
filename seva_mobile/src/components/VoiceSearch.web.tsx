import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

interface VoiceSearchProps {
    onResult: (text: string) => void;
    isListening?: boolean;
    onListeningStateChange?: (isListening: boolean) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult, onListeningStateChange }) => {
    const theme = useTheme();

    const handlePress = () => {
        console.log('Voice search is not supported on web');
        // Optionally show a snackbar or alert here if needed
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} disabled={true}>
                <IconButton
                    icon="microphone-off"
                    iconColor={theme.colors.onSurfaceDisabled}
                    size={24}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VoiceSearch;
