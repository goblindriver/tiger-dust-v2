import Link from 'next/link';
import Image from 'next/image';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
  { href: '/gallery', label: 'Gallery' },
] as const;

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="pub-header">
        <Link href="/" className="pub-logo-area">
          <Image
            src="/brand/logo-head.svg"
            alt=""
            width={38}
            height={38}
            className="pub-logo-mark"
          />
          <span className="pub-logo-name">Tiger Dust</span>
        </Link>
        <nav className="pub-nav">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="pub-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <hr className="pub-divider" />

      <main className="pub-main">{children}</main>

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="pub-footer-col">
            <p className="pub-footer-name">Tiger Dust</p>
            <p>4222 N Florida Ave, Suite B</p>
            <p>Seminole Heights, Tampa FL</p>
            <p>Open daily 12–7pm</p>
          </div>
          <div className="pub-footer-col">
            {/* Update with real handles when confirmed */}
            <div className="pub-footer-social">
              <a href="https://www.instagram.com/tigerdusttampa" className="pub-footer-col">
                Instagram
              </a>
              <a href="https://www.facebook.com/tigerdusttampa" className="pub-footer-col">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
