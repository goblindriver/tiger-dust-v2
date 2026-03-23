'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { publicNav, internalNav } from '@/lib/navigation';

export function SiteShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isInternalRoute = pathname.startsWith('/app');

  async function handleSignOut() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      const supabase = createBrowserClient(url, key);
      await supabase.auth.signOut();
    }

    router.push('/app/auth');
    router.refresh();
  }

  return (
    <main>
      <div className="hero">
        <p className="kicker">Tiger Dust v2 foundation</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>

      <section>
        <div className="nav">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href} className="badge">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav">
          {internalNav.map((item) => (
            <Link key={item.href} href={item.href} className="badge">
              {item.label}
            </Link>
          ))}
          {isInternalRoute && (
            <button className="button" onClick={handleSignOut}>
              Sign out
            </button>
          )}
        </div>
      </section>

      {children}
    </main>
  );
}
