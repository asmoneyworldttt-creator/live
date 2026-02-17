import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

export interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    variant?: 'default' | 'outlined' | 'elevated' | 'flat';
    padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    onPress,
    variant = 'default',
    padding = 4,
}) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'outlined':
                return {
                    borderWidth: 1,
                    borderColor: theme.colors.gray[200],
                    backgroundColor: theme.colors.white,
                };
            case 'elevated':
                return {
                    backgroundColor: theme.colors.white,
                    ...theme.shadows.md,
                };
            case 'flat':
                return {
                    backgroundColor: theme.colors.gray[50],
                };
            default:
                return {
                    backgroundColor: theme.colors.white,
                    ...theme.shadows.sm,
                    borderWidth: 1,
                    borderColor: theme.colors.gray[100],
                };
        }
    };

    const cardStyles = [
        styles.card,
        getVariantStyle(),
        { padding: theme.spacing[padding] },
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={cardStyles}>
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
});
