import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { getObjectBySlug, getObjectReferenceOptions, getObjectWorkflowSummary } from '@/features/objects/data';
import { ObjectDetailEditForm } from './object-detail-edit-form';
import { WorkflowEventForm } from './workflow-event-form';

function money(value: number | null) {
  if (value === null) return '—';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value / 100);
}

function formatDate(value: string | null) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export default async function ObjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { source, item } = await getObjectBySlug(slug);

  if (!item) {
    notFound();
  }

  const objectRecord = item as NonNullable<typeof item>;
  const workflow = getObjectWorkflowSummary(objectRecord);
  const { objectTypeOptions, locationOptions, lifecycleStatusOptions, routeIntentOptions } = getObjectReferenceOptions();

  return (
    <SiteShell
      title={objectRecord.title}
      description="Object detail as the operational center of gravity: what it is, where it is, how complete the record is, and what should happen next."
    >
      <section className="toolbar card">
        <div>
          <p className="eyebrow">Record source</p>
          <h2>{source === 'database' ? 'Live object record' : 'Demo fallback record'}</h2>
          <p className="muted">The fallback record is still shaped like the real screen, so local work stays honest instead of blocking on infrastructure.</p>
        </div>
        <div className="toolbar-actions">
          <Link href="/app/objects" className="button button-secondary">
            Back to objects
          </Link>
        </div>
      </section>

      <section className="grid grid-4">
        <article className="card stat-card">
          <p className="eyebrow">Readiness</p>
          <strong className="stat-copy">{workflow.readinessLabel}</strong>
        </article>
        <article className="card stat-card">
          <p className="eyebrow">Current location</p>
          <strong className="stat-copy">{objectRecord.location ?? 'Unplaced'}</strong>
        </article>
        <article className="card stat-card">
          <p className="eyebrow">Asking price</p>
          <strong className="stat-copy">{money(objectRecord.askingPriceCents)}</strong>
        </article>
        <article className="card stat-card">
          <p className="eyebrow">Last updated</p>
          <strong className="stat-copy">{formatDate(objectRecord.updatedAt)}</strong>
        </article>
      </section>

      <section className="grid grid-2 detail-top-grid">
        <article className="card">
          <p className="eyebrow">Overview</p>
          <h2>{objectRecord.subtitle ?? objectRecord.objectType ?? 'Untitled object record'}</h2>
          <p className="muted">{objectRecord.descriptionShort ?? 'No short description yet.'}</p>
          <div className="badge-row">
            <span className="badge">{objectRecord.lifecycleStatus}</span>
            <span className="badge">{objectRecord.routeIntent}</span>
            <span className="badge">{objectRecord.visibility}</span>
            <span className="badge">{objectRecord.intakeStage}</span>
          </div>

          <div className="table-like top-gap">
            <div className="table-row">
              <strong>Object type</strong>
              <span>{objectRecord.objectType ?? 'Unassigned'}</span>
            </div>
            <div className="table-row">
              <strong>Tags</strong>
              <span>{objectRecord.tagNames.join(', ') || 'No tags yet'}</span>
            </div>
            <div className="table-row">
              <strong>Materials</strong>
              <span>{objectRecord.materials ?? '—'}</span>
            </div>
            <div className="table-row">
              <strong>Condition</strong>
              <span>{objectRecord.conditionNotes ?? '—'}</span>
            </div>
            <div className="table-row">
              <strong>Acquisition</strong>
              <span>
                {objectRecord.acquisitionType ?? '—'}
                {objectRecord.acquisitionSource ? ` · ${objectRecord.acquisitionSource}` : ''}
              </span>
            </div>
          </div>
          <p className="detail-copy">{objectRecord.descriptionLong ?? 'No long-form internal description yet.'}</p>
        </article>

        <div className="stack-list">
          <article className="card">
            <p className="eyebrow">What should happen next</p>
            <h2>{workflow.nextAction}</h2>
            <div className="checklist top-gap">
              {workflow.readinessItems.map((entry) => (
                <div key={entry.label} className="checklist-row">
                  <span className={`check-dot ${entry.complete ? 'is-complete' : ''}`} aria-hidden="true" />
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </article>

          <ObjectDetailEditForm
            item={objectRecord}
            source={source}
            objectTypeOptions={objectTypeOptions}
            locationOptions={locationOptions}
            lifecycleStatusOptions={lifecycleStatusOptions}
            routeIntentOptions={routeIntentOptions}
          />

          <WorkflowEventForm
            objectId={objectRecord.id}
            lifecycleStatus={objectRecord.lifecycleStatus}
          />

          <article className="card">
            <p className="eyebrow">Media + research</p>
            <div className="table-like">
              <div className="table-row"><strong>Primary image</strong><span>{objectRecord.primaryImagePath ?? 'Missing'}</span></div>
              <div className="table-row"><strong>Media assets</strong><span>{objectRecord.media.length}</span></div>
              <div className="table-row"><strong>Research entries</strong><span>{objectRecord.research.length}</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="grid grid-2">
        <article className="card">
          <h2>Timeline</h2>
          <div className="timeline">
            {objectRecord.timeline.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <div>
                  <p className="compact"><strong>{entry.label}</strong></p>
                  <p className="muted compact">{formatDateTime(entry.at)} · {entry.kind}</p>
                </div>
                <p className="muted compact">{entry.notes ?? 'No notes.'}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>This step now edits</h2>
          <div className="table-like">
            <div className="table-row">
              <strong>Core fields</strong>
              <span>Title, object type, lifecycle status, route/disposition, asking price, and condition notes.</span>
            </div>
            <div className="table-row">
              <strong>Location move</strong>
              <span>Changing location writes a new current history row instead of only changing display state.</span>
            </div>
            <div className="table-row">
              <strong>Still out of scope</strong>
              <span>No tags, media, research, workflow milestones, or auth cleanup in this slice.</span>
            </div>
            <div className="table-row">
              <strong>Next likely step</strong>
              <span>Add explicit workflow event creation from the detail page so repairs/photo/research milestones can be logged cleanly.</span>
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-2">
        <article className="card">
          <h2>Research</h2>
          <div className="stack-list">
            {objectRecord.research.length > 0 ? (
              objectRecord.research.map((entry) => (
                <div key={entry.id} className="mini-card">
                  <strong>{entry.citation ?? 'Research note'}</strong>
                  <p className="muted compact">{entry.summary ?? 'No summary yet.'}</p>
                  <p className="muted compact">Confidence: {entry.confidence ?? 'unrated'}</p>
                  {entry.sourceUrl ? (
                    <p className="muted compact">
                      <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                        {entry.sourceUrl}
                      </a>
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="muted">No research entries yet.</p>
            )}
          </div>
        </article>

        <article className="card">
          <h2>Media</h2>
          <div className="stack-list">
            {objectRecord.media.length > 0 ? (
              objectRecord.media.map((asset) => (
                <div key={asset.id} className="mini-card">
                  <strong>{asset.caption ?? asset.storagePath}</strong>
                  <p className="muted compact">{asset.kind} · {asset.isPrimary ? 'primary' : 'secondary'}</p>
                  <p className="muted compact code">{asset.storagePath}</p>
                </div>
              ))
            ) : (
              <p className="muted">No media assets yet.</p>
            )}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
