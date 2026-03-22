import { redirect } from 'next/navigation';
import type { UserRole } from '@/features/domain/constants';
import { getCurrentUser } from './session';

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/app/auth');
  }

  const resolvedUser = user as NonNullable<typeof user>;

  if (!allowedRoles.includes(resolvedUser.role)) {
    redirect('/app/auth');
  }

  return resolvedUser;
}
