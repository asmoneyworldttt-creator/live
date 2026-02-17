import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    onHide?: () => void;
    duration?: number;
    visible?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    onHide,
    duration = 3000,
    visible = false,
}) => {
    const [isVisible, setIsVisible] = useState(visible);
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        if (visible) {
            show();
        } else {
            hide();
        }
    }, [visible]);

    const show = () => {
        setIsVisible(true);
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (duration > 0) {
                setTimeout(hide, duration);
            }
        });
    };

    const hide = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -20,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsVisible(false);
            onHide?.();
        });
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'alert-triangle';
            default: return 'info';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return theme.colors.success[500];
            case 'error': return theme.colors.error[500];
            case 'warning': return theme.colors.warning[500];
            default: return theme.colors.primary[500];
        }
    };

    if (!isVisible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <View style={[styles.toast, { borderLeftColor: getColor() }]}>
                <Feather name={getIcon()} size={20} color={getColor()} />
                <Text variant="sm" weight="medium" style={styles.message}>
                    {message}
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: theme.zIndex.tooltip,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[4],
        borderRadius: theme.borderRadius.md,
        borderLeftWidth: 4,
        width: '100%',
        ...theme.shadows.lg,
    },
    message: {
        marginLeft: theme.spacing[3],
        flex: 1,
        color: theme.colors.gray[800],
    },
});
