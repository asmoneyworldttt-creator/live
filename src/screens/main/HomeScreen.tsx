import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Loader, Button } from '../../components/common';
import { SwipeCard, LikeButtons, MatchAnimation, FilterPanel } from '../../components/discovery';
import { theme } from '../../theme';
import { useDiscovery, useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { BottomSheet } from '../../components/common/BottomSheet';

export default function HomeScreen({ navigation }: any) {
    const {
        users,
        isLoading,
        loadUsers,
        like,
        nope,
        lastMatch,
        clearMatch
    } = useDiscovery();
    const { profile } = useAuth();
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSwipeRight = (userId: string) => {
        like();
    };

    const handleSwipeLeft = (userId: string) => {
        nope();
    };

    const handleMatchClose = () => {
        clearMatch();
    };

    const handleSendMessage = () => {
        if (lastMatch) {
            navigation.navigate('ChatDetail', { userId: lastMatch.id });
            clearMatch();
        }
    };

    if (isLoading && users.length === 0) {
        return <Loader fullscreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Feather name="user" size={28} color={theme.colors.gray[400]} />
                </TouchableOpacity>

                <View style={styles.logoRow}>
                    <Feather name="heart" size={24} color={theme.colors.primary[500]} />
                    <Text variant="xl" weight="bold" color={theme.colors.primary[600]} style={styles.logoText}>
                        SoulMatch
                    </Text>
                </View>

                <TouchableOpacity onPress={() => setShowFilters(true)}>
                    <Feather name="sliders" size={24} color={theme.colors.gray[400]} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
                {users.length > 0 ? (
                    users.slice(0, 2).reverse().map((user) => (
                        <SwipeCard
                            key={user.id}
                            user={user}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <Feather name="users" size={48} color={theme.colors.gray[300]} />
                        </View>
                        <Text variant="lg" weight="bold" color={theme.colors.gray[600]}>
                            No more profiles
                        </Text>
                        <Text color={theme.colors.gray[400]} style={styles.emptySub}>
                            Try adjusting your filters to find {'\n'} more people nearby
                        </Text>
                        <Button
                            title="Refresh"
                            variant="outline"
                            onPress={loadUsers}
                            style={styles.refreshButton}
                        />
                    </View>
                )}
            </View>

            {users.length > 0 && (
                <View style={styles.footer}>
                    <LikeButtons
                        onUndo={() => { }}
                        onNope={() => handleSwipeLeft(users[0].id)}
                        onLike={() => handleSwipeRight(users[0].id)}
                        onSuperLike={() => { }}
                        onBoost={() => { }}
                    />
                </View>
            )}

            <MatchAnimation
                visible={!!lastMatch}
                currentUser={profile}
                matchedUser={lastMatch!}
                onClose={handleMatchClose}
                onSendMessage={handleSendMessage}
            />

            <BottomSheet
                visible={showFilters}
                onClose={() => setShowFilters(false)}
            >
                <FilterPanel
                    initialFilters={{
                        minAge: 18,
                        maxAge: 35,
                        maxDistance: 50,
                        verifiedOnly: false,
                        onlineOnly: false,
                    }}
                    onApply={(filters) => {
                        console.log('Applying filters:', filters);
                        setShowFilters(false);
                    }}
                />
            </BottomSheet>
        </SafeAreaView>
    );
}

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
        paddingVertical: theme.spacing[2],
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        marginLeft: 8,
    },
    cardContainer: {
        flex: 1,
        marginTop: theme.spacing[4],
    },
    footer: {
        paddingBottom: theme.spacing[4],
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptySub: {
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    refreshButton: {
        marginTop: 24,
        width: 150,
    },
});
