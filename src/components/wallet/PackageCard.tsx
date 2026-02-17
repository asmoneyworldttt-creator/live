import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '../common/Text';
import { theme } from '../../theme';
import { CoinPackage } from '../../store/walletStore';
import { Feather } from '@expo/vector-icons';

export interface PackageCardProps {
    pkg: CoinPackage;
    onSelect: (pkgId: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
    return (
        <TouchableOpacity
            style={[styles.container, pkg.is_popular && styles.popularContainer]}
            onPress={() => onSelect(pkg.id)}
            activeOpacity={0.8}
        >
            {pkg.is_popular && (
                <View style={styles.popularBadge}>
                    <Text variant="xs" weight="bold" color={theme.colors.white}>POPULAR</Text>
                </View>
            )}

            <View style={styles.iconContainer}>
                <Feather name="database" size={32} color={theme.colors.premium.gold} />
            </View>

            <Text variant="xl" weight="bold" style={styles.coinText}>
                {pkg.coins}
            </Text>
            <Text variant="xs" color={theme.colors.gray[500]} style={styles.label}>
                COINS
            </Text>

            {pkg.bonus ? (
                <View style={styles.bonusBadge}>
                    <Text variant="xs" weight="bold" color={theme.colors.success[600]}>
                        +{pkg.bonus} BONUS
                    </Text>
                </View>
            ) : <View style={styles.bonusSpacing} />}

            <View style={styles.footer}>
                <Text variant="lg" weight="bold" color={theme.colors.primary[600]}>
                    ${(pkg.price / 100).toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '48%',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing[4],
        alignItems: 'center',
        marginBottom: theme.spacing[4],
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        ...theme.shadows.sm,
    },
    popularContainer: {
        borderColor: theme.colors.primary[300],
        borderWidth: 2,
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    iconContainer: {
        marginBottom: 12,
        marginTop: 8,
    },
    coinText: {
        marginBottom: 2,
    },
    label: {
        marginBottom: 8,
    },
    bonusBadge: {
        backgroundColor: theme.colors.success[50],
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 16,
    },
    bonusSpacing: {
        height: 24,
        marginBottom: 16,
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[100],
    },
});
