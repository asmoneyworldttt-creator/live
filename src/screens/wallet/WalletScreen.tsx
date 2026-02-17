import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Loader, Card } from '../../components/common';
import { theme } from '../../theme';
import { useWallet, useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { formatDateTime } from '../../utils/dateUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PACKAGES = [
    { id: 'p1', name: 'Starter Kit', coins: 100, price: '$0.99', bonus: '0%' },
    { id: 'p2', name: 'Popular', coins: 550, price: '$4.99', bonus: '10%', is_popular: true },
    { id: 'p3', name: 'Super Value', coins: 1200, price: '$9.99', bonus: '20%' },
    { id: 'p4', name: 'Elite Pack', coins: 3000, price: '$24.99', bonus: '30%', bonusText: 'BEST VALUE' },
];

export default function WalletScreen({ navigation }: any) {
    const { profile } = useAuth();
    const {
        balance,
        transactions,
        isLoading,
        fetchWallet,
        buyCoins
    } = useWallet();

    useEffect(() => {
        fetchWallet();
    }, []);

    const handlePurchase = async (pkg: any) => {
        Alert.alert(
            'Confirm Purchase',
            `Are you sure you want to buy ${pkg.coins} coins for ${pkg.price}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            await buyCoins(pkg);
                            Alert.alert('Success', 'Coins added to your account!');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Purchase failed');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="chevron-left" size={28} color={theme.colors.gray[900]} />
                    </TouchableOpacity>
                    <Text variant="xl" weight="bold">My Wallet</Text>
                    <TouchableOpacity style={styles.historyButton}>
                        <Feather name="help-circle" size={24} color={theme.colors.gray[400]} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchWallet} />
                }
            >
                {/* Balance Card */}
                <View style={styles.balanceContainer}>
                    <Card style={styles.balanceCard}>
                        <View style={styles.balanceInner}>
                            <View>
                                <Text color="rgba(255,255,255,0.7)" weight="medium">Available Balance</Text>
                                <View style={styles.coinRow}>
                                    <Image
                                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png' }}
                                        style={styles.coinImg}
                                    />
                                    <Text variant="4xl" weight="bold" color={theme.colors.white}>
                                        {balance.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                            {profile?.is_creator && (
                                <TouchableOpacity
                                    style={styles.withdrawBtn}
                                    onPress={() => navigation.navigate('Withdraw')}
                                >
                                    <Text weight="bold" color={theme.colors.primary[500]}>Withdraw</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </Card>
                </View>

                {/* Info Text */}
                <View style={styles.infoSection}>
                    <Text variant="lg" weight="bold" style={styles.sectionTitle}>Get More Coins</Text>
                    <Text variant="sm" color={theme.colors.gray[500]}>
                        Use coins to send gifts, unlock premium content, or make video calls.
                    </Text>
                </View>

                {/* Packages Grid */}
                <View style={styles.packagesGrid}>
                    {PACKAGES.map((pkg) => (
                        <TouchableOpacity
                            key={pkg.id}
                            style={[styles.packageItem, pkg.is_popular && styles.popularItem]}
                            onPress={() => handlePurchase(pkg)}
                        >
                            {pkg.is_popular && (
                                <View style={styles.popularBadge}>
                                    <Text variant="xs" weight="bold" color={theme.colors.white}>POPULAR</Text>
                                </View>
                            )}
                            {pkg.bonusText && (
                                <View style={styles.bestValueBadge}>
                                    <Text variant="xs" weight="bold" color={theme.colors.white}>{pkg.bonusText}</Text>
                                </View>
                            )}
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png' }}
                                style={[styles.pkgImg, pkg.id === 'p4' && styles.largePkgImg]}
                            />
                            <Text variant="lg" weight="bold" style={styles.pkgCoins}>{pkg.coins} Coins</Text>
                            <View style={styles.bonusTag}>
                                <Text variant="xs" weight="bold" color={theme.colors.success[600]}>+{pkg.bonus} Bonus</Text>
                            </View>
                            <View style={styles.priceTag}>
                                <Text weight="bold" color={theme.colors.white}>{pkg.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Transactions Table */}
                <View style={styles.historySection}>
                    <View style={styles.sectionHeader}>
                        <Text variant="lg" weight="bold">Transaction History</Text>
                        <TouchableOpacity>
                            <Text color={theme.colors.primary[500]} weight="medium">See All</Text>
                        </TouchableOpacity>
                    </View>

                    {transactions.length === 0 ? (
                        <View style={styles.emptyHistory}>
                            <Feather name="file-text" size={48} color={theme.colors.gray[200]} />
                            <Text color={theme.colors.gray[400]} style={styles.emptyText}>No transactions yet</Text>
                        </View>
                    ) : (
                        transactions.map((tx) => (
                            <View key={tx.id} style={styles.txItem}>
                                <View style={styles.txLeft}>
                                    <View style={[styles.txIcon, { backgroundColor: getTxColor(tx.type) + '15' }]}>
                                        <Feather
                                            name={getTxIcon(tx.type)}
                                            size={20}
                                            color={getTxColor(tx.type)}
                                        />
                                    </View>
                                    <View style={styles.txInfo}>
                                        <Text weight="semibold" numberOfLines={1}>{tx.description}</Text>
                                        <Text variant="xs" color={theme.colors.gray[400]}>
                                            {formatDateTime(tx.created_at)}
                                        </Text>
                                    </View>
                                </View>
                                <Text
                                    weight="bold"
                                    color={tx.amount > 0 ? theme.colors.success[500] : theme.colors.error[500]}
                                >
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const getTxIcon = (type: string) => {
    switch (type) {
        case 'purchase': return 'shopping-bag';
        case 'spent': return 'arrow-up-right';
        case 'earned': return 'arrow-down-left';
        case 'bonus': return 'gift';
        case 'withdrawal': return 'dollar-sign';
        default: return 'activity';
    }
};

const getTxColor = (type: string) => {
    switch (type) {
        case 'purchase': return theme.colors.primary[500];
        case 'spent': return theme.colors.error[500];
        case 'earned': return theme.colors.success[500];
        case 'bonus': return theme.colors.warning[500];
        case 'withdrawal': return theme.colors.gray[700];
        default: return theme.colors.gray[500];
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        backgroundColor: theme.colors.white,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[4],
        height: 56,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    historyButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    balanceContainer: {
        padding: theme.spacing[4],
    },
    balanceCard: {
        backgroundColor: theme.colors.primary[500],
        padding: theme.spacing[6],
        borderRadius: 24,
        borderWidth: 0,
    },
    balanceInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    coinImg: {
        width: 32,
        height: 32,
        marginRight: 10,
    },
    withdrawBtn: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    infoSection: {
        paddingHorizontal: theme.spacing[6],
        marginVertical: theme.spacing[4],
    },
    sectionTitle: {
        marginBottom: 4,
    },
    packagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: theme.spacing[3],
    },
    packageItem: {
        width: (SCREEN_WIDTH - theme.spacing[6] * 2) / 2,
        backgroundColor: theme.colors.gray[50], // Very light gray
        margin: theme.spacing[1.5],
        padding: theme.spacing[4],
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    popularItem: {
        borderColor: theme.colors.primary[200],
        backgroundColor: theme.colors.primary[50],
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    bestValueBadge: {
        position: 'absolute',
        top: -10,
        backgroundColor: theme.colors.error[500],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    pkgImg: {
        width: 50,
        height: 50,
        marginBottom: 12,
    },
    largePkgImg: {
        width: 65,
        height: 65,
    },
    pkgCoins: {
        marginBottom: 4,
    },
    bonusTag: {
        marginBottom: 16,
    },
    priceTag: {
        backgroundColor: theme.colors.gray[900],
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
    },
    historySection: {
        padding: theme.spacing[6],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing[4],
    },
    emptyHistory: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 10,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    txLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    txIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    txInfo: {
        flex: 1,
    },
});
