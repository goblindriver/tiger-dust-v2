import { SiteShell } from '@/components/site-shell';
import { seedSummary } from '@/features/domain/seed-summary';

export default function SettingsPage() {
  return (
    <SiteShell
      title="Reference data"
      description="Admin-only placeholder for low-volume controlled vocabularies and locations."
    >
      <section className="grid grid-2">
        {seedSummary.map((item) => (
          <article className="card" key={item.label}>
            <h2>{item.label}</h2>
            <p className="muted">{item.description}</p>
            <p className="code">{item.count} starter values scaffolded</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
