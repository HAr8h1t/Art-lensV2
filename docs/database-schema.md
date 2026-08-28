# Recommended Database Schema

The schema is centered on relationships and provenance.

Core entities:

- users and roles
- states, regions, and cities
- traditions
- creators
- artworks / cultural works
- cultural sites
- events
- workshops
- media
- sources
- verification records
- saved items
- contact / support requests

Important many-to-many relationships:

- creators to traditions
- artworks to traditions
- events to traditions
- workshops to traditions
- traditions to regions
- traditions to cultural sites
- creators to events
- creators to workshops
- entities to sources

Verification states:

- `unverified`
- `community_submitted`
- `source_backed`
- `verified`
- `institution_verified`

See `schema/art_lens_v2.sql` for the first full SQL draft.

