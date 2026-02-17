import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import { theme } from '../../theme';

export interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    activeColor?: string;
}

export const Switch: React.FC<SwitchProps> = ({
    value,
    onValueChange,
    disabled = false,
    activeColor = theme.colors.primary[500],
}) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false, // Colors and position don't always support native driver
        }).start();
    }, [value]);

    const toggle = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.gray[300], activeColor],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            disabled={disabled}
            onPress={toggle}
        >
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
        justifyContent: 'center',
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.white,
        ...theme.shadows.sm,
    },
});
