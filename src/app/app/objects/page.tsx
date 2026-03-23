import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
import {
  filterObjects,
  getObjectListFilterOptions,
  getObjectListFilters,
  getObjectWorkflowSummary,
  listObjects,
} from '@/features/objects/data';

function money(value: number | null) {
  if (value === null) return '—';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value / 100);
}

export default async function ObjectsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawPage = resolvedSearchParams.page;
  const page = Math.max(1, parseInt(String(Array.isArray(rawPage) ? rawPage[0] : rawPage ?? '1'), 10) || 1);
  const { source, items, total, pageSize } = await listObjects({ page });
  const filters = getObjectListFilters(resolvedSearchParams);
  const filteredItems = filterObjects(items, filters);
  const filterOptions = getObjectListFilterOptions(items);

  const counts = {
    total: items.length,
    filtered: filteredItems.length,
    needsPhoto: items.filter((item) => !item.primaryImagePath).length,
    needsPrice: items.filter((item) => item.askingPriceCents === null).length,
    readyToRoute: items.filter((item) => getObjectWorkflowSummary(item).readinessLabel === 'ready to route').length,
  };

  const activeFilters = [filters.q, filters.status, filters.route, filters.location, filters.readiness].filter(Boolean).length;
  const hasPrevPage = page > 1;
  const hasNextPage = page * pageSize < total;

  function buildPageLink(targetPage: number): `/app/objects?${string}` {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.status) params.set('status', filters.status);
    if (filters.route) params.set('route', filters.route);
    if (filters.location) params.set('location', filters.location);
    if (filters.readiness) params.set('readiness', filters.readiness);
    params.set('page', String(targetPage));
    return `/app/objects?${params.toString()}` as `/app/objects?${string}`;
  }

  return (
    <SiteShell
      title="Object workflow"
      description="A tighter first pass at the object list: triage what came in, see what is blocked, and jump directly into the records that need the next decision."
    >
      <section className="toolbar card">
        <div>
          <p className="eyebrow">Data source</p>
          <h2>{source === 'database' ? 'Live Prisma query' : 'Demo fallback dataset'}</h2>
          <p className="muted">
            The demo path is still intentional. It keeps the screen locally runnable while the DB/auth write path catches up.
          </p>
        </div>
        <div className="toolbar-actions">
          <Link href="/app/objects/new" className="button">
            New intake record
          </Link>
        </div>
      </section>

      <section className="grid grid-4">
        <article className="card stat-card">
          <p className="eyebrow">Objects in view</p>
          <strong>{counts.filtered}</strong>
          <p className="muted compact">{activeFilters ? `${counts.total} total · filtered down` : 'Current working set'}</p>
        </article>
        <article className="card stat-card">
          <p className="eyebrow">Needs photography</p>
          <strong>{counts.needsPhoto}</strong>
        </article>
        <article className="card stat-card">
          <p className="eyebrow">Needs pricing</p>
          <strong>{counts.needsPrice}</strong>
        </article>
        <article className="card stat-card">
          <p className="eyebrow">Ready to route</p>
          <strong>{counts.readyToRoute}</strong>
        </article>
      </section>

      <section className="card">
        <div className="list-header">
          <div>
            <h2>Filter the work, not just the records</h2>
            <p className="muted">
              Minimal filtering for the first workflow pass: search, stage, route, location, and readiness.
            </p>
          </div>
          {activeFilters ? (
            <div className="toolbar-actions">
              <Link href="/app/objects" className="button button-secondary">
                Clear filters
              </Link>
            </div>
          ) : null}
        </div>

        <form className="filter-grid" method="get">
          <label>
            <span>Search</span>
            <input name="q" defaultValue={filters.q} placeholder="lamp, occult, Laura, guest house…" />
          </label>
          <label>
            <span>Status</span>
            <select name="status" defaultValue={filters.status}>
              <option value="">All statuses</option>
              {filterOptions.statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Route</span>
            <select name="route" defaultValue={filters.route}>
              <option value="">All routes</option>
              {filterOptions.routes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Location</span>
            <select name="location" defaultValue={filters.location}>
              <option value="">All locations</option>
              {filterOptions.locations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Readiness</span>
            <select name="readiness" defaultValue={filters.readiness}>
              <option value="">Any readiness</option>
              {filterOptions.readiness.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div className="filter-actions">
            <button type="submit" className="button">
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <div className="list-header">
          <div>
            <h2>Objects</h2>
            <p className="muted">Each row answers the real question: what is it, where is it, and what is stopping it from moving forward?</p>
          </div>
        </div>

        <div className="object-table object-table-wide">
          <div className="object-table-head">
            <span>Object</span>
            <span>Workflow</span>
            <span>Location + value</span>
            <span>Next action</span>
          </div>

          {filteredItems.map((item) => {
            const workflow = getObjectWorkflowSummary(item);

            return (
              <Link key={item.id} href={`/app/objects/${item.slug}`} className="object-row object-row-wide">
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted compact">{item.subtitle ?? item.objectType ?? 'Unassigned type'}</p>
                  <p className="muted compact">{item.tagNames.join(', ') || 'No tags yet'}</p>
                </div>
                <div>
                  <p className="compact">
                    <span className={`badge subtle badge-${workflow.readinessTone}`}>{workflow.readinessLabel}</span>
                  </p>
                  <p className="muted compact">{item.lifecycleStatus} · {item.intakeStage} · route {item.routeIntent}</p>
                </div>
                <div>
                  <p className="compact">{item.location ?? 'No location set'}</p>
                  <p className="muted compact">Ask: {money(item.askingPriceCents)} · Cost: {money(item.costBasisCents)}</p>
                  <p className="muted compact">{item.primaryImagePath ? 'Image set' : 'No image yet'} · {item.hasResearch ? 'Research attached' : 'No research'}</p>
                </div>
                <div>
                  <p className="compact">{workflow.nextAction}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <h3>No objects match this view.</h3>
            <p className="muted">Try clearing a filter or broadening the search terms.</p>
          </div>
        ) : null}

        {(hasPrevPage || hasNextPage) ? (
          <div className="pagination">
            {hasPrevPage ? (
              <Link href={buildPageLink(page - 1)} className="button button-secondary">
                Previous
              </Link>
            ) : null}
            <span className="muted">Page {page} · {total} total</span>
            {hasNextPage ? (
              <Link href={buildPageLink(page + 1)} className="button button-secondary">
                Next
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}
