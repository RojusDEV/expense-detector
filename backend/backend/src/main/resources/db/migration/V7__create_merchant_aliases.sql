CREATE TABLE IF NOT EXISTS merchant_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchant(id),
    raw_name VARCHAR(255) NOT NULL,
    similarity_score FLOAT
);