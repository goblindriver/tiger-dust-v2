# Tiger Dust v2 Issue Backlog and Milestones
Last updated: 2026-03-22

## Purpose

This document translates the Tiger Dust MVP checklist into a concrete backlog and milestone structure.

It is designed to support:
- implementation planning
- coding-agent delegation
- prioritization
- phased delivery
- lower-friction decision-making

This is not meant to be a perfect project-management artifact.
It is meant to be buildable.

---

# 1. Milestone Overview

## Milestone 0 — Project Setup ✅ DONE
Foundation, tooling, and environment.

## Milestone 1 — Data Foundation ✅ DONE
Schema, auth, seed data, base models.

## Milestone 2 — Unique Object Workflow ✅ DONE (media pending)
Internal CRUD for one-of-a-kind objects.

## Milestone 3 — Merch / Inventory Workflow — NOT STARTED
Inventory items, variants, quantity, pricing.

## Milestone 4 — Media + Publishing Layer — NOT STARTED (next priority)
Images, public visibility, collections/featured controls.

## Milestone 5 — Public Website MVP — PLACEHOLDER ONLY
Home/About/Visit/Gallery and optional merch surface.

## Milestone 6 — Sales / Square Readiness — NOT STARTED
Basic sale-state handling and integration prep.

## Milestone 7 — Pilot + Cleanup — NOT STARTED
Real usage, friction reduction, polish.

---

# 2. Issue Format

Each issue includes:
- **ID**
- **Title**
- **Goal**
- **Depends on**
- **Notes**
- **Suggested owner**

Suggested owners:
- **Agent** = suitable for coding agent implementation
- **Jason** = requires real-world judgment/asset/input
- **Shared** = needs both

Status markers: ✅ DONE | 🔜 NEXT | ⏳ PENDING | 🆕 NEW

---

# 3. Milestone 0 — Project Setup ✅ DONE

## TD-001 ✅ — Create app scaffold
**Goal:** initialize the Tiger Dust v2 app with chosen framework and base structure.
**Depends on:** none
**Notes:** Next.js 15 + TypeScript. Done.
**Suggested owner:** Agent

## TD-002 ✅ — Configure local/dev environment
**Goal:** define environment variables, local setup, and base scripts.
**Depends on:** TD-001
**Notes:** Done. Supabase + Prisma env vars configured.
**Suggested owner:** Agent

## TD-003 ✅ — Set deployment target
**Goal:** choose and document deployment path.
**Depends on:** TD-001
**Notes:** Netlify. Auto-deploy from GitHub. DNS at tigerdust.party. Done.
**Suggested owner:** Shared

## TD-004 ✅ — Project documentation bootstrap
**Goal:** add README and core implementation notes.
**Depends on:** TD-001
**Notes:** Done.
**Suggested owner:** Agent

---

# 4. Milestone 1 — Data Foundation ✅ DONE

## TD-010 ✅ — Translate schema draft into implementation schema
**Goal:** convert `TIGER_DUST_SCHEMA_DRAFT.md` into Prisma schema.
**Depends on:** TD-001
**Notes:** 17 models. Live on Supabase. Done.
**Suggested owner:** Agent

## TD-011 ✅ — Create initial migrations
**Goal:** generate and validate first database migrations.
**Depends on:** TD-010
**Suggested owner:** Agent

## TD-012 ✅ — Implement auth and user roles
**Goal:** support internal login and role-aware access.
**Depends on:** TD-010
**Notes:** Supabase email/password. Auth middleware protecting /app/*. Done.
**Suggested owner:** Agent

## TD-013 ✅ — Implement reference data seed scripts
**Goal:** seed object types, locations, routes, tags, and core constants.
**Depends on:** TD-010
**Notes:** 26 object types, 18 locations, 27 tags, 8 collections, 3 users. Done.
**Suggested owner:** Agent

## TD-014 ✅ — Add admin/reference-data management screen
**Goal:** provide low-volume UI for managing object types, tags, and locations.
**Depends on:** TD-012, TD-013
**Notes:** Dynamic reference data from DB with hardcoded fallback. Done.
**Suggested owner:** Agent

## TD-015 ✅ — Validate merch support in schema
**Goal:** confirm inventory item + variant model supports Phase 1 merch needs.
**Depends on:** TD-010
**Notes:** inventory_items + inventory_variants in schema. Done.
**Suggested owner:** Shared

## TD-016 🆕 — Add sources table (vendor/acquisition source model)
**Goal:** track where objects come from. Repeat acquisition sources (vendors, estate sales, consigners).
**Depends on:** TD-010
**Notes:** Simple model: name, source_type (estate-sale / vendor / found / personal / gift / other), optional contact info. Add source_id FK to objects. Add source picker to intake form.
**Suggested owner:** Agent

---

# 5. Milestone 2 — Unique Object Workflow ✅ DONE

## TD-020 ✅ — Build object list screen
**Goal:** browse and filter unique objects.
**Depends on:** TD-010, TD-012, TD-013
**Notes:** Done. Filters: type, status, route, location. Pagination.
**Suggested owner:** Agent

## TD-021 ✅ — Build object creation flow
**Goal:** support low-friction intake for new object records.
**Depends on:** TD-020
**Notes:** Done. Creates object + workflow event + location history + tags in one transaction.
**Suggested owner:** Agent

## TD-022 ✅ — Build object detail screen
**Goal:** canonical detail/edit view for unique objects.
**Depends on:** TD-021
**Notes:** Done. 7 core fields editable. Workflow events. Tags.
**Suggested owner:** Agent

## TD-023 ✅ — Implement object tagging
**Goal:** assign/remove tags on object records.
**Depends on:** TD-022
**Notes:** Done.
**Suggested owner:** Agent

## TD-024 ✅ — Implement location assignment + move flow
**Goal:** move objects and write location history.
**Depends on:** TD-022
**Notes:** Done. Location changes close open history row and open new one.
**Suggested owner:** Agent

## TD-025 ✅ — Implement workflow event logging
**Goal:** attach practical workflow events to objects.
**Depends on:** TD-022
**Notes:** Done. Log UI on object detail page.
**Suggested owner:** Agent

## TD-026 ✅ — Add object search and filters
**Goal:** filter by type, route, location, status.
**Depends on:** TD-020
**Notes:** Done.
**Suggested owner:** Agent

## TD-027 ✅ — Add operational fields to object model/UI
**Goal:** support sale readiness, condition, ownership, assignment, price status, etc.
**Depends on:** TD-010, TD-022
**Notes:** Done. Core fields in edit form.
**Suggested owner:** Agent

## TD-028 🆕 — Add missing-data indicators to object list
**Goal:** surface inline warnings when a record is missing image, price, or route.
**Depends on:** TD-020
**Notes:** Filters exist but no inline per-row indicator. Low effort, high operational value.
**Suggested owner:** Agent

## TD-029 🆕 — ObjectRelation display on object detail
**Goal:** surface component_of / derived_from / paired_with relationships on the detail page.
**Depends on:** TD-022, media pipeline (TD-040)
**Notes:** Schema has object_relations join table. Design the UI pattern now. Build after media milestone. Relationship types: component_of, derived_from, paired_with, part_of_set.
**Suggested owner:** Agent

## TD-030-QR 🆕 — QR label system
**Goal:** print QR labels linking to /app/objects/{slug} using Brother label printer.
**Depends on:** TD-022
**Notes:** Solves "where is everything" during compound rebuild and active sorting. Steps: add QR code generation per object record, add print-label button on detail page, test label format on Brother printer.
**Suggested owner:** Shared

---

# 6. Milestone 3 — Merch / Inventory Workflow — NOT STARTED

## TD-030 ⏳ — Build inventory item list screen
**Goal:** browse merch and repeatable inventory records.
**Depends on:** TD-015, TD-012
**Suggested owner:** Agent

## TD-031 ⏳ — Build inventory item creation flow
**Goal:** create repeatable merch records.
**Depends on:** TD-030
**Suggested owner:** Agent

## TD-032 ⏳ — Build inventory detail screen
**Goal:** canonical view for merch/inventory items.
**Depends on:** TD-031
**Suggested owner:** Agent

## TD-033 ⏳ — Implement variant support
**Goal:** support size/color/version variants.
**Depends on:** TD-032
**Suggested owner:** Agent

## TD-034 ⏳ — Implement quantity and stock indicators
**Goal:** show in-stock / low-stock / out-of-stock states.
**Depends on:** TD-033
**Suggested owner:** Agent

## TD-035 ⏳ — Link merch items to optional design/object records
**Goal:** support relationship between merch and broader object/design context where useful.
**Depends on:** TD-032
**Suggested owner:** Agent

## TD-036 ⏳ — Add merch search and filters
**Goal:** filter by stock state, has variants, has image, has Square mapping.
**Depends on:** TD-030
**Suggested owner:** Agent

---

# 7. Milestone 4 — Media + Publishing Layer — NOT STARTED (NEXT PRIORITY)

## TD-040 🔜 — Implement media upload/storage pipeline
**Goal:** upload and track images in `media_assets`. Connect to Supabase Storage.
**Depends on:** TD-010, storage config
**Notes:** This is the highest-priority remaining item. Nothing public works without it.
**Suggested owner:** Agent

## TD-040-BACKUP 🆕 — Document and implement offsite backup strategy
**Goal:** protect against data loss (non-negotiable after Hurricane Milton).
**Depends on:** TD-040
**Notes:** (1) Verify Supabase daily DB backup is enabled and retention is configured. (2) Decide on media backup strategy — periodic export or mirrored storage bucket. (3) Add backup plan to project README. Do this alongside media upload setup, not after.
**Suggested owner:** Shared

## TD-041 ⏳ — Add media management to object detail
**Goal:** attach/reorder/set primary images for objects.
**Depends on:** TD-040, TD-022
**Suggested owner:** Agent

## TD-042 ⏳ — Add media management to merch detail
**Goal:** attach/reorder/set primary images for merch items.
**Depends on:** TD-040, TD-032
**Suggested owner:** Agent

## TD-043 ⏳ — Build lightweight Media Desk
**Goal:** see missing/weak media across records.
**Depends on:** TD-041, TD-042
**Suggested owner:** Agent

## TD-044 ⏳ — Implement publish profiles
**Goal:** create and manage public presentation settings for objects.
**Depends on:** TD-010, TD-022
**Suggested owner:** Agent

## TD-045 ⏳ — Build Publishing Manager UI
**Goal:** toggle public/private state, featured flags, public copy.
**Depends on:** TD-044
**Suggested owner:** Agent

## TD-046 ⏳ — Implement collections and collection assignment
**Goal:** support curated public groupings.
**Depends on:** TD-044
**Suggested owner:** Agent

## TD-047 ⏳ — Build Collections Manager UI
**Goal:** create/reorder collections and assign items.
**Depends on:** TD-046
**Suggested owner:** Agent

## TD-048 ⏳ — Extract and normalize brand assets
**Goal:** turn Tiger Dust source files into web-ready logo/icon asset set.
**Depends on:** none
**Notes:** use `TIGER_DUST_DESIGN_INVENTORY.md` as reference.
**Suggested owner:** Shared

## TD-049 ⏳ — Execute first website photo assignment
**Goal:** capture missing hero/interior/people/category imagery.
**Depends on:** `TIGER_DUST_PHOTO_ASSIGNMENT_BRIEF_01.md`
**Notes:** this is a Jason field task.
**Suggested owner:** Jason

---

# 8. Milestone 5 — Public Website MVP — PLACEHOLDER ONLY

## TD-050 ⏳ — Build public site shell/layout
**Goal:** establish site layout, navigation, footer, responsive structure.
**Depends on:** TD-001, TD-048
**Suggested owner:** Agent

## TD-051 ⏳ — Build homepage
**Goal:** create strong public homepage using structured content and assets.
**Depends on:** TD-050, TD-045, TD-048, TD-049
**Suggested owner:** Agent

## TD-052 ⏳ — Build About page
**Goal:** communicate identity/story with stronger imagery and tone.
**Depends on:** TD-050, TD-049
**Suggested owner:** Agent

## TD-053 ⏳ — Build Visit / Contact page
**Goal:** make store easy to find, recognize, and contact.
**Depends on:** TD-050, TD-049
**Suggested owner:** Agent

## TD-054 ⏳ — Build Gallery / Featured Objects page
**Goal:** surface curated public objects/collections.
**Depends on:** TD-045, TD-046, TD-050
**Suggested owner:** Agent

## TD-055 ⏳ — Build optional public object detail page
**Goal:** support individual featured object pages.
**Depends on:** TD-054
**Suggested owner:** Agent

## TD-056 ⏳ — Build optional merch page / shop overview
**Goal:** expose merch publicly if needed in MVP.
**Depends on:** TD-032, TD-042, TD-050
**Notes:** level of complexity depends on sales strategy.
**Suggested owner:** Shared

## TD-057 ⏳ — Add SEO/meta/open graph basics
**Goal:** ensure pages are shareable and locally discoverable.
**Depends on:** TD-051, TD-052, TD-053, TD-054
**Suggested owner:** Agent

---

# 9. Milestone 6 — Sales / Square Readiness — NOT STARTED

## TD-060 ⏳ — Define Square integration boundaries
**Goal:** decide exactly what syncs in MVP vs later.
**Depends on:** TD-015, TD-032, TD-022
**Suggested owner:** Shared

## TD-061 ⏳ — Add Square IDs and mapping UI
**Goal:** support linking internal records to Square entities.
**Depends on:** TD-060
**Suggested owner:** Agent

## TD-062 ⏳ — Implement manual sale recording for unique objects
**Goal:** mark sold state cleanly for one-off objects.
**Depends on:** TD-022, TD-061
**Suggested owner:** Agent

## TD-063 ⏳ — Implement merch stock adjustment flow
**Goal:** allow quantity changes driven by sales/recounts.
**Depends on:** TD-033, TD-034
**Suggested owner:** Agent

## TD-064 ⏳ — Build basic sales reconciliation view
**Goal:** compare internal state with sale records and obvious mismatches.
**Depends on:** TD-062, TD-063
**Suggested owner:** Agent

---

# 10. Milestone 7 — Pilot + Cleanup — NOT STARTED

## TD-070 ⏳ — Enter real sample object records
**Goal:** test unique object flow with real data.
**Depends on:** Milestones 1–4 foundation items
**Suggested owner:** Shared

## TD-071 ⏳ — Enter real sample merch records
**Goal:** test inventory/variant flow with real merch.
**Depends on:** Milestone 3
**Suggested owner:** Shared

## TD-072 ⏳ — Run public publishing pilot
**Goal:** publish a small curated set through the site.
**Depends on:** Milestones 4–5
**Suggested owner:** Shared

## TD-073 ⏳ — Mobile QA pass — internal app
**Goal:** test intake, object edit, workflow logging, and tag management on mobile (phone in lamp lab).
**Depends on:** Milestone 2
**Notes:** Intake and status updates must work on a phone. This is higher priority than public site mobile QA.
**Suggested owner:** Shared

## TD-073B ⏳ — Mobile QA pass — public site
**Goal:** test public site on mobile/tablet.
**Depends on:** Milestone 5
**Suggested owner:** Shared

## TD-074 ⏳ — Reduce friction in intake workflow
**Goal:** simplify anything people won't actually maintain.
**Depends on:** TD-070
**Suggested owner:** Shared

## TD-075 ⏳ — Reduce friction in merch workflow
**Goal:** simplify inventory handling based on actual use.
**Depends on:** TD-071
**Suggested owner:** Shared

## TD-076 ⏳ — Define post-MVP roadmap
**Goal:** identify what gets promoted into Phase 2.
**Depends on:** TD-070 through TD-075
**Suggested owner:** Shared

## TD-077 🆕 — Provenance-to-content pipeline
**Goal:** turn research notes + acquisition story + photography into shareable Instagram story cards.
**Depends on:** TD-041 (media on object), research desk (post-MVP)
**Notes:** This is the unique value of the custom system vs. off-the-shelf tools. Plan the flow now: what a "story-ready" object record looks like, what the export format is (image card + provenance text). Build the actual export tool when the research desk exists. Do not build this before media and research desk are in place.
**Suggested owner:** Shared

---

# 11. Highest-Leverage Build Order

Current state: Milestones 0–2 done. Media (Milestone 4) is the next critical path.

## Next chunk (immediate priority)
- TD-040 (media upload pipeline)
- TD-040-BACKUP (offsite backup — do alongside media)
- TD-030-QR (QR label system — high operational value now)
- TD-028 (missing-data indicators — low effort)
- TD-073 (mobile QA pass — internal app)

## After media is working
- TD-041 (media on object detail)
- TD-044, TD-045 (publish profiles + Publishing Manager)
- TD-046, TD-047 (collections)
- TD-051–TD-054 (public pages)

## Parallel track (when ready)
- TD-030–TD-036 (merch workflow)
- TD-016 (sources table)

---

# 12. Things Requiring Jason More Than an Agent

- deployment preference if there are tradeoffs
- merch scope/detail expectations
- Square integration boundaries
- asset selection from Tiger Dust source files
- photography execution and shot approval
- definitions of archive / hold / liquidation in actual practice
- deciding what feels too bureaucratic to keep
- backup strategy decisions (what to back up, where)
- QR label format and printer setup

Everything else is more delegatable.

---

# 13. Things That Can Wait

- deep research desk workflows
- elaborate collections tooling
- full Square automation
- heavy reporting dashboards
- AI enrichment/tagging
- digital twin/archive expansion
- advanced permissions complexity
- exhaustive public browsing/search
- ObjectRelation UI (TD-029) — design now, build after media milestone
- provenance-to-content pipeline (TD-077) — plan now, build after research desk
