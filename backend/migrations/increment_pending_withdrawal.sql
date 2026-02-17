-- Create RPC function to increment pending withdrawal
CREATE OR REPLACE FUNCTION increment_pending_withdrawal(
    p_user_id UUID,
    p_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE creator_profiles
    SET pending_withdrawal = pending_withdrawal + p_amount
    WHERE user_id = p_user_id;
END;
$$;
