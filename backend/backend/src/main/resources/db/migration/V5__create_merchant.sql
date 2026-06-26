CREATE TABLE IF NOT EXISTS merchant (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR NOT NULL,
    user_id     UUID REFERENCES users(id),
    category_id INTEGER REFERENCES category(id)
);
