import type { Metadata } from 'next';
import { PublicShell } from '@/components/public-shell';

export const metadata: Metadata = {
  title: 'About — Tiger Dust',
  description:
    'Tiger Dust is a curiosity shop in Seminole Heights, Tampa. Curated objects, handmade jewelry, restored lamps, taxidermy, natural specimens, and things worth keeping.',
};

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="pub-hero">
        <p className="pub-eyebrow">About</p>
        <h1 className="pub-hero-title">Not a store. A wonder room.</h1>
        <p className="pub-hero-sub">
          Tiger Dust is a curiosity shop in Seminole Heights, Tampa. We deal in
          objects — curated, repaired, handmade, found, and occasionally
          unexplainable.
        </p>
      </section>

      <hr className="pub-divider" />

      <section className="pub-section">
        <div className="pub-two-col">
          <div className="pub-prose">
            <p>
              Tiger Dust exists because Tampa needed a shop where the
              inventory has a point of view. Not vintage for vintage&apos;s
              sake. Not generic crystals from a wholesale catalog. Objects that
              were chosen because someone thought they were worth choosing.
            </p>
            <p>
              Every piece that comes through the door gets evaluated. The lamps
              get rewired. The taxidermy gets cleaned. The jewelry gets made
              from scratch in the studio behind the store. The books are
              actually good. The oddities are actually odd.
            </p>
            <p>
              We are in Seminole Heights because this neighborhood rewards
              that kind of specificity. Our customers know what they&apos;re
              looking for — or they don&apos;t, and they find it anyway.
            </p>
          </div>
          <div>
            <div className="pub-card" style={{ marginBottom: 14 }}>
              <h3>Handmade jewelry</h3>
              <p>
                Original pieces made in our studio using sterling silver, semi-precious
                stone, wire, and wax carving. Not production jewelry. Not something
                you&apos;ll find anywhere else.
              </p>
            </div>
            <div className="pub-card" style={{ marginBottom: 14 }}>
              <h3>Lamp restoration</h3>
              <p>
                We source, repair, rewire, and finish vintage lamps in-house.
                Every working lamp that leaves this store has been touched by
                someone who cared about it.
              </p>
            </div>
            <div className="pub-card">
              <h3>Curation as a practice</h3>
              <p>
                We buy from estate sales, private collections, and
                people who know us. We turn down things that aren&apos;t right.
                The shop floor reflects that discipline.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="pub-divider" />

      <section className="pub-section">
        <p className="pub-section-label">What we carry</p>
        <h2 className="pub-section-title">The range.</h2>
        <p className="pub-section-sub">
          The categories are a framework, not a wall. If something is
          interesting enough, it finds a home here.
        </p>
        <div className="pub-grid">
          {[
            'Restored lamps & lighting',
            'Taxidermy & mounted specimens',
            'Skulls & bones',
            'Crystals, fossils & minerals',
            'Handmade & found jewelry',
            'Occult & esoteric books',
            'Vintage media — VHS, vinyl, print',
            'Masks & ceremonial objects',
            'Pinball & arcade pieces',
            'Curiosities & unexplained objects',
          ].map((item) => (
            <div key={item} className="pub-card">
              <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>{item}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
