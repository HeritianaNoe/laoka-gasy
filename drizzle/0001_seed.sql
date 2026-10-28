-- Seed data ported from the original Android app
INSERT INTO "categories" ("id", "name", "photo") VALUES
  (1, 'Henakisoa', '/img/laisoa.png'),
  (2, 'Henomby', '/img/henomby.png'),
  (3, 'Vorona', '/img/vorona.png'),
  (4, 'Akoho', '/img/akoho.png'),
  (5, 'Hazandrano', '/img/hazandrano.png'),
  (6, 'Ondry', '/img/henomby.png'),
  (7, 'Sosisy', '/img/tsaramaso.png'),
  (8, 'Hafa', '/img/ravitoto.png')
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('"categories"', 'id'), (SELECT COALESCE(MAX("id"), 1) FROM "categories"));

INSERT INTO "fady" ("name")
SELECT 'Osy' WHERE NOT EXISTS (SELECT 1 FROM "fady" WHERE "name" = 'Osy');

INSERT INTO "foods" ("name", "description", "photo", "heart", "rating", "category_id")
SELECT * FROM (VALUES
  (
    'Henakisoa ravitoto', 
    'Ravina mangahazo totoina nandrahoina tamin''ny henakisoa matavy. Laoka malaza indrindra eto Madagasikara, tsara arahina vary fotsy.', 
    '/img/ravitoto.png', 
    true, 5, 1,
    'Ravi-mangahazo voatoto na Ravitoto, Henakisoa (somary matavy), Menaka kely, Tongolo gasy, Rano kely, Sira (izay tiana), Siramamy kely',
    '1. Tetehina ny henakisoa rehefa avy nodiovina tsara ary andrahoina amin’ny rano, atao ritra tsara (tsy misy rano mihitsy).\n2. Kikisana na totoina ny tongolo gasy, arotsaka rehefa ritra tsara ilay henakisoa. Asiana menaka kely fotsiny 3 sotro fihinana, ary atao malefaka tena malefaka ny afo mba hidiran''ny tsiro tongolo gasy any anaty henakisoa mandritra 20 minitra eo ho eo.\n3. Raha efa vonona ny ravitoto dia arotsaka ao anaty henakisoa efa mivoaka menaka iny dia asiana sira sahaza sy siramamy kely ary asiana rano kely dia atao mahery ny afo.\n4. Rehefa hita fa efa kelikely sisa ny rano dia atao malefaka indray ny afo mba tsy ho may dia avela ho ritra tsara amin''izay.',
    'Ny siramamy dia manome tsiro tsara kokoa no manampy amin''ny fandevonan-kanina.'
  ),
  (
    'Henakisoa laisoa', 
    'Henakisoa nendasina kely dia nampifangaroina tamin''ny laisoa voatetika. Tsotra, haingana ary matsiro.', 
    '/img/laisoa.png', 
    true, 4, 1,
    'Laisoa, Henakisoa (somary matavy), Menaka kely, Tongolo gasy, Sira (izay tiana), Siramamy kely',
    '1. Tetehina ny henakisoa rehefa avy nodiovina tsara ary andrahoina amin’ny rano, atao ritra tsara (tsy misy rano mihitsy).\n2. Kikisana na totoina ny tongolo gasy, arotsaka rehefa ritra tsara ilay henakisoa. Asiana menaka kely fotsiny 3 sotro fihinana, ary atao malefaka tena malefaka ny afo mba hidiran''ny tsiro tongolo gasy any anaty henakisoa mandritra 20 minitra eo ho eo.\n3. Raha voatetika ny laisoa dia arotsaka ao anaty henakisoa dia asiana sira sahaza sy siramamy kely ary asiana rano kely.\n4. Rehefa hita fa efa kelikely sisa ny rano dia atao malefaka indray ny afo mba tsy ho may dia avela ho ritra tsara amin''izay.',
    'Ny siramamy dia manome tsiro tsara kokoa no manampy amin''ny fandevonan-kanina.'
  ),
  (
    'Henomby ritra', 
    'Henomby norarahina tsikelikely mandra-paharitry ny ron-katsiny, misy voatabia sy tongolo.', 
    '/img/henomby.png', 
    false, 4, 2,
    'Henomby (somary matavy), Menaka kely, Tongolo gasy, Sira (izay tiana), Sakamalao',
    '1. Tetehina ny henomby rehefa avy nodiovina tsara ary andrahoina amin’ny rano, atao ritra tsara (tsy misy rano mihitsy).\n2. Totoina miaraka ny tongolo gasy sy sakamalao, arotsaka rehefa ritra tsara ilay henomby dia asiana sira.\n3. Asiana menaka kely fotsiny, ary atao malefaka tena malefaka ny afo mba hidiran''ny tsiro tongolo gasy sy sakamalao any anaty henomby mandrapa masaka azy.',
    'Tsara raha misy lasary voatabia miaraka aminy.'
  ),
  ('Vorona ritra', 'Ganagana na vorontsiloza nendasina tamin''ny sakamalao sy tongolo gasy mandra-pahamenany.', '/img/vorona.png', true, 4, 3),
  ('Akoho sy sakamalao', 'Akoho gasy nandrahoina tamin''ny sakamalao, tongolo gasy ary voatabia. Matsiro sy mamerovero.', '/img/akoho.png', false, 3, 4),
  ('Hazandrano endasina', 'Tilapia nendasina manontolo, arahina saosy voatabia sy ravin-kazo maitso.', '/img/hazandrano.png', false, 3, 5),
  ('Tsaramaso sy henakisoa', 'Tsaramaso fotsy nandrahoina tamin''ny henakisoa nifohina sy saosy voatabia.', '/img/tsaramaso.png', true, 5, 1),
  ('Henomby sy ravitoto', 'Henomby kitoza na henomby matavy nampiarahina tamin''ny ravitoto.', '/img/ravitoto.png', false, 2, 2)
) AS v(name, description, photo, heart, rating, category_id)
WHERE NOT EXISTS (SELECT 1 FROM "foods" LIMIT 1);
