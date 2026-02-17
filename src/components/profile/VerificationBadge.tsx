import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { Text } from '../common/Text';

export interface VerificationBadgeProps {
    verified: boolean;
    showLabel?: boolean;
    size?: number;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
    verified,
    showLabel = false,
    size = 16,
}) => {
    if (!verified) return null;

    return (
        <View style={styles.container}>
            <View style={[styles.badge, { width: size + 4, height: size + 4, borderRadius: (size + 4) / 2 }]}>
                <Feather name="check" size={size} color={theme.colors.white} />
            </View>
            {showLabel && (
                <Text variant="xs" weight="bold" color={theme.colors.secondary[500]} style={styles.label}>
                    VERIFIED
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: theme.colors.secondary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        marginLeft: 4,
    },
});
