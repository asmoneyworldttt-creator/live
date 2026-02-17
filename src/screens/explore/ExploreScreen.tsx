import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Input, Avatar, Loader, Badge, Skeleton } from '../../components/common';
import { theme } from '../../theme';
import { useExplore } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExploreScreen({ navigation }: any) {
    const {
        searchResults,
        trendingUsers,
        recentSearches,
        isSearching,
        isLoadingTrending,
        search,
        getTrending,
        addRecentSearch,
        clearResults
    } = useExplore();

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getTrending();
    }, []);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        search(text);
    };

    const onUserPress = (user: any) => {
        addRecentSearch(user.full_name);
        navigation.navigate('OtherProfile', { userId: user.id });
    };

    const renderUserItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.userCard} onPress={() => onUserPress(item)}>
            <Avatar source={item.photos[0]} name={item.full_name} size="xl" />
            <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                    <Text weight="bold" variant="lg">{item.full_name}, {item.age}</Text>
                    {item.is_verified && <Feather name="check-circle" size={14} color={theme.colors.primary[500]} style={{ marginLeft: 4 }} />}
                </View>
                <Text variant="sm" color={theme.colors.gray[500]} numberOfLines={1}>@{item.username || 'user'}</Text>
                <View style={styles.badgeRow}>
                    <Badge label="Online" variant="success" size="sm" />
                    {item.compatibility_score && (
                        <View style={styles.scoreBadge}>
                            <Feather name="zap" size={10} color={theme.colors.primary[500]} />
                            <Text variant="xs" weight="bold" color={theme.colors.primary[500]} style={{ marginLeft: 2 }}>
                                {item.compatibility_score}% Match
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.gray[300]} />
        </TouchableOpacity>
    );

    const renderTrendingItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.trendingCard} onPress={() => onUserPress(item)}>
            <Image source={{ uri: item.photos[0] }} style={styles.trendingImage} />
            <View style={styles.trendingOverlay}>
                <Text color={theme.colors.white} weight="bold">{item.full_name}</Text>
                <View style={styles.onlineStatus}>
                    <View style={styles.onlineDot} />
                    <Text variant="xs" color={theme.colors.white}>Active</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text variant="3xl" weight="bold">Explore</Text>
            </View>

            <View style={styles.searchBar}>
                <Input
                    placeholder="Search users or interests..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    leftIcon="search"
                    rightIcon={searchQuery.length > 0 ? "x" : undefined}
                    onRightIconPress={() => {
                        setSearchQuery('');
                        clearResults();
                    }}
                />
            </View>

            {isSearching ? (
                <View style={styles.resultsList}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <View key={i} style={styles.userCard}>
                            <Skeleton width={80} height={80} circle />
                            <View style={styles.userInfo}>
                                <Skeleton width="60%" height={20} style={{ marginBottom: 8 }} />
                                <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
                                <View style={styles.badgeRow}>
                                    <Skeleton width={50} height={18} />
                                    <Skeleton width={80} height={18} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            ) : searchQuery.length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.resultsList}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Feather name="search" size={48} color={theme.colors.gray[200]} />
                            <Text color={theme.colors.gray[400]} style={{ marginTop: 16 }}>No users found for "{searchQuery}"</Text>
                        </View>
                    }
                />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoadingTrending} onRefresh={getTrending} />}
                >
                    <TouchableOpacity
                        style={styles.smartMatchBanner}
                        onPress={() => navigation.navigate('SmartMatch')}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary[500], theme.colors.secondary[500]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.bannerGradient}
                        />
                        <View style={styles.bannerContent}>
                            <View style={styles.bannerText}>
                                <Text variant="xl" weight="bold" color={theme.colors.white}>AI Smart Match</Text>
                                <Text color="rgba(255,255,255,0.8)" variant="xs">Based on your personality & interests</Text>
                            </View>
                            <View style={styles.bannerAction}>
                                <Text weight="bold" color={theme.colors.white}>Reveal Now</Text>
                                <Feather name="arrow-right" size={16} color={theme.colors.white} style={{ marginLeft: 4 }} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {recentSearches.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text variant="lg" weight="bold">Recent Searches</Text>
                            </View>
                            <View style={styles.recentTags}>
                                {recentSearches.map((s, i) => (
                                    <TouchableOpacity key={i} style={styles.tag} onPress={() => handleSearch(s)}>
                                        <Text variant="sm">{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text variant="lg" weight="bold">Trending Profiles</Text>
                            <TouchableOpacity>
                                <Text color={theme.colors.primary[500]} weight="bold">View All</Text>
                            </TouchableOpacity>
                        </View>
                        {isLoadingTrending ? (
                            <View style={styles.trendingList}>
                                {[1, 2, 3].map(i => (
                                    <View key={i} style={styles.trendingCard}>
                                        <Skeleton width="100%" height="100%" borderRadius={20} />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <FlatList
                                data={trendingUsers}
                                renderItem={renderTrendingItem}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.trendingList}
                            />
                        )}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text variant="lg" weight="bold">Interests</Text>
                        </View>
                        <View style={styles.interestGrid}>
                            {['🎨 Art', '🎭 Theater', '⚽ Sports', '🎸 Music', '✈️ Travel', '🍽️ Foodie'].map((interest) => (
                                <TouchableOpacity key={interest} style={styles.interestItem}>
                                    <Text weight="medium">{interest}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[4],
    },
    searchBar: {
        paddingHorizontal: theme.spacing[6],
        marginBottom: theme.spacing[4],
    },
    smartMatchBanner: {
        marginHorizontal: theme.spacing[6],
        height: 100,
        borderRadius: 20,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    bannerGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    bannerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    bannerText: {
        flex: 1,
    },
    bannerAction: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    section: {
        marginTop: theme.spacing[6],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[6],
        marginBottom: theme.spacing[4],
    },
    recentTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: theme.spacing[6],
        gap: 8,
    },
    tag: {
        backgroundColor: theme.colors.gray[50],
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    trendingList: {
        paddingHorizontal: theme.spacing[6],
        gap: 16,
    },
    trendingCard: {
        width: 140,
        height: 180,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: theme.colors.gray[100],
    },
    trendingImage: {
        width: '100%',
        height: '100%',
    },
    trendingOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.success[400],
        marginRight: 4,
    },
    interestGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: theme.spacing[6],
        gap: 12,
    },
    interestItem: {
        width: '48%',
        backgroundColor: theme.colors.gray[50],
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    resultsList: {
        paddingHorizontal: theme.spacing[6],
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[50],
    },
    userInfo: {
        flex: 1,
        marginLeft: theme.spacing[4],
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeRow: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary[50],
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    emptyState: {
        paddingTop: 100,
        alignItems: 'center',
    }
});
