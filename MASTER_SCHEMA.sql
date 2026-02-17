-- ============================================================
-- SOULMATCH MASTER DATABASE SCHEMA (Industrial Grade)
-- Platform: Supabase / PostgreSQL
-- Version: 1.0.0
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('user', 'creator', 'admin');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE call_status AS ENUM ('initiated', 'connected', 'ended', 'missed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'system', 'gift');

-- 3. TABLES

-- USERS TABLE (Core)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'user',
    coin_balance BIGINT DEFAULT 0 CHECK (coin_balance >= 0),
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    age INTEGER,
    bio TEXT,
    interests TEXT[],
    photos TEXT[],
    location JSONB, -- { lat, lng, address }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREATOR PROFILES
CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_calls INTEGER DEFAULT 0,
    total_earnings_coins BIGINT DEFAULT 0,
    call_rate_per_min INTEGER DEFAULT 10,
    is_online BOOLEAN DEFAULT FALSE,
    specialties TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CONVERSATIONS
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_ids UUID[] NOT NULL,
    type TEXT DEFAULT 'direct', -- 'direct' or 'group'
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    type message_type DEFAULT 'text',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WALLETS & TRANSACTIONS
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    balance BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    amount BIGINT NOT NULL, -- positive for credit, negative for debit
    type TEXT NOT NULL, -- 'purchase', 'call_payment', 'gift_sent', 'gift_received', 'withdrawal'
    reference_id UUID, -- ID of call, gift, or withdrawal
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WITHDRAWAL REQUESTS (Treasury Flow)
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL, -- USD amount
    coin_amount BIGINT NOT NULL,
    method TEXT NOT NULL,
    destination TEXT NOT NULL,
    status withdrawal_status DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CALL HISTORY
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caller_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    channel_name TEXT NOT NULL,
    agora_token TEXT,
    type TEXT DEFAULT 'video', -- 'video' or 'audio'
    status call_status DEFAULT 'initiated',
    duration_seconds INTEGER DEFAULT 0,
    cost_coins BIGINT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- LIKES & DISCOVERY
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    liker_id UUID REFERENCES users(id),
    liked_user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'matched', 'passed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(liker_id, liked_user_id)
);

-- AI COMPATIBILITY SCORES
CREATE TABLE compatibility_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a_id UUID REFERENCES users(id),
    user_b_id UUID REFERENCES users(id),
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_a_id, user_b_id)
);

-- REPORTS (Safety Feed)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id),
    reported_user_id UUID REFERENCES users(id),
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RPC FUNCTIONS

-- ATOMIC BALANCE UPDATE
CREATE OR REPLACE FUNCTION adjust_user_balance(uid UUID, amount BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE users SET coin_balance = coin_balance + amount WHERE id = uid;
    -- Also update wallet table for redundancy/consistency if used
    UPDATE wallets SET balance = balance + amount WHERE user_id = uid;
END;
$$ LANGUAGE plpgsql;

-- 5. ROW LEVEL SECURITY (RLS) policies included in rls_update.sql
