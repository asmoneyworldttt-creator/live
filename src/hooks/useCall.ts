import { useEffect, useCallback } from 'react';
import { useCallStore, CallSession } from '../store/callStore';
import { agoraService } from '../services/agora.service';
import { supabase } from '../api/supabase';

export const useCall = () => {
    const {
        activeCall,
        isIncoming,
        isOutgoing,
        isConnected,
        duration,
        isMuted,
        isVideoOff,
        error,
        initiateCall,
        receiveCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        updateDuration,
    } = useCallStore();

    // Subscribe to incoming calls
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const subscription = supabase
                .channel('call_signaling')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'call_signaling',
                        filter: `receiver_id=eq.${user.id}`,
                    },
                    (payload) => {
                        if (payload.new.status === 'ringing') {
                            // In a real app, fetch caller details from users table
                            receiveCall({
                                channelId: payload.new.channel_id,
                                remoteUser: {
                                    id: payload.new.caller_id,
                                    full_name: 'Incoming Call', // Placeholder
                                },
                                type: payload.new.call_type,
                            });
                        }
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'call_signaling',
                        filter: `receiver_id=eq.${user.id}`,
                    },
                    (payload) => {
                        if (payload.new.status === 'ended' || payload.new.status === 'rejected') {
                            endCall();
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        };

        fetchUser();
    }, []);

    // Listen for call status updates as a caller
    useEffect(() => {
        if (!isOutgoing || !activeCall) return;

        const subscription = supabase
            .channel(`call_status_${activeCall.channelId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'call_signaling',
                    filter: `channel_id=eq.${activeCall.channelId}`,
                },
                (payload) => {
                    if (payload.new.status === 'connected') {
                        acceptCall();
                        // join agora
                        agoraService.joinCall(
                            activeCall.channelId,
                            payload.new.token || '',
                            Math.floor(Math.random() * 10000),
                            activeCall.type === 'video'
                        );
                    } else if (payload.new.status === 'rejected') {
                        endCall();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [isOutgoing, activeCall]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected) {
            interval = setInterval(() => {
                updateDuration(duration + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected, duration]);

    const handleAccept = useCallback(async () => {
        if (!activeCall) return;
        await acceptCall();
        // Join Agora
        await agoraService.joinCall(
            activeCall.channelId,
            '', // Token should be fetched
            Math.floor(Math.random() * 10000),
            activeCall.type === 'video'
        );
    }, [activeCall, acceptCall]);

    const handleHangup = useCallback(async () => {
        await agoraService.leaveCall();
        await endCall();
    }, [endCall]);

    const handleToggleMute = useCallback(() => {
        const newMuted = !isMuted;
        toggleMute();
        agoraService.toggleMic(newMuted);
    }, [isMuted, toggleMute]);

    const handleToggleVideo = useCallback(() => {
        const newVideoOff = !isVideoOff;
        toggleVideo();
        agoraService.toggleCamera(newVideoOff);
    }, [isVideoOff, toggleVideo]);

    const handleSwitchCamera = useCallback(() => {
        agoraService.switchCamera();
    }, []);

    return {
        activeCall,
        isIncoming,
        isOutgoing,
        isConnected,
        duration,
        isMuted,
        isVideoOff,
        error,
        startCall: initiateCall,
        acceptCall: handleAccept,
        rejectCall,
        endCall: handleHangup,
        toggleMute: handleToggleMute,
        toggleVideo: handleToggleVideo,
        switchCamera: handleSwitchCamera,
    };
};
