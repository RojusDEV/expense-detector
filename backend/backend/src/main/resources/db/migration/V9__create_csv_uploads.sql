CREATE TABLE IF NOT EXISTS csv_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users (id),
    file_name VARCHAR,
    bank_source VARCHAR,
    rows_total INTEGER,
    rows_imported INTEGER,
    rows_duplicate INTEGER,
    processing_ms INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);