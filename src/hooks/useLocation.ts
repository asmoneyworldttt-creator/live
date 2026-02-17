import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    city?: string;
    country?: string;
}

/**
 * Hook for geolocation
 */
export const useLocation = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    // Request permission
    const requestPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setHasPermission(status === 'granted');
            return status === 'granted';
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    };

    // Get current location
    const getCurrentLocation = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const hasPermission = await requestPermission();
            if (!hasPermission) {
                throw new Error('Location permission denied');
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const locationData: LocationData = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy || undefined,
            };

            // Reverse geocode to get city/country
            try {
                const [address] = await Location.reverseGeocodeAsync({
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                });

                if (address) {
                    locationData.city = address.city || undefined;
                    locationData.country = address.country || undefined;
                }
            } catch (geocodeError) {
                console.warn('Geocoding failed:', geocodeError);
            }

            setLocation(locationData);
            return locationData;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate distance between two points (in meters)
    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    // Get distance from current location
    const getDistanceFrom = (lat: number, lon: number): number | null => {
        if (!location) return null;
        return calculateDistance(location.latitude, location.longitude, lat, lon);
    };

    return {
        location,
        isLoading,
        error,
        hasPermission,
        requestPermission,
        getCurrentLocation,
        calculateDistance,
        getDistanceFrom,
    };
};
