-- Create user_invites table for managing user invitations
-- This is separate from the brokers table which stores case handler information

CREATE TABLE IF NOT EXISTS user_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    invite_code VARCHAR(32) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    auth_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID  -- Reference to the admin who created the invite
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_invites_email ON user_invites(email);
CREATE INDEX IF NOT EXISTS idx_user_invites_code ON user_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_user_invites_expires ON user_invites(expires_at);

-- Add comments
COMMENT ON TABLE user_invites IS 'User invitation codes for new user registration';
COMMENT ON COLUMN user_invites.email IS 'Email address the invite is for';
COMMENT ON COLUMN user_invites.name IS 'Display name for the user';
COMMENT ON COLUMN user_invites.invite_code IS 'One-time invite code';
COMMENT ON COLUMN user_invites.expires_at IS 'When the invite expires';
COMMENT ON COLUMN user_invites.used_at IS 'When the invite was used (null if unused)';
COMMENT ON COLUMN user_invites.auth_user_id IS 'Supabase Auth user ID after registration';
