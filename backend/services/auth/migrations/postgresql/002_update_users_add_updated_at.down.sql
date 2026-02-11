DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_users_updated_at();
ALTER TABLE users DROP COLUMN updated_at;
