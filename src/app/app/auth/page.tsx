'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Supabase is not configured. Running in dev mode — no sign-in required.');
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push('/app');
      router.refresh();
    }
  }

  return (
    <SiteShell
      title="Sign in"
      description="Access the Tiger Dust internal operations app."
    >
      <section>
        <article className="card">
          <p className="eyebrow">Internal access</p>
          <h2>Sign in to continue</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </label>
            {error && <p className="muted" style={{ color: 'var(--color-error, #ef4444)' }}>{error}</p>}
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          {!supabaseUrl && (
            <p className="muted" style={{ marginTop: '1rem' }}>
              Dev mode active — Supabase not configured. Internal routes are unprotected.
            </p>
          )}
        </article>
      </section>
    </SiteShell>
  );
}
