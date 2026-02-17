-- Create call_signaling table
CREATE TABLE IF NOT EXISTS public.call_signaling (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id TEXT NOT NULL,
    caller_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    call_type TEXT NOT NULL CHECK (call_type IN ('audio', 'video')),
    status TEXT NOT NULL DEFAULT 'ringing' CHECK (status IN ('ringing', 'connected', 'rejected', 'ended')),
    token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER TABLE public.call_signaling REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_signaling;

-- RLS Policies
ALTER TABLE public.call_signaling ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see calls they are part of" 
ON public.call_signaling FOR SELECT 
USING (auth.uid() = caller_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert calls" 
ON public.call_signaling FOR INSERT 
WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Users can update their own calls" 
ON public.call_signaling FOR UPDATE 
USING (auth.uid() = caller_id OR auth.uid() = receiver_id);
