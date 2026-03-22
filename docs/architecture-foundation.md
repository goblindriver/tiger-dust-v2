# Architecture Foundation

## Why this stack

This scaffold follows the recommendation in the Tiger Dust v2 spec pack:
- **Next.js** for the public site and internal app shell
- **TypeScript** for safer schema/app iteration
- **Postgres** as the main relational store
- **Prisma** for the first schema implementation draft
- **Supabase Auth** as the likely internal login path
- **Supabase Storage or S3-compatible storage** as the media layer
- **Square** treated as a downstream channel, not the source of truth

## Foundation choices made in this chunk

### Next.js App Router
Chosen because the project needs both public-facing pages and internal admin routes in one codebase.

### Prisma first, not Drizzle
Either could work, but Prisma is the faster way to turn the schema draft into a readable initial implementation with migrations and seeds.

### Simple text-controlled values for MVP
Lifecycle status, route intent, visibility, and role fields are modeled as strings for now.
That matches the planning docs, which explicitly recommend starting with controlled values and app validation before locking everything into DB enums.

### Auth is scaffolded, not finished
This chunk adds:
- role definitions
- guard helpers
- session placeholder
- Supabase server client placeholder

It does **not** yet implement a real login flow.
That is deliberate.

### Public site shell is present but minimal
The public pages exist now so the codebase is already structured around the two-layer product model.
They are intentionally placeholder surfaces, not final design.

## Immediate next implementation targets
1. install dependencies and run first Prisma generate/migration
2. wire Supabase auth to `users.auth_provider_user_id`
3. create the first authenticated internal layout
4. build object list + create + detail flow
5. build reference data admin UI for types/tags/locations
