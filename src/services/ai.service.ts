interface CompatibilityResult {
    score: number;           // 0-100
    breakdown: {
        interests: number;
        location: number;
        activity: number;
        personality: number;
    };
    label: string;           // 'Perfect Match', 'Great Match', etc.
}

export const aiService = {
    calculateCompatibility: (
        userA: { interests: string[]; location_lat: number; location_lng: number; last_seen: string },
        userB: { interests: string[]; location_lat: number; location_lng: number; last_seen: string }
    ): CompatibilityResult => {
        // Interest overlap (Jaccard similarity)
        const setA = new Set(userA.interests);
        const setB = new Set(userB.interests);
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        const union = new Set([...setA, ...setB]);
        const interestScore = union.size > 0 ? (intersection.size / union.size) * 100 : 0;

        // Location proximity score
        const distance = haversineDistance(
            userA.location_lat, userA.location_lng,
            userB.location_lat, userB.location_lng
        );
        const locationScore = Math.max(0, 100 - (distance / 0.5));

        // Activity recency score
        const hoursAgo = (Date.now() - new Date(userB.last_seen).getTime()) / 3600000;
        const activityScore = Math.max(0, 100 - (hoursAgo * 2));

        // Weighted composite
        const weights = { interests: 0.5, location: 0.25, activity: 0.15, personality: 0.10 };
        const personalityScore = 60 + Math.random() * 40; // Placeholder for ML model
        const composite = Math.round(
            interestScore * weights.interests +
            locationScore * weights.location +
            activityScore * weights.activity +
            personalityScore * weights.personality
        );

        return {
            score: Math.min(100, composite),
            breakdown: {
                interests: Math.round(interestScore),
                location: Math.round(locationScore),
                activity: Math.round(activityScore),
                personality: Math.round(personalityScore)
            },
            label: composite >= 80 ? '🔥 Perfect Match'
                : composite >= 65 ? '💫 Great Match'
                    : composite >= 50 ? '👍 Good Match'
                        : '💡 Explore'
        };
    }
};

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
