import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Button, Card } from '../../components/common';
import { StatsDisplay, PhotoGallery, VerificationBadge } from '../../components/profile';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useDiscovery, useChat } from '../../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OtherProfileScreen({ route, navigation }: any) {
    const { userId, user } = route.params; // Can pass full user object or just ID
    const { swipeRight, superLike } = useDiscovery();
    const { startConversation } = useChat();

    // Mock stats for the other user
    const stats = [
        { label: 'Matches', value: 86 },
        { label: 'Followers', value: '4.2k' },
        { label: 'Likes', value: '12k' },
    ];

    const handleMessage = async () => {
        try {
            const conversation = await startConversation(userId);
            navigation.navigate('ChatDetail', {
                conversationId: conversation.id,
                user: user || { id: userId, full_name: 'User' }
            });
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    const handleLike = () => {
        swipeRight(userId);
    };

    const handleSuperLike = () => {
        superLike(userId);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${user?.full_name}'s profile on SoulMatch!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Image Header */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: user?.avatar_url || 'https://via.placeholder.com/500' }}
                        style={styles.profileImage}
                    />
                    <SafeAreaView style={styles.overlayHeader} edges={['top']}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.circleButton}
                        >
                            <Feather name="chevron-left" size={24} color={theme.colors.gray[900]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleShare}
                            style={styles.circleButton}
                        >
                            <Feather name="share-2" size={20} color={theme.colors.gray[900]} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                <View style={styles.content}>
                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <Text variant="3xl" weight="bold" style={styles.name}>
                                {user?.full_name}, {user?.age || 24}
                            </Text>
                            <VerificationBadge verified={user?.is_verified || true} size={24} />
                        </View>

                        <View style={styles.locationRow}>
                            <Feather name="map-pin" size={14} color={theme.colors.gray[500]} />
                            <Text variant="sm" color={theme.colors.gray[500]} style={styles.locationText}>
                                {user?.location?.city || 'New York'}, {user?.location?.distance || 5} miles away
                            </Text>
                        </View>

                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: user?.is_online ? theme.colors.success[500] : theme.colors.gray[300] }]} />
                            <Text variant="xs" color={theme.colors.gray[500]}>
                                {user?.is_online ? 'Online now' : 'Active 2h ago'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statsWrapper}>
                        <StatsDisplay stats={stats} />
                    </View>

                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>About</Text>
                        <Text color={theme.colors.gray[600]} style={styles.bioText}>
                            {user?.bio || "I love traveling, exploring new cuisines, and meeting interesting people. Always up for an adventure! 🌍✨"}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>Interests</Text>
                        <View style={styles.interestsContainer}>
                            {(user?.interests || ['Travel', 'Cooking', 'Music', 'Photography', 'Art']).map((interest: string) => (
                                <View key={interest} style={styles.interestTag}>
                                    <Text variant="xs" color={theme.colors.primary[600]} weight="medium">
                                        {interest}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text variant="lg" weight="bold">Gallery</Text>
                        </View>
                        <PhotoGallery photos={user?.photos || [user?.avatar_url]} />
                    </View>

                    <View style={styles.footerSpacing} />
                </View>
            </ScrollView>

            {/* Action Bar */}
            <View style={styles.actionBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.actionButton, styles.nopeButton]}>
                    <Feather name="x" size={28} color={theme.colors.error[500]} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSuperLike} style={[styles.actionButton, styles.superLikeButton]}>
                    <Feather name="star" size={24} color={theme.colors.primary[400]} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLike} style={[styles.actionButton, styles.likeButton]}>
                    <Feather name="heart" size={28} color={theme.colors.success[500]} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleMessage} style={styles.messageMainButton}>
                    <Feather name="message-circle" size={24} color={theme.colors.white} />
                    <Text weight="bold" color={theme.colors.white} style={styles.messageText}>Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 1.2,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    overlayHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[4],
        paddingBottom: 20,
    },
    circleButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    content: {
        flex: 1,
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingTop: theme.spacing[6],
    },
    profileInfo: {
        paddingHorizontal: theme.spacing[6],
        marginBottom: theme.spacing[6],
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        marginRight: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        marginLeft: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statsWrapper: {
        paddingHorizontal: theme.spacing[6],
        marginBottom: theme.spacing[8],
    },
    section: {
        paddingHorizontal: theme.spacing[6],
        marginBottom: theme.spacing[8],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing[4],
    },
    sectionTitle: {
        marginBottom: theme.spacing[4],
    },
    bioText: {
        lineHeight: 22,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    interestTag: {
        backgroundColor: theme.colors.primary[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary[100],
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[4],
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[100],
        ...theme.shadows.lg,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        ...theme.shadows.md,
        borderWidth: 1,
    },
    nopeButton: {
        borderColor: theme.colors.error[100],
    },
    likeButton: {
        borderColor: theme.colors.success[100],
    },
    superLikeButton: {
        borderColor: theme.colors.primary[100],
    },
    messageMainButton: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary[500],
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        ...theme.shadows.md,
    },
    messageText: {
        marginLeft: 8,
        fontSize: 16,
    },
    footerSpacing: {
        height: 100,
    },
});
