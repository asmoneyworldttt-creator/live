import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Loader, Card } from '../../components/common';
import { theme } from '../../theme';
import { usePremium } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PremiumFeaturesScreen({ navigation }: any) {
    const { plans, isPremium, subscription, buyPremium, isLoading, loadPremium } = usePremium();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    useEffect(() => {
        loadPremium();
    }, []);

    useEffect(() => {
        if (plans.length > 0 && !selectedPlanId) {
            const popular = plans.find(p => p.is_popular);
            setSelectedPlanId(popular ? popular.id : plans[0].id);
        }
    }, [plans]);

    const handleSubscribe = async () => {
        if (!selectedPlanId) return;

        try {
            await buyPremium(selectedPlanId);
            Alert.alert(
                'Welcome to Gold!',
                'Your premium subscription is now active. Enjoy all the benefits!',
                [{ text: 'Start Swiping', onPress: () => navigation.navigate('Main', { screen: 'Discovery' }) }]
            );
        } catch (error: any) {
            Alert.alert('Subscription Failed', error.message);
        }
    };

    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.primary[600], theme.colors.primary[400]]}
                style={styles.backgroundGradient}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="x" size={28} color={theme.colors.white} />
                    </TouchableOpacity>
                    <Text variant="xl" weight="bold" color={theme.colors.white}>SoulMatch Gold</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Hero Section */}
                    <View style={styles.hero}>
                        <View style={styles.goldBadge}>
                            <Feather name="award" size={40} color={theme.colors.warning[500]} />
                        </View>
                        <Text variant="4xl" weight="bold" color={theme.colors.white} style={styles.heroTitle}>
                            Upgrade to Gold
                        </Text>
                        <Text variant="lg" color="rgba(255,255,255,0.8)" style={styles.heroSubtitle}>
                            Get exclusive features and 10x more matches!
                        </Text>
                    </View>

                    {/* Features List */}
                    <View style={styles.featuresContainer}>
                        {selectedPlan?.features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={styles.checkCircle}>
                                    <Feather name="check" size={14} color={theme.colors.primary[500]} />
                                </View>
                                <Text color={theme.colors.white} weight="medium" style={styles.featureText}>
                                    {feature}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Plans Selector */}
                    <View style={styles.plansRow}>
                        {plans.map((plan) => (
                            <TouchableOpacity
                                key={plan.id}
                                style={[
                                    styles.planCard,
                                    selectedPlanId === plan.id && styles.planCardActive
                                ]}
                                onPress={() => setSelectedPlanId(plan.id)}
                            >
                                {plan.is_popular && (
                                    <View style={styles.popularBadge}>
                                        <Text variant="xs" weight="bold" color={theme.colors.white}>POPULAR</Text>
                                    </View>
                                )}
                                <Text
                                    weight="bold"
                                    color={selectedPlanId === plan.id ? theme.colors.primary[600] : theme.colors.gray[600]}
                                >
                                    {plan.name}
                                </Text>
                                <View style={styles.priceRow}>
                                    <Text variant="2xl" weight="bold" color={theme.colors.gray[900]}>
                                        ${plan.price}
                                    </Text>
                                    <Text variant="xs" color={theme.colors.gray[400]}>
                                        /{plan.interval === 'monthly' ? 'mo' : 'yr'}
                                    </Text>
                                </View>
                                {plan.interval === 'yearly' && (
                                    <View style={styles.saveTag}>
                                        <Text variant="xs" weight="bold" color={theme.colors.success[600]}>SAVE 50%</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Action Button */}
                    <View style={styles.actionContainer}>
                        {isPremium ? (
                            <View style={styles.subscribedInfo}>
                                <Feather name="check-circle" size={20} color={theme.colors.success[500]} />
                                <Text weight="bold" color={theme.colors.white} style={styles.subscribedText}>
                                    You are currently a Gold Member
                                </Text>
                                <Text variant="sm" color="rgba(255,255,255,0.6)">
                                    Valid until {new Date(subscription?.expires_at).toLocaleDateString()}
                                </Text>
                            </View>
                        ) : (
                            <Button
                                title={isLoading ? "Processing..." : `Get SoulMatch Gold`}
                                onPress={handleSubscribe}
                                loading={isLoading}
                                style={styles.subscribeBtn}
                                textStyle={styles.subscribeBtnText}
                            />
                        )}
                        <Text variant="xs" color="rgba(255,255,255,0.5)" style={styles.legalNote}>
                            Subscription will auto-renew until cancelled. See terms for details.
                        </Text>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary[600],
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
    },
    header: {
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
    hero: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    goldBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    heroTitle: {
        textAlign: 'center',
        marginBottom: 8,
    },
    heroSubtitle: {
        textAlign: 'center',
    },
    featuresContainer: {
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureText: {
        fontSize: 16,
    },
    plansRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        gap: 12,
    },
    planCard: {
        flex: 1,
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...theme.shadows.md,
    },
    planCardActive: {
        borderColor: theme.colors.warning[400],
        backgroundColor: '#fffbeb', // Faint yellow/gold
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginVertical: 4,
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        backgroundColor: theme.colors.warning[500],
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    saveTag: {
        marginTop: 4,
        backgroundColor: theme.colors.success[50],
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    actionContainer: {
        alignItems: 'center',
    },
    subscribeBtn: {
        width: '100%',
        backgroundColor: theme.colors.white,
        height: 60,
        borderRadius: 30,
    },
    subscribeBtnText: {
        color: theme.colors.primary[600],
        fontSize: 18,
        fontWeight: 'bold',
    },
    subscribedInfo: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 20,
        width: '100%',
    },
    subscribedText: {
        marginVertical: 4,
        fontSize: 16,
    },
    legalNote: {
        marginTop: 20,
        textAlign: 'center',
    }
});
