import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Plus } from 'lucide-react-native';

interface StoryCircleProps {
    imageUrl?: string;
    onPress: () => void;
    isActive?: boolean;
    style?: ViewStyle;
}

const StoryCircle: React.FC<StoryCircleProps> = ({
    imageUrl,
    onPress,
    isActive = false,
    style
}) => {
    const theme = useTheme();

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
            <View style={[
                styles.borderContainer,
                isActive && { borderColor: theme.colors.primary, borderWidth: 3 },
                !isActive && { borderColor: theme.colors.outline, borderWidth: 1 } // Inactive/seen state
            ]}>
                <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={{ flex: 1 }} />
                    )}
                </View>
            </View>
            <Text variant="labelSmall" style={styles.label}>
                Alankara
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    borderContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 36,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    label: {
        marginTop: 4,
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        bottom: 20,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    }
});

export default StoryCircle;
