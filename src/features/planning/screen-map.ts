export const appScreenOwnership = [
  {
    name: 'Intake / Object flow',
    purpose: 'Object-first CRUD, intake cleanup, and route/location/status edits.',
    tables: ['objects', 'object_types', 'object_tags', 'locations', 'workflow_events', 'media_assets'],
  },
  {
    name: 'Merch / Inventory flow',
    purpose: 'Repeatable saleable items, variants, quantity, and pricing.',
    tables: ['inventory_items', 'inventory_variants', 'media_assets'],
  },
  {
    name: 'Publishing layer',
    purpose: 'Explicit public controls separate from internal truth.',
    tables: ['publish_profiles', 'collections', 'collection_objects'],
  },
  {
    name: 'Reference data',
    purpose: 'Low-volume admin management for object types, tags, and locations.',
    tables: ['object_types', 'tags', 'locations'],
  },
] as const;
