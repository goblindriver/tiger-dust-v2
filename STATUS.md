# STATUS
Last updated: 2026-03-22

---

## What is built

### Infrastructure
- Next.js 15 + TypeScript + Prisma + Supabase stack
- Netlify deployment with auto-deploy from GitHub
- DNS configured: tigerdust.party
- Auth middleware protecting all `/app/*` routes
- Real sign-in page (Supabase email/password auth)
- Environment variable strategy documented and working

### Database
- Full Prisma schema — 17 models — live on Supabase
- Initial migrations applied
- Seed data: 26 object types, 18 locations, 27 tags, 8 collections, 3 users
- Dynamic reference data fetched from DB with hardcoded fallback for local/offline dev

### Internal app — Unique Object Workflow
- Object list page with filters (type, status, route, location) and pagination
- Object intake form: creates object + workflow event + location history + tags in one transaction
- Object detail page with edit form for 7 core fields (title, type, status, route, location, price, condition notes)
- Location changes write history (closes open row, opens new row) — not just display changes
- Workflow event logging UI on object detail page
- Tag management UI on object detail page (add/remove tags)

### Public site
- Placeholder pages exist at `/`, `/about`, `/visit` — not real content yet

---

## What is not built yet

### Biggest blockers for public site launch
- **No media upload pipeline** — `media_assets` table exists in schema, no upload UI or storage integration
- **Public pages are placeholders** — Home, About, Visit/Contact have no real content or structured data

### Internal features not yet started
- Merch / inventory workflow (Milestone 3)
- Publishing controls / publish profiles UI (Milestone 4)
- Collections manager UI
- Media desk
- Location browser screen
- Processing board / kanban view
- Research desk
- Sales reconciliation

### Integrations not started
- Square integration
- QR label printing (Brother printer → /object/{id} links)

### Infrastructure gaps
- No media upload to Supabase Storage (or alternative)
- No offsite backup strategy documented or implemented
- Mobile UX not tested or optimized for phone use in lamp lab

### Not yet designed
- ObjectRelation UI (schema has the join table, UI doesn't use it)
- Source/vendor model (where objects come from — repeat acquisition sources)
- Provenance-to-content pipeline (research notes + photos → shareable content)

---

## Known issues

- No missing-data indicators on object list (no image, no price, no route markers)
- Object detail doesn't yet show location history inline
- No pagination on workflow event log

---

## Current priorities

1. **Media upload** — biggest gap before any real public publishing can happen
2. **Mobile UX** — intake and status updates need to work on a phone; test and fix
3. **QR labels** — Brother printer + QR codes linking to /object/{id}; solve "where is everything" during physical rebuild work
4. **Public pages** — replace placeholders with real content and structured data
5. **Offsite backup** — document and implement Supabase DB backup + media backup plan
6. **Merch workflow** — when object catalog is stable enough

---

## Verification (last clean build)

- `npm run typecheck` ✅
- `npm run build` ✅
