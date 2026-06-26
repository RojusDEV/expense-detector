CREATE TABLE IF NOT EXISTS category_keywords (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES category(id),
    keyword VARCHAR(255)
);