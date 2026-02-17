import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from '../../components/common';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useGames, useWallet } from '../../hooks';

export default function GamePlayScreen({ route, navigation }: any) {
    const { gameId } = route.params;
    const { games, endSession, activeSession } = useGames();
    const { balance } = useWallet();
    const game = games.find(g => g.id === gameId);

    const [isSpinning, setIsSpinning] = useState(false);
    const spinValue = React.useRef(new Animated.Value(0)).current;

    const handleSpin = () => {
        if (balance < (game?.entryFee || 0)) {
            Alert.alert('Insufficient Balance', 'You need more coins to play this game.');
            return;
        }

        setIsSpinning(true);
        spinValue.setValue(0);

        Animated.timing(spinValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
        }).start(() => {
            setIsSpinning(false);
            Alert.alert('Congratulations!', 'You won 50 coins! 🎉');
        });
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '1080deg'],
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (activeSession) endSession(activeSession.id);
                    navigation.goBack();
                }}>
                    <Feather name="chevron-left" size={28} color={theme.colors.gray[900]} />
                </TouchableOpacity>
                <Text variant="xl" weight="bold">{game?.name}</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.gameArea}>
                <Text variant="lg" color={theme.colors.gray[500]} style={styles.subtitle}>
                    {gameId === 'spin_wheel' ? 'Tap to Spin!' : 'Game logic coming soon...'}
                </Text>

                <Animated.View style={[styles.wheelContainer, { transform: [{ rotate: spin }] }]}>
                    <View style={styles.wheel}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <View
                                key={i}
                                style={[
                                    styles.segment,
                                    {
                                        transform: [{ rotate: `${i * 45}deg` }],
                                        backgroundColor: i % 2 === 0 ? theme.colors.primary[500] : theme.colors.primary[300]
                                    }
                                ]}
                            />
                        ))}
                    </View>
                </Animated.View>

                {gameId === 'spin_wheel' && (
                    <Button
                        title={isSpinning ? "Spinning..." : "SPIN NOW"}
                        onPress={handleSpin}
                        disabled={isSpinning}
                        style={styles.spinButton}
                    />
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.balanceInfo}>
                    <Feather name="database" size={16} color={theme.colors.warning[500]} />
                    <Text weight="bold" style={{ marginLeft: 6 }}>Current Balance: {balance} coins</Text>
                </View>
            </View>
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
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2],
    },
    gameArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        marginBottom: 40,
    },
    wheelContainer: {
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheel: {
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 8,
        borderColor: theme.colors.gray[900],
        overflow: 'hidden',
    },
    segment: {
        position: 'absolute',
        top: 0,
        left: 140,
        width: 140,
        height: 140,
        transformOrigin: '0% 100%',
    },
    spinButton: {
        marginTop: 60,
        width: 200,
        height: 60,
        borderRadius: 30,
    },
    footer: {
        padding: 40,
        alignItems: 'center',
    },
    balanceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[50],
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    }
});
