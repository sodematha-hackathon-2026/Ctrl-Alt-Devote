import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Modal, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { ActivityIndicator, useTheme, Text, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { MediaItem } from '../api/galleryService';

const { width, height } = Dimensions.get('window');

interface AlbumViewerProps {
    visible: boolean;
    albumId: number | null;
    albumTitle: string;
    mediaItems: MediaItem[];
    coverImage?: string;
    loading?: boolean;
    onClose: () => void;
}

const AlbumViewer: React.FC<AlbumViewerProps> = ({ visible, albumId, albumTitle, mediaItems, coverImage, loading = false, onClose }) => {
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            setCurrentIndex(0);
            setImageLoading(true);
        }
    }, [visible]);

    useEffect(() => {
        if (mediaItems.length > 0) {
            setImageLoading(false);
        }
    }, [mediaItems]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < mediaItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    if (!visible || !albumId) return null;

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={[styles.container, { backgroundColor: 'black' }]}>
                <SafeAreaView style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
                                {albumTitle}
                            </Text>
                            {mediaItems.length > 0 && (
                                <Text variant="bodySmall" style={styles.counter}>
                                    {currentIndex + 1} / {mediaItems.length}
                                </Text>
                            )}
                        </View>
                    </View>
                </SafeAreaView>

                <View style={styles.imageContainer}>
                    {loading ? (
                        <View style={StyleSheet.absoluteFillObject}>
                            <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
                            <Text style={styles.loadingText}>Loading album images...</Text>
                        </View>
                    ) : mediaItems.length === 0 ? (
                        coverImage ? (
                            // Show cover image if available
                            <View style={styles.imageWrapper}>
                                {imageLoading && (
                                    <View style={StyleSheet.absoluteFillObject}>
                                        <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
                                    </View>
                                )}
                                <Image
                                    source={{ uri: coverImage }}
                                    style={styles.image}
                                    resizeMode="contain"
                                    onLoadEnd={() => setImageLoading(false)}
                                    onError={() => {
                                        setImageLoading(false);
                                    }}
                                />
                            </View>
                        ) : (
                            <View style={StyleSheet.absoluteFillObject}>
                                <Text style={styles.emptyText}>No images in this album yet.</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButtonBottom}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    ) : (
                        <>
                            <FlatList
                                data={mediaItems}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => (item.id || index).toString()}
                                style={styles.flatList}
                                onMomentumScrollEnd={(event) => {
                                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                                    setCurrentIndex(index);
                                }}
                                renderItem={({ item, index }) => (
                                    <View style={styles.imageWrapper}>
                                        {item.type === 'VIDEO' ? (
                                            <View style={styles.videoPlaceholder}>
                                                <Text style={styles.videoText}>Video not supported</Text>
                                            </View>
                                        ) : (
                                            <Image
                                                source={{ uri: item.url }}
                                                style={styles.image}
                                                resizeMode="contain"
                                                onLoadEnd={() => {
                                                    if (index === 0) setImageLoading(false);
                                                }}
                                            />
                                        )}
                                        {item.caption && (
                                            <View style={styles.captionContainer}>
                                                <Text style={styles.caption}>{item.caption}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                                getItemLayout={(data, index) => ({
                                    length: width,
                                    offset: width * index,
                                    index,
                                })}
                            />
                            {imageLoading && (
                                <View style={StyleSheet.absoluteFillObject}>
                                    <ActivityIndicator size="large" color="white" style={{ flex: 1 }} />
                                </View>
                            )}
                        </>
                    )}

                    {/* Navigation Arrows */}
                    {mediaItems.length > 1 && (
                        <>
                            {currentIndex > 0 && (
                                <TouchableOpacity
                                    style={[styles.navButton, styles.leftButton]}
                                    onPress={handlePrevious}
                                >
                                    <ChevronLeft size={32} color="white" />
                                </TouchableOpacity>
                            )}
                            {currentIndex < mediaItems.length - 1 && (
                                <TouchableOpacity
                                    style={[styles.navButton, styles.rightButton]}
                                    onPress={handleNext}
                                >
                                    <ChevronRight size={32} color="white" />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        marginRight: 12,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
    },
    counter: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatList: {
        flex: 1,
    },
    imageWrapper: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: height,
    },
    videoPlaceholder: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    videoText: {
        color: 'white',
        fontSize: 16,
    },
    captionContainer: {
        position: 'absolute',
        bottom: 40,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
        borderRadius: 8,
    },
    caption: {
        color: 'white',
        fontSize: 14,
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        zIndex: 20,
    },
    leftButton: {
        left: 16,
    },
    rightButton: {
        right: 16,
    },
    loadingText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginTop: '50%',
    },
    closeButtonBottom: {
        marginTop: 24,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    debugText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
});

export default AlbumViewer;
