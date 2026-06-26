DO $$
DECLARE
constraint_name text;
BEGIN
SELECT conname INTO constraint_name
FROM pg_constraint
WHERE conrelid = 'merchant_aliases'::regclass
      AND contype = 'f';

EXECUTE format('ALTER TABLE merchant_aliases DROP CONSTRAINT %I', constraint_name);
END $$;

ALTER TABLE merchant_aliases
    ADD CONSTRAINT merchant_aliases_merchant_id_fkey
        FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE;