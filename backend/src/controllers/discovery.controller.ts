import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../middleware/error.middleware';

export const discoveryController = {
    // GET /discovery/feed
    getFeed: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const { gender, minAge, maxAge, maxDistance } = req.query;

            // Simple mock logic for feed: find users not swiped on yet
            const { data: nopedUsers } = await supabaseAdmin.from('nopes').select('noped_user_id').eq('user_id', userId);
            const { data: likedUsers } = await supabaseAdmin.from('likes').select('liked_user_id').eq('liker_id', userId);

            const excludedIds = [
                userId,
                ...(nopedUsers?.map(n => n.noped_user_id) || []),
                ...(likedUsers?.map(l => l.liked_user_id) || [])
            ];

            let query = supabaseAdmin
                .from('users')
                .select('*, user_media(*)')
                .not('id', 'in', `(${excludedIds.join(',')})`)
                .eq('ghost_mode', false);

            if (gender) query = query.eq('gender', gender);

            const { data, error } = await query.limit(20);

            if (error) throw new AppError(error.message, 400);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /discovery/like
    likeUser: async (req: AuthRequest, res: Response) => {
        try {
            const { liked_user_id } = req.body;
            const userId = req.user?.id;

            const { error: likeError } = await supabaseAdmin
                .from('likes')
                .insert({ liker_id: userId, liked_user_id });

            if (likeError) throw new AppError(likeError.message, 400);

            // Check for match
            const { data: mutualLike } = await supabaseAdmin
                .from('likes')
                .select('*')
                .eq('liker_id', liked_user_id)
                .eq('liked_user_id', userId)
                .single();

            if (mutualLike) {
                // Create match
                const { data: match, error: matchError } = await supabaseAdmin
                    .from('matches')
                    .insert({ user1_id: userId, user2_id: liked_user_id })
                    .select()
                    .single();

                if (matchError) throw matchError;
                return res.status(201).json({ is_match: true, match });
            }

            res.status(201).json({ is_match: false });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // POST /discovery/nope
    nopeUser: async (req: AuthRequest, res: Response) => {
        try {
            const { noped_user_id } = req.body;
            const { error } = await supabaseAdmin
                .from('nopes')
                .insert({ user_id: req.user?.id, noped_user_id });

            if (error) throw new AppError(error.message, 400);
            res.status(201).json({ message: 'User noped' });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    // GET /discovery/matches
    getMatches: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const { data, error } = await supabaseAdmin
                .from('matches')
                .select(`
                    *,
                    user1:users!user1_id(*),
                    user2:users!user2_id(*)
                `)
                .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

            if (error) throw new AppError(error.message, 400);

            const matches = data.map((m: any) => ({
                id: m.id,
                created_at: m.created_at,
                other_user: m.user1_id === userId ? m.user2 : m.user1
            }));

            res.status(200).json(matches);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};
