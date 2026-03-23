# Tiger Dust v2 MVP Build Checklist
Last updated: 2026-03-22

## Purpose

This document turns the Tiger Dust v2 planning stack into a practical implementation checklist.

It is designed to answer:
- what gets built first
- what depends on what
- what the MVP actually includes
- what can wait until later
- what "done enough to use" looks like at each stage

This is not a perfect waterfall plan.
It is a pragmatic build order.

---

# 1. MVP Definition

## MVP outcome

The MVP is successful if Tiger Dust has:

### Public side
- a working public website that is useful and on-brand
- clear visit/contact/location information
- a curated public gallery/featured layer
- optional public merch visibility if needed early

### Internal side
- a usable internal catalog for unique objects
- basic merch/inventory support
- media attachment and primary image selection
- practical location tracking
- route/disposition tracking
- public visibility controls

### Not required for MVP
- fully mature Square automation
- advanced workflow dashboards
- deep research system
- full digital twin/archive features
- elaborate AI features
- enterprise-grade inventory complexity

---

# 2. Build Stages Overview

1. Foundation setup ✅ DONE
2. Database and auth ✅ DONE
3. Reference data + seed data ✅ DONE
4. Unique-object core CRUD ✅ DONE (media pending)
5. Merch/inventory core CRUD — NOT STARTED
6. Media handling — NOT STARTED (biggest current blocker)
7. Publishing controls — NOT STARTED
8. Public website rebuild — PLACEHOLDER ONLY
9. Basic sales / Square prep — NOT STARTED
10. QA + real-world pilot usage — NOT STARTED

---

# 3. Stage 1 — Foundation Setup ✅ DONE

## Goal
Establish project, stack, repo structure, and base environment.

## Checklist
- [x] Create Tiger Dust v2 app/repo structure
- [x] Choose framework/runtime approach (Next.js 15 + TypeScript)
- [x] Set up package manager, linting, formatting
- [x] Configure environment variable strategy
- [x] Configure deployment target (Netlify — auto-deploy from GitHub)
- [x] Set up database project (Supabase + Prisma)
- [x] Set up auth/storage provider (Supabase auth)
- [x] Add baseline README and project notes

## Done means
- app runs locally ✅
- deploy target is known ✅ (tigerdust.party via Netlify)
- env setup is documented ✅
- data/storage/auth choices are no longer vague ✅

---

# 4. Stage 2 — Database and Auth ✅ DONE

## Goal
Get the base persistence and internal access working.

## Checklist
- [x] Translate schema draft into Prisma schema (17 models)
- [x] Create initial migrations
- [x] Implement user/auth model
- [x] Add internal role support (admin/editor/operator/viewer)
- [x] Set up DB access layer (Prisma client)
- [x] Confirm timestamps/defaults/indexes on key tables
- [x] Seed baseline admin user(s)

## Core tables
- [x] users
- [x] objects
- [x] object_types
- [x] tags
- [x] object_tags
- [x] locations
- [x] object_location_history
- [x] workflow_events
- [x] media_assets (schema only — upload pipeline not yet built)
- [x] publish_profiles
- [x] inventory_items
- [x] inventory_variants

## Done means
- authenticated internal user can log in ✅
- database is real, migrated, and seeded enough to use ✅

---

# 5. Stage 3 — Reference Data + Seed Data ✅ DONE

## Goal
Make the system usable with real controlled values.

## Checklist
- [x] Seed object types (26 seeded)
- [x] Seed lifecycle status values / app constants
- [x] Seed route/disposition values / app constants
- [x] Seed visibility/public price modes / app constants
- [x] Seed initial locations and parent-child hierarchy (18 seeded)
- [x] Seed starter tags (27 seeded)
- [x] Seed starter collections (8 seeded)
- [x] Add admin UI or seed scripts for updating these later (dynamic reference data from DB with fallback)

## Done means
- new records can be created without inventing data structures on the fly ✅
- locations/types/routes feel grounded in real Tiger Dust workflow ✅

---

# 6. Stage 4 — Unique-Object Core CRUD ✅ MOSTLY DONE

## Goal
Create the internal backbone for one-of-a-kind objects.

## Screens
- Intake Queue ✅
- Object List ✅
- Object Detail ✅

## Checklist
- [x] Create object creation flow (intake form — object + workflow event + location history + tags in one transaction)
- [x] Support lightweight intake record creation
- [x] Edit title/type/notes/price/disposition/status (7 core fields)
- [x] Assign tags (add/remove tags on detail page)
- [x] Assign current location
- [x] Write location move events/history (closes open row, opens new row)
- [x] Write workflow events/history (log UI on detail page)
- [x] Add search/filter for objects (type, status, route, location, pagination)
- [ ] Add missing-data indicators (no image, no route) — filters exist but no inline warning on records
- [ ] Source/vendor tracking on intake (see Stage 4 additions below)
- [ ] QR label printing (see Stage 4 additions below)

## Stage 4 additions (new since original spec)

### Source / vendor model
Track where objects come from. Especially useful for repeat acquisition sources (estate sales, vendors, consigners).
- [ ] Add `sources` table: name, source_type (estate-sale / vendor / found / personal / gift / other), optional contact
- [ ] Link `objects.source_id` to sources
- [ ] Add source picker to intake form

### QR label system
Brother label printer + QR codes linking to `/app/objects/{slug}`.
Solves "where is everything" during post-Milton compound rebuild and active sorting sessions.
- [ ] Add QR code generation for object records (use slug/ID as URL target)
- [ ] Add print-label button on object detail page
- [ ] Ensure `/app/objects/{slug}` resolves correctly as QR target
- [ ] Test label format on Brother printer

### ObjectRelation — design now, build later
`object_relations` join table is in the schema. UI should surface it when useful.
Relationship types: `component_of`, `derived_from`, `paired_with`, `part_of_set`.
- [ ] Design the UI pattern for displaying related objects on detail page (post-media milestone)

## Done means
- Jason/Laura/Sarah can create and update object records without friction ✅
- system is already useful even before public site integration ✅

---

# 7. Stage 5 — Merch / Inventory Core CRUD — NOT STARTED

## Goal
Support early merch demand, especially for out-of-town interest.

## Screens
- Inventory / Merch List
- Inventory / Merch Detail

## Checklist
- [ ] Create inventory item records
- [ ] Support optional linking to object/design record where useful
- [ ] Add variant support (size/color/version)
- [ ] Add quantity tracking
- [ ] Add pricing fields
- [ ] Add SKU fields where helpful
- [ ] Add stock status indicators (in stock / low / out)
- [ ] Add image support for merch

## Done means
- merch does not have to be hacked into the object system
- stock and variants are understandable enough for real use

---

# 8. Stage 6 — Media Handling — NOT STARTED (HIGHEST PRIORITY)

## Goal
Make images first-class and usable for both internal and public workflows.
This is the biggest current blocker for public site and QR label usefulness.

## Checklist
- [ ] Implement media upload pipeline (Supabase Storage or equivalent)
- [ ] Store metadata in `media_assets`
- [ ] Support assigning primary image for objects
- [ ] Support assigning primary image for merch items
- [ ] Support image ordering
- [ ] Add captions / alt text fields
- [ ] Build lightweight Media Desk or media panel
- [ ] Ensure public-safe derivative handling if needed

## Offsite backup (do alongside media setup)
Non-negotiable after Hurricane Milton. Document and implement before the media library grows.
- [ ] Enable Supabase daily database backup (verify it is on and configure retention)
- [ ] Document media library backup strategy (periodic export or second storage bucket)
- [ ] Add backup plan to project README

## Done means
- objects and merch can be visually represented well
- website can rely on structured media instead of ad hoc assets
- media library is protected against data loss

---

# 9. Stage 7 — Publishing Controls — NOT STARTED

## Goal
Separate internal truth from public presentation.

## Screens
- Publishing Manager
- lightweight Collections Manager (optional in MVP)

## Checklist
- [ ] Implement `publish_profiles`
- [ ] Toggle public/private state per object
- [ ] Support featured-home and featured-gallery flags
- [ ] Support public title/excerpt/description overrides
- [ ] Support public price mode
- [ ] Add optional collection assignment
- [ ] Ensure unpublished objects cannot leak publicly

## Done means
- public site can be curated intentionally
- website placement is no longer mixed up with disposition/workflow

---

# 10. Stage 8 — Public Website Rebuild — PLACEHOLDER ONLY

## Goal
Rebuild the current useful site on top of the structured system without losing practicality.

## Public pages
- Home
- About
- Visit / Contact
- Gallery / Featured Objects
- optional Public Object Detail
- optional Merch Page / Shop Overview

## Checklist
- [ ] Rebuild homepage with stronger visual hierarchy
- [ ] Preserve practical visit/useful info
- [ ] Add curated gallery/featured object view
- [ ] Connect public pages to publishable data
- [ ] Add responsive/mobile-friendly behavior
- [ ] Integrate updated imagery/brand assets
- [ ] Preserve maps/contact/social pathways
- [ ] Improve metadata / SEO basics

## Done means
- site is useful on day one
- site looks stronger than current static version
- public output comes from structured content, not hardcoded duplication

---

# 11. Stage 9 — Basic Sales / Square Prep — NOT STARTED

## Goal
Get enough sales structure in place to avoid drift, without overbuilding automation too early.

## Checklist
- [ ] Finalize Square integration boundaries
- [ ] Store Square IDs for objects/merch where needed
- [ ] Support manual sale recording
- [ ] Mark unique objects sold
- [ ] Adjust merch stock manually or semi-automatically
- [ ] Add basic reconciliation view or report
- [ ] Decide webhook/import strategy for next phase

## Done means
- sold state and stock do not drift immediately
- future Square integration has a clear landing zone

---

# 12. Stage 10 — QA + Pilot Usage — NOT STARTED

## Goal
Test against real usage, not imagined workflows.

## Checklist
- [ ] Enter real sample objects
- [ ] Enter real sample merch records
- [ ] Upload real media
- [ ] Move real objects through locations
- [ ] Test route/disposition workflow
- [ ] Test publish/unpublish flow
- [ ] Test public site with real content
- [ ] Test on mobile devices (especially intake from phone in lamp lab)
- [ ] Identify friction in data entry
- [ ] Trim anything no one will actually maintain

## Mobile-first pass
Intake and status updates need to work on a phone in the lamp lab.
- [ ] Test intake form on mobile
- [ ] Test object detail edit on mobile
- [ ] Test workflow event logging on mobile
- [ ] Fix any obvious mobile UX problems before pilot

## Provenance-to-content pipeline (post-pilot, plan now)
The system's unique value over off-the-shelf tools: research notes + acquisition story + photography → shareable Instagram story cards.
Document the intended flow now; build when media and research desk are in place.
- [ ] Define what a "story-ready" object record looks like (fields, media, research notes)
- [ ] Sketch the export/share format (image card with provenance text)
- [ ] Build content export tool when research desk exists

## Done means
- the system survives contact with reality
- the MVP is genuinely usable, not merely technically complete

---

# 13. MVP Release Criteria

## Internal release criteria
- [x] Can create and find object records quickly
- [ ] Can create and manage merch records/variants
- [ ] Can attach media reliably
- [x] Can track location and disposition
- [ ] Can toggle public visibility intentionally

## Public release criteria
- [ ] Home/About/Visit pages work well on mobile
- [ ] Gallery or featured objects are populated
- [ ] Branding and photography are strong enough not to feel placeholder
- [ ] Contact/maps/hours are obvious and accurate

## Operational release criteria
- [x] At least one real object workflow has been tested end-to-end (partial — no media yet)
- [ ] At least one merch workflow has been tested end-to-end
- [ ] At least one public publishing workflow has been tested end-to-end

---

# 14. Things That Can Wait Until After MVP

- deep research desk workflows
- elaborate collections tooling
- full Square automation
- heavy reporting dashboards
- AI enrichment/tagging
- digital twin/archive expansion
- advanced permissions complexity
- exhaustive public browsing/search
- ObjectRelation UI (designed in Stage 4, build post-media)
- provenance-to-content pipeline (plan now, build after research desk exists)

These should wait unless real use proves they are immediately necessary.

---

# 15. Immediate Next Build Artifacts

Current build priority order:

1. **Media upload pipeline** (Stage 6) — nothing public works without this
2. **QR label system** (Stage 4 addition) — high operational value now
3. **Mobile UX pass** (Stage 10) — needed before real pilot use
4. **Offsite backup** (Stage 6 addition) — must do alongside media setup
5. **Public pages** (Stage 8) — after media and publishing controls
6. **Merch workflow** (Stage 5) — when object catalog is stable
