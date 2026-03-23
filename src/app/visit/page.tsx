import type { Metadata } from 'next';
import { PublicShell } from '@/components/public-shell';

export const metadata: Metadata = {
  title: 'Visit — Tiger Dust',
  description:
    'Tiger Dust is at 4222 N Florida Ave, Suite B, Seminole Heights, Tampa. Open daily 12–7pm.',
};

export default function VisitPage() {
  return (
    <PublicShell>
      <section className="pub-hero">
        <p className="pub-eyebrow">Visit</p>
        <h1 className="pub-hero-title">Come find us.</h1>
        <p className="pub-hero-sub">
          We&apos;re open every day. Street parking is plentiful on N Florida Ave
          and the surrounding blocks.
        </p>
      </section>

      <hr className="pub-divider" />

      <section className="pub-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
          <div>
            <div className="pub-info-block">
              <h2>Address</h2>
              <p>
                4222 N Florida Ave, Suite B<br />
                Seminole Heights<br />
                Tampa, FL 33603
              </p>
            </div>

            <div className="pub-info-block">
              <h2>Hours</h2>
              <p>
                Open daily<br />
                12:00 pm – 7:00 pm
              </p>
            </div>

            <div className="pub-info-block">
              <h2>Directions</h2>
              <a
                href="https://maps.google.com/?q=4222+N+Florida+Ave+Tampa+FL+33603"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          <div>
            <div className="pub-info-block">
              <h2>Social</h2>
              {/* Update handles when confirmed */}
              <div className="pub-social-row">
                <a
                  href="https://www.instagram.com/tigerdustheights"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-social-link"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/p/Tiger-Dust-Heights-100077028941213/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-social-link"
                >
                  Facebook
                </a>
              </div>
            </div>

            <div className="pub-info-block">
              <h2>Neighborhood</h2>
              <p>
                Seminole Heights is one of Tampa&apos;s best walkable commercial
                corridors. We&apos;re on the main strip — you&apos;ll see the window.
              </p>
            </div>

            <div className="pub-info-block">
              <h2>Buying &amp; selling</h2>
              <p>
                We buy interesting objects. If you have something you think
                belongs here, come in during business hours and ask. We&apos;ll
                take a look.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
