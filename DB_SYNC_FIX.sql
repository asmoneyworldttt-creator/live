-- ============================================================
-- DATABASE ALIGNMENT & FIXES (MASTER SCHEMA SYNC)
-- ============================================================

-- 1. Fix Conversation Column Mismatch
-- The backend and Master Schema use 'participant_ids', but the DB may have 'participants'
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'conversations' AND column_name = 'participants'
    ) THEN
        ALTER TABLE conversations RENAME COLUMN participants TO participant_ids;
    END IF;
END $$;

-- 2. Ensure participant_ids is a UUID array
ALTER TABLE conversations ALTER COLUMN participant_ids TYPE UUID[] USING participant_ids::UUID[];

-- 3. Sync RLS Policies
-- Drop old policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- 4. Re-apply robust RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participant_ids) OR created_by = auth.uid());

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids) OR created_by = auth.uid());

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
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
