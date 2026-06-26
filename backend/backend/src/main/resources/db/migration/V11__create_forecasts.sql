CREATE TABLE IF NOT EXISTS forecasts (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id),
    category_id      INTEGER NOT NULL REFERENCES category(id),
    forecast_month   DATE NOT NULL,
    predicted_amount DECIMAL(12, 2) NOT NULL,
    trend_slope      DECIMAL,
    r_squared        DECIMAL
);