CREATE TABLE IF NOT EXISTS subscriptions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_date      TIMESTAMP NOT NULL,
    name           VARCHAR(255) NOT NULL,
    amount         NUMERIC(10, 2) NOT NULL,
    merchant_id    UUID REFERENCES merchant(id),
    frequency_days INTEGER NOT NULL,
    confidence     DECIMAL(3, 2),
    is_active      BOOLEAN NOT NULL DEFAULT TRUE
);