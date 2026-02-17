import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Modal, Image, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withSequence,
    interpolate,
} from 'react-native-reanimated';
import { Text } from '../common/Text';
import { Button } from '../common/Button';
import { theme } from '../../theme';
import { DiscoveryUser } from '../../store/discoveryStore';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface MatchAnimationProps {
    visible: boolean;
    currentUser: any; // UserProfile from store
    matchedUser: DiscoveryUser;
    onSendMessage: () => void;
    onClose: () => void;
}

export const MatchAnimation: React.FC<MatchAnimationProps> = ({
    visible,
    currentUser,
    matchedUser,
    onSendMessage,
    onClose,
}) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const avatar1TranslateX = useSharedValue(-SCREEN_WIDTH);
    const avatar2TranslateX = useSharedValue(SCREEN_WIDTH);

    useEffect(() => {
        if (visible) {
            opacity.value = withSpring(1);
            scale.value = withDelay(300, withSpring(1));
            avatar1TranslateX.value = withDelay(500, withSpring(-20));
            avatar2TranslateX.value = withDelay(500, withSpring(20));
        } else {
            opacity.value = 0;
            scale.value = 0;
            avatar1TranslateX.value = -SCREEN_WIDTH;
            avatar2TranslateX.value = SCREEN_WIDTH;
        }
    }, [visible]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const avatar1Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: avatar1TranslateX.value },
            { rotate: '-10deg' }
        ],
    }));

    const avatar2Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: avatar2TranslateX.value },
            { rotate: '10deg' }
        ],
    }));

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.container}>
                <Animated.View style={[styles.backdrop, backdropStyle]} />

                <Animated.View style={[styles.content, contentStyle]}>
                    <Text variant="5xl" weight="bold" color={theme.colors.white} style={styles.matchText}>
                        It's a Match!
                    </Text>
                    <Text variant="lg" color={theme.colors.gray[300]} style={styles.subText}>
                        You and {matchedUser.full_name} have liked each other.
                    </Text>

                    <View style={styles.avatarRow}>
                        <Animated.View style={[styles.avatarWrapper, avatar1Style]}>
                            <Image
                                source={{ uri: currentUser?.avatar_url || 'https://via.placeholder.com/150' }}
                                style={styles.avatar}
                            />
                        </Animated.View>
                        <View style={styles.heartWrapper}>
                            <Feather name="heart" size={40} color={theme.colors.primary[500]} />
                        </View>
                        <Animated.View style={[styles.avatarWrapper, avatar2Style]}>
                            <Image
                                source={{ uri: matchedUser.photos[0] || 'https://via.placeholder.com/150' }}
                                style={styles.avatar}
                            />
                        </Animated.View>
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Send a Message"
                            onPress={onSendMessage}
                            style={styles.messageButton}
                        />
                        <TouchableOpacity onPress={onClose} style={styles.keepSwiping}>
                            <Text weight="semibold" color={theme.colors.gray[300]}>Keep Swiping</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: theme.spacing[6],
    },
    matchText: {
        textAlign: 'center',
        marginBottom: theme.spacing[2],
        fontStyle: 'italic',
    },
    subText: {
        textAlign: 'center',
        marginBottom: theme.spacing[12],
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 180,
    },
    avatarWrapper: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: theme.colors.white,
        overflow: 'hidden',
        backgroundColor: theme.colors.gray[200],
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    heartWrapper: {
        position: 'absolute',
        zIndex: 10,
        backgroundColor: theme.colors.white,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    footer: {
        marginTop: SCREEN_HEIGHT * 0.1,
        width: '100%',
    },
    messageButton: {
        backgroundColor: theme.colors.primary[500],
        marginBottom: theme.spacing[4],
    },
    keepSwiping: {
        alignItems: 'center',
        paddingVertical: theme.spacing[4],
    },
});
