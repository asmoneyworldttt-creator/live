import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-01-28.clover',
});

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
);

// Coin packages
const PACKAGES = {
    'starter': { coins: 100, price: 99 }, // $0.99
    'popular': { coins: 550, price: 499 }, // $4.99
    'value': { coins: 1200, price: 999 }, // $9.99
    'best': { coins: 3000, price: 2499 }, // $24.99
};

/**
 * Create payment intent
 */
router.post('/create-intent', async (req, res) => {
    try {
        const { userId, packageId, amount } = req.body;

        if (!userId || !packageId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const pkg = PACKAGES[packageId as keyof typeof PACKAGES];
        if (!pkg) {
            return res.status(400).json({ error: 'Invalid package' });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: pkg.price, // Amount in cents
            currency: 'usd',
            metadata: {
                userId,
                packageId,
                coins: pkg.coins.toString(),
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Confirm payment and add coins
 */
router.post('/confirm', async (req, res) => {
    try {
        const { userId, paymentIntentId, packageId } = req.body;

        if (!userId || !paymentIntentId || !packageId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'Payment not successful' });
        }

        const pkg = PACKAGES[packageId as keyof typeof PACKAGES];
        if (!pkg) {
            return res.status(400).json({ error: 'Invalid package' });
        }

        // Add coins via RPC
        const { error } = await supabase.rpc('add_coins', {
            user_id: userId,
            amount: pkg.coins,
            description: `Purchased ${pkg.coins} coins for $${(pkg.price / 100).toFixed(2)}`,
        });

        if (error) throw error;

        res.json({ success: true, coins: pkg.coins });
    } catch (error: any) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Process withdrawal request
 */
router.post('/withdraw', async (req, res) => {
    try {
        const { userId, amount, method, accountDetails } = req.body;

        if (!userId || !amount || !method || !accountDetails) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Minimum withdrawal check
        if (amount < 15) {
            return res.status(400).json({ error: 'Minimum withdrawal is $15' });
        }

        // Check user balance
        const { data: profile } = await supabase
            .from('creator_profiles')
            .select('withdrawable_balance')
            .eq('user_id', userId)
            .single();

        if (!profile || profile.withdrawable_balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Create withdrawal request
        const { error } = await supabase
            .from('withdrawal_requests')
            .insert({
                user_id: userId,
                amount_usd: amount,
                method,
                account_details: accountDetails,
                status: 'pending',
            });

        if (error) throw error;

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error processing withdrawal:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Stripe webhook handler
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const { userId, packageId, coins } = paymentIntent.metadata;

                // Add coins to user account
                await supabase.rpc('add_coins', {
                    user_id: userId,
                    amount: parseInt(coins),
                    description: `Payment confirmed: ${packageId}`,
                });

                console.log(`✅ Payment succeeded for user ${userId}: ${coins} coins`);
                break;

            case 'payment_intent.payment_failed':
                console.log('❌ Payment failed:', event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

export default router;
