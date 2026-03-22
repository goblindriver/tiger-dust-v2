import {
  collectionsSeed,
  locationsSeed,
  objectTypesSeed,
  starterTagsSeed,
  workflowEventTypesSeed,
} from './seed-data';

export const seedSummary = [
  {
    label: 'Object types',
    description: 'Starter object classification based on the schema and seed planning docs.',
    count: objectTypesSeed.length,
  },
  {
    label: 'Locations',
    description: 'Physical hierarchy grounded in the compound + store workflow.',
    count: locationsSeed.length,
  },
  {
    label: 'Tags',
    description: 'Restrained descriptive starter vocabulary, not a giant taxonomy.',
    count: starterTagsSeed.length,
  },
  {
    label: 'Workflow event types',
    description: 'Seed-controlled event vocabulary for the UI and operational history.',
    count: workflowEventTypesSeed.length,
  },
  {
    label: 'Collections',
    description: 'Starter public/internal curation buckets.',
    count: collectionsSeed.length,
  },
] as const;
