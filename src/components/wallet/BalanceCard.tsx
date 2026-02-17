import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Text } from '../common/Text';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface BalanceCardProps {
    balance: number;
    onAddCoins: () => void;
    onWithdraw?: () => void;
    isCreator?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    onAddCoins,
    onWithdraw,
    isCreator = false,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View>
                    <Text variant="sm" weight="medium" color="rgba(255,255,255,0.8)">
                        Your Balance
                    </Text>
                    <View style={styles.balanceRow}>
                        <Feather name="database" size={28} color={theme.colors.premium.gold} />
                        <Text variant="4xl" weight="bold" color={theme.colors.white} style={styles.balanceText}>
                            {balance.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.addButton} onPress={onAddCoins}>
                        <Feather name="plus-circle" size={20} color={theme.colors.white} />
                        <Text weight="bold" color={theme.colors.white} style={styles.actionText}>
                            Add Coins
                        </Text>
                    </TouchableOpacity>

                    {isCreator && onWithdraw && (
                        <TouchableOpacity style={styles.withdrawButton} onPress={onWithdraw}>
                            <Feather name="external-link" size={20} color={theme.colors.primary[100]} />
                            <Text weight="bold" color={theme.colors.primary[100]} style={styles.actionText}>
                                Withdraw
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: theme.colors.primary[600],
        borderRadius: theme.borderRadius['2xl'],
        overflow: 'hidden',
        ...theme.shadows.lg,
    },
    content: {
        padding: theme.spacing[6],
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    balanceText: {
        marginLeft: 12,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 24,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 12,
    },
    withdrawButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    actionText: {
        marginLeft: 8,
    },
});
