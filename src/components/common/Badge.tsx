import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';

export interface BadgeProps {
    count?: number;
    label?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    count,
    label,
    variant = 'error',
    size = 'md',
}) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return theme.colors.primary[500];
            case 'secondary': return theme.colors.secondary[500];
            case 'success': return theme.colors.success[500];
            case 'warning': return theme.colors.warning[500];
            case 'error': return theme.colors.error[500];
            default: return theme.colors.error[500];
        }
    };

    const getSize = () => {
        return size === 'sm' ? 16 : 20;
    };

    const getFontSize = () => {
        return size === 'sm' ? 10 : 12;
    };

    const content = count !== undefined ? (count > 99 ? '99+' : count) : label;

    if (!content) return null;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: getBackgroundColor(),
                minWidth: getSize(),
                height: getSize(),
                borderRadius: getSize() / 2,
            }
        ]}>
            <Text
                color={theme.colors.white}
                style={[styles.text, { fontSize: getFontSize() }]}
                weight="bold"
            >
                {content}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    text: {
        textAlign: 'center',
    },
});
