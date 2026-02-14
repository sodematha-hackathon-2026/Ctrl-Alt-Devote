import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, useTheme, Card, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const MathaHistoryScreen = () => {
    const theme = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>

                {/* Introduction */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="headlineMedium" style={[styles.heading, { color: theme.colors.primary }]}>
                            Sode Vadiraja Matha
                        </Text>
                        <Image
                            source={require('../../assets/sode.jpg')}
                            style={styles.MathaImage}
                            resizeMode="cover"
                        />
                        <Text variant="bodyMedium" style={styles.text}>
                            The Sode Vadiraja Matha, originally known as the Kumbhasi Matha, is one of the eight monastic institutions (Ashta Mathas) established by Sri Madhvacharya in the 13th century to preserve the Dvaita school of Vedanta. While it shares the responsibility of the Udupi Krishna Temple's administration, the Matha is unique for its 16th-century relocation to Sonda in Uttara Kannada, transforming it into a pan-Indian center for pilgrimage and scholarly excellence.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Foundations */}
                <Card style={styles.card}>
                    <Card.Title title="Foundations and the Kumbhasi Era" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            The lineage was founded by Sri Vishnu Theertha, the younger brother of Sri Madhvacharya. Known as the embodiment of Vairagya (radical detachment), Vishnu Theertha performed rigorous penance on the Harishchandra mountain and is believed to still reside in meditation at Kumara Parvatha near Kukke Subrahmanya.
                        </Text>
                        <Divider style={styles.divider} />
                        <Text variant="bodyMedium" style={styles.text}>
                            Originally centered in the village of Kumbhasi near Udupi, the Matha served as a regional branch of the Madhva tradition for nearly three centuries. Its early pontiffs, such as Sri Vedavyasa Theertha and Sri Vedanga Theertha, focused on the preservation of the Sarvamula texts and the worship of Lord Bhuvaraha, a unique icon gifted by Madhvacharya.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Relocation */}
                <Card style={styles.card}>
                    <Card.Title title="The Relocation to Sonda (Sode)" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            The institutional identity shifted fundamentally during the tenure of the 20th pontiff, Sri Vadiraja Theertha (1480–1600 CE). He established a historic alliance with Arasappa Nayaka, the ruler of the Sonda province.
                        </Text>
                        <Divider style={styles.divider} />
                        <Text variant="bodyMedium" style={styles.text}>
                            According to tradition, the king sought Sri Vadiraja Theertha's blessings during a military crisis; after a miraculous defeat of the king's enemies, the king became a devoted disciple. In gratitude, Arasappa Nayaka granted vast land properties, allowing Sri Vadiraja Theertha to establish Sonda as the permanent headquarters of the Matha.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Sacred Geography */}
                <Card style={styles.card}>
                    <Card.Title title="Sacred Geography of Sonda" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            The Sode headquarters is architecturally unique, built in three distinct stages:
                        </Text>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>
                                <Text style={{ fontWeight: 'bold' }}>Upper Stage:</Text> Contains the Rama Trivikrama Temple. This shrine is shaped like a stone chariot. A tall stone pillar (Garuda Stambha) stands in front.
                            </Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>
                                <Text style={{ fontWeight: 'bold' }}>Middle Stage:</Text> Houses the Rajangana, administrative offices, and the Antaraganga and Sheetala Ganga wells.
                            </Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text variant="bodyMedium" style={styles.bulletText}>
                                <Text style={{ fontWeight: 'bold' }}>Lower Stage:</Text> Features the holy tanks—Dhavala Ganga and Sheethala Ganga—and the Pancha Brindavana.
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Pancha Brindavana */}
                <Card style={styles.card}>
                    <Card.Title title="The Pancha Brindavana" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            In 1600 CE, Sri Vadiraja Theertha entered his sacred tomb (Vrindavana) while still alive (Sashareera). Unlike other saints, his resting place consists of five Vrindavanas arranged in a square.
                        </Text>
                        <Text variant="bodyMedium" style={styles.text}>
                            The five Vrindavanas represent the five forms of Vayu: Prana, Apana, Vyana, Udana, and Samana. Sri Hari dwells within all five Vrindavanas in the forms of Aniruddha, Pradyumna, Sankarshana, Vasudeva, and Narayana.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Legacy */}
                <Card style={styles.card}>
                    <Card.Title title="Theological and Cultural Legacy" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            The Sode lineage is defined by the doctrine of Rujutva, the belief that Sri Vadiraja Theertha is a Bhavi Sameera—the divinity destined to become the next wind-god (Vayu).
                        </Text>
                        <Text variant="bodyMedium" style={styles.text}>
                            Vadiraja Theertha's influence also extended to agricultural and social reforms, such as the introduction of the Mattu Gulla (a unique green brinjal variety) in Udupi and the consecration of Lord Manjunatha at Dharmasthala.
                        </Text>
                    </Card.Content>
                </Card>

                {/* Modern Succession */}
                <Card style={[styles.card, { marginBottom: 32 }]}>
                    <Card.Title title="Modern Succession" titleVariant="titleLarge" titleNumberOfLines={2} />
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.text}>
                            The Sode Matha has continued its mission through influential 20th-century pontiffs like Sri Vishwottama Theertha. The current pontiff, Sri Vishwavallabha Theertha, focuses on preserving rare manuscripts and integrating modern education with traditional Shastric studies.
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
        marginBottom: 8,
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
        textAlign: 'justify',
    },
    MathaImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
});

export default MathaHistoryScreen;
