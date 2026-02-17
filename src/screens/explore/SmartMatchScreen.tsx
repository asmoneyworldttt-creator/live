import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Loader, Avatar } from '../../components/common';
import { theme } from '../../theme';
import { useRecommendations } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SmartMatchScreen({ navigation }: any) {
    const { smartMatch, isLoading, getSmartMatch } = useRecommendations();

    useEffect(() => {
        getSmartMatch();
    }, []);

    if (isLoading && !smartMatch) {
        return <Loader />;
    }

    if (!smartMatch) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <Feather name="cpu" size={60} color={theme.colors.gray[200]} />
                <Text variant="xl" weight="bold" style={{ marginTop: 20 }}>No Smart Match found</Text>
                <Text color={theme.colors.gray[500]} style={{ textAlign: 'center', marginTop: 10 }}>
                    Keep swiping and updating your profile to help our AI find your perfect match!
                </Text>
                <Button
                    title="Back to Discovery"
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 30, width: '80%' }}
                />
            </SafeAreaView>
        );
    }

    const { compatibility_breakdown: bd } = smartMatch;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: smartMatch.photos[0] }} style={styles.heroImage} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.gradient}
                    />

                    <SafeAreaView style={styles.header} edges={['top']}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Feather name="x" size={24} color={theme.colors.white} />
                        </TouchableOpacity>
                        <Badge label="AI TOP MATCH" />
                    </SafeAreaView>

                    <View style={styles.heroContent}>
                        <Text variant="4xl" weight="bold" color={theme.colors.white}>
                            {smartMatch.full_name}, {smartMatch.age}
                        </Text>
                        <View style={styles.compatibilityBadge}>
                            <Feather name="zap" size={16} color={theme.colors.primary[500]} />
                            <Text weight="bold" color={theme.colors.primary[500]} style={{ marginLeft: 6 }}>
                                {smartMatch.compatibility_score}% Compatible
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>Why you match</Text>
                        <Text color={theme.colors.gray[600]} style={styles.reasonText}>
                            {smartMatch.reason}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>Compatibility Breakdown</Text>
                        <CompatibilityBar label="Interests" percentage={bd.interests} color={theme.colors.primary[500]} />
                        <CompatibilityBar label="Personality" percentage={bd.personality} color={theme.colors.secondary[500]} />
                        <CompatibilityBar label="Lifestyle" percentage={bd.lifestyle} color={theme.colors.success[500]} />
                        <CompatibilityBar label="Goals" percentage={bd.goals} color={theme.colors.warning[500]} />
                    </View>

                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>About {smartMatch.full_name}</Text>
                        <Text color={theme.colors.gray[600]}>{smartMatch.bio || "No bio yet."}</Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
                    <Feather name="x" size={28} color={theme.colors.gray[400]} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.chatButton]}
                    onPress={() => navigation.navigate('OtherProfile', { userId: smartMatch.id })}
                >
                    <Feather name="message-square" size={28} color={theme.colors.white} />
                    <Text weight="bold" color={theme.colors.white} style={{ marginLeft: 10 }}>MESSAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Feather name="heart" size={28} color={theme.colors.primary[500]} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function CompatibilityBar({ label, percentage, color }: any) {
    return (
        <View style={styles.barContainer}>
            <View style={styles.barLabelRow}>
                <Text variant="sm" weight="medium">{label}</Text>
                <Text variant="sm" weight="bold" color={color}>{percentage}%</Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.progress, { width: `${percentage}%`, backgroundColor: color }]} />
            </View>
        </View>
    );
}

function Badge({ label }: { label: string }) {
    return (
        <View style={styles.aiBadge}>
            <Text variant="xs" weight="bold" color={theme.colors.white}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 1.3,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiBadge: {
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    heroContent: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    compatibilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    reasonText: {
        lineHeight: 22,
        fontSize: 16,
    },
    barContainer: {
        marginBottom: 16,
    },
    barLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    track: {
        height: 8,
        backgroundColor: theme.colors.gray[100],
        borderRadius: 4,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        borderRadius: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[50],
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme.colors.primary[500],
        marginHorizontal: 15,
        borderRadius: 28,
    }
});
