import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import PhotoUploadScreen from '../screens/onboarding/PhotoUploadScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import SmartMatchScreen from '../screens/explore/SmartMatchScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import CreateGroupScreen from '../screens/chat/CreateGroupScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import WithdrawScreen from '../screens/wallet/WithdrawScreen';
import VideoCallScreen from '../screens/call/VideoCallScreen';
import CallHistoryScreen from '../screens/call/CallHistoryScreen';
import OtherProfileScreen from '../screens/profile/OtherProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import PremiumFeaturesScreen from '../screens/premium/PremiumFeaturesScreen';
import GamesLobbyScreen from '../screens/games/GamesLobbyScreen';
import GamePlayScreen from '../screens/games/GamePlayScreen';

// Hooks & Store
import { useAuth } from '../hooks';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const globalScreenOptions = {
    headerShown: false,
};

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary[500],
                tabBarInactiveTintColor: theme.colors.gray[400],
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.gray[100],
                    height: Platform.OS === 'ios' ? 88 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: any;
                    if (route.name === 'Discovery') iconName = 'heart';
                    else if (route.name === 'Explore') iconName = 'search';
                    else if (route.name === 'Games') iconName = 'play-circle';
                    else if (route.name === 'Chat') iconName = 'message-square';
                    else if (route.name === 'Profile') iconName = 'user';
                    return <Feather name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Discovery" component={HomeScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
            <Tab.Screen name="Games" component={GamesLobbyScreen} />
            <Tab.Screen name="Chat" component={ChatListScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
        </Stack.Navigator>
    );
}

function OnboardingStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
        </Stack.Navigator>
    );
}

import { navigationRef } from './RootNavigation';

export default function AppNavigator() {
    const { session, profile, isLoading } = useAuth();

    // Check if user has completed onboarding
    const isOnboarded = profile && profile.full_name && profile.avatar_url;

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={globalScreenOptions}>
                {!session ? (
                    <Stack.Screen name="Auth" component={AuthStack} />
                ) : !isOnboarded ? (
                    <Stack.Screen name="Onboarding" component={OnboardingStack} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen name="ChatDetail" component={ChatScreen} />
                        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
                        <Stack.Screen name="VideoCall" component={VideoCallScreen} />
                        <Stack.Screen name="CallHistory" component={CallHistoryScreen} />
                        <Stack.Screen name="GamePlay" component={GamePlayScreen} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
                        <Stack.Screen name="Premium" component={PremiumFeaturesScreen} />
                        <Stack.Screen name="Wallet" component={WalletScreen} />
                        <Stack.Screen name="Withdraw" component={WithdrawScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
