DO $$
DECLARE
mid uuid;
BEGIN

    -- MAXIMA
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Maxima', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'maxima', mid, 1.0),
                                                                               (gen_random_uuid(), 'maxima xxx', mid, 1.0),
                                                                               (gen_random_uuid(), 'maxima x', mid, 1.0),
                                                                               (gen_random_uuid(), 'maxima xx', mid, 1.0),
                                                                               (gen_random_uuid(), 'barbora', mid, 1.0);   -- Maxima's delivery brand

-- IKI
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Iki', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'iki', mid, 1.0),
                                                                               (gen_random_uuid(), 'iki express', mid, 1.0);

-- LIDL
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Lidl', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'lidl', mid, 1.0);

-- NORFA
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Norfa', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'norfa', mid, 1.0),
                                                                               (gen_random_uuid(), 'norfa xl', mid, 1.0),
                                                                               (gen_random_uuid(), 'norfos mazmena', mid, 1.0);

-- RIMI
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Rimi', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'rimi', mid, 1.0),
                                                                               (gen_random_uuid(), 'rimi hyper', mid, 1.0),
                                                                               (gen_random_uuid(), 'rimi express', mid, 1.0);

-- AIBE
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Aibe', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'aibe', mid, 1.0);

-- CIA MARKET
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Cia Market', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'cia market', mid, 1.0),
                                                                               (gen_random_uuid(), 'cia', mid, 1.0);

-- ===== FUEL =====
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Circle K', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'circle k', mid, 1.0),
                                                                               (gen_random_uuid(), 'circlek', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Orlen', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'orlen', mid, 1.0),
                                                                               (gen_random_uuid(), 'orlen lietuva', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Neste', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'neste', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Viada', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'viada', mid, 1.0);

-- ===== PHARMACY =====
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Eurovaistine', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'eurovaistine', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Benu', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'benu', mid, 1.0),
                                                                               (gen_random_uuid(), 'benu vaistine', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Gintarine Vaistine', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'gintarine vaistine', mid, 1.0),
                                                                               (gen_random_uuid(), 'gintarine', mid, 1.0);

-- ===== TELECOM =====
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Telia', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'telia', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Bite', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'bite', mid, 1.0),
                                                                               (gen_random_uuid(), 'bite lietuva', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Tele2', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'tele2', mid, 1.0);

-- ===== TRANSPORT / OTHER =====
INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Bolt', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'bolt', mid, 1.0),
                                                                               (gen_random_uuid(), 'bolt food', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Wolt', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
    (gen_random_uuid(), 'wolt', mid, 1.0);

INSERT INTO merchant (id, name, user_id, category_id)
VALUES (gen_random_uuid(), 'Senukai', NULL, NULL) RETURNING id INTO mid;
INSERT INTO merchant_aliases (id, raw_name, merchant_id, similarity_score) VALUES
                                                                               (gen_random_uuid(), 'senukai', mid, 1.0),
                                                                               (gen_random_uuid(), 'kesko senukai', mid, 1.0);

END $$;