import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
    PanResponder,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native';
import { theme } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.5,
}) => {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            show();
        } else {
            hide();
        }
    }, [visible]);

    const show = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: SCREEN_HEIGHT - height,
                useNativeDriver: true,
                friction: 8,
            }),
        ]).start();
    };

    const hide = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy > 0) {
                translateY.setValue(SCREEN_HEIGHT - height + gestureState.dy);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > 50) {
                hide();
            } else {
                show();
            }
        },
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={hide}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={hide}>
                    <Animated.View style={[styles.overlay, { opacity }]} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            height,
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    <View {...panResponder.panHandlers} style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>
                    <View style={styles.content}>{children}</View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: theme.borderRadius['2xl'],
        borderTopRightRadius: theme.borderRadius['2xl'],
        paddingBottom: theme.spacing[10],
    },
    handleContainer: {
        paddingVertical: theme.spacing[3],
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.gray[300],
        borderRadius: 2,
    },
    content: {
        flex: 1,
    },
});
