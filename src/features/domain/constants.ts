export const objectLifecycleStatuses = [
  'acquired',
  'intake',
  'processing',
  'ready',
  'published',
  'sold',
  'archived',
  'inactive',
] as const;

export const routeIntents = [
  'undecided',
  'storefront',
  'website-feature',
  'archive',
  'liquidation',
  'hold',
  'consignment',
  'event',
] as const;

export const visibilityStates = ['internal', 'public', 'archived'] as const;
export const intakeStages = ['draft', 'minimal', 'enriched', 'review-ready', 'complete'] as const;
export const publicPriceModes = ['hidden', 'visible', 'inquire', 'sold'] as const;
export const userRoles = ['admin', 'editor', 'operator', 'viewer'] as const;
export const inventoryTypes = ['merch', 'edition', 'repeatable-handmade', 'supplies'] as const;

export type UserRole = (typeof userRoles)[number];
