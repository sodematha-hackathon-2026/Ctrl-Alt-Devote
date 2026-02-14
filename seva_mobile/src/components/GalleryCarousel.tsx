import React, { useState } from 'react';
import { FlatList, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { Album } from '../api/galleryService';

interface GalleryCarouselProps {
    data: Album[];
    onPressAlbum?: (album: Album) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7; // 70% of screen width

// Separate component for album card to use hooks
const AlbumCard: React.FC<{ album: Album; onPress: (album: Album) => void }> = ({ album, onPress }) => {
    const theme = useTheme();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);


    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(album)}>
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={{ borderRadius: 12, overflow: 'hidden' }}>
                    {/* Image Section */}
                    <View style={styles.imageContainer}>
                        {album.thumbnailUrl && !imageError ? (
                            <>
                                {imageLoading && (
                                    <View style={[styles.image, styles.loadingOverlay, { backgroundColor: theme.colors.surfaceVariant }]} />
                                )}
                                <Image
                                    source={{ uri: album.thumbnailUrl }}
                                    style={styles.image}
                                    resizeMode="cover"
                                    onLoadStart={() => {
                                        setImageLoading(true);
                                    }}
                                    onLoadEnd={() => {
                                        setImageLoading(false);
                                    }}
                                    onError={(error) => {
                                        console.error(`Image load error for album ${album.id}:`, error.nativeEvent.error);
                                        console.error(`Failed URL: ${album.thumbnailUrl}`);
                                        setImageError(true);
                                        setImageLoading(false);
                                    }}
                                />
                            </>
                        ) : (
                            <View style={[styles.image, { backgroundColor: theme.colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text variant="labelMedium">No Cover</Text>
                                {album.thumbnailUrl && (
                                    <Text variant="bodySmall" style={{ marginTop: 4, fontSize: 10, opacity: 0.5 }}>
                                        Failed to load
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                    <Card.Content style={styles.cardContent}>
                        <Text variant="titleMedium" numberOfLines={1} style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            {album.title}
                        </Text>
                        {album.description && (
                            <Text variant="bodySmall" numberOfLines={1} style={{ opacity: 0.7 }}>
                                {album.description}
                            </Text>
                        )}
                    </Card.Content>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ data, onPressAlbum }) => {
    const theme = useTheme();

    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', opacity: 0.7 }}>
                    No albums created yet. Please wait till admin uploads images.
                </Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Album }) => (
        <AlbumCard album={item} onPress={(album) => onPressAlbum && onPressAlbum(album)} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToInterval={CARD_WIDTH + 16}
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: CARD_WIDTH,
        marginRight: 16,
        borderRadius: 12,
        elevation: 2,
    },
    imageContainer: {
        height: 120,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    cardContent: {
        padding: 12,
    },
});

export default GalleryCarousel;
