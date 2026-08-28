CREATE TABLE roles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  user_id INTEGER NOT NULL REFERENCES users(id),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE states (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE regions (
  id INTEGER PRIMARY KEY,
  state_id INTEGER NOT NULL REFERENCES states(id),
  name TEXT NOT NULL,
  summary TEXT,
  latitude REAL,
  longitude REAL
);

CREATE TABLE cities (
  id INTEGER PRIMARY KEY,
  region_id INTEGER NOT NULL REFERENCES regions(id),
  name TEXT NOT NULL,
  latitude REAL,
  longitude REAL
);

CREATE TABLE traditions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  origin_text TEXT,
  category TEXT,
  introduction TEXT,
  cultural_significance TEXT,
  practice_description TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  is_demo_data INTEGER NOT NULL DEFAULT 0,
  submitted_by_user_id INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creators (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  region_id INTEGER REFERENCES regions(id),
  name TEXT NOT NULL,
  practitioner_type TEXT,
  biography TEXT,
  cultural_story TEXT,
  contact_summary TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  is_demo_data INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artworks (
  id INTEGER PRIMARY KEY,
  creator_id INTEGER REFERENCES creators(id),
  region_id INTEGER REFERENCES regions(id),
  title TEXT NOT NULL,
  description TEXT,
  materials TEXT,
  support_available INTEGER NOT NULL DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  is_demo_data INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cultural_sites (
  id INTEGER PRIMARY KEY,
  region_id INTEGER REFERENCES regions(id),
  name TEXT NOT NULL,
  site_type TEXT,
  description TEXT,
  latitude REAL,
  longitude REAL,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  region_id INTEGER REFERENCES regions(id),
  cultural_site_id INTEGER REFERENCES cultural_sites(id),
  title TEXT NOT NULL,
  event_type TEXT,
  starts_at TEXT,
  ends_at TEXT,
  location_text TEXT,
  description TEXT,
  registration_contact TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  is_demo_data INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workshops (
  id INTEGER PRIMARY KEY,
  creator_id INTEGER REFERENCES creators(id),
  region_id INTEGER REFERENCES regions(id),
  cultural_site_id INTEGER REFERENCES cultural_sites(id),
  title TEXT NOT NULL,
  starts_at TEXT,
  location_text TEXT,
  description TEXT,
  registration_contact TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  is_demo_data INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
  id INTEGER PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  media_type TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  attribution TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  publisher TEXT,
  url TEXT NOT NULL,
  source_type TEXT,
  accessed_at TEXT
);

CREATE TABLE entity_sources (
  id INTEGER PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  claim_summary TEXT
);

CREATE TABLE verification_records (
  id INTEGER PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  reviewer_user_id INTEGER REFERENCES users(id),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creator_traditions (
  creator_id INTEGER NOT NULL REFERENCES creators(id),
  tradition_id INTEGER NOT NULL REFERENCES traditions(id),
  PRIMARY KEY (creator_id, tradition_id)
);

CREATE TABLE artwork_traditions (
  artwork_id INTEGER NOT NULL REFERENCES artworks(id),
  tradition_id INTEGER NOT NULL REFERENCES traditions(id),
  PRIMARY KEY (artwork_id, tradition_id)
);

CREATE TABLE event_traditions (
  event_id INTEGER NOT NULL REFERENCES events(id),
  tradition_id INTEGER NOT NULL REFERENCES traditions(id),
  PRIMARY KEY (event_id, tradition_id)
);

CREATE TABLE workshop_traditions (
  workshop_id INTEGER NOT NULL REFERENCES workshops(id),
  tradition_id INTEGER NOT NULL REFERENCES traditions(id),
  PRIMARY KEY (workshop_id, tradition_id)
);

CREATE TABLE tradition_regions (
  tradition_id INTEGER NOT NULL REFERENCES traditions(id),
  region_id INTEGER NOT NULL REFERENCES regions(id),
  relationship_type TEXT NOT NULL DEFAULT 'associated',
  PRIMARY KEY (tradition_id, region_id)
);

CREATE TABLE tradition_sites (
  tradition_id INTEGER NOT NULL REFERENCES traditions(id),
  cultural_site_id INTEGER NOT NULL REFERENCES cultural_sites(id),
  PRIMARY KEY (tradition_id, cultural_site_id)
);

CREATE TABLE creator_events (
  creator_id INTEGER NOT NULL REFERENCES creators(id),
  event_id INTEGER NOT NULL REFERENCES events(id),
  participation_role TEXT,
  PRIMARY KEY (creator_id, event_id)
);

CREATE TABLE creator_workshops (
  creator_id INTEGER NOT NULL REFERENCES creators(id),
  workshop_id INTEGER NOT NULL REFERENCES workshops(id),
  PRIMARY KEY (creator_id, workshop_id)
);

CREATE TABLE saved_items (
  user_id INTEGER NOT NULL REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, entity_type, entity_id)
);

CREATE TABLE contact_requests (
  id INTEGER PRIMARY KEY,
  requester_user_id INTEGER REFERENCES users(id),
  creator_id INTEGER NOT NULL REFERENCES creators(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  request_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
