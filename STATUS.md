# STATUS

## Object workflow progress

Implemented the next smallest real object workflow step only:

- added core-field editing to `/app/objects/[slug]`
  - the detail page now includes a small edit form for title, object type, lifecycle status, route/disposition, location, asking price, and condition notes
  - the screen keeps demo/fallback behavior explicit instead of pretending edits persist when DB/env is unavailable
- added a dedicated detail-page server action in `src/app/app/objects/[slug]/actions.ts`
  - validates form input with Zod
  - updates the `objects` row when the DB is available
  - resolves object type + location by seeded slugs so the form stays grounded in reference data
  - revalidates the object list and current detail route after save
  - fails clearly when `DATABASE_URL` or required seeded reference rows are missing
- made location edits write history, not just display changes
  - when location changes, the action closes any open `object_location_history` row by setting `left_at`
  - then it creates a new current `object_location_history` entry in the same transaction
  - unchanged locations do not create duplicate history noise
- added `src/app/app/objects/[slug]/object-detail-edit-form.tsx`
  - uses `useActionState` for inline save feedback and pending state
  - keeps the edit slice tightly scoped to the seven requested fields only
- extended `src/features/objects/data.ts`
  - object detail records now carry object-type and location slugs for form defaults in both DB and demo modes
  - demo objects were updated so the detail edit form stays locally runnable without infra
- refreshed the detail-page copy in `src/app/app/objects/[slug]/page.tsx`
  - replaced the old “next editable blocks” placeholder with the real current edit slice and clearly marked what remains out of scope

## Verification

- `npm run typecheck` ✅
- `npm run build` ✅

## Next small step

Add explicit workflow-event logging from the object detail page so repairs, photography, research, and routing milestones can be recorded as discrete events without broadening into media, research CRUD, or larger workflow tooling.
