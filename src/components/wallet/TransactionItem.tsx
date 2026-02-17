import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { theme } from '../../theme';
import { Transaction } from '../../store/walletStore';
import { formatDateTime } from '../../utils/dateUtils';
import { Feather } from '@expo/vector-icons';

export interface TransactionItemProps {
    transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    const isPositive = ['purchase', 'earning'].includes(transaction.type);

    const getIcon = () => {
        switch (transaction.type) {
            case 'purchase': return 'plus-circle';
            case 'deduction': return 'minus-circle';
            case 'earning': return 'trending-up';
            case 'withdrawal': return 'external-link';
            default: return 'database';
        }
    };

    const getColor = () => {
        if (transaction.type === 'purchase' || transaction.type === 'earning') return theme.colors.success[500];
        if (transaction.type === 'withdrawal') return theme.colors.primary[500];
        return theme.colors.error[500];
    };

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: getColor() + '10' }]}>
                <Feather name={getIcon()} size={20} color={getColor()} />
            </View>

            <View style={styles.content}>
                <Text weight="semibold" style={styles.description}>
                    {transaction.description}
                </Text>
                <Text variant="xs" color={theme.colors.gray[500]}>
                    {formatDateTime(transaction.created_at)}
                </Text>
            </View>

            <View style={styles.amountContainer}>
                <Text
                    variant="lg"
                    weight="bold"
                    color={getColor()}
                >
                    {isPositive ? '+' : '-'}{Math.abs(transaction.amount)}
                </Text>
                <Text variant="xs" color={theme.colors.gray[400]}>coins</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray[100],
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginLeft: theme.spacing[4],
    },
    description: {
        marginBottom: 2,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
});
