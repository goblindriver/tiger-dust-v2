import { SiteShell } from '@/components/site-shell';

export default function VisitPage() {
  return (
    <SiteShell
      title="Visit Tiger Dust"
      description="Practical customer-facing info should stay dead simple and never get lost during the rebuild."
    >
      <section className="card table-like">
        <div className="table-row"><strong>Address</strong><span>4222 N Florida Ave, Suite B, Seminole Heights, Tampa</span></div>
        <div className="table-row"><strong>Hours</strong><span>Open daily 12–7pm</span></div>
        <div className="table-row"><strong>Status</strong><span>Placeholder data wired in as static content for now. Move to structured settings later.</span></div>
      </section>
    </SiteShell>
  );
}
