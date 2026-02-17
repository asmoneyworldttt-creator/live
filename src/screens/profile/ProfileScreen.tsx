import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Button, Card } from '../../components/common';
import { StatsDisplay, PhotoGallery, VerificationBadge } from '../../components/profile';
import { BalanceCard } from '../../components/wallet';
import { theme } from '../../theme';
import { useAuth, useWallet } from '../../hooks';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
    const { profile, logout } = useAuth();
    const { balance } = useWallet();

    const stats = [
        { label: 'Matches', value: 124 },
        { label: 'Following', value: 890 },
        { label: 'Followers', value: '1.2k' },
    ];

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    const handleCallHistory = () => {
        navigation.navigate('CallHistory');
    };

    const handleAddCoins = () => {
        navigation.navigate('Wallet');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text variant="2xl" weight="bold">Profile</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
                        <Feather name="settings" size={22} color={theme.colors.gray[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={logout}>
                        <Feather name="log-out" size={22} color={theme.colors.error[500]} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarWrapper}>
                        <Avatar
                            source={profile?.avatar_url}
                            name={profile?.full_name || 'User'}
                            size={120}
                        />
                        <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditProfile}>
                            <Feather name="camera" size={16} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.nameRow}>
                        <Text variant="2xl" weight="bold" style={styles.name}>
                            {profile?.full_name}, {profile?.age || 24}
                        </Text>
                        <VerificationBadge verified={profile?.is_verified || false} size={20} />
                    </View>
                    <Text color={theme.colors.gray[500]}>@{profile?.username || 'user'}</Text>
                </View>

                <View style={styles.statsWrapper}>
                    <StatsDisplay stats={stats} />
                </View>

                <View style={styles.section}>
                    <BalanceCard
                        balance={balance}
                        onAddCoins={handleAddCoins}
                        isCreator={profile?.is_creator}
                        onWithdraw={() => navigation.navigate('Withdraw')}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text variant="lg" weight="bold">My Gallery</Text>
                        <TouchableOpacity onPress={handleEditProfile}>
                            <Text variant="sm" weight="bold" color={theme.colors.primary[500]}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <PhotoGallery photos={[profile?.avatar_url || 'https://via.placeholder.com/150']} />
                </View>

                <View style={styles.section}>
                    <Text variant="lg" weight="bold" style={styles.sectionTitle}>Activity</Text>
                    <Card variant="flat" style={styles.menuCard}>
                        <MenuItem icon="phone" title="Call History" onPress={handleCallHistory} />
                        <MenuItem icon="settings" title="App Settings" onPress={handleSettings} isLast />
                    </Card>
                </View>

                <View style={styles.upgradeSection}>
                    <TouchableOpacity
                        style={styles.premiumCard}
                        onPress={() => navigation.navigate('Premium')}
                    >
                        <View style={styles.premiumTextWrapper}>
                            <Text variant="lg" weight="bold" color={theme.colors.white}>Upgrade to Gold</Text>
                            <Text variant="xs" color="rgba(255,255,255,0.8)">Get unlimited likes and more!</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color={theme.colors.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footerSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
}

const MenuItem = ({ icon, title, isLast, onPress }: { icon: any; title: string, isLast?: boolean; onPress?: () => void }) => (
    <TouchableOpacity style={[styles.menuItem, isLast && styles.noBorder]} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <View style={styles.menuIconWrapper}>
                <Feather name={icon} size={18} color={theme.colors.gray[600]} />
            </View>
            <Text weight="medium">{title}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={theme.colors.gray[400]} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[4],
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing[3],
    },
    scrollContent: {
        paddingBottom: theme.spacing[10],
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: theme.spacing[6],
    },
    avatarWrapper: {
        marginBottom: theme.spacing[4],
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary[500],
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.colors.white,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        marginRight: 8,
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
    menuCard: {
        padding: 0,
        backgroundColor: theme.colors.gray[50],
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    upgradeSection: {
        paddingHorizontal: theme.spacing[6],
        marginTop: theme.spacing[4],
    },
    premiumCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.premium.gold,
        padding: theme.spacing[5],
        borderRadius: 20,
        ...theme.shadows.md,
    },
    premiumTextWrapper: {
        flex: 1,
    },
    footerSpacing: {
        height: 40,
    },
});
