import { SiteShell } from '@/components/site-shell';
import { appScreenOwnership } from '@/features/planning/screen-map';

export default function OpsDashboardPage() {
  return (
    <SiteShell
      title="Ops dashboard foundation"
      description="Internal screen shell for the object-first operational system."
    >
      <section className="grid grid-2">
        {appScreenOwnership.map((screen) => (
          <article className="card" key={screen.name}>
            <h2>{screen.name}</h2>
            <p className="muted">{screen.purpose}</p>
            <p><strong>Primary tables:</strong> {screen.tables.join(', ')}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
