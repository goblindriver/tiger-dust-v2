import type { Metadata } from 'next';
import { PublicShell } from '@/components/public-shell';

export const metadata: Metadata = {
  title: 'Gallery — Tiger Dust',
  description:
    'Lamps, taxidermy, crystals, jewelry, occult books, and curiosities. A curated selection from Tiger Dust in Seminole Heights, Tampa.',
};

const collections = [
  {
    name: 'Lamps & Glow',
    eyebrow: 'Lighting',
    description:
      'Restored vintage lamps, rewired and ready to use. Brass, ceramic, glass, and cast iron bases. Pleated shades, paper shades, converted oil lamps. These are objects that make a room feel like it was chosen, not furnished.',
  },
  {
    name: 'Taxidermy & Skulls',
    eyebrow: 'Natural history',
    description:
      'Mounted specimens and cleaned bone from foxes, birds, fish, reptiles, and larger animals. Natural history as decoration — the kind of wall presence that makes people stop and ask. All sourced and handled with care.',
  },
  {
    name: 'Crystals & Fossils',
    eyebrow: 'Specimens',
    description:
      'Raw and polished crystals, geodes, mineral specimens, and ancient marine fossils. Amethyst clusters, selenite towers, calcite formations. Each one selected for quality and character — not bought by the cubic foot.',
  },
  {
    name: 'Jewelry & Handmade Work',
    eyebrow: 'Made here',
    description:
      'Original jewelry made in our studio. Sterling silver, semi-precious stone, wire, wax carving. Alongside a rotating selection of vintage and found pieces with history. Nothing production. Nothing generic.',
  },
  {
    name: 'Occult Books & Media',
    eyebrow: 'Books & print',
    description:
      'Tarot, astrology, herbalism, folk magic, esoteric history, ceremonial practice, and the adjacent shelves that don\'t fit anywhere else. VHS and vinyl when we find the right ones. Printed ephemera when it\'s worth keeping.',
  },
  {
    name: 'Curiosities & Oddities',
    eyebrow: 'The unexpected',
    description:
      'Things that resist classification. Medical models, sideshow pieces, carnival objects, strange small sculptures, and the occasional genuine mystery. If you have to ask what it is, that\'s part of the point.',
  },
];

export default function GalleryPage() {
  return (
    <PublicShell>
      <section className="pub-hero">
        <p className="pub-eyebrow">Gallery</p>
        <h1 className="pub-hero-title">What&apos;s here right now.</h1>
        <p className="pub-hero-sub">
          Inventory turns constantly. These are the categories — what lives in
          each one changes week to week. The best way to know what&apos;s
          currently in stock is to come in.
        </p>
      </section>

      <hr className="pub-divider" />

      <section className="pub-section">
        <div className="pub-grid">
          {collections.map((col) => (
            <div className="pub-card" key={col.name}>
              <p className="pub-eyebrow" style={{ marginBottom: 8, fontSize: '0.75rem' }}>{col.eyebrow}</p>
              <h3>{col.name}</h3>
              <p>{col.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="pub-divider" />

      <section className="pub-section">
        <h2 className="pub-section-title">New things arrive all the time.</h2>
        <p className="pub-section-sub">
          Follow us on Instagram for the freshest looks at what just came in.
          Or better yet, just stop by — nothing replaces seeing it in person.
        </p>
        <div className="pub-cta-row">
          {/* Update handle when confirmed */}
          <a
            href="https://www.instagram.com/tigerdustheights"
            target="_blank"
            rel="noopener noreferrer"
            className="pub-cta-primary"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
