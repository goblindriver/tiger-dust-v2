export const recommendedStack = [
  { label: 'Framework', value: 'Next.js App Router' },
  { label: 'Language', value: 'TypeScript' },
  { label: 'Database', value: 'Postgres' },
  { label: 'ORM', value: 'Prisma' },
  { label: 'Auth', value: 'Supabase Auth (placeholder foundation)' },
  { label: 'Media storage', value: 'Supabase Storage or S3-compatible bucket' },
  { label: 'Sales channel', value: 'Square as downstream integration, not source of truth' },
  { label: 'Deployment', value: 'Vercel preferred in scaffold; Netlify still viable if desired later' },
] as const;
