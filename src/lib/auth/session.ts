import { cache } from 'react';
import { cookies } from 'next/headers';
import type { UserRole } from '@/features/domain/constants';
import { getDb, isDatabaseConfigured } from '@/lib/db';
import { getAuthStatus } from '@/features/objects/data';
import { getSupabaseSessionClient } from '@/lib/supabase/server';

export type AppSessionUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  source: 'supabase' | 'database' | 'development';
};

const allowedRoles: UserRole[] = ['admin', 'editor', 'operator', 'viewer'];

function normalizeRole(input: string | undefined | null): UserRole {
  if (input && allowedRoles.includes(input as UserRole)) {
    return input as UserRole;
  }

  return 'admin';
}

export const getCurrentUser = cache(async (): Promise<AppSessionUser | null> => {
  // Use real Supabase session when configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await getSupabaseSessionClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return {
          id: user.id,
          email: user.email ?? null,
          displayName: (user.user_metadata?.display_name as string | undefined) ?? user.email ?? null,
          role: normalizeRole((user.user_metadata?.role as string | undefined) ?? 'viewer'),
          source: 'supabase',
        };
      }

      // Supabase is configured but no valid session
      return null;
    }
  }

  // Dev mode fallback — only when Supabase is not configured
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
