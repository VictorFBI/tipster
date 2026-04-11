CREATE INDEX IF NOT EXISTS idx_users_username_lower
    ON users (lower(username))
    WHERE username IS NOT NULL;
