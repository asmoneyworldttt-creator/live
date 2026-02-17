import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Text } from '../../components/common';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <View style={styles.logoCircle}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png' }}
                        style={styles.logo}
                    />
                </View>
                <Text variant="4xl" weight="bold" color={theme.colors.white} style={styles.title}>
                    SoulMatch
                </Text>
                <Text variant="lg" color="rgba(255,255,255,0.7)" style={styles.subtitle}>
                    Find Your Perfect Match
                </Text>
            </Animated.View>

            <View style={styles.footer}>
                <View style={styles.loaderLine}>
                    <Animated.View style={[styles.loaderProgress, { width: '60%' }]} />
                </View>
                <Text variant="xs" color="rgba(255,255,255,0.5)">Version 1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        ...theme.shadows.lg,
    },
    logo: {
        width: 70,
        height: 70,
    },
    title: {
        letterSpacing: 2,
    },
    subtitle: {
        marginTop: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        width: '100%',
    },
    loaderLine: {
        width: width * 0.4,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        marginBottom: 20,
        overflow: 'hidden',
    },
    loaderProgress: {
        height: '100%',
        backgroundColor: theme.colors.white,
    }
});
