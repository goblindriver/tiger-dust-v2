import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
import { getAuthStatus, getObjectIntakeDefaults, getObjectReferenceOptions } from '@/features/objects/data';
import { ObjectIntakeForm } from './object-intake-form';

export default function NewObjectPage() {
  const defaults = getObjectIntakeDefaults();
  const auth = getAuthStatus();
  const {
    objectTypeOptions,
    locationOptions,
    lifecycleStatusOptions,
    routeIntentOptions,
    intakeStageOptions,
    visibilityOptions,
  } = getObjectReferenceOptions();

  return (
    <SiteShell
      title="New object intake"
      description="A grounded intake screen for the first object workflow: enough structure to capture what came in, where it lives now, and what kind of follow-up the object needs next."
    >
      <section className="toolbar card">
        <div>
          <p className="eyebrow">Current mode</p>
          <h2>{auth.configured ? 'Auth/config present, first write path is live' : 'Demo-safe intake with graceful DB fallback'}</h2>
          <p className="muted">
            Save now attempts the real first workflow step. If DB/env/reference data is missing, the form stays honest and returns a clear message instead of faking persistence.
          </p>
        </div>
        <div className="toolbar-actions">
          <Link href="/app/objects" className="button button-secondary">
            Back to objects
          </Link>
        </div>
      </section>

      <section className="grid grid-2">
        <article className="card">
          <h2>What counts as a usable intake record</h2>
          <ul>
            <li>Give it a working title someone else can recognize later.</li>
            <li>Set the current location immediately so the record matches physical reality.</li>
            <li>Choose a rough route intent even if it stays undecided.</li>
            <li>Leave condition notes early, before memory turns into mythology.</li>
            <li>Photography and research can lag, but the record should still be actionable.</li>
          </ul>
        </article>

        <article className="card">
          <h2>Write path this screen now performs</h2>
          <div className="table-like">
            <div className="table-row">
              <strong>Object row</strong>
              <span>Title, type, stage, route, value, and catalog notes.</span>
            </div>
            <div className="table-row">
              <strong>Workflow event</strong>
              <span>Create an initial <span className="code">intake_created</span> event on save.</span>
            </div>
            <div className="table-row">
              <strong>Location history</strong>
              <span>Open the first current location record in the same transaction.</span>
            </div>
            <div className="table-row">
              <strong>Redirect</strong>
              <span>Land directly on the new object detail page so enrichment continues in context.</span>
            </div>
          </div>
        </article>
      </section>

      <section className="grid grid-2 object-intake-layout">
        <ObjectIntakeForm
          defaults={defaults}
          objectTypeOptions={objectTypeOptions}
          locationOptions={locationOptions}
          lifecycleStatusOptions={lifecycleStatusOptions}
          routeIntentOptions={routeIntentOptions}
          intakeStageOptions={intakeStageOptions}
          visibilityOptions={visibilityOptions}
        />

        <div className="stack-list">
          <article className="card">
            <h2>What happens after save</h2>
            <ul>
              <li>Redirect to the new object detail page so enrichment continues in context.</li>
              <li>Show the new record in the object list immediately.</li>
              <li>Record the initial location and first workflow event together.</li>
              <li>Leave media upload and research entry as follow-on actions.</li>
            </ul>
          </article>

          <article className="card">
            <h2>Environment check</h2>
            <p className="muted compact">Mode: <strong>{auth.mode}</strong></p>
            <p className="muted compact">Suggested role: <strong>{auth.suggestedRole}</strong></p>
            <p className="muted compact">Configured: {auth.configuredItems.join(', ') || 'none yet'}</p>
            <p className="muted compact">Missing: {auth.missingItems.join(', ') || 'nothing missing'}</p>
          </article>

          <article className="card">
            <h2>Still intentionally not in this step</h2>
            <ol>
              <li>No fake persistence path when DB/env is unavailable.</li>
              <li>No media upload or research creation yet.</li>
              <li>No tag-link writes yet, even though the field is preserved.</li>
              <li>No general edit/update workflow yet.</li>
            </ol>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
