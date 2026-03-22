import { cache } from 'react';
import { cookies } from 'next/headers';
import type { UserRole } from '@/features/domain/constants';
import { getDb, isDatabaseConfigured } from '@/lib/db';
import { getAuthStatus } from '@/features/objects/data';

export type AppSessionUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  source: 'database' | 'development';
};

const allowedRoles: UserRole[] = ['admin', 'editor', 'operator', 'viewer'];

function normalizeRole(input: string | undefined | null): UserRole {
  if (input && allowedRoles.includes(input as UserRole)) {
    return input as UserRole;
  }

  return 'admin';
}

export const getCurrentUser = cache(async (): Promise<AppSessionUser | null> => {
  const authStatus = getAuthStatus();

  if (isDatabaseConfigured() && process.env.DEV_USER_EMAIL) {
    try {
      const db = getDb();
      const user = await db.user.findUnique({ where: { email: process.env.DEV_USER_EMAIL } });

      if (user) {
        return {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: normalizeRole(user.role),
          source: 'database',
        };
      }
    } catch {
      // Fall back to development session below.
    }
  }

  const cookieStore = await cookies();
  const roleFromCookie = cookieStore.get('td-role')?.value;
  const roleFromEnv = process.env.DEV_USER_ROLE;

  return {
    id: process.env.DEV_USER_ID ?? 'dev-user-admin',
    email: process.env.DEV_USER_EMAIL ?? 'jason@jasongronvold.com',
    displayName: process.env.DEV_USER_NAME ?? 'Jason (development mode)',
    role: normalizeRole(roleFromCookie ?? roleFromEnv ?? authStatus.suggestedRole),
    source: 'development',
  };
});
