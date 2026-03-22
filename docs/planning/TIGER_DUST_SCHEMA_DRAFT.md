# Tiger Dust v2 Schema Draft

## Purpose

This document translates the Tiger Dust v2 spec into a practical relational schema draft.

It is optimized for:
- one-of-a-kind objects
- low-tech real-world intake
- physical location tracking
- workflow history
- media attachment
- public visibility controls
- future Square integration
- future research/archive depth

This is not meant to be final code yet.
It is the data model we should pressure-test before implementation.

---

# 1. Design Principles

## 1.1 Object-first, not product-first

The core record is an **object**, not a generic ecommerce product.

Why:
- many items are one-offs
- some are handmade
- some are restored
- some are not for sale
- some belong in archive/liquidation/storefront
- some may never enter Square

## 1.2 Support progressive enrichment

Intake should be lightweight.
A record must be allowed to start incomplete and get richer over time.

That means many fields should be optional at first.

## 1.3 Preserve history

Do not overwrite reality when things move or change.
Use event/history tables where movement and process matter.

## 1.4 Public visibility is explicit

No object should become public by accident.
Public exposure must be intentional.

## 1.5 Phase 1 must support merch

Tiger Dust Phase 1 is not unique-object-only.
The system must also support merch demand early, especially for out-of-town customers.

That means the schema should handle both:
- unique one-off objects
- repeatable saleable items with quantity/variant logic

The cleanest direction is to preserve the object-first worldview while allowing a second layer for sellable units/variants where needed.

---

# 2. Core Tables

## 2.1 `objects`

The canonical record for a physical object, handmade item, merch item, or archival piece.

### Fields
- `id` UUID PK
- `slug` TEXT UNIQUE NULL
- `title` TEXT NOT NULL
- `subtitle` TEXT NULL
- `object_type_id` UUID NULL FK -> object_types.id
- `lifecycle_status` TEXT NOT NULL DEFAULT 'acquired'
- `route_intent` TEXT NOT NULL DEFAULT 'undecided'
- `visibility` TEXT NOT NULL DEFAULT 'internal'
- `description_short` TEXT NULL
- `description_long` TEXT NULL
- `materials` TEXT NULL
- `dimensions` JSONB NULL
- `condition_notes` TEXT NULL
- `is_one_of_a_kind` BOOLEAN NOT NULL DEFAULT true
- `is_batch_item` BOOLEAN NOT NULL DEFAULT false
- `is_archival` BOOLEAN NOT NULL DEFAULT false
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `intake_stage` TEXT NOT NULL DEFAULT 'draft'
- `date_acquired` TIMESTAMPTZ NULL
- `acquisition_type` TEXT NULL
- `acquisition_source` TEXT NULL
- `cost_basis_cents` INTEGER NULL
- `asking_price_cents` INTEGER NULL
- `sold_price_cents` INTEGER NULL
- `currency` TEXT NOT NULL DEFAULT 'USD'
- `primary_location_id` UUID NULL FK -> locations.id
- `primary_image_id` UUID NULL FK -> media_assets.id
- `square_item_id` TEXT NULL
- `square_variation_id` TEXT NULL
- `published_at` TIMESTAMPTZ NULL
- `sold_at` TIMESTAMPTZ NULL
- `archived_at` TIMESTAMPTZ NULL
- `created_by_user_id` UUID NULL FK -> users.id
- `updated_by_user_id` UUID NULL FK -> users.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Notes
This table should remain broad enough to support a minimal first record and a richly documented mature record.

---

## 2.2 `object_types`

Defines broad category/class of object.

### Fields
- `id` UUID PK
- `slug` TEXT UNIQUE NOT NULL
- `name` TEXT NOT NULL
- `description` TEXT NULL
- `sort_order` INTEGER NOT NULL DEFAULT 0
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example values
- lamp
- jewelry
- taxidermy
- skull
- crystal
- fossil
- furniture
- artwork
- book
- media
- shirt
- oddity
- archive-item

---

## 2.3 `tags`

Cross-cutting descriptive vocabulary.

### Fields
- `id` UUID PK
- `slug` TEXT UNIQUE NOT NULL
- `name` TEXT NOT NULL
- `tag_type` TEXT NULL
- `description` TEXT NULL
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example tag types
- style
- material
- theme
- era
- motif
- process
- season

---

## 2.4 `object_tags`

Many-to-many relationship between objects and tags.

### Fields
- `object_id` UUID NOT NULL FK -> objects.id
- `tag_id` UUID NOT NULL FK -> tags.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Constraints
- PK (`object_id`, `tag_id`)

---

## 2.5 `locations`

Physical places where objects can be.

### Fields
- `id` UUID PK
- `parent_location_id` UUID NULL FK -> locations.id
- `slug` TEXT UNIQUE NOT NULL
- `name` TEXT NOT NULL
- `location_type` TEXT NOT NULL
- `description` TEXT NULL
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `sort_order` INTEGER NOT NULL DEFAULT 0
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example location types
- compound
- studio
- room
- staging
- storefront
- archive
- liquidation
- storage

### Notes
Self-reference allows nesting such as:
- compound
  - guest house staging
  - lamp lab
  - jewelry studio
- tiger dust
  - sales floor
  - back room

---

## 2.6 `object_location_history`

Tracks every move through physical space.

### Fields
- `id` UUID PK
- `object_id` UUID NOT NULL FK -> objects.id
- `location_id` UUID NOT NULL FK -> locations.id
- `entered_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `left_at` TIMESTAMPTZ NULL
- `reason` TEXT NULL
- `notes` TEXT NULL
- `recorded_by_user_id` UUID NULL FK -> users.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Notes
There should typically be at most one open location row per object where `left_at IS NULL`.
The app can enforce this.

---

## 2.7 `workflow_events`

Append-only log of workflow changes and milestones.

### Fields
- `id` UUID PK
- `object_id` UUID NOT NULL FK -> objects.id
- `event_type` TEXT NOT NULL
- `from_state` TEXT NULL
- `to_state` TEXT NULL
- `notes` TEXT NULL
- `event_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `created_by_user_id` UUID NULL FK -> users.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example event types
- intake_created
- intake_updated
- cleaned
- repaired
- lapidary_work
- jewelry_fabrication
- photography_started
- photography_completed
- research_added
- priced
- routed
- published
- sold
- archived

---

## 2.8 `media_assets`

Stores metadata for all image/video/scan assets tied to objects.

### Fields
- `id` UUID PK
- `object_id` UUID NULL FK -> objects.id
- `storage_provider` TEXT NOT NULL DEFAULT 'supabase'
- `storage_path` TEXT NOT NULL
- `kind` TEXT NOT NULL
- `mime_type` TEXT NULL
- `original_filename` TEXT NULL
- `width` INTEGER NULL
- `height` INTEGER NULL
- `duration_seconds` NUMERIC NULL
- `file_size_bytes` BIGINT NULL
- `checksum_sha256` TEXT NULL
- `caption` TEXT NULL
- `alt_text` TEXT NULL
- `visibility` TEXT NOT NULL DEFAULT 'internal'
- `is_primary` BOOLEAN NOT NULL DEFAULT false
- `sort_order` INTEGER NOT NULL DEFAULT 0
- `shot_at` TIMESTAMPTZ NULL
- `shot_by_user_id` UUID NULL FK -> users.id
- `derivative_of_asset_id` UUID NULL FK -> media_assets.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example kinds
- photo
- video
- scan
- document
- thumbnail
- web-derivative

### Notes
Allow object_id to be NULL only if you want a temporary unassigned media inbox.
If not needed, make it NOT NULL later.

---

## 2.9 `research_entries`

Provenance, source notes, references, and contextual research.

### Fields
- `id` UUID PK
- `object_id` UUID NOT NULL FK -> objects.id
- `source_type` TEXT NULL
- `source_url` TEXT NULL
- `citation` TEXT NULL
- `summary` TEXT NULL
- `confidence` TEXT NULL
- `notes` TEXT NULL
- `created_by_user_id` UUID NULL FK -> users.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example confidence values
- low
- medium
- high

---

## 2.10 `collections`

Curated groupings for public or internal presentation.

### Fields
- `id` UUID PK
- `slug` TEXT UNIQUE NOT NULL
- `name` TEXT NOT NULL
- `description` TEXT NULL
- `visibility` TEXT NOT NULL DEFAULT 'internal'
- `is_featured` BOOLEAN NOT NULL DEFAULT false
- `starts_at` TIMESTAMPTZ NULL
- `ends_at` TIMESTAMPTZ NULL
- `created_by_user_id` UUID NULL FK -> users.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

---

## 2.11 `collection_objects`

Many-to-many between collections and objects.

### Fields
- `collection_id` UUID NOT NULL FK -> collections.id
- `object_id` UUID NOT NULL FK -> objects.id
- `sort_order` INTEGER NOT NULL DEFAULT 0
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Constraints
- PK (`collection_id`, `object_id`)

---

## 2.12 `sales_records`

Internal record of a sale event.

### Fields
- `id` UUID PK
- `object_id` UUID NOT NULL FK -> objects.id
- `channel` TEXT NOT NULL
- `square_sale_id` TEXT NULL
- `square_order_id` TEXT NULL
- `sold_at` TIMESTAMPTZ NOT NULL
- `sale_price_cents` INTEGER NOT NULL
- `currency` TEXT NOT NULL DEFAULT 'USD'
- `fees_cents` INTEGER NULL
- `tax_cents` INTEGER NULL
- `notes` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example channels
- square
- in-store
- direct
- event
- archive-transfer

---

## 2.13 `publish_profiles`

Controls whether and how an object appears publicly.

### Fields
- `id` UUID PK
- `object_id` UUID NOT NULL UNIQUE FK -> objects.id
- `is_public` BOOLEAN NOT NULL DEFAULT false
- `is_featured_home` BOOLEAN NOT NULL DEFAULT false
- `is_featured_gallery` BOOLEAN NOT NULL DEFAULT false
- `public_title` TEXT NULL
- `public_excerpt` TEXT NULL
- `public_description` TEXT NULL
- `public_price_mode` TEXT NOT NULL DEFAULT 'hidden'
- `public_status_label` TEXT NULL
- `seo_title` TEXT NULL
- `seo_description` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example public price modes
- hidden
- visible
- sold
- inquire

### Notes
This table separates internal object truth from public editorial treatment.
That’s useful.

---

## 2.14 `inventory_items` (Phase 1 merch support)

Represents sellable inventory records for repeatable products, merch, editions, or multiple-unit items.

### Fields
- `id` UUID PK
- `object_id` UUID NULL FK -> objects.id
- `slug` TEXT UNIQUE NULL
- `title` TEXT NOT NULL
- `inventory_type` TEXT NOT NULL DEFAULT 'merch'
- `sku` TEXT NULL
- `status` TEXT NOT NULL DEFAULT 'active'
- `quantity_on_hand` INTEGER NOT NULL DEFAULT 0
- `quantity_reserved` INTEGER NOT NULL DEFAULT 0
- `reorder_threshold` INTEGER NULL
- `price_cents` INTEGER NULL
- `currency` TEXT NOT NULL DEFAULT 'USD'
- `square_item_id` TEXT NULL
- `square_variation_id` TEXT NULL
- `primary_image_id` UUID NULL FK -> media_assets.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Notes
Use this table for:
- shirts
- repeatable printed merch
- editions
- productized handmade runs

If a merch item is conceptually tied to a design/object record, it can optionally point back to `objects.id`.
If it stands alone as straightforward merch, it can live here directly.

## 2.15 `inventory_variants` (Phase 1 merch support)

Optional variant layer for size/color/version differences.

### Fields
- `id` UUID PK
- `inventory_item_id` UUID NOT NULL FK -> inventory_items.id
- `sku` TEXT NULL
- `variant_name` TEXT NOT NULL
- `option_values` JSONB NULL
- `quantity_on_hand` INTEGER NOT NULL DEFAULT 0
- `quantity_reserved` INTEGER NOT NULL DEFAULT 0
- `price_cents` INTEGER NULL
- `currency` TEXT NOT NULL DEFAULT 'USD'
- `square_variation_id` TEXT NULL
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example uses
- shirt size variants
- color variants
- print run variations

# 3. Support Tables

## 3.1 `users`

Internal users only.

### Fields
- `id` UUID PK
- `auth_provider_user_id` TEXT UNIQUE NULL
- `email` TEXT UNIQUE NULL
- `display_name` TEXT NOT NULL
- `role` TEXT NOT NULL DEFAULT 'operator'
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example roles
- admin
- editor
- operator
- viewer

---

## 3.2 `object_relationships` (optional but likely useful)

Represents meaningful relationships between objects.

### Fields
- `id` UUID PK
- `source_object_id` UUID NOT NULL FK -> objects.id
- `target_object_id` UUID NOT NULL FK -> objects.id
- `relationship_type` TEXT NOT NULL
- `notes` TEXT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example relationship types
- part_of_set
- pair_with
- derived_from
- variant_of
- companion_piece

This is likely useful later for sets, pairings, and grouped displays.

---

## 3.3 `object_valuations` (optional later)

If pricing gets more nuanced over time.

### Fields
- `id` UUID PK
- `object_id` UUID NOT NULL FK -> objects.id
- `valuation_type` TEXT NOT NULL
- `amount_cents` INTEGER NOT NULL
- `currency` TEXT NOT NULL DEFAULT 'USD'
- `notes` TEXT NULL
- `created_by_user_id` UUID NULL FK -> users.id
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

### Example valuation types
- cost_basis
- asking_price
- reserve_price
- archive_estimate
- sold_price

This is optional because MVP can keep price directly on `objects`.

---

# 4. Enums / Controlled Values

These can start as TEXT with app validation and migrate to stricter enums later.

## 4.1 `lifecycle_status`
Suggested values:
- acquired
- intake
- processing
- ready
- published
- sold
- archived

## 4.2 `route_intent`
Suggested values:
- undecided
- storefront
- website-feature
- archive
- liquidation
- hold

## 4.3 `visibility`
Suggested values:
- internal
- public
- archived

## 4.4 `intake_stage`
Suggested values:
- draft
- minimal
- enriched
- review-ready

---

# 5. Relationships Summary

## One-to-many
- one `object_type` -> many `objects`
- one `location` -> many `objects` (current primary location)
- one `object` -> many `workflow_events`
- one `object` -> many `media_assets`
- one `object` -> many `research_entries`
- one `object` -> many `sales_records`
- one `user` -> many created records

## Many-to-many
- `objects` <-> `tags` via `object_tags`
- `collections` <-> `objects` via `collection_objects`

## Self-referential
- `locations.parent_location_id`
- `media_assets.derivative_of_asset_id`
- `object_relationships.source_object_id/target_object_id`

---

# 6. MVP Schema Cut

If we need the smallest useful version, ship these first:

## Required MVP tables
- `users`
- `objects`
- `object_types`
- `tags`
- `object_tags`
- `locations`
- `object_location_history`
- `workflow_events`
- `media_assets`
- `publish_profiles`

## Optional for MVP but valuable soon after
- `research_entries`
- `collections`
- `collection_objects`
- `sales_records`

---

# 7. Example Object Record Lifecycle

## Day 1 intake
Create object with:
- title: “Brass lamp with stained glass shade”
- object_type_id: lamp
- lifecycle_status: acquired
- route_intent: undecided
- visibility: internal
- primary_location_id: guest-house-staging
- 1 intake photo

## Day 3 enrichment
Update with:
- condition notes
- cost basis
- more photos
- workflow events for cleaning / lamp work
- tags: brass, stained-glass, vintage

## Day 7 routing
Update with:
- route_intent: storefront
- asking_price_cents
- publish profile for public site
- featured collection assignment if desired

## On sale
- create `sales_record`
- update `sold_at`
- set lifecycle_status to sold
- optionally keep object public with sold state, or remove from public display

---

# 8. Implementation Notes

## 8.1 Use app-level defaults for easy intake
A new object should be creatable in seconds.

## 8.2 Avoid over-normalizing too early
The data model should be expressive, not bureaucratic.

## 8.3 Prefer history tables over destructive overwrites
Especially for:
- location
- workflow
- pricing changes (later, if needed)

## 8.4 Keep public publishing separate from internal truth
That separation will save pain.

---

# 9. Next Steps

After approving this schema draft, the next documents should be:

1. **Prisma schema draft** or **SQL DDL draft**
2. **Screen-to-table mapping**
3. **MVP API contract**
4. **Seed data plan** for object types, locations, and routes

---

# 10. Final Direction

This schema is designed to support a business that is:
- curation-driven
- object-driven
- physical-world and location-sensitive
- partially retail, partially archive
- low-tech in day-to-day behavior
- high-context rather than mass-inventory optimized

That is why it should fit Tiger Dust better than a generic ecommerce schema.
