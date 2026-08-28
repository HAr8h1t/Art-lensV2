# ART-LENS V2

ART-LENS V2 is a prototype for a Digital Living Heritage Network: a discovery layer that connects creators, works, traditions, regions, cultural sites, events, workshops, sources, and verification status.

The first implementation is intentionally dependency-free so it can run immediately from this repository while the full production stack is being built.

## Run locally

Run:

```bash
npm start
```

Then visit `http://localhost:4173`.

The same server exposes early API endpoints under `/api`.

## Check locally

```bash
npm test
```

## Current milestone

- One polished vertical slice for Gujarat / Kutch.
- Structured demo data for traditions, creators, artworks, sites, events, workshops, sources, and verification.
- Explorer homepage, cultural map, tradition/creator detail panels, relationship graph, structured search, creator dashboard preview, and admin trust queue preview.
- Demo creators are clearly labelled as demo data.
- Cultural claims are connected to sources and verification states.
- Dependency-free API foundation for entities, search, admin review queue, and review-only AI onboarding suggestions.

## Development workflow

For every meaningful completed change:

1. Inspect Git status.
2. Make the logical change.
3. Run relevant checks.
4. Review the diff.
5. Commit with a conventional message.
6. Push to the configured GitHub remote when one exists.

This repository currently needs a GitHub remote before pushes can work:

```bash
git remote add origin <github-repo-url>
```
