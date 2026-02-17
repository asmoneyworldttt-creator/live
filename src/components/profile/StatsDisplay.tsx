import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { theme } from '../../theme';

export interface StatItem {
    label: string;
    value: string | number;
}

export interface StatsDisplayProps {
    stats: StatItem[];
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
    return (
        <View style={styles.container}>
            {stats.map((stat, index) => (
                <View key={index} style={[
                    styles.statItem,
                    index < stats.length - 1 && styles.borderRight
                ]}>
                    <Text variant="xl" weight="bold" color={theme.colors.gray[900]}>
                        {stat.value}
                    </Text>
                    <Text variant="xs" color={theme.colors.gray[500]} style={styles.label}>
                        {stat.label}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing[4],
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: theme.colors.gray[100],
    },
    label: {
        marginTop: 4,
        textTransform: 'uppercase',
    },
});
