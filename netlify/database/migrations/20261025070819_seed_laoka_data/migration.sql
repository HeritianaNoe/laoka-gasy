-- Seed data ported from the original Android app (LaokaDatabase onCreate callback)
INSERT INTO "categories" ("id", "name", "photo") VALUES
  (1, 'Henakisoa', '/img/laisoa.png'),
  (2, 'Henomby', '/img/henomby.png'),
  (3, 'Vorona', '/img/vorona.png'),
  (4, 'Akoho', '/img/akoho.png'),
  (5, 'Hazandrano', '/img/hazandrano.png'),
  (6, 'Ondry', '/img/henomby.png'),
  (7, 'Sosisy', '/img/tsaramaso.png'),
  (8, 'Hafa', '/img/ravitoto.png');
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('"categories"', 'id'), (SELECT MAX("id") FROM "categories"));
--> statement-breakpoint
INSERT INTO "fady" ("name") VALUES ('Osy');
--> statement-breakpoint
INSERT INTO "foods" ("name", "description", "photo", "heart", "rating", "category_id") VALUES
  ('Henakisoa ravitoto', 'Ravina mangahazo totoina nandrahoina tamin''ny henakisoa matavy. Laoka malaza indrindra eto Madagasikara, tsara arahina vary fotsy.', '/img/ravitoto.png', true, 5, 1),
  ('Henakisoa laisoa', 'Henakisoa nendasina kely dia nampifangaroina tamin''ny laisoa voatetika. Tsotra, haingana ary matsiro.', '/img/laisoa.png', true, 4, 1),
  ('Henomby ritra', 'Henomby norarahina tsikelikely mandra-paharitry ny ron-katsiny, misy voatabia sy tongolo.', '/img/henomby.png', false, 4, 2),
  ('Vorona ritra', 'Ganagana na vorontsiloza nendasina tamin''ny sakamalao sy tongolo gasy mandra-pahamenany.', '/img/vorona.png', true, 4, 3),
  ('Akoho sy sakamalao', 'Akoho gasy nandrahoina tamin''ny sakamalao, tongolo gasy ary voatabia. Matsiro sy mamerovero.', '/img/akoho.png', false, 3, 4),
  ('Hazandrano endasina', 'Tilapia nendasina manontolo, arahina saosy voatabia sy ravin-kazo maitso.', '/img/hazandrano.png', false, 3, 5),
  ('Tsaramaso sy henakisoa', 'Tsaramaso fotsy nandrahoina tamin''ny henakisoa nifohina sy saosy voatabia.', '/img/tsaramaso.png', true, 5, 1),
  ('Henomby sy ravitoto', 'Henomby kitoza na henomby matavy nampiarahina tamin''ny ravitoto.', '/img/ravitoto.png', false, 2, 2);
