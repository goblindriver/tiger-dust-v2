# Tiger Dust v2 Issue Backlog and Milestones

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

## Milestone 0 — Project Setup
Foundation, tooling, and environment.

## Milestone 1 — Data Foundation
Schema, auth, seed data, base models.

## Milestone 2 — Unique Object Workflow
Internal CRUD for one-of-a-kind objects.

## Milestone 3 — Merch / Inventory Workflow
Inventory items, variants, quantity, pricing.

## Milestone 4 — Media + Publishing Layer
Images, public visibility, collections/featured controls.

## Milestone 5 — Public Website MVP
Home/About/Visit/Gallery and optional merch surface.

## Milestone 6 — Sales / Square Readiness
Basic sale-state handling and integration prep.

## Milestone 7 — Pilot + Cleanup
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

---

# 3. Milestone 0 — Project Setup

## TD-001 — Create app scaffold
**Goal:** initialize the Tiger Dust v2 app with chosen framework and base structure.
**Depends on:** none
**Notes:** likely Next.js + TypeScript.
**Suggested owner:** Agent

## TD-002 — Configure local/dev environment
**Goal:** define environment variables, local setup, and base scripts.
**Depends on:** TD-001
**Notes:** include DB/auth/storage placeholders.
**Suggested owner:** Agent

## TD-003 — Set deployment target
**Goal:** choose and document deployment path.
**Depends on:** TD-001
**Notes:** Vercel vs Netlify or equivalent.
**Suggested owner:** Shared

## TD-004 — Project documentation bootstrap
**Goal:** add README and core implementation notes.
**Depends on:** TD-001
**Notes:** should reference planning docs in workspace.
**Suggested owner:** Agent

---

# 4. Milestone 1 — Data Foundation

## TD-010 — Translate schema draft into implementation schema
**Goal:** convert `TIGER_DUST_SCHEMA_DRAFT.md` into Prisma schema or SQL DDL.
**Depends on:** TD-001
**Notes:** use current planning docs as source of truth.
**Suggested owner:** Agent

## TD-011 — Create initial migrations
**Goal:** generate and validate first database migrations.
**Depends on:** TD-010
**Suggested owner:** Agent

## TD-012 — Implement auth and user roles
**Goal:** support internal login and role-aware access.
**Depends on:** TD-010
**Notes:** admin/editor/operator/viewer.
**Suggested owner:** Agent

## TD-013 — Implement reference data seed scripts
**Goal:** seed object types, locations, routes, tags, and core constants.
**Depends on:** TD-010
**Notes:** source from `TIGER_DUST_SEED_DATA_DRAFT.md`.
**Suggested owner:** Agent

## TD-014 — Add admin/reference-data management screen
**Goal:** provide low-volume UI for managing object types, tags, and locations.
**Depends on:** TD-012, TD-013
**Suggested owner:** Agent

## TD-015 — Validate merch support in schema
**Goal:** confirm inventory item + variant model supports Phase 1 merch needs.
**Depends on:** TD-010
**Notes:** Jason may need to confirm how much merch detail matters initially.
**Suggested owner:** Shared

---

# 5. Milestone 2 — Unique Object Workflow

## TD-020 — Build object list screen
**Goal:** browse and filter unique objects.
**Depends on:** TD-010, TD-012, TD-013
**Suggested owner:** Agent

## TD-021 — Build object creation flow
**Goal:** support low-friction intake for new object records.
**Depends on:** TD-020
**Notes:** keep minimal required fields.
**Suggested owner:** Agent

## TD-022 — Build object detail screen
**Goal:** canonical detail/edit view for unique objects.
**Depends on:** TD-021
**Suggested owner:** Agent

## TD-023 — Implement object tagging
**Goal:** assign/remove tags on object records.
**Depends on:** TD-022
**Suggested owner:** Agent

## TD-024 — Implement location assignment + move flow
**Goal:** move objects and write location history.
**Depends on:** TD-022
**Notes:** location history should be source of truth.
**Suggested owner:** Agent

## TD-025 — Implement workflow event logging
**Goal:** attach practical workflow events to objects.
**Depends on:** TD-022
**Notes:** keep event vocabulary restrained.
**Suggested owner:** Agent

## TD-026 — Add object search and filters
**Goal:** filter by type, route, location, status, missing image, missing price.
**Depends on:** TD-020
**Suggested owner:** Agent

## TD-027 — Add operational fields to object model/UI
**Goal:** support sale readiness, condition, ownership, assignment, price status, etc.
**Depends on:** TD-010, TD-022
**Notes:** this reflects the schema review recommendations.
**Suggested owner:** Agent

---

# 6. Milestone 3 — Merch / Inventory Workflow

## TD-030 — Build inventory item list screen
**Goal:** browse merch and repeatable inventory records.
**Depends on:** TD-015, TD-012
**Suggested owner:** Agent

## TD-031 — Build inventory item creation flow
**Goal:** create repeatable merch records.
**Depends on:** TD-030
**Suggested owner:** Agent

## TD-032 — Build inventory detail screen
**Goal:** canonical view for merch/inventory items.
**Depends on:** TD-031
**Suggested owner:** Agent

## TD-033 — Implement variant support
**Goal:** support size/color/version variants.
**Depends on:** TD-032
**Suggested owner:** Agent

## TD-034 — Implement quantity and stock indicators
**Goal:** show in-stock / low-stock / out-of-stock states.
**Depends on:** TD-033
**Suggested owner:** Agent

## TD-035 — Link merch items to optional design/object records
**Goal:** support relationship between merch and broader object/design context where useful.
**Depends on:** TD-032
**Suggested owner:** Agent

## TD-036 — Add merch search and filters
**Goal:** filter by stock state, has variants, has image, has Square mapping.
**Depends on:** TD-030
**Suggested owner:** Agent

---

# 7. Milestone 4 — Media + Publishing Layer

## TD-040 — Implement media upload/storage pipeline
**Goal:** upload and track images in `media_assets`.
**Depends on:** TD-010, storage config
**Suggested owner:** Agent

## TD-041 — Add media management to object detail
**Goal:** attach/reorder/set primary images for objects.
**Depends on:** TD-040, TD-022
**Suggested owner:** Agent

## TD-042 — Add media management to merch detail
**Goal:** attach/reorder/set primary images for merch items.
**Depends on:** TD-040, TD-032
**Suggested owner:** Agent

## TD-043 — Build lightweight Media Desk
**Goal:** see missing/weak media across records.
**Depends on:** TD-041, TD-042
**Suggested owner:** Agent

## TD-044 — Implement publish profiles
**Goal:** create and manage public presentation settings for objects.
**Depends on:** TD-010, TD-022
**Suggested owner:** Agent

## TD-045 — Build Publishing Manager UI
**Goal:** toggle public/private state, featured flags, public copy.
**Depends on:** TD-044
**Suggested owner:** Agent

## TD-046 — Implement collections and collection assignment
**Goal:** support curated public groupings.
**Depends on:** TD-044
**Suggested owner:** Agent

## TD-047 — Build Collections Manager UI
**Goal:** create/reorder collections and assign items.
**Depends on:** TD-046
**Suggested owner:** Agent

## TD-048 — Extract and normalize brand assets
**Goal:** turn Tiger Dust source files into web-ready logo/icon asset set.
**Depends on:** none
**Notes:** use `TIGER_DUST_DESIGN_INVENTORY.md` as reference.
**Suggested owner:** Shared

## TD-049 — Execute first website photo assignment
**Goal:** capture missing hero/interior/people/category imagery.
**Depends on:** `TIGER_DUST_PHOTO_ASSIGNMENT_BRIEF_01.md`
**Notes:** this is a Jason field task.
**Suggested owner:** Jason

---

# 8. Milestone 5 — Public Website MVP

## TD-050 — Build public site shell/layout
**Goal:** establish site layout, navigation, footer, responsive structure.
**Depends on:** TD-001, TD-048
**Suggested owner:** Agent

## TD-051 — Build homepage
**Goal:** create strong public homepage using structured content and assets.
**Depends on:** TD-050, TD-045, TD-048, TD-049
**Suggested owner:** Agent

## TD-052 — Build About page
**Goal:** communicate identity/story with stronger imagery and tone.
**Depends on:** TD-050, TD-049
**Suggested owner:** Agent

## TD-053 — Build Visit / Contact page
**Goal:** make store easy to find, recognize, and contact.
**Depends on:** TD-050, TD-049
**Suggested owner:** Agent

## TD-054 — Build Gallery / Featured Objects page
**Goal:** surface curated public objects/collections.
**Depends on:** TD-045, TD-046, TD-050
**Suggested owner:** Agent

## TD-055 — Build optional public object detail page
**Goal:** support individual featured object pages.
**Depends on:** TD-054
**Suggested owner:** Agent

## TD-056 — Build optional merch page / shop overview
**Goal:** expose merch publicly if needed in MVP.
**Depends on:** TD-032, TD-042, TD-050
**Notes:** level of complexity depends on sales strategy.
**Suggested owner:** Shared

## TD-057 — Add SEO/meta/open graph basics
**Goal:** ensure pages are shareable and locally discoverable.
**Depends on:** TD-051, TD-052, TD-053, TD-054
**Suggested owner:** Agent

---

# 9. Milestone 6 — Sales / Square Readiness

## TD-060 — Define Square integration boundaries
**Goal:** decide exactly what syncs in MVP vs later.
**Depends on:** TD-015, TD-032, TD-022
**Suggested owner:** Shared

## TD-061 — Add Square IDs and mapping UI
**Goal:** support linking internal records to Square entities.
**Depends on:** TD-060
**Suggested owner:** Agent

## TD-062 — Implement manual sale recording for unique objects
**Goal:** mark sold state cleanly for one-off objects.
**Depends on:** TD-022, TD-061
**Suggested owner:** Agent

## TD-063 — Implement merch stock adjustment flow
**Goal:** allow quantity changes driven by sales/recounts.
**Depends on:** TD-033, TD-034
**Suggested owner:** Agent

## TD-064 — Build basic sales reconciliation view
**Goal:** compare internal state with sale records and obvious mismatches.
**Depends on:** TD-062, TD-063
**Suggested owner:** Agent

---

# 10. Milestone 7 — Pilot + Cleanup

## TD-070 — Enter real sample object records
**Goal:** test unique object flow with real data.
**Depends on:** Milestones 1–4 foundation items
**Suggested owner:** Shared

## TD-071 — Enter real sample merch records
**Goal:** test inventory/variant flow with real merch.
**Depends on:** Milestone 3
**Suggested owner:** Shared

## TD-072 — Run public publishing pilot
**Goal:** publish a small curated set through the site.
**Depends on:** Milestones 4–5
**Suggested owner:** Shared

## TD-073 — Mobile QA pass
**Goal:** test public site and internal critical flows on mobile/tablet where relevant.
**Depends on:** Milestone 5
**Suggested owner:** Shared

## TD-074 — Reduce friction in intake workflow
**Goal:** simplify anything people won’t actually maintain.
**Depends on:** TD-070
**Suggested owner:** Shared

## TD-075 — Reduce friction in merch workflow
**Goal:** simplify inventory handling based on actual use.
**Depends on:** TD-071
**Suggested owner:** Shared

## TD-076 — Define post-MVP roadmap
**Goal:** identify what gets promoted into Phase 2.
**Depends on:** TD-070 through TD-075
**Suggested owner:** Shared

---

# 11. Highest-Leverage Build Order

If implementation begins immediately, the most effective first chunk is:

## Chunk A
- TD-001
- TD-002
- TD-010
- TD-011
- TD-012
- TD-013

## Chunk B
- TD-020
- TD-021
- TD-022
- TD-023
- TD-024
- TD-026
- TD-027

## Chunk C
- TD-030
- TD-031
- TD-032
- TD-033
- TD-034
- TD-036

## Chunk D
- TD-040
- TD-041
- TD-042
- TD-044
- TD-045

## Chunk E
- TD-050
- TD-051
- TD-052
- TD-053
- TD-054
- TD-057

This order gets the internal system real before chasing polish.

---

# 12. Things Requiring Jason More Than an Agent

These are the places where your judgment matters most:

- deployment preference if there are tradeoffs
- merch scope/detail expectations
- Square integration boundaries
- asset selection from Tiger Dust source files
- photography execution and shot approval
- definitions of archive / hold / liquidation in actual practice
- deciding what feels too bureaucratic to keep

Everything else is more delegatable.

---

# 13. Best Next Delegation Step

After this backlog exists, the strongest next action is:

## Option A
Have a coding agent scaffold:
- app foundation
- schema
- auth
- seed scripts

## Option B
Have a coding agent create the first implementation milestone issues/files directly in a fresh project.

## Recommendation
Start with **Option A** and keep scope to Milestones 0–1 plus the beginning of Milestone 2.

That gives you a concrete working base quickly without pretending the whole app should be built in one shot.
