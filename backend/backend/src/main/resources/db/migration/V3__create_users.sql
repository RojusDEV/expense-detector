CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(50) NOT NULL,
    email         VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    default_bank  VARCHAR,
    role_id       INTEGER NOT NULL REFERENCES roles(id),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
    );