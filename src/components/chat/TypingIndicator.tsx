import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay
} from 'react-native-reanimated';
import { theme } from '../../theme';
import { Text } from '../common/Text';

export const TypingIndicator: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Dot delay={0} />
                <Dot delay={150} />
                <Dot delay={300} />
            </View>
        </View>
    );
};

const Dot = ({ delay }: { delay: number }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        scale.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1.5, { duration: 400 }),
                    withTiming(1, { duration: 400 })
                ),
                -1,
                true
            )
        );
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 400 }),
                    withTiming(0.4, { duration: 400 })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing[4],
        paddingVertical: 8,
    },
    bubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[100],
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 15,
        borderBottomLeftRadius: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.gray[500],
        marginHorizontal: 3,
    },
});
