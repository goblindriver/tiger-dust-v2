import Link from 'next/link';
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
        </div>
      </section>

      {children}
    </main>
  );
}
