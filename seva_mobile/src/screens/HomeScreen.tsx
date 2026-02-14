import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView, RefreshControl, Dimensions, Alert, Image, Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, useTheme, Button, Searchbar, IconButton, Chip, Card } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { newsService, NewsArticle } from '../api/newsService';
import NewsTile from '../components/NewsTile';
import VoiceSearch from '../components/VoiceSearch';
import { useAuthStore } from '../store/authStore';
import { alankaraService } from '../api/alankaraService';
import StoryCircle from '../components/StoryCircle';
import StoryViewer from '../components/StoryViewer';
import FlashUpdatesCarousel from '../components/FlashUpdatesCarousel';
import { searchService, SearchResults, Guru, Branch } from '../api/searchService';
import { timingsService } from '../api/timingsService';
import { eventService, Event } from '../api/eventService';
import { galleryService, Album, MediaItem } from '../api/galleryService';
import GalleryCarousel from '../components/GalleryCarousel';
import AlbumViewer from '../components/AlbumViewer';
import LanguageToggle from '../components/LanguageToggle';

const HomeScreen = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { user, refreshUser } = useAuthStore();
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [voiceListening, setVoiceListening] = useState(false);

    // Alankara State
    const [alankara, setAlankara] = useState<{ id: string, imageUrl: string } | null>(null);
    const [timings, setTimings] = useState<any[]>([]);
    const [storyVisible, setStoryVisible] = useState(false);

    // Album Viewer State
    const [albumViewerVisible, setAlbumViewerVisible] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [albumMedia, setAlbumMedia] = useState<MediaItem[]>([]);
    const [loadingMedia, setLoadingMedia] = useState(false);

    useEffect(() => {
        loadContent();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTimings();
            refreshUser();
            // Clear search when navigating back to home
            setSearchQuery('');
            setSearchResults(null);
        }, [])
    );

    const loadContent = async () => {
        setLoading(true);
        await Promise.all([loadNews(), loadAlankara(), loadTimings(), loadEvents(), loadAlbums()]);
        setLoading(false);
    };

    const loadNews = async () => {
        try {
            const data = await newsService.getAllNews();
            setNews(data);
        } catch (error) {
            console.error('Failed to load news', error);
        }
    };

    const loadEvents = async () => {
        try {
            const data = await eventService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events', error);
        }
    };

    const loadAlbums = async () => {
        try {
            const data = await galleryService.getAllAlbums();
            setAlbums(data);
        } catch (error) {
            console.error('HomeScreen: Failed to load albums', error);
        }
    };

    const loadTimings = async () => {
        try {
            const data = await timingsService.getAllTimings();
            setTimings(data);
        } catch (error) {
            console.error('Failed to load timings', error);
        }
    };

    const loadAlankara = async () => {
        const data = await alankaraService.getLatestAlankara();
        setAlankara(data);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([loadNews(), loadAlankara(), loadEvents(), loadAlbums()]);
        setRefreshing(false);
    }, []);

    const performSearch = async (query: string) => {
        if (!query || query.trim().length <= 2) {
            setSearchResults(null);
            return;
        }
        setLoading(true);
        const results = await searchService.searchGlobal(query);
        setSearchResults(results);
        setLoading(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query === '') {
            setSearchResults(null);
        }
    };

    const handleVoiceStateChange = (isListening: boolean) => {
        setVoiceListening(isListening);
    };

    const handleAlbumPress = async (album: Album) => {
        setSelectedAlbum(album);
        setLoadingMedia(true);
        setAlbumViewerVisible(true);

        try {
            const media = await galleryService.getAlbumMedia(album.id);
            setAlbumMedia(media);
        } catch (error) {
            console.error('Failed to load album media:', error);
            setAlbumMedia([]);
        } finally {
            setLoadingMedia(false);
        }
    };

    const handleCloseAlbumViewer = () => {
        setAlbumViewerVisible(false);
        setSelectedAlbum(null);
        setAlbumMedia([]);
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const renderHeader = () => (
        <View>
            <View style={styles.orangeHeader}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    {/* Top Bar: Logo/Greeting and Actions */}
                    <View style={styles.topBar}>
                        <View style={styles.userInfo}>
                            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                            <View>
                                <Text variant="labelLarge" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'PlusJakartaSans-Medium' }}>
                                    {t('home.namaste')}
                                </Text>
                                <Text variant="titleLarge" style={{ color: '#fff', fontFamily: 'PlusJakartaSans-Bold' }}>
                                    {user?.fullName || t('home.devotee')}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.headerActions}>
                            <LanguageToggle />
                        </View>
                    </View>

                    {/* Swamiji Section - Inside the Header */}
                    {!searchResults && (
                        <View style={styles.swamijiSection}>
                            <View style={styles.swamijiContainer}>
                                <View style={styles.swamijiCircle}>
                                    <Image
                                        source={require('../../assets/Vishwotham1.png')}
                                        style={styles.swamijiImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text style={styles.swamijiName}>
                                    {t('home.swamiji1')}
                                </Text>
                            </View>
                            <View style={styles.swamijiContainer}>
                                <View style={styles.swamijiCircle}>
                                    <Image
                                        source={require('../../assets/Vishwavallabha1.png')}
                                        style={styles.swamijiImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text style={styles.swamijiName}>
                                    {t('home.swamiji2')}
                                </Text>
                            </View>
                        </View>
                    )}
                </SafeAreaView>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder={t('home.searchPlaceholder')}
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor={theme.colors.primary}
                    onSubmitEditing={() => performSearch(searchQuery)}
                    onIconPress={() => performSearch(searchQuery)}
                    right={() => (
                        <VoiceSearch
                            onResult={(text) => {
                                handleSearch(text);
                                performSearch(text);
                            }}
                            onListeningStateChange={handleVoiceStateChange}
                        />
                    )}
                />
            </View>

            {!searchResults && (
                <>
                    {/* Daily Alankara */}
                    <View style={styles.appBar}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text variant="titleLarge" style={styles.sectionTitle}>{t('home.events')}</Text>
                            {alankara && (
                                <StoryCircle
                                    imageUrl={alankara.imageUrl}
                                    isActive={true}
                                    onPress={() => setStoryVisible(true)}
                                    style={{ marginLeft: 16 }}
                                />
                            )}
                        </View>
                    </View>

                    {/* Events Carousel */}
                    <View style={styles.flashUpdateContainer}>
                        <FlashUpdatesCarousel data={events} />
                    </View>

                    {/* Darshana & Prasada Section */}
                    <View style={styles.darshanaSection}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 16 }}>
                            <Text variant="titleLarge" style={[styles.sectionTitle, { marginLeft: 0 }]}>{t('home.darshanaPrasada')}</Text>
                        </View>

                        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]}>
                            <Card.Content>
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableHeader, { flex: 1 }]}>{t('home.location')}</Text>
                                    <Text style={[styles.tableHeader, { flex: 2 }]}>{t('home.darshan')}</Text>
                                    <Text style={[styles.tableHeader, { flex: 1, textAlign: 'right' }]}>{t('home.prasada')}</Text>
                                </View>
                                <View style={styles.divider} />
                                {loading ? (
                                    <Text style={{ textAlign: 'center', marginVertical: 10, opacity: 0.6 }}>
                                        Loading timings...
                                    </Text>
                                ) : timings.filter(t => t.isActive).length === 0 ? (
                                    <Text style={{ textAlign: 'center', marginVertical: 10, opacity: 0.6 }}>
                                        Kindly wait for admin to update timings
                                    </Text>
                                ) : (
                                    timings.filter(t => t.isActive).map((timing) => (
                                        <View key={timing.id} style={styles.tableRow}>
                                            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>{timing.location}</Text>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>{timing.darshanTime}</Text>
                                            <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{timing.prasadaTime}</Text>
                                        </View>
                                    ))
                                )}
                            </Card.Content>
                        </Card>
                    </View>

                    <Text variant="titleLarge" style={[styles.sectionTitle, { marginLeft: 16, marginTop: 16 }]}>{t('home.gallery')}</Text>
                </>
            )}
        </View>
    );

    const renderSearchResults = () => {
        if (!searchResults) return null;

        return (
            <View style={styles.searchResultsContainer}>
                {/* Gurus */}
                {searchResults.gurus.length > 0 && (
                    <View style={styles.resultSection}>
                        <Text variant="titleMedium" style={styles.resultTitle}>Gurus</Text>
                        {searchResults.gurus.map((guru: Guru) => (
                            <Card key={`guru-${guru.id}`} style={styles.resultCard} onPress={() => navigation.navigate('GuruDetail', { guruId: guru.id })}>
                                <Card.Title title={guru.name} subtitle={guru.mathaName} left={(props) => <Image source={{ uri: guru.imageUrl }} style={{ width: 40, height: 40, borderRadius: 20 }} />} />
                            </Card>
                        ))}
                    </View>
                )}

                {/* News */}
                {searchResults.news.length > 0 && (
                    <View style={styles.resultSection}>
                        <Text variant="titleMedium" style={styles.resultTitle}>News</Text>
                        {searchResults.news.map((item: NewsArticle) => (
                            <NewsTile key={`news-${item.id}`} id={item.id} title={item.title} date={item.date || ''} />
                        ))}
                    </View>
                )}

                {/* Events */}
                {searchResults.events.length > 0 && (
                    <View style={styles.resultSection}>
                        <Text variant="titleMedium" style={styles.resultTitle}>Events</Text>
                        {searchResults.events.map((event) => (
                            <Card key={`event-${event.id}`} style={styles.resultCard}>
                                <Card.Title title={event.title} subtitle={event.date} />
                                <Card.Content><Text numberOfLines={2}>{event.description}</Text></Card.Content>
                            </Card>
                        ))}
                    </View>
                )}

                {/* Branches */}
                {searchResults.branches.length > 0 && (
                    <View style={styles.resultSection}>
                        <Text variant="titleMedium" style={styles.resultTitle}>Branches</Text>
                        {searchResults.branches.map((branch: Branch) => (
                            <Card key={`branch-${branch.id}`} style={styles.resultCard} onPress={() => navigation.navigate('Contact', { branch: branch })}>
                                <Card.Title title={branch.name} subtitle={`${branch.city || ''}, ${branch.state || ''}`} />
                            </Card>
                        ))}
                    </View>
                )}

                {Object.values(searchResults).every((arr: any[]) => arr.length === 0) && (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No results found.</Text>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={searchResults ? [] : filteredNews}
                renderItem={({ item }) => <NewsTile id={item.id} title={item.title} date={item.date || ''} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                ListHeaderComponent={renderHeader()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListFooterComponent={
                    <View>
                        {searchResults ? renderSearchResults() : (
                            <View>
                                {/* Gallery Carousel */}
                                <View style={styles.gallerySection}>
                                    <GalleryCarousel data={albums} onPressAlbum={handleAlbumPress} />
                                </View>

                                <View style={styles.socialMediaContainer}>
                                    <Text variant="titleMedium" style={styles.socialTitle}>{t('home.connectWithUs')}</Text>
                                    <View style={styles.socialIcons}>
                                        <IconButton icon="instagram" iconColor="#E1306C" size={32} onPress={() => Linking.openURL('https://www.instagram.com/sodematha/')} />
                                        <IconButton icon="facebook" iconColor="#1877F2" size={32} onPress={() => Linking.openURL('https://www.facebook.com/sodematha/')} />
                                        <IconButton icon="youtube" iconColor="#FF0000" size={32} onPress={() => Linking.openURL('https://www.youtube.com/@SriSodeVadirajaMatha')} />
                                        <IconButton icon="whatsapp" iconColor="#25D366" size={32} onPress={() => Linking.openURL('https://whatsapp.com/channel/0029VaBcrXaLNSa72JbPrZ0r')} />
                                    </View>
                                </View>
                            </View>
                        )}
                        <View style={{ height: 1 }} />
                    </View>
                }
            />

            <StoryViewer
                visible={storyVisible}
                imageUrl={alankara?.imageUrl || null}
                onClose={() => setStoryVisible(false)}
            />

            <AlbumViewer
                visible={albumViewerVisible}
                albumId={selectedAlbum?.id || null}
                albumTitle={selectedAlbum?.title || ''}
                mediaItems={albumMedia}
                coverImage={selectedAlbum?.thumbnailUrl}
                loading={loadingMedia}
                onClose={handleCloseAlbumViewer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    orangeHeader: {
        backgroundColor: '#FF6F00',
        paddingBottom: 40, // Space for overlap
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        marginBottom: 0,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 0,
        paddingTop: 10,
        paddingBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    headerActions: {
        flexDirection: 'row',
        marginRight: 16,
    },
    swamijiSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    swamijiContainer: {
        alignItems: 'center',
        width: '45%',
    },
    swamijiCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
        overflow: 'hidden',
    },
    swamijiImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        transform: [{ scale: 1.1 }],
    },
    swamijiName: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'PlusJakartaSans-SemiBold',
        fontSize: 12,
        lineHeight: 16,
    },
    flashUpdateContainer: {
        marginTop: 0,
        marginBottom: 20,
    },
    darshanaSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'PlusJakartaSans-Bold',
        marginLeft: 8,
    },
    infoCard: {
        borderRadius: 16,
        elevation: 2,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
    },
    tableHeader: {
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#8E24AA', // Or theme primary color
        fontSize: 14,
    },
    tableCell: {
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 4,
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans-ExtraBold',
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginTop: -28, // Overlap the header
        marginBottom: 24,
    },
    searchBar: {
        elevation: 4,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    chipContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    chip: {
        marginRight: 8,
    },
    listContent: {
        paddingBottom: 20,
    },
    reminderBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    searchResultsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    resultSection: {
        marginBottom: 20,
    },
    resultTitle: {
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#555',
    },
    resultCard: {
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    socialMediaContainer: {
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 16,
    },
    socialTitle: {
        marginBottom: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 24,
    },
    socialIcon: {
        padding: 8,
    },
    gallerySection: {
        marginBottom: 16,
    }
});

export default HomeScreen;
