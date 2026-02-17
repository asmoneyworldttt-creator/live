import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../api/supabase';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    /**
     * Request notification permissions
     */
    requestPermissions: async (): Promise<boolean> => {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('Notification permission denied');
                return false;
            }

            // Get push token
            const token = await notificationService.getPushToken();
            if (token) {
                await notificationService.savePushToken(token);
            }

            return true;
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    },

    /**
     * Get Expo push token
     */
    getPushToken: async (): Promise<string | null> => {
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#7c3aed',
                });
            }

            const { data: token } = await Notifications.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
            });

            console.log('✅ Push token:', token);
            return token;
        } catch (error) {
            console.error('Error getting push token:', error);
            return null;
        }
    },

    /**
     * Save push token to database
     */
    savePushToken: async (token: string): Promise<boolean> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { error } = await supabase
                .from('users')
                .update({ push_token: token })
                .eq('id', user.id);

            if (error) throw error;

            console.log('✅ Push token saved to database');
            return true;
        } catch (error) {
            console.error('Error saving push token:', error);
            return false;
        }
    },

    /**
     * Send local notification
     */
    sendLocalNotification: async (title: string, body: string, data?: any) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                    sound: true,
                },
                trigger: null, // Show immediately
            });
        } catch (error) {
            console.error('Error sending local notification:', error);
        }
    },

    /**
     * Add notification listener
     */
    addNotificationListener: (callback: (notification: Notifications.Notification) => void) => {
        return Notifications.addNotificationReceivedListener(callback);
    },

    /**
     * Add notification response listener (when user taps notification)
     */
    addNotificationResponseListener: (
        callback: (response: Notifications.NotificationResponse) => void
    ) => {
        return Notifications.addNotificationResponseReceivedListener(callback);
    },

    /**
     * Remove all listeners (handled by removing subscriptions individually)
     */
    removeAllListeners: () => {
        // Listeners should be removed by calling .remove() on the subscription
        console.log('Remove notification listeners by calling subscription.remove()');
    },

    /**
     * Get badge count
     */
    getBadgeCount: async (): Promise<number> => {
        return await Notifications.getBadgeCountAsync();
    },

    /**
     * Set badge count
     */
    setBadgeCount: async (count: number) => {
        await Notifications.setBadgeCountAsync(count);
    },

    /**
     * Clear all notifications
     */
    clearAllNotifications: async () => {
        await Notifications.dismissAllNotificationsAsync();
    },
};
