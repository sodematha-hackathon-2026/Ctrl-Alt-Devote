import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, Checkbox, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditProfileScreen = () => {
    const theme = useTheme();
    const { user, updateProfile, isLoading, error } = useAuthStore();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const isOnboarding = route.params?.isOnboarding;

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState(user?.city || '');
    const [state, setState] = useState(user?.state || '');
    const [pincode, setPincode] = useState(user?.pincode || '');
    const [gothra, setGothra] = useState(user?.gothra || '');
    const [nakshatra, setNakshatra] = useState(user?.nakshatra || '');
    const [rashi, setRashi] = useState(user?.rashi || '');

    // Volunteer specific fields
    const [isVolunteer, setIsVolunteer] = useState(user?.volunteerRequest || user?.isVolunteer || false);
    const [hobbies, setHobbies] = useState(user?.hobbiesOrTalents || '');
    const [pastExperience, setPastExperience] = useState(user?.pastExperience || '');

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setEmail(user.email || '');
            setAddress(user.address || '');
            setCity(user.city || '');
            setState(user.state || '');
            setPincode(user.pincode || '');
            setGothra(user.gothra || '');
            setNakshatra(user.nakshatra || '');
            setRashi(user.rashi || '');
            setIsVolunteer(user.isVolunteer || false);
            setHobbies(user.hobbiesOrTalents || '');
            setPastExperience(user.pastExperience || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!fullName.trim()) {
            // Alert.alert("Validation Error", "Full Name is required.");
            console.warn("Validation Error: Full Name is required.");
            return;
        }

        setSaving(true);
        try {
            await updateProfile({
                fullName,
                email,
                address,
                city,
                state,
                pincode,
                gothra,
                nakshatra,
                rashi,
                isVolunteer: isVolunteer ? (user?.isVolunteer || false) : false,
                // Send volunteer details only if volunteering
                hobbiesOrTalents: isVolunteer ? hobbies : undefined,
                pastExperience: isVolunteer ? pastExperience : undefined,
                volunteerRequest: isVolunteer // Send as request, backend handles approval
            });
            // Alert.alert("Success", "Profile updated successfully!", [...]);
            console.log("Success: Profile updated successfully!");
            if (isOnboarding) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                navigation.goBack();
            }
        } catch (err: any) {
            console.error("Profile update error:", err);
            // Alert.alert("Error", err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Edit Profile
                </Text>

                <View style={styles.form}>
                    <TextInput
                        label="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <TextInput
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <View style={styles.row}>
                        <TextInput
                            label="City"
                            value={city}
                            onChangeText={setCity}
                            mode="outlined"
                            style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: theme.colors.surface }]}
                            outlineStyle={{ borderRadius: 12 }}
                        />
                        <TextInput
                            label="Pincode"
                            value={pincode}
                            onChangeText={setPincode}
                            mode="outlined"
                            keyboardType="number-pad"
                            style={[styles.input, { flex: 0.6, backgroundColor: theme.colors.surface }]}
                            outlineStyle={{ borderRadius: 12 }}
                        />
                    </View>

                    <TextInput
                        label="State"
                        value={state}
                        onChangeText={setState}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <TextInput
                        label="Gothra"
                        value={gothra}
                        onChangeText={setGothra}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        outlineStyle={{ borderRadius: 12 }}
                    />

                    <View style={styles.row}>
                        <TextInput
                            label="Nakshatra"
                            value={nakshatra}
                            onChangeText={setNakshatra}
                            mode="outlined"
                            style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: theme.colors.surface }]}
                            outlineStyle={{ borderRadius: 12 }}
                        />
                        <TextInput
                            label="Rashi"
                            value={rashi}
                            onChangeText={setRashi}
                            mode="outlined"
                            style={[styles.input, { flex: 1, backgroundColor: theme.colors.surface }]}
                            outlineStyle={{ borderRadius: 12 }}
                        />
                    </View>

                    <View style={styles.volunteerContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
                            <View style={Platform.OS === 'ios' ? [styles.checkboxWrapper, { borderColor: 'black' }] : undefined}>
                                <Checkbox
                                    status={isVolunteer ? 'checked' : 'unchecked'}
                                    onPress={() => setIsVolunteer(!isVolunteer)}
                                    color={theme.colors.primary}
                                    uncheckedColor={Platform.OS === 'ios' ? 'transparent' : 'black'}
                                />
                            </View>
                            <TouchableOpacity onPress={() => setIsVolunteer(!isVolunteer)} style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, color: theme.colors.onSurface }}>I want to sign up as a Volunteer</Text>
                            </TouchableOpacity>
                        </View>
                        <HelperText type="info" visible={true}>
                            Volunteers help with Matha events and services.
                            {user?.volunteerRequest && !user?.isVolunteer && " (Status: Pending Approval)"}
                            {user?.isVolunteer && " (Status: Approved)"}
                        </HelperText>

                        {isVolunteer && (
                            <View style={{ padding: 16, paddingTop: 0 }}>
                                <TextInput
                                    label="Hobbies or Talents"
                                    value={hobbies}
                                    onChangeText={setHobbies}
                                    mode="outlined"
                                    multiline
                                    numberOfLines={3}
                                    maxLength={4000}
                                    placeholder="Describe your hobbies or talents..."
                                    style={[styles.input, { backgroundColor: theme.colors.surface, marginBottom: 12 }]}
                                    outlineStyle={{ borderRadius: 12 }}
                                />
                                <TextInput
                                    label="Past Work/Volunteer Experience"
                                    value={pastExperience}
                                    onChangeText={setPastExperience}
                                    mode="outlined"
                                    multiline
                                    numberOfLines={3}
                                    maxLength={4000}
                                    placeholder="Describe your past experience..."
                                    style={[styles.input, { backgroundColor: theme.colors.surface }]}
                                    outlineStyle={{ borderRadius: 12 }}
                                />
                            </View>
                        )}
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={saving || isLoading}
                        disabled={saving || isLoading}
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                    >
                        Save Changes
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        disabled={saving}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        Cancel
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    headerTitle: {
        fontFamily: 'PlusJakartaSans-SemiBold',
        marginBottom: 24,
    },
    form: {
        gap: 16,
    },
    input: {
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    volunteerContainer: {
        marginVertical: 8,
        backgroundColor: '#f0f0f0', // Slight gray background to highlight
        borderRadius: 12,
        overflow: 'hidden',
    },
    checkboxWrapper: {
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 12,
    },
    button: {
        marginTop: 8,
        borderRadius: 24,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans-SemiBold',
        color: '#4C0519',
    },
});

export default EditProfileScreen;
