import { SiteShell } from '@/components/site-shell';

export default function AboutPage() {
  return (
    <SiteShell
      title="About Tiger Dust"
      description="Placeholder public copy surface. Later this should carry the actual brand voice, story, and stronger imagery."
    >
      <section className="card">
        <p>
          Tiger Dust deals in curated objects, handmade work, repair/restoration, and one-offs that do not fit generic ecommerce logic.
        </p>
        <p className="muted">
          This page exists now so the public site shell is grounded early, without pretending the final design or copy is done yet.
        </p>
      </section>
    </SiteShell>
  );
}
