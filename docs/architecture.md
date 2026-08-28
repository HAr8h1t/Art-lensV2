# ART-LENS V2 Architecture

## Product shape

ART-LENS V2 is a Digital Living Heritage Network. Its main object is not a trip, product, chatbot response, or AR scene. Its main object is the relationship graph between cultural entities.

The platform should connect:

```text
Region -> Tradition -> Creator -> Work -> Source -> Site -> Event -> Workshop -> Support
```

## Current implementation

This milestone is a dependency-free prototype. It proves the V2 information architecture and user flow while introducing a small API foundation.

- `index.html` defines the app shell.
- `src/data/culture-data.js` contains structured cultural demo records.
- `src/app.js` renders relationship-aware views, search, map details, and trust queue.
- `src/styles.css` implements the visual system.
- `backend/server.mjs` serves the app and exposes early JSON API routes.
- `backend/services/search-service.mjs` keeps search grounded in platform entities.
- `backend/services/onboarding-assist-service.mjs` drafts creator metadata suggestions for human review.
- `backend/auth/roles.mjs` centralizes role names and demo authorization checks.
- `schema/art_lens_v2.sql` defines the proposed relational database.

## Target implementation

### Frontend

- React with TypeScript.
- Route groups for explorer, traditions, creators, events, creator dashboard, and admin moderation.
- Shared components for verification badges, source lists, entity cards, map panels, relationship trails, and review queues.

### Backend

- Python API using FastAPI or Flask.
- SQLAlchemy models aligned to the schema.
- Service layer for search, verification workflow, media, and AI assistance.
- Role-based authentication for explorer, creator, and admin users.

The current Node API is a temporary dependency-free foundation. It should be replaced or wrapped by the Python service once the persistent database and deployment target are settled.

### Data

- Relational database as the source of truth.
- Every cultural claim should carry source coverage, submitter metadata, or a verification state.
- Demo records must remain visibly labelled until replaced by real submissions.

### AI

AI must be assistive, not authoritative.

Allowed early uses:

- multilingual query expansion,
- translation,
- creator onboarding metadata suggestions,
- categorization drafts,
- recommendations based on actual platform entities.

AI output should enter a review state before it changes public cultural records.
