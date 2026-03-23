import type { UserRole } from '@/features/domain/constants';
import { getDb, isDatabaseConfigured } from '@/lib/db';

export type ObjectListItem = {
  id: string;
  slug: string;
  title: string;
  objectType: string | null;
  objectTypeSlug: string | null;
  lifecycleStatus: string;
  routeIntent: string;
  visibility: string;
  intakeStage: string;
  location: string | null;
  primaryLocationSlug: string | null;
  askingPriceCents: number | null;
  costBasisCents: number | null;
  primaryImagePath: string | null;
  tagNames: string[];
  hasResearch: boolean;
  updatedAt: string;
  subtitle: string | null;
  descriptionShort: string | null;
  materials: string | null;
  conditionNotes: string | null;
};

export type ObjectDetail = ObjectListItem & {
  descriptionLong: string | null;
  acquisitionType: string | null;
  acquisitionSource: string | null;
  dateAcquired: string | null;
  notesInternal: string | null;
  timeline: Array<{
    id: string;
    label: string;
    notes: string | null;
    at: string;
    kind: 'workflow' | 'location' | 'research';
  }>;
  media: Array<{
    id: string;
    kind: string;
    storagePath: string;
    caption: string | null;
    isPrimary: boolean;
  }>;
  research: Array<{
    id: string;
    citation: string | null;
    summary: string | null;
    sourceUrl: string | null;
    confidence: string | null;
  }>;
};

export type ObjectIntakeDefaults = {
  title: string;
  objectTypeSlug: string;
  lifecycleStatus: string;
  routeIntent: string;
  visibility: string;
  intakeStage: string;
  primaryLocationSlug: string;
  acquisitionType: string;
  acquisitionSource: string;
  askingPrice: string;
  conditionNotes: string;
  materials: string;
  tags: string[];
  descriptionShort: string;
};

export type AuthStatus = {
  mode: 'supabase' | 'development';
  configured: boolean;
  configuredItems: string[];
  missingItems: string[];
  suggestedRole: UserRole;
};

export type ObjectWorkflowSummary = {
  readinessLabel: 'needs intake' | 'needs pricing' | 'needs photography' | 'needs research' | 'ready to route';
  readinessTone: 'warning' | 'muted' | 'good';
  readinessItems: Array<{
    label: string;
    complete: boolean;
  }>;
  nextAction: string;
};

export type ObjectListFilters = {
  q: string;
  status: string;
  route: string;
  location: string;
  readiness: string;
};

const demoObjects: ObjectDetail[] = [
  {
    id: 'obj-lamp-001',
    slug: 'brass-serpent-lamp',
    title: 'Brass Serpent Lamp',
    subtitle: 'Recovered floor lamp slated for storefront',
    objectType: 'Lamp',
    objectTypeSlug: 'lamp',
    lifecycleStatus: 'processing',
    routeIntent: 'storefront',
    visibility: 'internal',
    intakeStage: 'enriched',
    location: 'Lamp Lab',
    primaryLocationSlug: 'lamp-lab',
    askingPriceCents: 28500,
    costBasisCents: 9000,
    primaryImagePath: 'objects/brass-serpent-lamp/intake-01.jpg',
    tagNames: ['brass', 'gothic', 'restored'],
    hasResearch: true,
    updatedAt: '2026-03-21T14:15:00.000Z',
    descriptionShort: 'Tall brass lamp with serpent detail and rewiring in progress.',
    descriptionLong:
      'Acquired during the post-flood recovery cycle. Electrically viable now, but still wants a final shade decision, polished photography, and a last pass on copy before it moves to guest-house staging or the sales floor.',
    materials: 'brass, fabric shade, electrical components',
    conditionNotes: 'Body cleaned. Socket rewired. Shade still under review.',
    acquisitionType: 'found / recovery',
    acquisitionSource: 'compound flood recovery',
    dateAcquired: '2026-03-10T15:00:00.000Z',
    notesInternal: 'Potential hero object for Lamps & Glow if final photos land well.',
    timeline: [
      { id: 'wf-1', label: 'Intake created', notes: 'Quick draft record from phone photo.', at: '2026-03-10T15:10:00.000Z', kind: 'workflow' },
      { id: 'wf-2', label: 'Moved to Lamp Lab', notes: 'Needs rewiring and polish.', at: '2026-03-11T10:00:00.000Z', kind: 'location' },
      { id: 'wf-3', label: 'Repair completed', notes: 'Functional test passed.', at: '2026-03-18T17:20:00.000Z', kind: 'workflow' },
      { id: 'wf-4', label: 'Research added', notes: 'Comparable brass figural lamps saved.', at: '2026-03-19T12:00:00.000Z', kind: 'research' },
    ],
    media: [
      { id: 'm-1', kind: 'image', storagePath: 'objects/brass-serpent-lamp/intake-01.jpg', caption: 'Intake shot on workbench', isPrimary: true },
      { id: 'm-2', kind: 'image', storagePath: 'objects/brass-serpent-lamp/detail-wiring.jpg', caption: 'Socket rewire detail', isPrimary: false },
    ],
    research: [
      {
        id: 'r-1',
        citation: 'Pairpoint / figural lamp comparables',
        summary: 'Not a direct maker match, but pricing context suggests mid-high 200s after final presentation.',
        sourceUrl: 'https://example.com/comparable-lamps',
        confidence: 'medium',
      },
    ],
  },
  {
    id: 'obj-jewel-002',
    slug: 'silver-onyx-chainmail-necklace',
    title: 'Silver + Onyx Chainmail Necklace',
    subtitle: 'Laura handmade piece heading toward photo + publish',
    objectType: 'Jewelry',
    objectTypeSlug: 'jewelry',
    lifecycleStatus: 'ready',
    routeIntent: 'website-feature',
    visibility: 'internal',
    intakeStage: 'complete',
    location: 'Guest House Staging',
    primaryLocationSlug: 'guest-house-staging',
    askingPriceCents: 16800,
    costBasisCents: 4200,
    primaryImagePath: 'objects/silver-onyx-chainmail-necklace/hero.jpg',
    tagNames: ['silver', 'handmade', 'handmade-by-laura'],
    hasResearch: false,
    updatedAt: '2026-03-21T13:00:00.000Z',
    descriptionShort: 'One-off chainmail necklace with polished onyx focal stone.',
    descriptionLong:
      'Built in-house and basically ready to go. The remaining work is presentation: approve the final image set, write public-facing copy, and decide whether it belongs in a feature collection or the normal storefront stream.',
    materials: 'silver, onyx',
    conditionNotes: 'Finished and photo-ready.',
    acquisitionType: 'handmade',
    acquisitionSource: 'Laura studio',
    dateAcquired: '2026-03-16T18:00:00.000Z',
    notesInternal: 'Candidate for homepage feature during jewelry push.',
    timeline: [
      { id: 'wf-5', label: 'Fabrication completed', notes: 'Final clasp installed.', at: '2026-03-16T18:00:00.000Z', kind: 'workflow' },
      { id: 'wf-6', label: 'Moved to Guest House Staging', notes: 'Awaiting staged photos.', at: '2026-03-17T11:15:00.000Z', kind: 'location' },
    ],
    media: [{ id: 'm-3', kind: 'image', storagePath: 'objects/silver-onyx-chainmail-necklace/hero.jpg', caption: 'Staged hero image', isPrimary: true }],
    research: [],
  },
  {
    id: 'obj-book-003',
    slug: 'occult-herbarium-ledger',
    title: 'Occult Herbarium Ledger',
    subtitle: 'Needs research before routing decision',
    objectType: 'Book',
    objectTypeSlug: 'book',
    lifecycleStatus: 'intake',
    routeIntent: 'hold',
    visibility: 'internal',
    intakeStage: 'minimal',
    location: 'Research Hold',
    primaryLocationSlug: 'research-hold',
    askingPriceCents: null,
    costBasisCents: 2000,
    primaryImagePath: null,
    tagNames: ['occult', 'victorian'],
    hasResearch: false,
    updatedAt: '2026-03-20T19:40:00.000Z',
    descriptionShort: 'Handwritten ledger with pressed plants and occult marginalia.',
    descriptionLong:
      'Promising object, but authenticity, completeness, and handling risk all need to be understood before pricing or deciding whether it belongs in the shop, the archive, or a longer-term hold.',
    materials: 'paper, cloth binding, dried plant matter',
    conditionNotes: 'Fragile spine. Handle carefully.',
    acquisitionType: 'purchase',
    acquisitionSource: 'estate lot',
    dateAcquired: '2026-03-20T16:45:00.000Z',
    notesInternal: 'Do not put on sales floor until provenance is clearer.',
    timeline: [
      { id: 'wf-7', label: 'Intake created', notes: 'Estate box pull.', at: '2026-03-20T16:50:00.000Z', kind: 'workflow' },
      { id: 'wf-8', label: 'Moved to Research Hold', notes: 'Missing attribution and date confidence.', at: '2026-03-20T17:05:00.000Z', kind: 'location' },
    ],
    media: [],
    research: [],
  },
];

const objectTypeOptions = [
  'lamp', 'chandelier', 'jewelry', 'taxidermy', 'skull', 'crystal', 'fossil', 'specimen',
  'artwork', 'print', 'book', 'media', 'decor', 'furniture', 'oddity', 'ritual-object',
  'collectible', 'garment', 'shirt', 'accessory', 'mask', 'signage', 'arcade', 'archive-item',
  'tool', 'supplies',
];

const locationOptions = [
  'intake-holding',
  'lamp-lab',
  'jewelry-studio',
  'guest-house-staging',
  'photo-station',
  'screen-printing',
  'store-sales-floor',
  'store-front-window',
  'store-back-room',
  'store-counter-display',
  'archive-storage',
  'liquidation-holding',
];

function formatDbObject(record: any): ObjectDetail {
  const tagNames = (record.tagLinks ?? []).map((link: any) => link.tag.name);
  const timeline = [
    ...(record.workflowEvents ?? []).map((event: any) => ({
      id: event.id,
      label: event.eventType.replaceAll('_', ' '),
      notes: event.notes ?? null,
      at: event.eventAt.toISOString(),
      kind: 'workflow' as const,
    })),
    ...(record.locationHistory ?? []).map((entry: any) => ({
      id: entry.id,
      label: `Moved to ${entry.location.name}`,
      notes: entry.reason ?? entry.notes ?? null,
      at: entry.enteredAt.toISOString(),
      kind: 'location' as const,
    })),
    ...(record.researchEntries ?? []).map((entry: any) => ({
      id: entry.id,
      label: 'Research added',
      notes: entry.summary ?? entry.citation ?? null,
      at: entry.createdAt.toISOString(),
      kind: 'research' as const,
    })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  return {
    id: record.id,
    slug: record.slug ?? record.id,
    title: record.title,
    subtitle: record.subtitle ?? null,
    objectType: record.objectType?.name ?? null,
    objectTypeSlug: record.objectType?.slug ?? null,
    lifecycleStatus: record.lifecycleStatus,
    routeIntent: record.routeIntent,
    visibility: record.visibility,
    intakeStage: record.intakeStage,
    location: record.primaryLocation?.name ?? null,
    primaryLocationSlug: record.primaryLocation?.slug ?? null,
    askingPriceCents: record.askingPriceCents ?? null,
    costBasisCents: record.costBasisCents ?? null,
    primaryImagePath: record.primaryImage?.storagePath ?? null,
    tagNames,
    hasResearch: (record.researchEntries?.length ?? 0) > 0,
    updatedAt: record.updatedAt.toISOString(),
    descriptionShort: record.descriptionShort ?? null,
    descriptionLong: record.descriptionLong ?? null,
    materials: record.materials ?? null,
    conditionNotes: record.conditionNotes ?? null,
    acquisitionType: record.acquisitionType ?? null,
    acquisitionSource: record.acquisitionSource ?? null,
    dateAcquired: record.dateAcquired ? record.dateAcquired.toISOString() : null,
    notesInternal: null,
    timeline,
    media: (record.mediaAssets ?? []).map((asset: any) => ({
      id: asset.id,
      kind: asset.kind,
      storagePath: asset.storagePath,
      caption: asset.caption ?? null,
      isPrimary: asset.isPrimary,
    })),
    research: (record.researchEntries ?? []).map((entry: any) => ({
      id: entry.id,
      citation: entry.citation ?? null,
      summary: entry.summary ?? null,
      sourceUrl: entry.sourceUrl ?? null,
      confidence: entry.confidence ?? null,
    })),
  };
}

export async function listObjects(): Promise<{ source: 'database' | 'demo'; items: ObjectListItem[] }> {
  if (!isDatabaseConfigured()) {
    return { source: 'demo', items: demoObjects };
  }

  try {
    const db = getDb();
    const objects = await db.object.findMany({
      include: {
        objectType: true,
        primaryLocation: true,
        primaryImage: true,
        tagLinks: { include: { tag: true } },
        researchEntries: { select: { id: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    return {
      source: 'database',
      items: objects.map((record: any) => formatDbObject(record)),
    };
  } catch {
    return { source: 'demo', items: demoObjects };
  }
}

export async function getObjectBySlug(slug: string): Promise<{ source: 'database' | 'demo'; item: ObjectDetail | null }> {
  if (!isDatabaseConfigured()) {
    return { source: 'demo', item: demoObjects.find((item) => item.slug === slug) ?? null };
  }

  try {
    const db = getDb();
    const record = await db.object.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        objectType: true,
        primaryLocation: true,
        primaryImage: true,
        tagLinks: { include: { tag: true } },
        workflowEvents: { orderBy: { eventAt: 'desc' }, take: 20 },
        locationHistory: { include: { location: true }, orderBy: { enteredAt: 'desc' }, take: 20 },
        mediaAssets: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        researchEntries: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    return { source: 'database', item: record ? formatDbObject(record) : null };
  } catch {
    return { source: 'demo', item: demoObjects.find((item) => item.slug === slug) ?? null };
  }
}

export function getObjectIntakeDefaults(): ObjectIntakeDefaults {
  return {
    title: '',
    objectTypeSlug: 'lamp',
    lifecycleStatus: 'acquired',
    routeIntent: 'undecided',
    visibility: 'internal',
    intakeStage: 'minimal',
    primaryLocationSlug: 'intake-holding',
    acquisitionType: 'purchase',
    acquisitionSource: '',
    askingPrice: '',
    conditionNotes: '',
    materials: '',
    tags: ['one-of-a-kind'],
    descriptionShort: '',
  };
}

export function getObjectReferenceOptions() {
  return {
    objectTypeOptions,
    locationOptions,
    lifecycleStatusOptions: ['acquired', 'intake', 'processing', 'ready', 'published', 'sold', 'archived', 'inactive'],
    routeIntentOptions: ['undecided', 'storefront', 'website-feature', 'archive', 'liquidation', 'hold', 'consignment', 'event'],
    intakeStageOptions: ['draft', 'minimal', 'enriched', 'review-ready', 'complete'],
    visibilityOptions: ['internal', 'public', 'archived'],
  };
}

export function getAuthStatus(): AuthStatus {
  const configuredItems: string[] = [];
  const missingItems: string[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) configuredItems.push('NEXT_PUBLIC_SUPABASE_URL');
  else missingItems.push('NEXT_PUBLIC_SUPABASE_URL');

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) configuredItems.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  else missingItems.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) configuredItems.push('SUPABASE_SERVICE_ROLE_KEY');
  else missingItems.push('SUPABASE_SERVICE_ROLE_KEY');

  const mode = configuredItems.length >= 2 ? 'supabase' : 'development';

  return {
    mode,
    configured: missingItems.length === 0,
    configuredItems,
    missingItems,
    suggestedRole: 'admin',
  };
}

export function getObjectWorkflowSummary(item: Pick<ObjectDetail, 'primaryImagePath' | 'askingPriceCents' | 'hasResearch' | 'intakeStage' | 'routeIntent' | 'lifecycleStatus'>): ObjectWorkflowSummary {
  const readinessItems = [
    { label: 'Intake record enriched beyond minimal stub', complete: item.intakeStage !== 'minimal' },
    { label: 'Primary image assigned', complete: Boolean(item.primaryImagePath) },
    { label: 'Asking price decided', complete: item.askingPriceCents !== null },
    { label: 'Research/context attached when needed', complete: item.hasResearch || item.routeIntent !== 'hold' },
  ];

  if (item.intakeStage === 'minimal') {
    return {
      readinessLabel: 'needs intake',
      readinessTone: 'warning',
      readinessItems,
      nextAction: 'Finish the basic record first: title, object type, clearer notes, and the right current location.',
    };
  }

  if (!item.primaryImagePath) {
    return {
      readinessLabel: 'needs photography',
      readinessTone: 'warning',
      readinessItems,
      nextAction: 'Add at least one intake image so the object can be recognized and reviewed without handling it again.',
    };
  }

  if (item.askingPriceCents === null) {
    return {
      readinessLabel: 'needs pricing',
      readinessTone: 'warning',
      readinessItems,
      nextAction: 'Set an asking price or mark the object as intentionally held while research or routing is unresolved.',
    };
  }

  if (!item.hasResearch && (item.routeIntent === 'hold' || item.lifecycleStatus !== 'ready')) {
    return {
      readinessLabel: 'needs research',
      readinessTone: 'muted',
      readinessItems,
      nextAction: 'Attach comparables, provenance notes, or maker context so routing decisions are documented instead of floating in memory.',
    };
  }

  return {
    readinessLabel: 'ready to route',
    readinessTone: 'good',
    readinessItems,
    nextAction: 'Move it forward: publish, stage it for the floor, or explicitly archive it instead of letting it idle in “ready”.',
  };
}

export function getObjectListFilters(searchParams?: Record<string, string | string[] | undefined>): ObjectListFilters {
  const pick = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] ?? '' : value ?? '');

  return {
    q: pick(searchParams?.q).trim(),
    status: pick(searchParams?.status),
    route: pick(searchParams?.route),
    location: pick(searchParams?.location),
    readiness: pick(searchParams?.readiness),
  };
}

export function filterObjects(items: ObjectListItem[], filters: ObjectListFilters) {
  return items.filter((item) => {
    const summary = getObjectWorkflowSummary(item);
    const haystack = [item.title, item.subtitle ?? '', item.objectType ?? '', item.location ?? '', item.tagNames.join(' ')]
      .join(' ')
      .toLowerCase();

    if (filters.q && !haystack.includes(filters.q.toLowerCase())) return false;
    if (filters.status && item.lifecycleStatus !== filters.status) return false;
    if (filters.route && item.routeIntent !== filters.route) return false;
    if (filters.location && (item.location ?? '').toLowerCase() !== filters.location.toLowerCase()) return false;
    if (filters.readiness && summary.readinessLabel !== filters.readiness) return false;

    return true;
  });
}

export function getObjectListFilterOptions(items: ObjectListItem[]) {
  const unique = (values: string[]) => Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

  return {
    statuses: unique(items.map((item) => item.lifecycleStatus)),
    routes: unique(items.map((item) => item.routeIntent)),
    locations: unique(items.map((item) => item.location).filter((value): value is string => Boolean(value))),
    readiness: unique(items.map((item) => getObjectWorkflowSummary(item).readinessLabel)),
  };
}
