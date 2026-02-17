import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';

export interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    style,
    textStyle,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.gray[300];
        switch (variant) {
            case 'primary': return theme.colors.primary[500];
            case 'secondary': return theme.colors.secondary[500];
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            case 'danger': return theme.colors.error[500];
            default: return theme.colors.primary[500];
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.gray[500];
        switch (variant) {
            case 'primary': return theme.colors.white;
            case 'secondary': return theme.colors.white;
            case 'outline': return theme.colors.primary[500];
            case 'ghost': return theme.colors.gray[700];
            case 'danger': return theme.colors.white;
            default: return theme.colors.white;
        }
    };

    const getBorderColor = () => {
        if (disabled) return 'transparent';
        if (variant === 'outline') return theme.colors.primary[500];
        return 'transparent';
    };

    const getHeight = () => {
        switch (size) {
            case 'sm': return 36;
            case 'md': return 48;
            case 'lg': return 56;
            default: return 48;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm': return 'sm';
            case 'md': return 'base';
            case 'lg': return 'lg';
            default: return 'base';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    height: getHeight(),
                    opacity: disabled ? 0.7 : 1,
                },
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {leftIcon}
                    <Text
                        variant={getFontSize()}
                        weight="semibold"
                        color={getTextColor()}
                        style={[{ marginHorizontal: leftIcon || rightIcon ? 8 : 0 }, textStyle]}
                    >
                        {title}
                    </Text>
                    {rightIcon}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: theme.spacing[6],
        ...theme.shadows.sm,
    },
});
