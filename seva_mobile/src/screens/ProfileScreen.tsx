import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, useTheme, Avatar, Card, Divider, Chip, ActivityIndicator } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { scheduleNotification } from '../utils/notifications';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Mail, Phone, User as UserIcon, HeartHandshake, Calendar, Home, Clock } from 'lucide-react-native';
import { bookingService, RoomBooking, SevaBooking } from '../api/bookingService';

const ProfileScreen = () => {
    const { user, signOut, getToken } = useAuthStore();
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
    const [sevaBookings, setSevaBookings] = useState<SevaBooking[]>([]);
    const [loading, setLoading] = useState(true);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            padding: 20,
            paddingBottom: 40,
        },
        header: {
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            marginBottom: 16,
            fontWeight: 'bold',
        },
        guestContainer: {
            width: '100%',
            alignItems: 'center',
            padding: 20,
        },
        editButton: {
            alignSelf: 'center',
            marginBottom: 24,
            borderRadius: 20,
            paddingHorizontal: 16,
        },
        infoCard: {
            marginBottom: 24,
            borderRadius: 12,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
        },
        infoText: {
            marginLeft: 16,
            flex: 1,
        },
        divider: {
            backgroundColor: '#e0e0e0',
            marginVertical: 8,
        },
        sectionTitle: {
            marginBottom: 12,
            fontFamily: 'PlusJakartaSans-SemiBold',
        },
        actionButton: {
            width: '100%',
            marginBottom: 12,
            borderRadius: 12,
        },
        actionButtonContent: {
            paddingVertical: 6,
            justifyContent: 'flex-start',
        },
        button: {
            width: '100%',
            borderRadius: 12,
        },
        // Booking history styles
        bookingItem: {
            marginBottom: 16,
            borderRadius: 12,
        },
        bookingHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        bookingInfo: {
            flex: 1,
        },
        statusChip: {
            paddingHorizontal: 12,
            paddingVertical: 4,
        },
        bookingDetails: {
            marginTop: 8,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        cancelButton: {
            marginTop: 12,
        },
    });

    useEffect(() => {
        const fetchBookingData = async () => {
            if (user && user.id) {
                try {
                    const token = await getToken();
                    if (token) {
                        const [roomData, sevaData] = await Promise.all([
                            bookingService.getRoomBookings(token, user.id),
                            bookingService.getSevaBookings(token, user.id)
                        ]);
                        setRoomBookings(roomData);
                        setSevaBookings(sevaData);
                    }
                } catch (error) {
                    console.error('Error fetching booking data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBookingData();
    }, [user, getToken]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
            case 'APPROVED': 
                return theme.colors.primary;
            case 'PENDING': return theme.colors.secondary;
            case 'CANCELLED':
            case 'REJECTED':
                return theme.colors.error;
            case 'COMPLETED': return theme.colors.tertiary;
            default: return theme.colors.onSurface;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleCancelBooking = async (bookingId: string, type: 'room' | 'seva') => {
        Alert.alert(
            t('profile.bookingHistory.cancel'),
            t('profile.bookingHistory.confirmCancel'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('profile.bookingHistory.confirm'),
                    onPress: async () => {
                        try {
                            const token = await getToken();
                            if (token) {
                                if (type === 'room') {
                                    await bookingService.cancelRoomBooking(bookingId, token);
                                    setRoomBookings(prev => prev.filter(b => b.id !== bookingId));
                                } else {
                                    await bookingService.cancelSevaBooking(bookingId, token);
                                    setSevaBookings(prev => prev.filter(b => b.id !== bookingId));
                                }
                            }
                        } catch (error) {
                            Alert.alert(t('common.error'), t('profile.bookingHistory.cancelError'));
                        }
                    }
                }
            ]
        );
    };

    const renderRoomBookingItem = (booking: RoomBooking) => (
        <Card key={booking.id} style={styles.bookingItem}>
            <Card.Content>
                <View style={styles.bookingHeader}>
                    <View style={styles.bookingInfo}>
                        <Text variant="titleMedium">{t('profile.bookingHistory.roomBookings')}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {formatDate(booking.createdAt)}
                        </Text>
                    </View>
                    <Chip
                        style={[styles.statusChip, { backgroundColor: getStatusColor(booking.status) }]}
                        textStyle={{ color: 'white' }}
                    >
                        {t(`profile.bookingHistory.${booking.status.toLowerCase()}`)}
                    </Chip>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                        <Home size={16} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyMedium">
                            {t('profile.bookingHistory.checkIn')}: {formatDate(booking.checkInDate)}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Home size={16} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyMedium">
                            {t('profile.bookingHistory.checkOut')}: {formatDate(booking.checkOutDate)}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <UserIcon size={16} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyMedium">
                            {t('profile.bookingHistory.people')}: {booking.numberOfGuests}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Home size={16} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyMedium">
                            {t('profile.bookingHistory.rooms')}: {booking.numberOfRooms}
                        </Text>
                    </View>
                    {booking.referenceId && (
                        <View style={styles.detailRow}>
                            <Clock size={16} color={theme.colors.onSurfaceVariant} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('profile.bookingHistory.referenceId')}: {booking.referenceId}
                            </Text>
                        </View>
                    )}
                </View>
                {booking.status === 'PENDING' && (
                    <Button
                        mode="outlined"
                        onPress={() => handleCancelBooking(booking.id, 'room')}
                        style={[styles.cancelButton, { borderColor: theme.colors.error }]}
                        textColor={theme.colors.error}
                    >
                        {t('profile.bookingHistory.cancel')}
                    </Button>
                )}
            </Card.Content>
        </Card>
    );

    const renderSevaBookingItem = (booking: SevaBooking) => (
        <Card key={booking.id} style={styles.bookingItem}>
            <Card.Content>
                <View style={styles.bookingHeader}>
                    <View style={styles.bookingInfo}>
                        <Text variant="titleMedium">{booking.sevaTitle}</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {formatDate(booking.sevaDate)}
                        </Text>
                    </View>
                    <Chip
                        style={[styles.statusChip, { backgroundColor: getStatusColor(booking.status) }]}
                        textStyle={{ color: 'white' }}
                    >
                        {t(`profile.bookingHistory.${booking.status.toLowerCase()}`)}
                    </Chip>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                        <Clock size={16} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyMedium">
                            {t('profile.bookingHistory.amount')}: ₹{booking.amountPaid}
                        </Text>
                    </View>
                    {booking.referenceId && (
                        <View style={styles.detailRow}>
                            <Clock size={16} color={theme.colors.onSurfaceVariant} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {t('profile.bookingHistory.referenceId')}: {booking.referenceId}
                            </Text>
                        </View>
                    )}
                </View>
                {booking.status === 'PENDING' && (
                    <Button
                        mode="outlined"
                        onPress={() => handleCancelBooking(booking.id, 'seva')}
                        style={styles.cancelButton}
                        textColor={theme.colors.error}
                    >
                        {t('profile.bookingHistory.cancel')}
                    </Button>
                )}
            </Card.Content>
        </Card>
    );


    const renderGuestView = () => (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]} edges={['top']}>
            <View style={styles.guestContainer}>
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                    {t('profile.welcomeGuest')}
                </Text>
                <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 30, color: theme.colors.onSurfaceVariant }}>
                    {t('profile.guestSubtitle')}
                </Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    {t('profile.loginSignup')}
                </Button>
            </View>
        </SafeAreaView>
    );

    return (
        !user ? renderGuestView() : (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Avatar.Text
                            size={80}
                            label={user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}
                            style={{ backgroundColor: theme.colors.primaryContainer }}
                            color={theme.colors.onPrimaryContainer}
                        />
                        <Text variant="headlineSmall" style={{ marginTop: 16, fontWeight: 'bold' }}>
                            {user.fullName || 'User'}
                        </Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            {user.phoneNumber}
                        </Text>

                        {user.isVolunteer && (
                            <Chip
                                icon={() => <HeartHandshake size={16} color={theme.colors.primary} />}
                                style={{ marginTop: 12, backgroundColor: theme.colors.secondaryContainer }}
                                textStyle={{ color: theme.colors.onSecondaryContainer }}
                            >
                                {t('profile.volunteer')}
                            </Chip>
                        )}
                    </View>

                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('EditProfile')}
                        style={styles.editButton}
                    >
                        {t('profile.editProfile')}
                    </Button>

                    <Card style={styles.infoCard}>
                        <Card.Content>
                            <View style={styles.infoRow}>
                                <UserIcon size={20} color={theme.colors.onSurfaceVariant} />
                                <View style={styles.infoText}>
                                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{t('profile.fullName')}</Text>
                                    <Text variant="bodyLarge">{user.fullName || t('profile.notSet')}</Text>
                                </View>
                            </View>
                            <Divider style={styles.divider} />

                            <View style={styles.infoRow}>
                                <Phone size={20} color={theme.colors.onSurfaceVariant} />
                                <View style={styles.infoText}>
                                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{t('profile.phone')}</Text>
                                    <Text variant="bodyLarge">{user.phoneNumber}</Text>
                                </View>
                            </View>
                            <Divider style={styles.divider} />

                            <View style={styles.infoRow}>
                                <Mail size={20} color={theme.colors.onSurfaceVariant} />
                                <View style={styles.infoText}>
                                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{t('profile.email')}</Text>
                                    <Text variant="bodyLarge">{user.email || t('profile.notSet')}</Text>
                                </View>
                            </View>
                            <Divider style={styles.divider} />

                            <View style={styles.infoRow}>
                                <MapPin size={20} color={theme.colors.onSurfaceVariant} />
                                <View style={styles.infoText}>
                                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{t('profile.address')}</Text>
                                    <Text variant="bodyLarge">
                                        {[user.address, user.city, user.state, user.pincode].filter(Boolean).join(', ') || t('profile.notSet')}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Booking History Section */}
                    <Text variant="titleMedium" style={styles.sectionTitle}>{t('profile.bookingHistory.title')}</Text>

                    {loading ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : (
                        <>
                            {/* Room Bookings */}
                            <Text variant="titleSmall" style={{ marginBottom: 12, color: theme.colors.onSurfaceVariant }}>
                                {t('profile.bookingHistory.roomBookings')}
                            </Text>
                            {roomBookings.length > 0 ? (
                                roomBookings.map(renderRoomBookingItem)
                            ) : (
                                <Card style={styles.bookingItem}>
                                    <Card.Content>
                                        <Text variant="bodyMedium" style={{ textAlign: 'center', padding: 20 }}>
                                            {t('profile.bookingHistory.noRoomBookings')}
                                        </Text>
                                    </Card.Content>
                                </Card>
                            )}

                            {/* Seva History */}
                            <Text variant="titleSmall" style={{ marginTop: 24, marginBottom: 12, color: theme.colors.onSurfaceVariant }}>
                                {t('profile.bookingHistory.sevaHistory')}
                            </Text>
                            {sevaBookings.length > 0 ? (
                                sevaBookings.map(renderSevaBookingItem)
                            ) : (
                                <Card style={styles.bookingItem}>
                                    <Card.Content>
                                        <Text variant="bodyMedium" style={{ textAlign: 'center', padding: 20 }}>
                                            {t('profile.bookingHistory.noSevaBookings')}
                                        </Text>
                                    </Card.Content>
                                </Card>
                            )}
                        </>
                    )}

                    <Text variant="titleMedium" style={styles.sectionTitle}>{t('profile.actions')}</Text>


                    <Button
                        mode="outlined"
                        // Use a wrapper function to ensure safe execution
                        onPress={() => {
                            console.log("Logout pressed");
                            signOut();
                        }}
                        style={[styles.actionButton, { marginTop: 24, borderColor: theme.colors.error }]}
                        textColor={theme.colors.error}
                        icon="logout"
                        contentStyle={styles.actionButtonContent}
                    >
                        {t('profile.logout')}
                    </Button>
                </ScrollView>
            </SafeAreaView>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    guestContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 20,
    },
    editButton: {
        alignSelf: 'center',
        marginBottom: 24,
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    infoCard: {
        marginBottom: 24,
        borderRadius: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoText: {
        marginLeft: 16,
        flex: 1,
    },
    divider: {
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    sectionTitle: {
        marginBottom: 12,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    actionButton: {
        width: '100%',
        marginBottom: 12,
        borderRadius: 12,
    },
    actionButtonContent: {
        paddingVertical: 6,
        justifyContent: 'flex-start',
    },
    button: {
        width: '100%',
        borderRadius: 12,
    },
    bookingItem: {
        marginBottom: 16,
        borderRadius: 12,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bookingInfo: {
        flex: 1,
    },
    statusChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    bookingDetails: {
        marginTop: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cancelButton: {
        marginTop: 12,
    },
});

export default ProfileScreen;
