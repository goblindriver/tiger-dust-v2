import { SiteShell } from '@/components/site-shell';

const placeholderCollections = [
  'Featured Now',
  'Wonder Room',
  'Taxidermy & Skulls',
  'Lamps & Glow',
  'Jewelry & Handmade',
];

export default function GalleryPage() {
  return (
    <SiteShell
      title="Curated gallery"
      description="The public gallery should stay selective. This is a placeholder for the future publish-profile-driven collection surface."
    >
      <section className="grid grid-2">
        {placeholderCollections.map((name) => (
          <article className="card" key={name}>
            <h2>{name}</h2>
            <p className="muted">Placeholder collection shell. Final content should come from collections + publish profiles, not hardcoded markup.</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
