import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Badge, Loader } from '../../components/common';
import { theme } from '../../theme';
import { useGames } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GamesLobbyScreen({ navigation }: any) {
    const { games, isLoading, loadGames, playSolo } = useGames();

    useEffect(() => {
        loadGames();
    }, []);

    const handlePlayGame = async (gameId: string) => {
        // For now, we just mock starting a session
        // In a real app, this would navigate to the specific game screen
        try {
            await playSolo(gameId);
            navigation.navigate('GamePlay', { gameId });
        } catch (error) {
            console.error('Failed to start game:', error);
        }
    };

    const renderGameCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.gameCard}
            onPress={() => handlePlayGame(item.id)}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.image }} style={styles.gameImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
            />

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Badge
                        label={item.category}
                        variant={item.category === 'Competitive' ? 'error' : 'primary'}
                        size="sm"
                    />
                    <View style={styles.onlineStatus}>
                        <View style={styles.onlineDot} />
                        <Text variant="xs" color={theme.colors.white}>
                            {item.playersOnline} online
                        </Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.titleRow}>
                        <Text variant="xl" weight="bold" color={theme.colors.white}>
                            {item.name}
                        </Text>
                        <Feather name={item.icon} size={20} color={theme.colors.white} />
                    </View>
                    <Text variant="sm" color="rgba(255,255,255,0.7)" numberOfLines={2} style={styles.description}>
                        {item.description}
                    </Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Feather name="database" size={14} color={theme.colors.warning[400]} />
                            <Text variant="xs" weight="bold" color={theme.colors.warning[400]} style={styles.statText}>
                                {item.entryFee} coins
                            </Text>
                        </View>
                        <View style={styles.stat}>
                            <Feather name="award" size={14} color={theme.colors.success[400]} />
                            <Text variant="xs" weight="bold" color={theme.colors.success[400]} style={styles.statText}>
                                Win {item.prizePool}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTop}>
                    <Text variant="2xl" weight="bold">Games Lobby</Text>
                    <TouchableOpacity style={styles.coinBadge} onPress={() => navigation.navigate('Wallet')}>
                        <Feather name="database" size={16} color={theme.colors.warning[500]} />
                        <Text weight="bold" color={theme.colors.warning[600]} style={styles.coinBalance}>
                            Wallet
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text color={theme.colors.gray[500]} style={styles.headerSub}>
                    Challenge your matches or play solo to win big!
                </Text>
            </SafeAreaView>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {['All Games', 'Casual', 'Social', 'Competitive', 'Board Games'].map((cat, i) => (
                        <TouchableOpacity key={cat} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
                            <Text weight="medium" color={i === 0 ? theme.colors.white : theme.colors.gray[600]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {isLoading ? (
                <Loader />
            ) : (
                <FlatList
                    data={games}
                    renderItem={renderGameCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <View style={styles.featuredSection}>
                            <Text variant="lg" weight="bold" style={styles.sectionTitle}>Featured Games</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        paddingHorizontal: theme.spacing[6],
        paddingBottom: theme.spacing[4],
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerSub: {
        marginTop: 4,
    },
    coinBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.warning[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.warning[100],
    },
    coinBalance: {
        marginLeft: 4,
    },
    filterContainer: {
        marginBottom: 10,
    },
    filterScroll: {
        paddingHorizontal: theme.spacing[6],
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.gray[50],
        borderWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
    },
    listContent: {
        paddingHorizontal: theme.spacing[6],
        paddingBottom: 40,
    },
    featuredSection: {
        marginTop: 10,
        marginBottom: 16,
    },
    sectionTitle: {
        marginBottom: 4,
    },
    gameCard: {
        width: '100%',
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        ...theme.shadows.lg,
    },
    gameImage: {
        width: '100%',
        height: '100%',
    },
    cardGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
    },
    cardContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.success[500],
        marginRight: 6,
    },
    cardFooter: {
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    description: {
        lineHeight: 18,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        marginLeft: 4,
    }
});
