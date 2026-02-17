import { create } from 'zustand';
import { supabase } from '../api/supabase';

export interface CallSession {
    channelId: string;
    remoteUser: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
    type: 'audio' | 'video';
    startTime?: number;
    token?: string;
}

interface CallState {
    activeCall: CallSession | null;
    isIncoming: boolean;
    isOutgoing: boolean;
    isConnected: boolean;
    duration: number;
    startTime?: number;
    isMuted: boolean;
    isVideoOff: boolean;
    error: string | null;

    // Actions
    initiateCall: (user: any, type: 'audio' | 'video') => Promise<void>;
    receiveCall: (session: CallSession) => void;
    acceptCall: () => Promise<void>;
    rejectCall: () => Promise<void>;
    endCall: () => Promise<void>;
    toggleMute: () => void;
    toggleVideo: () => void;
    updateDuration: (seconds: number) => void;
}

export const useCallStore = create<CallState>((set, get) => ({
    activeCall: null,
    isIncoming: false,
    isOutgoing: false,
    isConnected: false,
    duration: 0,
    startTime: undefined,
    isMuted: false,
    isVideoOff: false,
    error: null,

    initiateCall: async (user, type) => {
        const channelId = `call_${Date.now()}`;
        set({
            isOutgoing: true,
            activeCall: {
                channelId,
                remoteUser: user,
                type,
            },
            error: null
        });

        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            await supabase.from('call_signaling').insert({
                channel_id: channelId,
                caller_id: currentUser?.id,
                receiver_id: user.id,
                call_type: type,
                status: 'ringing',
                created_at: new Date().toISOString()
            });

        } catch (error: any) {
            set({ error: error.message, isOutgoing: false, activeCall: null });
        }
    },

    receiveCall: (session) => {
        set({
            activeCall: session,
            isIncoming: true,
            isConnected: false,
            duration: 0
        });
    },

    acceptCall: async () => {
        const { activeCall } = get();
        if (!activeCall) return;

        try {
            await supabase
                .from('call_signaling')
                .update({ status: 'connected' })
                .eq('channel_id', activeCall.channelId);

            set({
                isIncoming: false,
                isOutgoing: false,
                isConnected: true,
                startTime: Date.now()
            });
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    rejectCall: async () => {
        const { activeCall } = get();
        if (!activeCall) return;

        try {
            await supabase
                .from('call_signaling')
                .update({ status: 'rejected' })
                .eq('channel_id', activeCall.channelId);

            set({
                activeCall: null,
                isIncoming: false,
                isOutgoing: false,
                isConnected: false
            });
        } catch (error: any) {
            console.error('Error rejecting call:', error);
        }
    },

    endCall: async () => {
        const { activeCall } = get();
        if (!activeCall) return;

        try {
            await supabase
                .from('call_signaling')
                .update({ status: 'ended' })
                .eq('channel_id', activeCall.channelId);

            set({
                activeCall: null,
                isIncoming: false,
                isOutgoing: false,
                isConnected: false,
                duration: 0,
                startTime: undefined
            });
        } catch (error: any) {
            console.error('Error ending call:', error);
        }
    },

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    toggleVideo: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
    updateDuration: (seconds) => set({ duration: seconds }),
}));
