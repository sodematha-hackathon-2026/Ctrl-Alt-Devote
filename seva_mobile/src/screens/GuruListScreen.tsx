import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Swamiji } from '../data/guruParampara';
import { guruService } from '../api/guruService';

const { width, height } = Dimensions.get('window');

const GuruListScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const [gurus, setGurus] = useState<Swamiji[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadGurus();
    }, []);

    const loadGurus = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await guruService.getAllGurus();
            // Sort by orderIndex if available
            const sortedData = data.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            setGurus(sortedData);
        } catch (error) {
            console.error('Failed to load gurus', error);
            setError('Failed to load gurus. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleGuruPress = (guru: Swamiji) => {
        navigation.navigate('GuruDetail', { guruId: guru.id });
    };

    const renderGridItem = ({ item }: { item: Swamiji }) => (
        <TouchableOpacity
            onPress={() => handleGuruPress(item)}
            activeOpacity={0.7}
            style={styles.gridItem}
        >
            <View style={[styles.gridCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
                <View style={[styles.gridAvatarContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    {item.photoURL ? (
                        <Image
                            source={{ uri: item.photoURL }}
                            style={styles.gridAvatarImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {item.name.charAt(0)}
                        </Text>
                    )}
                </View>
                <Text variant="titleSmall" style={styles.gridName} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.gridPeriod} numberOfLines={1}>
                    {item.period || 'Period N/A'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text variant="bodyLarge" style={{ color: theme.colors.error }}>{error}</Text>
                <Button mode="contained" onPress={loadGurus} style={{ marginTop: 16 }}>
                    Retry
                </Button>
            </View>
        );
    }

    return (
        <FlatList
            data={gurus}
            renderItem={renderGridItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    gridContent: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
    },
    gridCard: {
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    gridAvatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        overflow: 'hidden',
    },
    gridAvatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    gridName: {
        textAlign: 'center',
        marginBottom: 4,
        fontWeight: '600',
    },
    gridPeriod: {
        textAlign: 'center',
        opacity: 0.7,
    },
});

export default GuruListScreen;
