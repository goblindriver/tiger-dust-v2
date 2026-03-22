# Tiger Dust v2 Spec Pack

## Purpose

Tiger Dust v2 is not just a website redesign.

It is a two-layer system:

1. A **public-facing website** that remains simple, fast, branded, and useful for real customers
2. An **internal business system** for tracking objects, workflow, media, routing, research, and sales state

The public site should stay low-friction and practical.
The internal system should become the operational spine of the business.

---

# 1. Product Principles

## 1.1 Keep the website functional

The public website must always answer:

- Who are we?
- Where are we?
- When are we open?
- What kinds of things do we carry?
- How do people find/contact/follow us?

The current static site already provides real value here. That value should be preserved.

## 1.2 The system centers on objects, not generic products

Tiger Dust deals in one-offs, handmade work, repaired/restored pieces, collected objects, and items that may be sold, archived, staged, researched, or liquidated.

The core unit of the system is therefore:

- **Object**

Not every object is a standard retail product.
Not every object should be public.
Not every object should end up in Square.

## 1.3 Public site and internal system are different interfaces

The public site should feel:
- curated
- atmospheric
- useful
- human
- selective

The internal system should feel:
- structured
- searchable
- operational
- practical
- tolerant of messy real-world workflows

## 1.4 Low-tech reality matters

The system must support how Tiger Dust works now, not require everyone to adopt enterprise software behavior.

That means:
- minimal required fields at intake
- progressive enrichment later
- strong defaults
- fast editing
- mobile-friendliness where useful
- no unnecessary admin burden

---

# 2. System Overview

## 2.1 High-level architecture

Tiger Dust v2 should have three logical layers:

### A. Public Site
Customer-facing website for brand, visit info, gallery, featured objects, and curated public content.

### B. Internal Operations App
Private admin for object records, workflow, media, routing, locations, research, and publication controls.

### C. Data and Media Layer
Database + storage for object records, images, workflow history, research, and sales references.

---

# 3. Recommended Technical Stack

## 3.1 Preferred stack

- **Next.js** for public site + internal admin
- **TypeScript**
- **Postgres** for primary relational data
- **Prisma** or **Drizzle** as ORM/query layer
- **Supabase Auth** for internal login
- **Supabase Storage** or S3-compatible storage for media
- **Square API** as downstream sales channel integration
- **Vercel** or **Netlify** for deployment

## 3.2 Why this stack

This stack supports:
- a clean public website
- an internal admin app
- structured relational data
- reliable media storage
- future API integrations
- incremental growth without overengineering day one

---

# 4. Domain Model

## 4.1 Core entity: Object

An object represents a single item, artifact, handmade piece, restored piece, or inventory-tracked item.

### Object fields (initial)

- `id`
- `slug`
- `title`
- `object_type_id`
- `status_lifecycle`
- `route_intent`
- `visibility`
- `description_short`
- `description_long`
- `materials`
- `dimensions`
- `condition_notes`
- `acquisition_type`
- `acquisition_source`
- `date_acquired`
- `cost_basis`
- `asking_price`
- `sold_price`
- `square_item_id`
- `primary_location_id`
- `primary_image_id`
- `is_one_of_a_kind`
- `created_by`
- `updated_by`
- `notes_internal`
- `published_at`
- `sold_at`

## 4.2 Object Type

Defines broad class of item.

Examples:
- lamp
- jewelry
- taxidermy
- crystal
- fossil
- furniture
- artwork
- shirt
- oddity
- book
- media
- archive item

## 4.3 Tags

Tags capture descriptive qualities that cut across categories.

Examples:
- occult
- brass
- victorian
- handmade
- silver
- mourning
- folk art
- gothic
- one-of-a-kind
- found object

## 4.4 Location

Represents a real physical place where an object can be.

Examples:
- compound / guest house staging
- compound / lamp lab
- compound / jewelry studio
- compound / photography station
- tiger dust / sales floor
- tiger dust / back room
- archive storage
- liquidation holding

## 4.5 Object Location History

Objects move. Location history must be preserved.

Fields:
- `object_id`
- `location_id`
- `entered_at`
- `left_at`
- `reason`
- `recorded_by`
- `notes`

## 4.6 Workflow Event

An append-only event log of operational state changes.

Fields:
- `object_id`
- `event_type`
- `from_state`
- `to_state`
- `timestamp`
- `actor`
- `notes`

Examples of states/events:
- acquired
- intake_started
- cleaning
- repair
- lapidary
- jewelry_fabrication
- photography_pending
- photography_complete
- research_pending
- pricing_pending
- routed_to_store
- routed_to_archive
- routed_to_liquidation
- published
- sold

## 4.7 Media Asset

Represents a photo, video, scan, or derived asset.

Fields:
- `id`
- `object_id`
- `kind`
- `storage_path`
- `mime_type`
- `width`
- `height`
- `duration`
- `checksum`
- `caption`
- `shot_at`
- `shot_by`
- `is_primary`
- `sort_order`
- `derivative_of`
- `visibility`

## 4.8 Research Entry

Tracks provenance, reference material, notes, and source links.

Fields:
- `id`
- `object_id`
- `source_type`
- `source_url`
- `citation`
- `summary`
- `confidence`
- `created_by`
- `notes`
- `created_at`

## 4.9 Route

Represents where an object is intended to go.

Examples:
- storefront
- public website feature
- personal archive
- liquidation
- hold for research
- hold for restoration

## 4.10 Sales Record

Tracks actual sale events and ties them back to the object.

Fields:
- `id`
- `object_id`
- `channel`
- `square_sale_id`
- `sold_at`
- `sale_price`
- `fees`
- `notes`

## 4.11 Collection

Groups objects for public or internal use.

Examples:
- taxidermy
- lamp restorations
- curiosities cabinet
- featured this month
- spring jewelry release

---

# 5. State Model

Do not flatten everything into one status field.

Tiger Dust needs at least three parallel dimensions:

## 5.1 Lifecycle State
Examples:
- acquired
- processing
- ready
- published
- sold
- archived

## 5.2 Physical Location
Where the object actually is right now.

## 5.3 Route Intent
Where the object is meant to end up.

Examples:
- storefront
- archive
- liquidation
- undecided

This allows a realistic record such as:

> Acquired, currently in lamp lab, intended for storefront, photography pending.

---

# 6. Workflow Map

## 6.1 Primary workflow

1. **Acquisition**
   - item enters the system
   - initial photo or placeholder record added
   - temporary title allowed

2. **Intake**
   - assign object type
   - assign rough tags
   - assign current location
   - capture initial condition notes

3. **Processing**
   - cleaning
   - repair/restoration
   - jewelry work
   - lapidary work
   - bundling or separating related items

4. **Research**
   - provenance
   - comparative references
   - maker/source notes
   - pricing context

5. **Photography / Media**
   - basic record image
   - staged detail photos
   - optional video
   - assign primary image

6. **Pricing / Review**
   - cost basis
   - target price
   - fit with store/archive/liquidation

7. **Routing Decision**
   - storefront
   - online/public feature
   - archive
   - liquidation
   - hold

8. **Publication / Sales Readiness**
   - public visibility on/off
   - Square sync if applicable
   - collection placement if public

9. **Sale or Retention**
   - sold
   - removed from public view if needed
   - retained in archive
   - moved to historical record

## 6.2 Secondary workflow reality

Not every object follows a straight line.

The system must support:
- going back from pricing to research
- moving between locations multiple times
- changing route intent
- becoming archive-only after originally being for sale
- being sold without ever being published publicly

---

# 7. Public Site Map

## 7.1 Required pages

### Home
Must clearly communicate:
- what Tiger Dust is
- basic aesthetic and identity
- key categories
- hours
- location
- map path
- social links
- selected featured objects or gallery blocks

### About
Brand story, voice, and point of view.

### Visit / Contact
- address
- open hours
- map link
- phone/contact details
- social links

### Gallery / Featured Objects
Curated selection only.

### Object Detail Pages (optional in MVP if content exists)
Only for explicitly published objects.

### Events / Journal (later)
Optional expansion area for storytelling and programming.

## 7.2 Public requirements

- mobile-friendly
- fast-loading
- easy to update
- curated, not exhaustive
- public data sourced from internal system or curated content layer
- no dependency on raw internal records being customer-readable

---

# 8. Internal Screen Map

## 8.1 Intake Queue

Purpose:
Show newly added or incomplete records.

Filters:
- missing photo
- missing route
- missing location
- missing object type
- missing price
- missing research

## 8.2 Object Detail Screen

The central record for each object.

Includes:
- title
- photos
- tags
- location
- workflow timeline
- notes
- pricing
- route intent
- public visibility
- Square mapping
- research notes

## 8.3 Processing Board

Kanban-style operational board by workflow stage.

Columns might include:
- intake
- cleaning
- repair
- research
- photography
- pricing
- routing
- ready

## 8.4 Location Browser

Allows viewing all objects by physical location.

Useful for:
- guest house staging
- lamp lab
- jewelry studio
- storefront
- archive storage
- liquidation area

## 8.5 Routing Review Screen

A decision-making interface for where objects should go.

Buckets:
- storefront candidate
- archive candidate
- liquidation candidate
- hold for research
- hold for repair

## 8.6 Media Desk

For managing photos and media quality.

Filters:
- no primary image
- no media
- only intake photo
- needs detail shots
- public-ready media

## 8.7 Sales Reconciliation Screen

Purpose:
Compare internal records with Square activity.

Examples:
- sold in Square, not marked sold internally
- object marked public but already sold
- missing Square link on sale-ready item

## 8.8 Publishing Controls

Simple controls for public site visibility.

Per object:
- public on/off
- feature on homepage on/off
- feature in collection on/off
- use in gallery on/off

---

# 9. Square Integration Strategy

## 9.1 Principle

Square is a sales channel, not the system of record.

The Tiger Dust catalog database should remain the primary source of truth.

## 9.2 Initial integration behavior

When an object is ready for sale:
- it may be linked to or created in Square
- its `square_item_id` is stored
- sale activity from Square updates internal state

## 9.3 Why not make Square the primary system

Square does not model:
- provenance
- research
- restoration workflow
- archive intent
- object history
- internal curation logic

## 9.4 Special case: batch merch

Shirts and other repeatable items may need a separate product/inventory model.
These should not force one-of-a-kind objects into a generic retail schema.

---

# 10. Media Strategy

## 10.1 Short term

Use structured storage for:
- originals
- web derivatives
- thumbnails
- optional video

## 10.2 Mid term

Track:
- intake photo
- staged photo set
- detail shots
- before/after restoration
- research/reference images

## 10.3 Long term

This becomes the foundation of the digital twin/archive layer.

---

# 11. Search Strategy

## 11.1 MVP search

Use Postgres text search across:
- title
- object type
- tags
- notes
- materials
- research summaries
- location

## 11.2 Later search improvements

Add richer filtering and possibly embeddings later if truly useful.

Do not lead with AI search unless the base metadata is sound.

---

# 12. Roles and Permissions

Keep early roles simple.

## Proposed roles
- **Admin** — full access
- **Editor** — content and object editing
- **Operator** — intake/workflow/media updates
- **Viewer** — read-only

Early likely mapping:
- Jason: Admin
- Laura: Admin
- Sarah: Operator or Editor depending on workflow needs

---

# 13. MVP Scope

## 13.1 MVP goal

Deliver a system that is already useful in day-to-day operations while keeping the website functional and practical.

## 13.2 MVP includes

### Public side
- homepage
- about page
- visit/contact page
- curated gallery or selected objects page
- mobile-friendly design
- easy maintenance of hours/address/social links

### Internal side
- login
- object CRUD
- tags
- locations
- media upload
- workflow state/events
- route intent
- public visibility controls
- search/filter

## 13.3 MVP excludes

Not required for first release:
- full ecommerce storefront
- customer accounts
- advanced AI features
- deep digital twin functionality
- highly complex automation
- exhaustive public inventory

---

# 14. Phased Build Plan

## Phase 0 — Stabilize current website
- audit current static site
- improve mobile usability
- verify maps/contact/hours/social links
- preserve current usefulness

## Phase 1 — Define the system
- finalize domain model
- finalize workflow map
- finalize screen map
- define MVP boundaries

## Phase 2 — Build core internal foundation
- database schema
- auth
- object records
- tags
- locations
- media
- workflow events
- search/filter

## Phase 3 — Rebuild public site on top of structured data
- homepage
- about
- visit/contact
- curated gallery
- selected public object pages

## Phase 4 — Add operational workflow tools
- intake queue
- processing board
- location browser
- routing review
- media desk

## Phase 5 — Integrate Square
- item linkage
- sync sale state
- reconcile mismatches

## Phase 6 — Add research/archive depth
- provenance
- source tracking
- richer media structure
- archive support

---

# 15. Immediate Next Documents

Before implementation, create these working docs:

1. **Entity schema draft**
2. **Workflow diagram**
3. **Screen-by-screen IA**
4. **MVP build checklist**

These will turn the spec into an implementable plan.

---

# 16. Final Direction

Tiger Dust v2 should:
- keep the public website simple and useful
- build a strong internal catalog/workflow system behind it
- treat objects as the core unit
- support real locations and real movement
- preserve curation and taste as decision-making tools
- avoid forcing the business into generic ecommerce software logic

The right system is not “high tech for its own sake.”
It is a better reflection of how Tiger Dust actually works.
