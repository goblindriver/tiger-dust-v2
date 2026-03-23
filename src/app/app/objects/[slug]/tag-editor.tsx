'use client';

import { useState, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateObjectTagsAction, updateObjectTagsInitialState } from './actions';

type TagEditorProps = {
  objectId: string;
  initialTags: string[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="button" disabled={pending} aria-disabled={pending}>
      {pending ? 'Saving tags…' : 'Save tags'}
    </button>
  );
}

function slugifyTag(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function TagEditor({ objectId, initialTags }: TagEditorProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [state, formAction] = useActionState(updateObjectTagsAction, updateObjectTagsInitialState);
  const inputRef = useRef<HTMLInputElement>(null);

  function addTags() {
    if (!inputValue.trim()) return;
    const parsed = inputValue
      .split(',')
      .map((t) => slugifyTag(t.trim()))
      .filter(Boolean);
    setTags((prev) => Array.from(new Set([...prev, ...parsed])));
    setInputValue('');
    inputRef.current?.focus();
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTags();
    }
  }

  return (
    <form action={formAction} className="card object-form-shell">
      <div className="list-header">
        <div>
          <p className="eyebrow">Tags</p>
          <h2>Edit tags</h2>
          <p className="muted">Add or remove tags. Changes take effect on save.</p>
        </div>
        <span className="badge">{tags.length} tag{tags.length !== 1 ? 's' : ''}</span>
      </div>

      <input type="hidden" name="objectId" value={objectId} />
      <input type="hidden" name="tags" value={tags.join(',')} />

      {tags.length > 0 ? (
        <div className="badge-row top-gap">
          {tags.map((tag) => (
            <span key={tag} className="badge badge-removable">
              {tag}
              <button
                type="button"
                className="badge-remove"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="muted top-gap">No tags yet.</p>
      )}

      <div className="tag-add-row top-gap">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="brass, gothic, restored"
          aria-label="Add tags (comma-separated)"
        />
        <button type="button" className="button button-secondary" onClick={addTags}>
          Add
        </button>
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
