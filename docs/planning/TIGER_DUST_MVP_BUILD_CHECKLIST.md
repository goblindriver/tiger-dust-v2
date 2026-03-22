# Tiger Dust v2 MVP Build Checklist

## Purpose

This document turns the Tiger Dust v2 planning stack into a practical implementation checklist.

It is designed to answer:
- what gets built first
- what depends on what
- what the MVP actually includes
- what can wait until later
- what “done enough to use” looks like at each stage

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

1. Foundation setup
2. Database and auth
3. Reference data + seed data
4. Unique-object core CRUD
5. Merch/inventory core CRUD
6. Media handling
7. Publishing controls
8. Public website rebuild
9. Basic sales / Square prep
10. QA + real-world pilot usage

---

# 3. Stage 1 — Foundation Setup

## Goal
Establish project, stack, repo structure, and base environment.

## Checklist
- [ ] Create Tiger Dust v2 app/repo structure
- [ ] Choose framework/runtime approach (likely Next.js + TS)
- [ ] Set up package manager, linting, formatting
- [ ] Configure environment variable strategy
- [ ] Configure deployment target (Vercel/Netlify or equivalent)
- [ ] Set up database project (Postgres / Supabase)
- [ ] Set up auth/storage provider
- [ ] Add baseline README and project notes

## Done means
- app runs locally
- deploy target is known
- env setup is documented
- data/storage/auth choices are no longer vague

---

# 4. Stage 2 — Database and Auth

## Goal
Get the base persistence and internal access working.

## Checklist
- [ ] Translate schema draft into Prisma schema or SQL DDL
- [ ] Create initial migrations
- [ ] Implement user/auth model
- [ ] Add internal role support (admin/editor/operator/viewer)
- [ ] Set up DB access layer
- [ ] Confirm timestamps/defaults/indexes on key tables
- [ ] Seed baseline admin user(s)

## Core tables needed now
- [ ] users
- [ ] objects
- [ ] object_types
- [ ] tags
- [ ] object_tags
- [ ] locations
- [ ] object_location_history
- [ ] workflow_events
- [ ] media_assets
- [ ] publish_profiles
- [ ] inventory_items
- [ ] inventory_variants

## Done means
- authenticated internal user can log in
- database is real, migrated, and seeded enough to use

---

# 5. Stage 3 — Reference Data + Seed Data

## Goal
Make the system usable with real controlled values.

## Checklist
- [ ] Seed object types
- [ ] Seed lifecycle status values / app constants
- [ ] Seed route/disposition values / app constants
- [ ] Seed visibility/public price modes / app constants
- [ ] Seed initial locations and parent-child hierarchy
- [ ] Seed starter tags
- [ ] Seed starter collections if using them in MVP
- [ ] Add admin UI or seed scripts for updating these later

## Done means
- new records can be created without inventing data structures on the fly
- locations/types/routes feel grounded in real Tiger Dust workflow

---

# 6. Stage 4 — Unique-Object Core CRUD

## Goal
Create the internal backbone for one-of-a-kind objects.

## Screens
- Intake Queue
- Object List
- Object Detail

## Checklist
- [ ] Create object creation flow
- [ ] Support lightweight intake record creation
- [ ] Edit title/type/notes/price/disposition/status
- [ ] Assign tags
- [ ] Assign current location
- [ ] Write location move events/history
- [ ] Write workflow events/history
- [ ] Add search/filter for objects
- [ ] Add missing-data indicators (no image, no route, etc.)

## Done means
- Jason/Laura/Sarah can create and update object records without friction
- system is already useful even before public site integration

---

# 7. Stage 5 — Merch / Inventory Core CRUD

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

# 8. Stage 6 — Media Handling

## Goal
Make images first-class and usable for both internal and public workflows.

## Checklist
- [ ] Implement media upload pipeline
- [ ] Store metadata in `media_assets`
- [ ] Support assigning primary image for objects
- [ ] Support assigning primary image for merch items
- [ ] Support image ordering
- [ ] Add captions / alt text fields
- [ ] Build lightweight Media Desk or media panel
- [ ] Ensure public-safe derivative handling if needed

## Done means
- objects and merch can be visually represented well
- website can rely on structured media instead of ad hoc assets

---

# 9. Stage 7 — Publishing Controls

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

# 10. Stage 8 — Public Website Rebuild

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

# 11. Stage 9 — Basic Sales / Square Prep

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

# 12. Stage 10 — QA + Pilot Usage

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
- [ ] Test on mobile devices
- [ ] Identify friction in data entry
- [ ] Trim anything no one will actually maintain

## Done means
- the system survives contact with reality
- the MVP is genuinely usable, not merely technically complete

---

# 13. MVP Release Criteria

## Internal release criteria
- [ ] Can create and find object records quickly
- [ ] Can create and manage merch records/variants
- [ ] Can attach media reliably
- [ ] Can track location and disposition
- [ ] Can toggle public visibility intentionally

## Public release criteria
- [ ] Home/About/Visit pages work well on mobile
- [ ] Gallery or featured objects are populated
- [ ] Branding and photography are strong enough not to feel placeholder
- [ ] Contact/maps/hours are obvious and accurate

## Operational release criteria
- [ ] At least one real object workflow has been tested end-to-end
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

These should wait unless real use proves they are immediately necessary.

---

# 15. Immediate Next Build Artifacts

After this checklist, the strongest next artifacts are:

1. **Prisma schema / SQL DDL**
2. **field-by-field screen requirements**
3. **issue backlog / milestone breakdown**
4. **photo field checklist for website asset gathering**

If choosing one, the best immediate move is likely:

## Recommended next step
**Issue backlog + milestone breakdown**

That would translate the MVP checklist into actual implementation chunks that a coding agent can begin building.
