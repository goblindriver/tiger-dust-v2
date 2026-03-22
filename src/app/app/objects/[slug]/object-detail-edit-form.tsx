'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { ObjectDetail } from '@/features/objects/data';
import { updateObjectAction, updateObjectInitialState } from './actions';

type ObjectDetailEditFormProps = {
  item: ObjectDetail;
  source: 'database' | 'demo';
  objectTypeOptions: string[];
  locationOptions: string[];
  lifecycleStatusOptions: string[];
  routeIntentOptions: string[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="button" disabled={pending} aria-disabled={pending}>
      {pending ? 'Saving changes…' : 'Save core fields'}
    </button>
  );
}

function formatPriceInput(value: number | null) {
  if (value === null) return '';
  return (value / 100).toFixed(2);
}

export function ObjectDetailEditForm({
  item,
  source,
  objectTypeOptions,
  locationOptions,
  lifecycleStatusOptions,
  routeIntentOptions,
}: ObjectDetailEditFormProps) {
  const [state, formAction] = useActionState(updateObjectAction, updateObjectInitialState);

  return (
    <form action={formAction} className="card object-form-shell">
      <div className="list-header">
        <div>
          <p className="eyebrow">Core field edit</p>
          <h2>Edit the record without leaving the object page</h2>
          <p className="muted">
            This slice only covers title, type, lifecycle, route, location, asking price, and condition notes.
          </p>
        </div>
        <span className="badge">{source === 'database' ? 'live edit path' : 'demo-safe fallback'}</span>
      </div>

      <input type="hidden" name="objectId" value={item.id} />
      <input type="hidden" name="slug" value={item.slug} />

      <div className="form-grid">
        <label className="field-span-full">
          <span>Title</span>
          <input name="title" defaultValue={item.title} required />
        </label>
        <label>
          <span>Object type</span>
          <select name="objectTypeSlug" defaultValue={item.objectTypeSlug ?? ''} required>
            {objectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Lifecycle status</span>
          <select name="lifecycleStatus" defaultValue={item.lifecycleStatus} required>
            {lifecycleStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Route / disposition</span>
          <select name="routeIntent" defaultValue={item.routeIntent} required>
            {routeIntentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Location</span>
          <select name="primaryLocationSlug" defaultValue={item.primaryLocationSlug ?? ''} required>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Asking price</span>
          <input name="askingPrice" defaultValue={formatPriceInput(item.askingPriceCents)} placeholder="285.00" inputMode="decimal" />
        </label>
        <label className="field-span-full">
          <span>Condition notes</span>
          <textarea name="conditionNotes" defaultValue={item.conditionNotes ?? ''} rows={5} />
        </label>
      </div>

      <p className="muted top-gap">
        {source === 'database'
          ? 'If you change location, save will close the current open location row and create a new history entry.'
          : 'This stays fully explorable in demo mode, but save will return a clear non-persisted message until the DB is configured.'}
      </p>

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
