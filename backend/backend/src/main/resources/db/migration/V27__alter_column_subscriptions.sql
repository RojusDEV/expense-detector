DO $$
DECLARE
constraint_name text;
BEGIN
SELECT conname INTO constraint_name
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
      AND contype = 'f'
      AND conname LIKE '%merchant%';

EXECUTE format('ALTER TABLE subscriptions DROP CONSTRAINT %I', constraint_name);
END $$;

ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_merchant_id_fkey
        FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE;