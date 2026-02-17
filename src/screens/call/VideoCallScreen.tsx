import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Loader, Button } from '../../components/common';
import { theme } from '../../theme';
import { useCall, useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { formatDuration } from '../../utils/dateUtils';
import { RtcSurfaceView } from 'react-native-agora';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoCallScreen({ route, navigation }: any) {
    const {
        activeCall,
        isConnected,
        isOutgoing,
        isIncoming,
        duration,
        isMuted,
        isVideoOff,
        endCall,
        toggleMute,
        toggleVideo,
        switchCamera,
        acceptCall,
        rejectCall
    } = useCall();

    const { profile } = useAuth();
    const [localUid] = useState(Math.floor(Math.random() * 10000));

    // Handle call ending automatically if store state clears
    useEffect(() => {
        if (!activeCall && !isIncoming && !isOutgoing) {
            navigation.goBack();
        }
    }, [activeCall, isIncoming, isOutgoing]);

    const handleEndCall = () => {
        endCall();
        navigation.goBack();
    };

    if (isIncoming && !isConnected) {
        return (
            <View style={styles.incomingContainer}>
                <Image
                    source={{ uri: activeCall?.remoteUser.avatar_url || 'https://via.placeholder.com/500' }}
                    style={StyleSheet.absoluteFill}
                    blurRadius={50}
                />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />

                <SafeAreaView style={styles.incomingContent}>
                    <View style={styles.incomingUserInfo}>
                        <Avatar
                            source={activeCall?.remoteUser.avatar_url}
                            name={activeCall?.remoteUser.full_name || 'User'}
                            size={120}
                        />
                        <Text variant="3xl" weight="bold" color={theme.colors.white} style={styles.incomingName}>
                            {activeCall?.remoteUser.full_name}
                        </Text>
                        <Text variant="lg" color="rgba(255,255,255,0.7)">
                            Incoming {activeCall?.type} call...
                        </Text>
                    </View>

                    <View style={styles.incomingActions}>
                        <TouchableOpacity
                            onPress={rejectCall}
                            style={[styles.callActionBtn, styles.declineBtn]}
                        >
                            <Feather name="x" size={32} color={theme.colors.white} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={acceptCall}
                            style={[styles.callActionBtn, styles.acceptBtn]}
                        >
                            <Feather name="phone" size={32} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (isOutgoing && !isConnected) {
        return (
            <View style={styles.outgoingContainer}>
                <Image
                    source={{ uri: activeCall?.remoteUser.avatar_url || 'https://via.placeholder.com/500' }}
                    style={StyleSheet.absoluteFill}
                    blurRadius={50}
                />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />

                <SafeAreaView style={styles.outgoingContent}>
                    <View style={styles.outgoingUserInfo}>
                        <Avatar
                            source={activeCall?.remoteUser.avatar_url}
                            name={activeCall?.remoteUser.full_name || 'User'}
                            size={100}
                        />
                        <Text variant="2xl" weight="bold" color={theme.colors.white} style={styles.outgoingName}>
                            {activeCall?.remoteUser.full_name}
                        </Text>
                        <Text variant="base" color="rgba(255,255,255,0.6)">Calling...</Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleEndCall}
                        style={[styles.callActionBtn, styles.declineBtn, styles.endOutgoingBtn]}
                    >
                        <Feather name="phone-off" size={28} color={theme.colors.white} />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Remote Video */}
            <View style={styles.remoteVideoContainer}>
                {activeCall?.type === 'video' ? (
                    <RtcSurfaceView
                        canvas={{ uid: 0 }} // 0 uses the remote video automatically in many Agora setups
                        style={styles.remoteVideo}
                    />
                ) : (
                    <View style={styles.audioCallOverlay}>
                        <Avatar
                            source={activeCall?.remoteUser.avatar_url}
                            name={activeCall?.remoteUser.full_name || 'User'}
                            size={150}
                        />
                        <Text variant="2xl" weight="bold" color={theme.colors.white} style={styles.audioName}>
                            {activeCall?.remoteUser.full_name}
                        </Text>
                        <Text variant="lg" color={theme.colors.gray[400]}>Audio Call</Text>
                        <Text variant="xl" weight="medium" color={theme.colors.primary[400]} style={styles.timer}>
                            {formatDuration(duration)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Local Video (PiP) */}
            {activeCall?.type === 'video' && !isVideoOff && (
                <View style={styles.localVideoContainer}>
                    <RtcSurfaceView
                        canvas={{ uid: localUid }}
                        style={styles.localVideo}
                    />
                </View>
            )}

            {/* Video Controls Header */}
            {activeCall?.type === 'video' && (
                <SafeAreaView style={styles.videoHeader}>
                    <View style={styles.videoInfo}>
                        <Text weight="bold" color={theme.colors.white}>{activeCall.remoteUser.full_name}</Text>
                        <Text variant="xs" color="rgba(255,255,255,0.7)">{formatDuration(duration)}</Text>
                    </View>
                    <TouchableOpacity onPress={switchCamera} style={styles.headerIcon}>
                        <Feather name="refresh-ccw" size={20} color={theme.colors.white} />
                    </TouchableOpacity>
                </SafeAreaView>
            )}

            {/* Bottom Controls */}
            <SafeAreaView style={styles.controls} edges={['bottom']}>
                <TouchableOpacity
                    onPress={toggleMute}
                    style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                >
                    <Feather name={isMuted ? "mic-off" : "mic"} size={24} color={isMuted ? theme.colors.white : theme.colors.gray[800]} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleEndCall}
                    style={[styles.controlBtn, styles.endCallBtn]}
                >
                    <Feather name="phone-off" size={28} color={theme.colors.white} />
                </TouchableOpacity>

                {activeCall?.type === 'video' ? (
                    <TouchableOpacity
                        onPress={toggleVideo}
                        style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
                    >
                        <Feather name={isVideoOff ? "video-off" : "video"} size={24} color={isVideoOff ? theme.colors.white : theme.colors.gray[800]} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.controlBtn}>
                        <Feather name="volume-2" size={24} color={theme.colors.gray[800]} />
                    </TouchableOpacity>
                )}
            </SafeAreaView>

            {/* Coin Balance Warning (Mock) */}
            {profile?.is_creator === false && (
                <View style={styles.balanceContainer}>
                    <Feather name="database" size={14} color={theme.colors.warning[400]} />
                    <Text variant="xs" color={theme.colors.white} style={styles.balanceText}>
                        15 coins/min • {profile.coin_balance} available
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    incomingContainer: {
        flex: 1,
    },
    incomingContent: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
    },
    incomingUserInfo: {
        alignItems: 'center',
        marginTop: 40,
    },
    incomingName: {
        marginTop: 20,
        marginBottom: 10,
    },
    incomingActions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        paddingHorizontal: 40,
    },
    callActionBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    declineBtn: {
        backgroundColor: theme.colors.error[500],
    },
    acceptBtn: {
        backgroundColor: theme.colors.success[500],
    },
    outgoingContainer: {
        flex: 1,
    },
    outgoingContent: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 100,
    },
    outgoingUserInfo: {
        alignItems: 'center',
    },
    outgoingName: {
        marginTop: 20,
        marginBottom: 8,
    },
    endOutgoingBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    remoteVideoContainer: {
        flex: 1,
    },
    remoteVideo: {
        flex: 1,
    },
    localVideoContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 120,
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: '#222',
        zIndex: 10,
    },
    localVideo: {
        flex: 1,
    },
    audioCallOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
    },
    audioName: {
        marginTop: 24,
        marginBottom: 4,
    },
    timer: {
        marginTop: 40,
    },
    videoHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        zIndex: 5,
    },
    videoInfo: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 20,
    },
    controlBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    controlBtnActive: {
        backgroundColor: theme.colors.error[500],
    },
    endCallBtn: {
        backgroundColor: theme.colors.error[500],
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    balanceContainer: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    balanceText: {
        marginLeft: 6,
    },
});
