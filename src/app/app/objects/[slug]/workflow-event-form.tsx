'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { logWorkflowEventAction, logWorkflowEventInitialState } from './actions';

const EVENT_TYPE_OPTIONS = [
  'repair',
  'cleaning',
  'lapidary',
  'jewelry-fabrication',
  'photography-pending',
  'photography-complete',
  'research-pending',
  'research-complete',
  'pricing-review',
  'routed-to-store',
  'routed-to-archive',
  'routed-to-liquidation',
  'published',
  'sold',
  'note',
];

type WorkflowEventFormProps = {
  objectId: string;
  lifecycleStatus: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="button" disabled={pending} aria-disabled={pending}>
      {pending ? 'Logging event…' : 'Log event'}
    </button>
  );
}

export function WorkflowEventForm({ objectId, lifecycleStatus }: WorkflowEventFormProps) {
  const [state, formAction] = useActionState(logWorkflowEventAction, logWorkflowEventInitialState);

  return (
    <form action={formAction} className="card object-form-shell">
      <div className="list-header">
        <div>
          <p className="eyebrow">Workflow event</p>
          <h2>Log a workflow event</h2>
          <p className="muted">
            Record a repair, photo milestone, routing decision, or any other operational event for this object.
          </p>
        </div>
      </div>

      <input type="hidden" name="objectId" value={objectId} />
      <input type="hidden" name="fromState" value={lifecycleStatus} />

      <div className="form-grid">
        <label>
          <span>Event type</span>
          <select name="eventType" required>
            {EVENT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field-span-full">
          <span>Notes (optional)</span>
          <textarea name="notes" rows={4} placeholder="Add any relevant context for this event…" />
        </label>
      </div>

      {state.message ? (
        <p className="muted top-gap" role="status">
          {state.message}
        </p>
      ) : null}

      <div className="toolbar-actions top-gap">
        <SubmitButton />
      </div>
    </form>
  );
}
