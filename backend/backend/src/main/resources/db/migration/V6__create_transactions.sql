CREATE TABLE IF NOT EXISTS transactions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id        INTEGER,
    bank_source      VARCHAR,
    raw_description  VARCHAR,
    raw_recipient    VARCHAR,
    is_expense       BOOLEAN NOT NULL DEFAULT TRUE,
    user_id          UUID NOT NULL REFERENCES users(id),
    merchant_id      UUID REFERENCES merchant(id),
    category_id      INTEGER REFERENCES category(id),
    amount           NUMERIC(12, 2) NOT NULL,
    currency         VARCHAR(3) NOT NULL,
    description      VARCHAR(256),
    transaction_date DATE NOT NULL
);