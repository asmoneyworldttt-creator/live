import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    Extrapolate,
    runOnJS,
} from 'react-native-reanimated';
import { Text } from '../common/Text';
import { theme } from '../../theme';
import { DiscoveryUser } from '../../store/discoveryStore';
import { Feather } from '@expo/vector-icons';
import { getAge } from '../../utils/dateUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export interface SwipeCardProps {
    user: DiscoveryUser;
    onSwipeLeft: (userId: string) => void;
    onSwipeRight: (userId: string) => void;
    onSuperLike?: (userId: string) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
    user,
    onSwipeLeft,
    onSwipeRight,
    onSuperLike,
}) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number; startY: number }>({
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            translateX.value = ctx.startX + event.translationX;
            translateY.value = ctx.startY + event.translationY;
        },
        onEnd: (event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                translateX.value = withSpring(SCREEN_WIDTH * 1.5);
                runOnJS(onSwipeRight)(user.id);
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
                runOnJS(onSwipeLeft)(user.id);
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        },
    });

    const cardStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-10, 0, 10],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
            ],
        };
    });

    const likeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP),
    }));

    const nopeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP),
    }));

    return (
        <View style={styles.container}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.card, cardStyle]}>
                    <Image
                        source={{ uri: user.photos[0] || 'https://via.placeholder.com/400x600' }}
                        style={styles.image}
                        resizeMode="cover"
                    />

                    <Animated.View style={[styles.stamp, styles.likeStamp, likeOpacity]}>
                        <Text variant="3xl" weight="bold" color={theme.colors.success[500]}>LIKE</Text>
                    </Animated.View>

                    <Animated.View style={[styles.stamp, styles.nopeStamp, nopeOpacity]}>
                        <Text variant="3xl" weight="bold" color={theme.colors.error[500]}>NOPE</Text>
                    </Animated.View>

                    <View style={styles.info}>
                        <View style={styles.header}>
                            <Text variant="2xl" weight="bold" color={theme.colors.white}>
                                {user.full_name}, {user.age}
                            </Text>
                            {user.is_verified && (
                                <Feather name="check-circle" size={20} color={theme.colors.secondary[400]} style={styles.verifiedIcon} />
                            )}
                        </View>

                        {user.location?.city && (
                            <View style={styles.locationContainer}>
                                <Feather name="map-pin" size={14} color={theme.colors.gray[300]} />
                                <Text variant="sm" color={theme.colors.gray[300]} style={styles.locationText}>
                                    {user.location.city} {user.location.distance ? `• ${user.location.distance} km away` : ''}
                                </Text>
                            </View>
                        )}

                        {user.interests && user.interests.length > 0 && (
                            <View style={styles.interestsContainer}>
                                {user.interests.slice(0, 3).map((interest, idx) => (
                                    <View key={idx} style={styles.interestBadge}>
                                        <Text variant="xs" weight="medium" color={theme.colors.white}>
                                            {interest}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing[4],
    },
    card: {
        width: SCREEN_WIDTH - theme.spacing[8],
        height: '100%',
        backgroundColor: theme.colors.gray[200],
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadows.lg,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    stamp: {
        position: 'absolute',
        top: 50,
        borderWidth: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        zIndex: 10,
    },
    likeStamp: {
        left: 45,
        borderColor: theme.colors.success[500],
        transform: [{ rotate: '-30deg' }],
    },
    nopeStamp: {
        right: 45,
        borderColor: theme.colors.error[500],
        transform: [{ rotate: '30deg' }],
    },
    info: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing[6],
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifiedIcon: {
        marginLeft: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    locationText: {
        marginLeft: 4,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    interestBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
});
