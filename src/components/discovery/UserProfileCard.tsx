import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text } from '../common/Text';
import { theme } from '../../theme';
import { DiscoveryUser } from '../../store/discoveryStore';
import { Feather } from '@expo/vector-icons';
import { Chip } from '../common/Chip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface UserProfileCardProps {
    user: DiscoveryUser;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                    {user.photos.map((photo, index) => (
                        <Image
                            key={index}
                            source={{ uri: photo }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ))}
                    {user.photos.length === 0 && (
                        <View style={[styles.image, styles.placeholderImage]}>
                            <Feather name="image" size={64} color={theme.colors.gray[300]} />
                        </View>
                    )}
                </ScrollView>
                <View style={styles.pagination}>
                    {user.photos.map((_, index) => (
                        <View key={index} style={[styles.dot, index === 0 && styles.activeDot]} />
                    ))}
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <View style={styles.nameRow}>
                            <Text variant="2xl" weight="bold">
                                {user.full_name}, {user.age}
                            </Text>
                            {user.is_verified && (
                                <Feather name="check-circle" size={20} color={theme.colors.secondary[500]} style={styles.verifiedIcon} />
                            )}
                        </View>
                        <View style={styles.locationRow}>
                            <Feather name="map-pin" size={14} color={theme.colors.gray[500]} />
                            <Text variant="sm" color={theme.colors.gray[500]} style={styles.locationText}>
                                {user.location?.city || 'Worldwide'}
                                {user.location?.distance ? ` • ${user.location.distance} km away` : ''}
                            </Text>
                        </View>
                    </View>
                    {user.is_online && (
                        <View style={styles.onlineBadge}>
                            <View style={styles.onlineDot} />
                            <Text variant="xs" weight="bold" color={theme.colors.success[600]}>ONLINE</Text>
                        </View>
                    )}
                </View>

                {user.bio && (
                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>About</Text>
                        <Text color={theme.colors.gray[700]} style={styles.bio}>
                            {user.bio}
                        </Text>
                    </View>
                )}

                {user.interests && user.interests.length > 0 && (
                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>Interests</Text>
                        <View style={styles.interestsContainer}>
                            {user.interests.map((interest, idx) => (
                                <Chip key={idx} label={interest} variant="primary" />
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text variant="lg" weight="bold" style={styles.sectionTitle}>Basic Info</Text>
                    <View style={styles.infoGrid}>
                        <InfoItem icon="user" label="Gender" value="Female" />
                        <InfoItem icon="calendar" label="Age" value={`${user.age} years`} />
                        <InfoItem icon="eye" label="Looking for" value="Friendship" />
                        <InfoItem icon="message-circle" label="Languages" value="English, Spanish" />
                    </View>
                </View>

                <View style={[styles.section, styles.lastSection]}>
                    <Text variant="lg" weight="bold" style={styles.sectionTitle}>Verification</Text>
                    <View style={styles.verificationRow}>
                        <Feather
                            name={user.is_verified ? "shield" : "shield-off"}
                            size={24}
                            color={user.is_verified ? theme.colors.success[500] : theme.colors.gray[400]}
                        />
                        <Text style={styles.verificationText}>
                            {user.is_verified
                                ? "This profile is verified and authentic."
                                : "This profile has not completed verification yet."}
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

interface InfoItemProps {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
        <Feather name={icon} size={16} color={theme.colors.primary[500]} />
        <View style={styles.infoTextContainer}>
            <Text variant="xs" color={theme.colors.gray[500]}>{label}</Text>
            <Text variant="sm" weight="medium">{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    imageContainer: {
        height: SCREEN_WIDTH * 1.25,
        backgroundColor: theme.colors.gray[100],
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 1.25,
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagination: {
        position: 'absolute',
        top: theme.spacing[4],
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: (SCREEN_WIDTH - 40) / 4, // Max 4 dots visible well
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginHorizontal: 2,
        borderRadius: 2,
    },
    activeDot: {
        backgroundColor: theme.colors.white,
    },
    content: {
        padding: theme.spacing[6],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing[6],
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifiedIcon: {
        marginLeft: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    locationText: {
        marginLeft: 4,
    },
    onlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.success[50],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.success[500],
        marginRight: 6,
    },
    section: {
        marginBottom: theme.spacing[6],
    },
    sectionTitle: {
        marginBottom: theme.spacing[3],
    },
    bio: {
        lineHeight: 22,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -theme.spacing[2],
    },
    infoItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[2],
        marginBottom: theme.spacing[4],
    },
    infoTextContainer: {
        marginLeft: 12,
    },
    verificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[50],
        padding: theme.spacing[4],
        borderRadius: theme.borderRadius.md,
    },
    verificationText: {
        marginLeft: 12,
        flex: 1,
        color: theme.colors.gray[600],
        fontSize: 14,
    },
    lastSection: {
        marginBottom: theme.spacing[12],
    },
});
