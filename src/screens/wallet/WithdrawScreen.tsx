import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Loader, Card } from '../../components/common';
import { theme } from '../../theme';
import { useWallet } from '../../hooks';
import { Feather } from '@expo/vector-icons';

const METHODS = [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', desc: 'Secure bank deposit' },
    { id: 'paypal', name: 'PayPal', icon: '💳', desc: 'Instant digital wallet' },
    { id: 'usdt_crypto', name: 'USDT (Crypto)', icon: '₿', desc: 'Fast global crypto' },
];

export default function WithdrawScreen({ navigation }: any) {
    const { withdrawableBalance, withdraw, isLoading } = useWallet();
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [details, setDetails] = useState('');

    const handleWithdraw = async () => {
        const amt = parseFloat(amount);

        if (!amt || amt < 15) {
            Alert.alert('Invalid Amount', 'Minimum withdrawal is $15.00');
            return;
        }

        if (amt > withdrawableBalance) {
            Alert.alert('Insufficient Balance', 'You don\'t have enough withdrawable balance.');
            return;
        }

        if (!selectedMethod) {
            Alert.alert('Selection Required', 'Please choose a withdrawal method.');
            return;
        }

        if (!details.trim()) {
            Alert.alert('Missing Info', 'Please provide your payment account details.');
            return;
        }

        try {
            await withdraw(amt, selectedMethod, details);
            Alert.alert(
                'Success',
                'Withdrawal request submitted! It will be processed within 3-5 business days.',
                [{ text: 'Great', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert('Request Failed', error.message || 'Something went wrong');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="chevron-left" size={28} color={theme.colors.gray[900]} />
                    </TouchableOpacity>
                    <Text variant="xl" weight="bold">Withdraw Earnings</Text>
                    <View style={{ width: 44 }} />
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Minimal Balance Info */}
                <View style={styles.balanceSummary}>
                    <Text color={theme.colors.gray[500]} weight="medium">Withdrawable Balance</Text>
                    <Text variant="4xl" weight="bold" color={theme.colors.gray[900]}>
                        ${withdrawableBalance.toFixed(2)}
                    </Text>
                </View>

                {/* Amount Input Section */}
                <View style={styles.section}>
                    <Text variant="lg" weight="bold" style={styles.sectionTitle}>Enter Amount</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.dollarSign}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                            placeholderTextColor={theme.colors.gray[300]}
                        />
                    </View>
                    <View style={styles.chipsRow}>
                        {[15, 50, 100, 500].map(val => (
                            <TouchableOpacity
                                key={val}
                                style={styles.chip}
                                onPress={() => setAmount(val.toString())}
                            >
                                <Text variant="sm" weight="semibold" color={theme.colors.primary[600]}>${val}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.chip, styles.chipAll]}
                            onPress={() => setAmount(withdrawableBalance.toFixed(2))}
                        >
                            <Text variant="sm" weight="bold" color={theme.colors.white}>MAX</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Method Selection */}
                <View style={styles.section}>
                    <Text variant="lg" weight="bold" style={styles.sectionTitle}>Withdrawal Method</Text>
                    {METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.methodCard,
                                selectedMethod === method.id && styles.methodCardSelected
                            ]}
                            onPress={() => setSelectedMethod(method.id)}
                        >
                            <View style={styles.methodLeft}>
                                <View style={styles.methodIconBox}>
                                    <Text style={styles.methodIconText}>{method.icon}</Text>
                                </View>
                                <View>
                                    <Text weight="bold" style={styles.methodName}>{method.name}</Text>
                                    <Text variant="xs" color={theme.colors.gray[500]}>{method.desc}</Text>
                                </View>
                            </View>
                            <View style={[
                                styles.radio,
                                selectedMethod === method.id && styles.radioActive
                            ]}>
                                {selectedMethod === method.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Account Details */}
                {selectedMethod && (
                    <View style={styles.section}>
                        <Text variant="lg" weight="bold" style={styles.sectionTitle}>Account Details</Text>
                        <TextInput
                            style={styles.detailsInput}
                            placeholder={getPlaceholder(selectedMethod)}
                            multiline
                            numberOfLines={4}
                            value={details}
                            onChangeText={setDetails}
                            placeholderTextColor={theme.colors.gray[400]}
                        />
                        <Text variant="xs" color={theme.colors.gray[400]} style={styles.infoNote}>
                            * Ensure the details are accurate to avoid delays.
                        </Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={isLoading ? "Processing..." : "Withdraw Funds"}
                    onPress={handleWithdraw}
                    loading={isLoading}
                    disabled={isLoading || !amount || !selectedMethod || !details}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

function getPlaceholder(method: string): string {
    switch (method) {
        case 'bank_transfer':
            return 'Account Name:\nBank Name:\nAccount Number:\nIFSC/SWIFT Code:';
        case 'paypal':
            return 'PayPal Email Address:';
        case 'usdt_crypto':
            return 'USDT (TRC-20) Wallet Address:';
        default:
            return 'Enter your account details here...';
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        backgroundColor: theme.colors.white,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[4],
        height: 56,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: theme.spacing[6],
    },
    balanceSummary: {
        alignItems: 'center',
        marginVertical: theme.spacing[8],
    },
    section: {
        marginBottom: theme.spacing[6],
    },
    sectionTitle: {
        marginBottom: theme.spacing[3],
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary[500],
        paddingBottom: 8,
    },
    dollarSign: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.gray[900],
        marginRight: 8,
    },
    amountInput: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.gray[900],
        flex: 1,
    },
    chipsRow: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 8,
    },
    chip: {
        backgroundColor: theme.colors.primary[50], // Very faint primary
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.primary[100],
    },
    chipAll: {
        backgroundColor: theme.colors.gray[900],
        borderColor: theme.colors.gray[900],
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing[4],
        backgroundColor: theme.colors.gray[50],
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    methodCardSelected: {
        borderColor: theme.colors.primary[500],
        backgroundColor: theme.colors.primary[50] + '30', // Very faint primary
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        ...theme.shadows.sm,
    },
    methodIconText: {
        fontSize: 24,
    },
    methodName: {
        fontSize: 16,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: theme.colors.gray[300],
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioActive: {
        borderColor: theme.colors.primary[500],
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.primary[500],
    },
    detailsInput: {
        backgroundColor: theme.colors.gray[50],
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        color: theme.colors.gray[900],
        minHeight: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: theme.colors.gray[100],
    },
    infoNote: {
        marginTop: 8,
    },
    footer: {
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[4],
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray[100],
    },
});
