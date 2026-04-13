CREATE TABLE post_images (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    sort_index SMALLINT NOT NULL CHECK (sort_index >= 0 AND sort_index <= 9),
    object_key TEXT NOT NULL,
    PRIMARY KEY (post_id, sort_index)
);

CREATE TABLE comment_images (
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    sort_index SMALLINT NOT NULL CHECK (sort_index >= 0 AND sort_index <= 9),
    object_key TEXT NOT NULL,
    PRIMARY KEY (comment_id, sort_index)
);
