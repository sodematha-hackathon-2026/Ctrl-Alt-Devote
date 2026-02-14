import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, useTheme, Text } from 'react-native-paper';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

interface VoiceSearchProps {
    onResult: (text: string) => void;
    isListening?: boolean;
    onListeningStateChange?: (isListening: boolean) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResult, onListeningStateChange }) => {
    const theme = useTheme();
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStart = (e: any) => {
        setIsListening(true);
        onListeningStateChange?.(true);
    };

    const onSpeechEnd = (e: any) => {
        setIsListening(false);
        onListeningStateChange?.(false);
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
        console.error('onSpeechError: ', e);
        setError(JSON.stringify(e.error));
        setIsListening(false);
        onListeningStateChange?.(false);
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value && e.value[0]) {
            onResult(e.value[0]);
        }
    };

    const startRecognizing = async () => {
        try {
            await Voice.start('en-US');
            setError('');
        } catch (e) {
            console.error(e);
        }
    };

    const stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={isListening ? stopRecognizing : startRecognizing}>
                <IconButton
                    icon={isListening ? "microphone-off" : "microphone"}
                    iconColor={isListening ? theme.colors.error : theme.colors.primary}
                    size={24}
                    mode={isListening ? "contained" : undefined}
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
