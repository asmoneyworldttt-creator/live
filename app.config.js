export default {
    // Mobile - iOS
    ios: {
        bundleIdentifier: "com.socialapp.live",
        buildNumber: "1.0.0",
        supportsTablet: true,
        infoPlist: {
            NSCameraUsageDescription: "Allow camera access for video calls.",
            NSMicrophoneUsageDescription: "Allow microphone access for audio calls.",
            NSPhotoLibraryUsageDescription: "Select photos to share in chat.",
        }
    },
    // Mobile - Android
    android: {
        package: "com.socialapp.live",
        versionCode: 1,
        permissions: [
            "CAMERA",
            "RECORD_AUDIO",
            "READ_EXTERNAL_STORAGE",
            "WRITE_EXTERNAL_STORAGE",
            "ACCESS_FINE_LOCATION"
        ]
    },
    // Web (PWA)
    web: {
        favicon: "./assets/favicon.png",
        name: "Social Live",
        shortName: "SocialLive",
        themeColor: "#7c3aed",
        backgroundColor: "#ffffff",
        display: "standalone",
        scope: "/",
        startUrl: "/",
        description: "Premium Social Discovery & Video Chat App"
    }
};
