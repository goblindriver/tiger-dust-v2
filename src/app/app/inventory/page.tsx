import { SiteShell } from '@/components/site-shell';
import { inventoryTypes, userRoles } from '@/features/domain/constants';

export default function InventoryPage() {
  return (
    <SiteShell
      title="Merch / Inventory"
      description="Foundation screen placeholder for repeatable inventory items, variants, quantity, and pricing."
    >
      <section className="grid grid-2">
        <article className="card">
          <h2>Inventory types</h2>
          {inventoryTypes.map((value) => (
            <span className="badge" key={value}>{value}</span>
          ))}
        </article>
        <article className="card">
          <h2>Role-aware ops target</h2>
          {userRoles.map((value) => (
            <span className="badge" key={value}>{value}</span>
          ))}
        </article>
      </section>
    </SiteShell>
  );
}
