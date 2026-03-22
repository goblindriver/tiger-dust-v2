# Tiger Dust v2

First implementation chunk for Tiger Dust v2.

This repo scaffolds the foundation for:
- a public-facing Next.js site
- an internal operations app for object + merch tracking
- a Prisma/Postgres data model based on the Tiger Dust planning docs
- auth/role placeholders shaped around Supabase Auth
- seed data scaffolding for object types, locations, tags, routes, and workflow defaults

## Chosen stack

- **Next.js 15** with App Router
- **TypeScript**
- **Prisma** over **Postgres**
- **Supabase Auth** placeholders for internal login
- **Supabase Storage / S3-compatible storage** as intended media layer
- **Zod** for typed config / validation work

This matches the recommendation in `TIGER_DUST_V2_SPEC.md` and keeps the foundation aligned with the planning docs.

## Current scope

This is intentionally only the first build chunk:
1. scaffold app foundation
2. document stack choices in-code
3. create initial schema implementation draft
4. add auth/role foundation placeholders
5. add seed-data scaffolding/scripts
6. initialize git
7. document status and assumptions

## Run later

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
npm run dev
```

## Project structure

- `src/app` — public + internal route skeletons
- `src/lib` — config, auth helpers, role guards, navigation metadata
- `src/features` — domain constants and helper modules
- `prisma/schema.prisma` — initial implementation schema draft
- `prisma/seed.ts` — seed scaffolding based on planning docs
- `STATUS.md` — what this first chunk created and what remains next

## Planning docs used as source of truth

Located in the parent OpenClaw workspace:
- `TIGER_DUST_V2_SPEC.md`
- `TIGER_DUST_SCHEMA_DRAFT.md`
- `TIGER_DUST_SEED_DATA_DRAFT.md`
- `TIGER_DUST_SCREEN_TO_TABLE_MAPPING.md`
- `TIGER_DUST_MVP_BUILD_CHECKLIST.md`
- `TIGER_DUST_ISSUE_BACKLOG_AND_MILESTONES.md`
