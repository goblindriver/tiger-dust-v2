'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { ObjectIntakeDefaults } from '@/features/objects/data';
import { createObjectAction, createObjectInitialState } from './actions';

type ObjectIntakeFormProps = {
  defaults: ObjectIntakeDefaults;
  objectTypeOptions: string[];
  locationOptions: string[];
  lifecycleStatusOptions: string[];
  routeIntentOptions: string[];
  intakeStageOptions: string[];
  visibilityOptions: string[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="button" disabled={pending} aria-disabled={pending}>
      {pending ? 'Saving intake record…' : 'Save intake record'}
    </button>
  );
}

export function ObjectIntakeForm({
  defaults,
  objectTypeOptions,
  locationOptions,
  lifecycleStatusOptions,
  routeIntentOptions,
  intakeStageOptions,
  visibilityOptions,
}: ObjectIntakeFormProps) {
  const [state, formAction] = useActionState(createObjectAction, createObjectInitialState);

  return (
    <form action={formAction} className="card object-form-shell">
      <div className="list-header">
        <div>
          <h2>Intake draft</h2>
          <p className="muted">This now writes the first real object workflow when the database is available.</p>
        </div>
        <span className="badge">real create flow</span>
      </div>

      <div className="form-grid">
        <label>
          <span>Working title</span>
          <input name="title" defaultValue={defaults.title} placeholder="Brass serpent lamp" required />
        </label>
        <label>
          <span>Object type</span>
          <select name="objectTypeSlug" defaultValue={defaults.objectTypeSlug}>
            {objectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Lifecycle status</span>
          <select name="lifecycleStatus" defaultValue={defaults.lifecycleStatus}>
            {lifecycleStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Intake stage</span>
          <select name="intakeStage" defaultValue={defaults.intakeStage}>
            {intakeStageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Route intent</span>
          <select name="routeIntent" defaultValue={defaults.routeIntent}>
            {routeIntentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Visibility</span>
          <select name="visibility" defaultValue={defaults.visibility}>
            {visibilityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Primary location</span>
          <select name="primaryLocationSlug" defaultValue={defaults.primaryLocationSlug}>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Acquisition type</span>
          <input name="acquisitionType" defaultValue={defaults.acquisitionType} placeholder="purchase / found / handmade / consignment" />
        </label>
        <label>
          <span>Acquisition source</span>
          <input name="acquisitionSource" defaultValue={defaults.acquisitionSource} placeholder="estate lot, Laura studio, flood recovery…" />
        </label>
        <label>
          <span>Asking price</span>
          <input name="askingPrice" defaultValue={defaults.askingPrice} placeholder="285.00" inputMode="decimal" />
        </label>
        <label className="field-span-full">
          <span>Short internal description</span>
          <input
            name="descriptionShort"
            defaultValue={defaults.descriptionShort}
            placeholder="Tall brass lamp with figural serpent detail and repair work in progress."
          />
        </label>
        <label className="field-span-full">
          <span>Materials</span>
          <input name="materials" defaultValue={defaults.materials} placeholder="brass, glass, velvet" />
        </label>
        <label className="field-span-full">
          <span>Condition notes</span>
          <textarea
            name="conditionNotes"
            defaultValue={defaults.conditionNotes}
            placeholder="Needs rewiring, polish, and shade decision."
            rows={5}
          />
        </label>
        <label className="field-span-full">
          <span>Starter tags</span>
          <input name="tags" defaultValue={defaults.tags.join(', ')} placeholder="occult, brass, restored" />
        </label>
      </div>

      {state.message ? (
        <p className="muted top-gap" role="status">
          {state.message}
        </p>
      ) : null}

      <div className="toolbar-actions top-gap">
        <SubmitButton />
        <Link href="/app/objects" className="button button-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
