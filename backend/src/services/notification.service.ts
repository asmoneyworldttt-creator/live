import * as admin from 'firebase-admin';
import { supabaseAdmin } from '../config/supabase';

// Initialize Firebase Admin (make sure to set FIREBASE_SERVICE_ACCOUNT in env)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
}

interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
    type: 'message' | 'like' | 'match' | 'call' | 'gift' | 'system';
}

export const notificationService: {
    sendPush: (userId: string, notification: NotificationPayload) => Promise<void>;
    sendBulkPush: (userIds: string[], notification: NotificationPayload) => Promise<void>;
} = {
    sendPush: async (userId: string, notification: NotificationPayload) => {
        // Store in DB
        await supabaseAdmin.from('notifications').insert({
            user_id: userId,
            type: notification.type,
            title: notification.title,
            body: notification.body,
            data: notification.data || {}
        });

        // Get FCM token
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('fcm_token') // Assuming fcm_token column exists (schema might need update if missing)
            .eq('id', userId)
            .single();

        if (!user?.fcm_token) return;

        // Send push via Firebase
        try {
            await admin.messaging().send({
                token: user.fcm_token,
                notification: { title: notification.title, body: notification.body },
                data: { ...notification.data, type: notification.type },
                apns: {
                    payload: { aps: { sound: 'default', badge: 1 } }
                },
                android: {
                    priority: 'high',
                    notification: { sound: 'default', channelId: 'social_app_main' }
                }
            });
        } catch (err) {
            console.error('FCM error:', err);
        }
    },

    // Broadcast to multiple users efficiently
    sendBulkPush: async (userIds: string[], notification: NotificationPayload) => {
        await Promise.allSettled(
            userIds.map(id => notificationService.sendPush(id, notification))
        );
    }
};
