CREATE TABLE IF NOT EXISTS anomalies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    anomaly_type    anomaly_type NOT NULL,
    category_id     INTEGER REFERENCES category(id),
    transaction_id  UUID REFERENCES transactions(id),
    month           DATE,
    zscore          DECIMAL,
    expected_amount DECIMAL(12, 2),
    actual_amount   DECIMAL(12, 2),
    explanation     VARCHAR,
    is_dismissed    BOOLEAN NOT NULL DEFAULT FALSE
);