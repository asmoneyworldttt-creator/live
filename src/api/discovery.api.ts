import { supabase } from './supabase';

export interface NearbyUser {
    user_id: string;
    distance_km: number;
    full_name: string;
    avatar_url: string;
    bio: string;
    compatibility_score?: number;
    interests: string[];
}

export const discoveryApi = {
    getNearbyUsers: async (
        lat: number,
        lng: number,
        radiusKm: number = 10,
        filters?: { gender?: string; minAge?: number; maxAge?: number }
    ): Promise<NearbyUser[]> => {
        const { data, error } = await supabase.rpc('get_nearby_users', {
            lat, lng, radius_km: radiusKm,
            exclude_id: (await supabase.auth.getUser()).data.user?.id,
            limit_count: 50
        });
        if (error) throw error;
        return data;
    },

    updateLocation: async (lat: number, lng: number) => {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        const { error } = await supabase
            .from('users')
            .update({
                location_lat: lat,
                location_lng: lng,
                location_updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        if (error) throw error;
    },

    toggleGhostMode: async (enabled: boolean) => {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        const { error } = await supabase
            .from('users')
            .update({ ghost_mode: enabled })
            .eq('id', userId);
        if (error) throw error;
    }
};
