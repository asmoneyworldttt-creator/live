import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { notificationService } from '../services/notification.service';
import AgoraToken from 'agora-access-token';

export const callsController = {
    initiateCall: async (req: Request, res: Response) => {
        const { calleeId, callType } = req.body;
        const callerId = (req as any).user.id;

        // Validate caller has sufficient coins
        const [callerData, creatorData] = await Promise.all([
            supabaseAdmin.from('users').select('coin_balance').eq('id', callerId).single(),
            supabaseAdmin.from('creator_profiles')
                .select('audio_call_rate, video_call_rate, is_live')
                .eq('user_id', calleeId).single()
        ]);

        const rate = callType === 'video'
            ? creatorData.data!.video_call_rate
            : creatorData.data!.audio_call_rate;

        // Pre-authorize minimum 1 minute
        if (callerData.data!.coin_balance < rate) {
            return res.status(402).json({ error: 'Insufficient coins', required: rate });
        }

        // Generate Agora token
        const channelName = `call_${Date.now()}_${callerId.slice(0, 8)}`;
        const token = AgoraToken.RtcTokenBuilder.buildTokenWithUid(
            process.env.AGORA_APP_ID!,
            process.env.AGORA_APP_CERT!,
            channelName, 0,
            AgoraToken.RtcRole.PUBLISHER,
            Math.floor(Date.now() / 1000) + 3600
        );

        // Create call record
        const { data: call } = await supabaseAdmin.from('calls').insert({
            caller_id: callerId,
            callee_id: calleeId,
            call_type: callType,
            status: 'initiated',
            agora_channel: channelName,
            rate_per_minute: rate
        }).select().single();

        // Notify callee
        await notificationService.sendPush(calleeId, {
            title: '📞 Incoming Call',
            body: `Someone is calling you!`,
            data: { callId: call.id, channelName, token, callType },
            type: 'call'
        });

        // Realtime broadcast via Supabase
        await supabaseAdmin.channel(`user:${calleeId}`).send({
            type: 'broadcast',
            event: 'incoming_call',
            payload: { callId: call.id, callerId, channelName, token, callType, rate }
        });

        res.json({ callId: call.id, channelName, token });
    },

    endCall: async (req: Request, res: Response) => {
        const { callId } = req.body;
        const now = new Date();

        const { data: call } = await supabaseAdmin
            .from('calls')
            .update({ status: 'ended', ended_at: now.toISOString() })
            .eq('id', callId)
            .select()
            .single();

        if (!call?.started_at) return res.json({ success: true });

        const durationSecs = Math.floor(
            (now.getTime() - new Date(call.started_at).getTime()) / 1000
        );
        const durationMins = Math.ceil(durationSecs / 60);
        const coinsCharged = durationMins * call.rate_per_minute;

        // Deduct from caller
        await supabaseAdmin.rpc('deduct_coins', {
            p_user_id: call.caller_id,
            p_amount: coinsCharged,
            p_description: `${call.call_type} call - ${durationMins} min`
        });

        // Credit creator (80% split)
        const creatorEarnings = Math.floor(coinsCharged * 0.8);
        await supabaseAdmin.rpc('increment_pending_withdrawal', {
            p_user_id: call.callee_id,
            p_amount: creatorEarnings
        });

        await supabaseAdmin.from('calls').update({
            duration_seconds: durationSecs,
            coins_charged: coinsCharged
        }).eq('id', callId);

        res.json({ success: true, coinsCharged, durationSecs });
    },

    getCallHistory: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { data, error } = await supabaseAdmin
                .from('calls')
                .select(`
                    *,
                    caller:users!caller_id(full_name, avatar_url),
                    callee:users!callee_id(full_name, avatar_url)
                `)
                .or(`caller_id.eq.${userId},callee_id.eq.${userId}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    getCallAnalytics: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;

            // Get total stats
            const { data, error } = await supabaseAdmin
                .from('calls')
                .select('duration_seconds, coins_charged, call_type')
                .eq('callee_id', userId)
                .eq('status', 'ended');

            if (error) throw error;

            const analytics = {
                total_calls: data.length,
                total_minutes: Math.ceil(data.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0) / 60),
                total_earned: data.reduce((acc, curr) => acc + (curr.coins_charged || 0), 0) * 0.8,
                video_vs_audio: data.reduce((acc: any, curr) => {
                    acc[curr.call_type] = (acc[curr.call_type] || 0) + 1;
                    return acc;
                }, { video: 0, audio: 0 })
            };

            res.status(200).json(analytics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};
