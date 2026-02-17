import * as Location from 'expo-location';
import { supabase } from '../api/supabase';

export const locationService = {
    /**
     * Request location permissions
     */
    requestPermissions: async (): Promise<boolean> => {
        try {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

            if (foregroundStatus !== 'granted') {
                console.warn('Location permission denied');
                return false;
            }

            // Request background permission for continuous tracking
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

            if (backgroundStatus !== 'granted') {
                console.warn('Background location permission denied');
                // Still return true as foreground is sufficient for basic functionality
            }

            return true;
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    },

    /**
     * Get current location
     */
    getCurrentLocation: async (): Promise<{ latitude: number; longitude: number } | null> => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            return null;
        }
    },

    /**
     * Update user location in database
     */
    updateUserLocation: async (latitude: number, longitude: number): Promise<boolean> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { error } = await supabase
                .from('users')
                .update({
                    location_lat: latitude,
                    location_lng: longitude,
                    location_updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;

            console.log('✅ Location updated:', { latitude, longitude });
            return true;
        } catch (error) {
            console.error('Error updating location:', error);
            return false;
        }
    },

    /**
     * Start watching location (updates every 5 minutes)
     */
    startLocationTracking: async (): Promise<Location.LocationSubscription | null> => {
        try {
            const hasPermission = await locationService.requestPermissions();
            if (!hasPermission) return null;

            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 5 * 60 * 1000, // 5 minutes
                    distanceInterval: 100, // 100 meters
                },
                async (location) => {
                    await locationService.updateUserLocation(
                        location.coords.latitude,
                        location.coords.longitude
                    );
                }
            );

            console.log('✅ Location tracking started');
            return subscription;
        } catch (error) {
            console.error('Error starting location tracking:', error);
            return null;
        }
    },

    /**
     * Stop location tracking
     */
    stopLocationTracking: (subscription: Location.LocationSubscription | null) => {
        if (subscription) {
            subscription.remove();
            console.log('✅ Location tracking stopped');
        }
    },

    /**
     * Get distance between two points in kilometers
     */
    getDistance: (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },
};
