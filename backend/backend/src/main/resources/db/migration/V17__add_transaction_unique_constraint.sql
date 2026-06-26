ALTER TABLE transactions
    ADD CONSTRAINT uq_transaction UNIQUE (user_id, transaction_date, amount, raw_description);