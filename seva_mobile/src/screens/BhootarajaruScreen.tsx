import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, useTheme, Card, Divider } from 'react-native-paper';

const BhootarajaruScreen = () => {
    const theme = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>

                {/* Header & Image */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="headlineMedium" style={[styles.heading, { color: theme.colors.primary }]}>
                            Bhootarajaru
                        </Text>

                        <Image
                            source={require('../../assets/bhoota-raja.jpg')}
                            style={styles.bhootarajaImage}
                            resizeMode="contain"
                        />

                        <Text variant="bodyMedium" style={styles.text}>
                            The legacy of the Sode Vadiraja Matha is inseparable from the divine presence of Bhootarajaru, a unique and powerful figure in the Madhwa lineage. While he is often referred to as a "spirit" or "daiva," in the context of Sode, he is revered as a high-level celestial being and a devoted servant of Sri Vadiraja Theertha.
                        </Text>
                    </Card.Content>
                </Card>

                {/* The Origin */}
                <Card style={styles.card}>
                    <Card.Title title="The Origin: From Scholar to Guardian" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            The history of Bhootarajaru begins with a Brahmana named Narayana Bhatta. According to tradition, he was a learned scholar who, due to a momentary lapse in conduct or a specific curse, was forced to take the form of a Brahmarakshasa (a powerful spirit).
                        </Text>
                        <Divider style={styles.divider} />
                        <Text variant="bodyMedium" style={styles.text}>
                            For years, he haunted the forests near Sode, but his inherent divinity remained. His life changed forever when he encountered Sri Vadiraja Theertha, the 16th-century saint and philosopher. Recognizing the saint’s immense spiritual power, the spirit challenged him to a debate. Sri Vadiraja, with his characteristic wit and wisdom, easily defeated him. Realizing he was in the presence of a master, the spirit surrendered and sought redemption.
                        </Text>
                        <Text variant="bodyMedium" style={styles.text}>
                            Sri Vadiraja Theertha transformed this restless energy into a force for good. He initiated him into the service of the Matha and Lord Trivikrama, bestowing upon him the name Bhootaraja.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Role at Sode */}
                <Card style={styles.card}>
                    <Card.Title title="The Role of Bhootarajaru at Sode" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            Bhootarajaru is considered the Kshetrapala (guardian) of Sode. His role is multifaceted, blending the lines between a disciplined administrator and a fierce protector.
                        </Text>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>
                                <Text style={{ fontWeight: 'bold' }}>Guardian of the Temple:</Text> It is believed that Bhootarajaru protects the sanctity of the Sode Kshetra. Legend says he personally oversaw the construction of the Dhvajastambha (flag pillar) and the placement of the Lord Trivikrama idol, which Sri Vadiraja brought from Badari.
                            </Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>
                                <Text style={{ fontWeight: 'bold' }}>The Chariot Legend:</Text> One of the most famous stories involves Bhootarajaru transporting the massive stone chariot or temple structures across vast distances overnight at the command of his Guru.
                            </Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>
                                <Text style={{ fontWeight: 'bold' }}>The Executor of Justice:</Text> Within the Matha's tradition, Bhootarajaru is seen as the one who removes obstacles for sincere devotees while maintaining a strict, disciplined environment.
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Iconography */}
                <Card style={styles.card}>
                    <Card.Title title="Iconography and Worship" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            Unlike the primary deities in the sanctum, Bhootarajaru is often represented in a distinct manner. At Sode, his presence is marked by a specific shrine. He is frequently depicted holding a coconut, which has become a primary symbol of offering to him.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Spiritual Significance */}
                <Card style={styles.card}>
                    <Card.Title title="Spiritual Significance for Devotees" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            For the followers of the Sode Matha, Bhootarajaru is not a figure of fear, but one of profound reassurance. He represents the idea that even the most "shattered" or "fallen" souls can find redemption through the grace of a Guru.
                        </Text>
                        <Text variant="bodyMedium" style={styles.text}>
                            Devotees traveling to Sode typically follow a specific protocol:
                        </Text>
                        <View style={{ paddingLeft: 8 }}>
                            <Text variant="bodyMedium" style={styles.bulletText}>1. Dhavala Gange: Purifying oneself in the sacred pond.</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>2. Rama Trivikrama: Seeking the blessings of the main deity.</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>3. Vadiraja Theertha: Paying respects at the Vrindavana.</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>4. Bhootarajaru: Offering a coconut and seeking protection and the removal of "graha doshas" (astrological or spiritual afflictions).</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <Text variant="bodyMedium" style={styles.text}>
                            It is said that Bhootarajaru is particularly responsive to those who are sincere in their devotion to Sri Hari and Vayu. He acts as a "troubleshooter" for the earthly problems of devotees—be it health issues, legal troubles, or spiritual stagnation—provided they remain on the path of Dharma.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Conclusion */}
                <Card style={[styles.card, { marginBottom: 32 }]}>
                    <Card.Title title="Conclusion" titleVariant="titleLarge" />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            Bhootarajaru stands as a testament to the transformative power of Sri Vadiraja Theertha’s grace. He is the invisible shield of Sode, ensuring that the teachings of the Madhwa philosophy and the worship of Lord Trivikrama continue undisturbed. His story reminds us that strength, when tethered to devotion and guided by a Guru, becomes a divine instrument for the welfare of the world.
                        </Text>
                    </Card.Content>
                </Card>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
    },
    heading: {
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    text: {
        lineHeight: 22,
        marginBottom: 12,
        opacity: 0.8,
        textAlign: 'justify',
    },
    divider: {
        marginVertical: 12,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingLeft: 4,
    },
    bullet: {
        fontSize: 18,
        marginRight: 8,
        lineHeight: 22,
    },
    bulletText: {
        flex: 1,
        lineHeight: 22,
        opacity: 0.8,
        marginBottom: 4,
        textAlign: 'justify',
    },
    bhootarajaImage: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
    }
});

export default BhootarajaruScreen;
