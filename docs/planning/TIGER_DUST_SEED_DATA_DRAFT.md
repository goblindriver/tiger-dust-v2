# Tiger Dust v2 Seed Data Draft
Last reviewed: 2026-03-22 — content is accurate. All seed data in this document has been implemented: 26 object types, 18 locations, 27 tags, 8 collections, 3 users. Workflow event types and controlled values are seeded and live.

## Purpose

This document defines the first-pass seed data needed to make the Tiger Dust schema usable from day one.

Without seed data, the schema is just structure.
With seed data, the team can start creating records in a way that reflects the actual business.

This draft focuses on:
- object types
- lifecycle statuses
- route intents
- intake stages
- visibility states
- location hierarchy
- tag starter vocabulary
- workflow event starter list
- collection starter list

---

# 1. Object Types

These are broad enough to be useful but specific enough to help with intake and browsing.

## Core seed set

| Slug | Name | Notes |
|---|---|---|
| lamp | Lamp | Includes restored lamps and lighting pieces |
| chandelier | Chandelier | Distinct from smaller lamps |
| jewelry | Jewelry | Handmade or found jewelry |
| taxidermy | Taxidermy | Mounted animals and preserved display pieces |
| skull | Skull | Bone/skull category when worth distinguishing |
| crystal | Crystal | Crystals, points, clusters |
| fossil | Fossil | Fossils and mineral-adjacent specimens |
| specimen | Specimen | General natural specimen category |
| artwork | Artwork | Original art, framed work, prints |
| print | Print | Posters, prints, graphic work |
| book | Book | Occult books, vintage books, printed matter |
| media | Media | VHS, tapes, DVDs, other media formats |
| decor | Decor | General home decor / curios |
| furniture | Furniture | Shelving, tables, chairs, cabinets |
| oddity | Oddity | Weird one-offs that don’t fit elsewhere |
| ritual-object | Ritual Object | Esoteric/ceremonial/occult-use objects |
| collectible | Collectible | General collectible object |
| garment | Garment | Clothing items |
| shirt | Shirt | Merch / wearable printed shirt |
| accessory | Accessory | Smaller wearable/non-jewelry accessory |
| mask | Mask | Masks and wall/display mask pieces |
| signage | Signage | Signs, plaques, display signage |
| arcade | Arcade | Pinball/arcade-adjacent items |
| archive-item | Archive Item | Internal/personal archive objects |
| tool | Tool | Studio/workshop-related tools if tracked |
| supplies | Supplies | Consumable or process-related supply items |

## Notes
- Start broad. Add more only when real intake proves the need.
- Avoid 40 hyper-specific categories at launch.
- `oddity` should exist, but should not become a lazy dumping ground for everything.

## Phase 1 merch note

Phase 1 should assume merch matters.
That means the seed set should also support:
- shirt designs
- size/color variants
- repeatable product records
- quantity tracking

The object type seeds above are still useful, but merch should not be forced to behave exactly like one-off found objects.

---

# 2. Lifecycle Statuses

These represent the broad operational state of an object.

| Value | Meaning |
|---|---|
| acquired | Entered system, not fully processed |
| intake | Basic record created, needs enrichment |
| processing | Undergoing cleaning, repair, research, or prep |
| ready | Operationally ready for routing/sale/publication |
| published | Publicly visible on website or public-facing channel |
| sold | Sold or otherwise transferred out |
| archived | Retained as historical/archive record |
| inactive | Not currently in active workflow |

## Notes
- `published` should not imply sold.
- `archived` should not imply hidden forever; some archival records may remain public later.

---

# 3. Route Intents

These are not the same as lifecycle states.
They represent where an object is meant to go.

| Value | Meaning |
|---|---|
| undecided | No final route chosen yet |
| storefront | Intended for Tiger Dust shop floor |
| website-feature | Intended for website/public feature |
| archive | Intended for personal/archive retention |
| liquidation | Intended for liquidation/offloading |
| hold | Temporarily held pending decision or more work |
| consignment | If applicable later |
| event | Intended for pop-up/event use |

## Notes
- `website-feature` can coexist with storefront as a public treatment, but as a route seed it’s okay to keep simple for now.
- If dual routing becomes common, later split route into primary/secondary or use a separate routing table.

---

# 4. Intake Stages

Represents metadata completeness rather than operational state.

| Value | Meaning |
|---|---|
| draft | Bare minimum record started |
| minimal | Enough info to track object reliably |
| enriched | Better metadata, more usable internally |
| review-ready | Good enough for pricing/routing/public review |
| complete | Fully documented for current needs |

---

# 5. Visibility States

Controls public exposure.

| Value | Meaning |
|---|---|
| internal | Internal-only |
| public | Can appear publicly |
| archived | Retained but not actively surfaced |

## Notes
Use `publish_profiles` for more detailed public controls.

---

# 6. Public Price Modes

For publish profile seed values.

| Value | Meaning |
|---|---|
| hidden | No price shown publicly |
| visible | Price visible |
| inquire | Ask/contact for price |
| sold | Publicly marked as sold |

---

# 7. User Roles

| Value | Meaning |
|---|---|
| admin | Full control |
| editor | Can edit content and object records |
| operator | Intake/workflow/media updates |
| viewer | Read-only |

---

# 8. Location Hierarchy

This is one of the most important seed sets because it grounds the system in physical reality.

## Top-level locations

| Slug | Name | Type | Parent |
|---|---|---|---|
| compound | Compound | compound | null |
| tiger-dust-store | Tiger Dust Store | storefront | null |
| archive-storage | Archive Storage | archive | null |
| liquidation-holding | Liquidation Holding | liquidation | null |

## Compound child locations

| Slug | Name | Type | Parent |
|---|---|---|---|
| guest-house-staging | Guest House Staging | staging | compound |
| lamp-lab | Lamp Lab | studio | compound |
| jewelry-studio | Jewelry Studio | studio | compound |
| photo-station | Photo Station | studio | compound |
| screen-printing | Screen Printing Area | studio | compound |
| intake-holding | Intake Holding | storage | compound |

## Tiger Dust store child locations

| Slug | Name | Type | Parent |
|---|---|---|---|
| store-sales-floor | Sales Floor | storefront | tiger-dust-store |
| store-front-window | Front Window Display | storefront | tiger-dust-store |
| store-back-room | Back Room | storage | tiger-dust-store |
| store-counter-display | Counter Display | storefront | tiger-dust-store |

## Optional additional locations

| Slug | Name | Type | Parent |
|---|---|---|---|
| repair-hold | Repair Hold | storage | compound |
| research-hold | Research Hold | storage | compound |
| photo-ready-hold | Photo Ready Hold | staging | compound |
| priced-ready-hold | Priced Ready Hold | staging | compound |

## Notes
- Keep the first seed set small enough that the team will use it consistently.
- Add more sublocations only when they solve a real problem.

---

# 9. Workflow Event Starter List

These should be seed-controlled values for the app UI.

| Value | Meaning |
|---|---|
| intake_created | Object record created |
| intake_updated | Intake metadata updated |
| location_moved | Object moved to new location |
| cleaning_started | Cleaning process started |
| cleaning_completed | Cleaning completed |
| repair_started | Repair/restoration started |
| repair_completed | Repair/restoration completed |
| lapidary_started | Lapidary work started |
| lapidary_completed | Lapidary work completed |
| fabrication_started | Jewelry/fabrication started |
| fabrication_completed | Jewelry/fabrication completed |
| photography_started | Photography underway |
| photography_completed | Photo set completed |
| research_started | Research underway |
| research_added | Research added |
| pricing_set | Asking price set |
| route_changed | Route decision updated |
| publish_enabled | Public visibility enabled |
| publish_disabled | Public visibility disabled |
| sold_recorded | Sale recorded |
| archived_recorded | Archive state recorded |

---

# 10. Tag Starter Vocabulary

Start with a restrained but useful tag vocabulary.
These are seeds, not a final taxonomy.

## Style / Theme tags
- occult
- gothic
- victorian
- macabre
- playful
- mystical
- religious
- folk-art
- carnival
- sideshow
- retro
- haunted
- handmade
- one-of-a-kind

## Material tags
- brass
- silver
- bone
- wood
- glass
- crystal
- stone
- leather
- velvet
- fabric
- metal
- ceramic

## Subject / Motif tags
- skull
- snake
- tiger
- moon
- star
- eye
- hand
- floral
- taxidermy
- fossil
- occult-book
- arcade
- pinball

## Era / vibe tags
- antique
- vintage
- mid-century
- 70s
- 80s
- 90s

## Process tags
- restored
- repaired
- cleaned
- photographed
- researched
- handmade-by-laura
- lapidary

## Notes
- Tags should stay descriptive and flexible.
- Avoid turning tags into a second rigid category tree.

---

# 11. Collection Starter Set

Collections help both public presentation and internal organization.

## Suggested initial collections

| Slug | Name | Visibility | Notes |
|---|---|---|---|
| featured-now | Featured Now | public | Homepage/public rotating selection |
| wonder-room | Wonder Room | public | High-level Tiger Dust curation |
| taxidermy-and-skulls | Taxidermy & Skulls | public | Strong visual/public grouping |
| occult-books-and-media | Occult Books & Media | public | Books/VHS/printed matter grouping |
| crystals-and-fossils | Crystals & Fossils | public | Natural specimen grouping |
| lamps-and-glow | Lamps & Glow | public | Lighting/decor grouping |
| jewelry-and-handmade | Jewelry & Handmade | public | Handmade/artist-made grouping |
| archived-favorites | Archived Favorites | internal | Internal or eventual public archive showcase |

---

# 12. Example Seed Strategy

## Day-one usable defaults
At launch, the app should already know:
- what object types exist
- what lifecycle states exist
- where objects can physically go
- what route options exist
- which workflow events to log
- what baseline tags are available

## Minimal required record at intake
For an object to exist, only require:
- title
- object type
- current location
- 1 image or placeholder note

Everything else can be enriched later.

---

# 13. Things to Avoid

Avoid seeding:
- too many hyper-specific object types
- dozens of locations nobody will remember
- tags that duplicate full descriptions
- workflow states so granular they become unusable

If the team can’t remember it, they won’t use it consistently.

---

# 14. Recommended Next Step

After this seed draft, the next artifact should be:

1. **Screen-to-table mapping**
2. **Prisma schema or SQL DDL**
3. **Seed import format** (JSON, SQL inserts, or TS seed file)

The best immediate next move is probably **screen-to-table mapping**, because it will test whether the schema and seed data actually support the UI we need.
