# Tiger Dust v2 Screen-to-Table Mapping

## Purpose

This document maps the proposed Tiger Dust v2 UI screens to the schema and seed model.

It is meant to answer:
- what screens exist
- what each screen is for
- which tables each screen reads/writes
- what minimum actions each screen must support
- which screens are MVP vs later

This is the bridge between planning docs and implementation.

---

# 1. Screen Map Overview

## Core internal screens
1. Dashboard
2. Intake Queue
3. Object List
4. Object Detail
5. Inventory / Merch List
6. Inventory / Merch Detail
7. Location Browser
8. Processing Board
9. Media Desk
10. Publishing Manager
11. Collections Manager
12. Sales Reconciliation
13. Research Desk
14. Settings / Reference Data

## Public-facing pages
1. Home
2. About
3. Visit / Contact
4. Gallery / Featured Objects
5. Public Object Detail
6. Featured Collection Page
7. Merch Page / Shop Overview (if public in MVP)

---

# 2. Internal Screens

## 2.1 Dashboard

### Purpose
High-level operational snapshot.

### Key questions answered
- What needs attention today?
- What is missing photos, location, price, or route?
- What is ready to publish or push to Square?
- What merch is low or out of stock?

### Reads
- `objects`
- `publish_profiles`
- `media_assets`
- `workflow_events`
- `inventory_items`
- `inventory_variants`
- `sales_records`

### Writes
- none required for MVP dashboard itself

### MVP actions
- jump to incomplete object records
- jump to ready-to-publish items
- jump to low-stock merch
- jump to recent sales mismatches

### MVP status
Yes

---

## 2.2 Intake Queue

### Purpose
Show incomplete or newly created object records needing enrichment.

### Reads
- `objects`
- `object_types`
- `locations`
- `media_assets`
- `publish_profiles`

### Writes
- `objects`
- `workflow_events`
- `object_tags`
- `media_assets`
- `object_location_history`

### Minimum fields editable here
- title
- object type
- primary/current location
- route/disposition
- condition notes
- one image or placeholder note

### MVP actions
- create new object
- add missing type/location
- upload intake photo
- add rough tags
- mark intake more complete

### MVP status
Yes

---

## 2.3 Object List

### Purpose
Browse and filter all unique-object records.

### Reads
- `objects`
- `object_types`
- `locations`
- `publish_profiles`
- `object_tags`
- `tags`

### Writes
- lightweight bulk updates to `objects` (optional)

### Filters
- object type
- lifecycle status
- route/disposition
- location
- visibility/public status
- missing image
- missing price
- missing route
- sold / unsold

### MVP actions
- open detail view
- bulk route change (optional later)
- bulk publish toggle (later, carefully)

### MVP status
Yes

---

## 2.4 Object Detail

### Purpose
Canonical record screen for a unique object.

### Reads
- `objects`
- `object_types`
- `object_tags`
- `tags`
- `locations`
- `object_location_history`
- `workflow_events`
- `media_assets`
- `research_entries`
- `publish_profiles`
- `sales_records`
- `collections`
- `collection_objects`

### Writes
- `objects`
- `object_tags`
- `object_location_history`
- `workflow_events`
- `media_assets`
- `research_entries`
- `publish_profiles`
- `collection_objects`
- `sales_records`

### Core sections
- overview
- photos/media
- tags/materials
- location history
- workflow history
- pricing/sale readiness
- route/disposition
- publishing controls
- research notes
- sales history

### MVP actions
- edit core fields
- upload/reorder photos
- add workflow event
- move location
- update price/status
- toggle public visibility

### MVP status
Yes

---

## 2.5 Inventory / Merch List

### Purpose
Browse repeatable saleable items like shirts, merch, editions, and variants.

### Reads
- `inventory_items`
- `inventory_variants`
- `media_assets`
- `sales_records`

### Writes
- `inventory_items`
- `inventory_variants`

### Filters
- active/inactive
- low stock
- out of stock
- has Square link / missing Square link
- merch type

### MVP actions
- create merch item
- adjust quantity
- open detail view
- see stock at a glance

### MVP status
Yes

---

## 2.6 Inventory / Merch Detail

### Purpose
Canonical record screen for repeatable merch/inventory items.

### Reads
- `inventory_items`
- `inventory_variants`
- `media_assets`
- `sales_records`
- optional linked `objects`

### Writes
- `inventory_items`
- `inventory_variants`
- `media_assets`

### Core sections
- item overview
- linked design/object (optional)
- images
- pricing
- quantity by variant
- Square mapping
- public publishing state (if exposed publicly)

### MVP actions
- add variants
- update quantities
- change price
- attach image
- sync/prepare for Square

### MVP status
Yes

---

## 2.7 Location Browser

### Purpose
View records by where they physically are.

### Reads
- `locations`
- `objects`
- `object_location_history`

### Writes
- none directly, except navigation to move/edit screens

### Views
- hierarchy/tree
- objects currently in location
- recently moved objects

### MVP actions
- drill into location
- jump to object detail
- move object from related flow

### MVP status
Yes

---

## 2.8 Processing Board

### Purpose
Operational workflow view for unique objects in progress.

### Reads
- `objects`
- `workflow_events`
- `locations`
- `media_assets`

### Writes
- `workflow_events`
- `objects`

### Suggested columns
- intake
- processing
- ready
- hold
- sold/archived (optional hidden terminal states)

### Notes
Keep this simpler than a hyper-granular production board unless actual team behavior proves otherwise.

### MVP actions
- move status between columns
- add quick workflow note
- jump to object detail

### MVP status
Maybe MVP, but could follow shortly after

---

## 2.9 Media Desk

### Purpose
Manage images and media quality across the system.

### Reads
- `media_assets`
- `objects`
- `inventory_items`
- `publish_profiles`

### Writes
- `media_assets`
- `objects.primary_image_id`
- `inventory_items.primary_image_id`

### Filters
- missing primary image
- no media
- public but weak media coverage
- internal-only media
- recent uploads

### MVP actions
- assign primary image
- reorder assets
- add captions/alt text
- identify missing website-ready imagery

### MVP status
Yes, even if lightweight at first

---

## 2.10 Publishing Manager

### Purpose
Control what appears publicly and how it is presented.

### Reads
- `objects`
- `publish_profiles`
- `collections`
- `collection_objects`
- `media_assets`
- `inventory_items` (if merch is public)

### Writes
- `publish_profiles`
- `collection_objects`
- `collections`

### Core controls
- public on/off
- featured on home
- featured in gallery
- public title/excerpt/description
- public price mode
- collection assignment

### Notes
This is where website placement belongs — not in route/disposition.

### MVP actions
- make item public/private
- choose featured items
- assign item to public collection

### MVP status
Yes

---

## 2.11 Collections Manager

### Purpose
Create and manage curated sets of objects for the public site or internal use.

### Reads
- `collections`
- `collection_objects`
- `objects`
- `publish_profiles`

### Writes
- `collections`
- `collection_objects`

### MVP actions
- create collection
- add/remove objects
- reorder objects
- toggle collection visibility

### MVP status
Maybe MVP, but can be lightweight

---

## 2.12 Sales Reconciliation

### Purpose
Compare internal records with Square or recorded sale activity.

### Reads
- `sales_records`
- `objects`
- `inventory_items`
- `inventory_variants`

### Writes
- `sales_records`
- `objects`
- `inventory_items`
- `inventory_variants`

### MVP questions answered
- what sold but is not marked sold internally?
- what public object is still visible but already sold?
- what merch stock is inaccurate?

### MVP actions
- mark sold
- adjust stock
- resolve mismatch

### MVP status
Post-MVP but important soon after

---

## 2.13 Research Desk

### Purpose
Manage provenance, references, and contextual notes.

### Reads
- `research_entries`
- `objects`

### Writes
- `research_entries`

### MVP actions
- add source
- add citation
- summarize research findings

### MVP status
Can be simple MVP or phase-right-after-MVP

---

## 2.14 Settings / Reference Data

### Purpose
Manage low-volume controlled vocabularies and internal reference data.

### Reads
- `object_types`
- `tags`
- `locations`
- optional future reference tables

### Writes
- `object_types`
- `tags`
- `locations`

### MVP actions
- add/edit object type
- add/edit tag
- add/edit location

### MVP status
Yes, but admin-only

---

# 3. Public Pages

## 3.1 Home

### Purpose
Explain what Tiger Dust is and help people get oriented quickly.

### Reads
- `collections`
- `collection_objects`
- `objects`
- `publish_profiles`
- `media_assets`
- optional `inventory_items` for merch highlights

### Writes
- none directly from public site

### Content blocks
- hero image / statement
- what Tiger Dust is
- featured categories or collections
- practical visit info
- selected merch or featured objects

### MVP status
Yes

---

## 3.2 About

### Purpose
Communicate identity, story, and curation.

### Reads
- curated content source (could begin as code/content file)
- optional `media_assets`
- optional `collections`

### Writes
- none from public site

### MVP status
Yes

---

## 3.3 Visit / Contact

### Purpose
Make it dead simple to find and recognize the store.

### Reads
- curated content source for address/hours/contact
- optional `media_assets`

### Writes
- none from public site

### MVP status
Yes

---

## 3.4 Gallery / Featured Objects

### Purpose
Public curated browsing.

### Reads
- `collections`
- `collection_objects`
- `objects`
- `publish_profiles`
- `media_assets`

### Notes
Only explicitly public/published records should appear.
Not a raw inventory dump.

### MVP status
Yes

---

## 3.5 Public Object Detail

### Purpose
Public page for a specific object worth featuring.

### Reads
- `objects`
- `publish_profiles`
- `media_assets`
- `collection_objects`

### Notes
Only if public visibility is enabled.
Price display depends on `publish_profiles.public_price_mode`.

### MVP status
Maybe MVP if enough content exists

---

## 3.6 Featured Collection Page

### Purpose
Public page for a collection like Taxidermy & Skulls or Lamps & Glow.

### Reads
- `collections`
- `collection_objects`
- `objects`
- `publish_profiles`
- `media_assets`

### MVP status
Yes if collections drive public navigation

---

## 3.7 Merch Page / Shop Overview

### Purpose
Public-facing merch browsing if Phase 1 merch is exposed online.

### Reads
- `inventory_items`
- `inventory_variants`
- `media_assets`
- optional public merch publishing metadata

### Notes
This can begin very simply.
It does not need to become a full ecommerce monster in MVP.

### MVP status
Maybe, depending on how fast merch exposure matters

---

# 4. Data Ownership by Screen

## Unique-object workflow screens
- Intake Queue
- Object List
- Object Detail
- Processing Board
- Location Browser
- Research Desk

Primary tables:
- `objects`
- `object_types`
- `object_tags`
- `tags`
- `locations`
- `object_location_history`
- `workflow_events`
- `media_assets`
- `research_entries`

## Merch workflow screens
- Inventory / Merch List
- Inventory / Merch Detail
- Sales Reconciliation

Primary tables:
- `inventory_items`
- `inventory_variants`
- `media_assets`
- `sales_records`

## Public publishing screens
- Publishing Manager
- Collections Manager

Primary tables:
- `publish_profiles`
- `collections`
- `collection_objects`
- supporting `objects` and `media_assets`

---

# 5. MVP Screen Cut

## Must-have MVP screens
- Dashboard
- Intake Queue
- Object List
- Object Detail
- Inventory / Merch List
- Inventory / Merch Detail
- Location Browser
- Media Desk
- Publishing Manager
- Settings / Reference Data

## Very likely next wave
- Processing Board
- Collections Manager
- Research Desk
- Sales Reconciliation

## Public MVP pages
- Home
- About
- Visit / Contact
- Gallery / Featured Objects
- optional Public Object Detail
- optional Merch Page

---

# 6. Key Implementation Notes

## 6.1 Keep object and merch flows related but distinct
Do not force repeatable merch to act exactly like one-of-a-kind objects.

## 6.2 Keep public publishing separate from route/disposition
This decision removes a lot of confusion.

## 6.3 Use location history as truth
Object Detail and move actions should write to location history consistently.

## 6.4 Avoid trying to build every screen at once
The MVP should prioritize usable record management over idealized operations dashboards.

---

# 7. Recommended Next Step

After this document, the strongest next artifact is:

1. **Prisma schema or SQL DDL**
2. **MVP build checklist / issue breakdown**
3. **screen-by-screen field requirements**

If choosing one, the best immediate move is likely the **MVP build checklist**, because the planning stack is now detailed enough to break into implementation phases.
