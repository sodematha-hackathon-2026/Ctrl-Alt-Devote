import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { Event } from '../api/eventService';

interface EventsCarouselProps {
    data: Event[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // Full width minus padding (20 left + 20 right)
const SCROLL_INTERVAL = 5000;

const FlashUpdatesCarousel: React.FC<EventsCarouselProps> = ({ data }) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const theme = useTheme();

    useEffect(() => {
        if (data.length === 0) return;
        const timer = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= data.length) {
                nextIndex = 0;
            }
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, SCROLL_INTERVAL);

        return () => clearInterval(timer);
    }, [currentIndex, data.length]);

    const renderItem = ({ item }: { item: Event }) => (
        <Card style={[styles.card, { backgroundColor: '#A03010' }]}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text variant="titleMedium" style={{ fontFamily: 'PlusJakartaSans-Bold', color: '#FFFFFF' }}>
                        {item.title}
                    </Text>
                    <Text variant="bodySmall" style={{ fontFamily: 'PlusJakartaSans-Medium', color: '#FFFFFF', opacity: 0.8, marginTop: 4 }}>
                        {item.date} {item.tithi ? `• ${item.tithi}` : ''}
                    </Text>
                    <Text variant="bodyMedium" numberOfLines={2} style={{ marginTop: 8, fontFamily: 'PlusJakartaSans-Regular', color: '#FFFFFF' }}>
                        {item.description}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    if (!data || data.length === 0) return null;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToInterval={CARD_WIDTH + 16} // Card width + margin
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                onScroll={(event) => {
                    const index = Math.round(
                        event.nativeEvent.contentOffset.x / (CARD_WIDTH + 16)
                    );
                    setCurrentIndex(index);
                }}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH + 16,
                    offset: (CARD_WIDTH + 16) * index,
                    index,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    card: {
        width: CARD_WIDTH,
        marginRight: 16,
        borderRadius: 16,
        height: 140, // Slightly taller for better layout
        justifyContent: 'center',
        elevation: 2,
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        height: '100%',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default FlashUpdatesCarousel;
