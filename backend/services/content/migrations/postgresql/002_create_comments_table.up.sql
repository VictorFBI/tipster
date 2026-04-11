CREATE TABLE comments (
    id UUID PRIMARY KEY,

    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,

    content VARCHAR(4096) NOT NULL,

    parent_id UUID REFERENCES comments(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);