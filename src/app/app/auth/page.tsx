import { SiteShell } from '@/components/site-shell';
import { roleCapabilities } from '@/lib/auth/roles';
import { getCurrentUser } from '@/lib/auth/session';
import { getAuthStatus } from '@/features/objects/data';

export default async function AuthPlaceholderPage() {
  const user = await getCurrentUser();
  const authStatus = getAuthStatus();

  return (
    <SiteShell
      title="Auth foundation"
      description="Supabase is still only partly wired, but internal role resolution now has a usable development path so the app can keep moving while real credentials catch up."
    >
      <section className="grid grid-2">
        <article className="card">
          <p className="eyebrow">Current resolved session</p>
          <h2>{user?.displayName ?? 'No user resolved'}</h2>
          <div className="table-like">
            <div className="table-row"><strong>Role</strong><span>{user?.role ?? 'none'}</span></div>
            <div className="table-row"><strong>Email</strong><span>{user?.email ?? 'none'}</span></div>
            <div className="table-row"><strong>Source</strong><span>{user?.source ?? 'none'}</span></div>
            <div className="table-row"><strong>Mode</strong><span>{authStatus.mode}</span></div>
          </div>
        </article>

        <article className="card">
          <p className="eyebrow">Env readiness</p>
          <h2>{authStatus.configured ? 'Supabase env present' : 'Still missing auth env pieces'}</h2>
          <p className="muted">Configured: {authStatus.configuredItems.join(', ') || 'none'}</p>
          <p className="muted">Missing: {authStatus.missingItems.join(', ') || 'none'}</p>
          <p className="top-gap muted">Development fallback uses <span className="code">DEV_USER_EMAIL</span>, <span className="code">DEV_USER_NAME</span>, and <span className="code">DEV_USER_ROLE</span> until real Supabase session resolution lands.</p>
        </article>
      </section>

      <section className="grid grid-2">
        {Object.entries(roleCapabilities).map(([role, capabilities]) => (
          <article className="card" key={role}>
            <h2>{role}</h2>
            <ul>
              {capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
