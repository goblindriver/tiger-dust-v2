import type { UserRole } from '@/features/domain/constants';

export const roleCapabilities: Record<UserRole, string[]> = {
  admin: [
    'full object and merch management',
    'reference data management',
    'publishing controls',
    'role assignment',
  ],
  editor: [
    'edit objects and merch',
    'manage public copy and featured content',
    'attach media',
  ],
  operator: [
    'intake objects',
    'move locations',
    'record workflow events',
    'upload media',
  ],
  viewer: ['read-only internal access'],
};

export function canManageReferenceData(role: UserRole) {
  return role === 'admin';
}

export function canEditCatalog(role: UserRole) {
  return role === 'admin' || role === 'editor' || role === 'operator';
}

export function canPublish(role: UserRole) {
  return role === 'admin' || role === 'editor';
}
