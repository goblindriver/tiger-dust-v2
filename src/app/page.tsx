import { SiteShell } from '@/components/site-shell';
import { recommendedStack } from '@/features/planning/stack';

export default function HomePage() {
  return (
    <SiteShell
      title="Tiger Dust public site + operations spine"
      description="This first chunk keeps the public side simple and useful while laying down the internal catalog foundation."
    >
      <section className="grid grid-2">
        <article className="card">
          <h2>What this scaffold covers</h2>
          <ul>
            <li>Public site shell for Home / About / Visit / Gallery</li>
            <li>Internal route skeleton for objects, merch, settings, and auth</li>
            <li>Prisma schema draft for unique objects + merch support</li>
            <li>Seed scaffolding for types, locations, tags, workflow events, and collections</li>
          </ul>
        </article>
        <article className="card">
          <h2>Chosen stack</h2>
          <ul>
            {recommendedStack.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.value}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </SiteShell>
  );
}
