import Link from 'next/link';
import { PublicShell } from '@/components/public-shell';

const categories = [
  {
    name: 'Lamps & Glow',
    description:
      'Restored vintage lamps, wired and working. Ornate bases, unusual shades, statement lighting for rooms that want to be seen.',
  },
  {
    name: 'Taxidermy & Skulls',
    description:
      'Mounted specimens and cleaned bone. Foxes, birds, fish, and things with interesting skulls. Natural history on the wall.',
  },
  {
    name: 'Crystals & Fossils',
    description:
      'Amethyst clusters, selenite towers, raw specimens, and ancient marine fossils. Nothing mass-produced.',
  },
  {
    name: 'Jewelry & Handmade Work',
    description:
      'Original pieces made in-house alongside found and vintage jewelry. Sterling silver, stone, wire, and wax carving.',
  },
  {
    name: 'Occult Books & Media',
    description:
      'Tarot, astrology, herbalism, folk magic, esoteric history, and a rotating selection of VHS, vinyl, and printed oddities.',
  },
  {
    name: 'Curiosities & Oddities',
    description:
      'The things that don\'t fit anywhere else. Medical models, carnival pieces, strange small objects, and the occasional genuine mystery.',
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="pub-hero">
        <p className="pub-eyebrow">Seminole Heights · Tampa, FL</p>
        <h1 className="pub-hero-title">
          The curiosity shop Seminole Heights deserves.
        </h1>
        <p className="pub-hero-sub">
          Tiger Dust carries curated objects, handmade jewelry, restored lamps,
          taxidermy, natural specimens, occult books, vintage media, and the kind
          of weird, beautiful thing you didn&apos;t know you needed.
        </p>
        <div className="pub-cta-row">
          <Link href="/visit" className="pub-cta-primary">
            Visit us
          </Link>
          <Link href="/gallery" className="pub-cta-secondary">
            See what&apos;s here
          </Link>
        </div>
        <p className="pub-hours-note">
          <strong>Open daily 12–7pm</strong> &nbsp;·&nbsp; 4222 N Florida Ave, Suite B
        </p>
      </section>

      <hr className="pub-divider" />

      <section className="pub-section">
        <p className="pub-section-label">What we carry</p>
        <h2 className="pub-section-title">Six rooms of reasons to visit.</h2>
        <p className="pub-section-sub">
          No two trips are the same. New objects come in constantly, and
          nothing stays forever.
        </p>
        <div className="pub-grid">
          {categories.map((cat) => (
            <div className="pub-card" key={cat.name}>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="pub-divider" />

      <section className="pub-section">
        <p className="pub-section-label">Find us</p>
        <h2 className="pub-section-title">Come see for yourself.</h2>
        <p className="pub-section-sub">
          We&apos;re on N Florida Ave in the heart of Seminole Heights. Street
          parking is easy. Open every day, noon to seven.
        </p>
        <div className="pub-cta-row">
          <a
            href="https://maps.google.com/?q=4222+N+Florida+Ave+Tampa+FL+33603"
            target="_blank"
            rel="noopener noreferrer"
            className="pub-cta-primary"
          >
            Get directions
          </a>
          <Link href="/visit" className="pub-cta-secondary">
            Hours &amp; contact
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
