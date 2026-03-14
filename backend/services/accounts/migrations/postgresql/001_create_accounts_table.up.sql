CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE,

    first_name VARCHAR(255),
    last_name VARCHAR(255),
    bio VARCHAR(255),
    avatar_url VARCHAR(255),
    wallet_address VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
