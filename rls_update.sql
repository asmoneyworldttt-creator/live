-- ============================================================
-- GLOBAL SECURITY ENHANCEMENTS (PHASE 4)
-- ============================================================

-- 1. MESSAGES SECURITY
-- Users can only see messages in conversations they are part of
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participant_ids) OR created_by = auth.uid());

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids) OR created_by = auth.uid());

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Messages view" ON messages;
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (auth.uid() = ANY(participant_ids))
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (auth.uid() = ANY(participant_ids))
    )
  );

-- 2. WALLET SECURITY
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own wallet" ON wallets FOR SELECT USING (user_id = auth.uid());

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());

-- 3. GAME SECURITY
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their game sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = ANY(participant_ids));

-- 4. RECOMMENDATION SECURITY
ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own recommendations" ON compatibility_scores FOR SELECT USING (user_a_id = auth.uid());

-- 5. SOCIAL SECURITY
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own likes" ON likes FOR SELECT USING (liker_id = auth.uid() OR liked_user_id = auth.uid());
CREATE POLICY "Users can like" ON likes FOR INSERT WITH CHECK (liker_id = auth.uid());

-- 6. MEDIA SECURITY
ALTER TABLE user_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view media" ON user_media FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own media" ON user_media FOR ALL USING (user_id = auth.uid());

-- 7. CALLS SECURITY
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own calls" ON call_history FOR SELECT USING (caller_id = auth.uid() OR receiver_id = auth.uid());
