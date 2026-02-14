import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { shadows } from '../theme/shadows';

interface NewsTileProps {
    id: string;
    title: string;
    date: string;
    imageUrl?: string; // Optional URL
}

const NewsTile: React.FC<NewsTileProps> = ({ title, date, imageUrl }) => {
    const theme = useTheme();

    return (
        <Pressable style={({ pressed }) => [styles.container, pressed && { opacity: 0.9 }]}>
            <View style={[styles.card, shadows.primary, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    ) : (
                        <View style={[styles.placeholderImage, { backgroundColor: theme.colors.surfaceVariant }]} />
                    )}
                </View>
                <View style={styles.content}>
                    <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text variant="bodySmall" style={styles.date}>
                        {date}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        marginHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 24,
        padding: 12,
        alignItems: 'center',
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    title: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginBottom: 4,
    },
    date: {
        fontFamily: 'PlusJakartaSans-Regular',
        opacity: 0.6,
    },
});

export default NewsTile;
