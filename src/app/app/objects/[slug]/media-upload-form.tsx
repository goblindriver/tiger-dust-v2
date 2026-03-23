'use client';

import { useActionState } from 'react';
import {
  uploadMediaAction,
  setPrimaryImageAction,
  deleteMediaAssetAction,
  type MediaActionState,
} from './actions';

export type MediaAssetProp = {
  id: string;
  publicUrl: string;
  storagePath: string;
  kind: string;
  caption: string | null;
  isPrimary: boolean;
  mimeType: string | null;
};

type Props = {
  objectId: string;
  mediaAssets: MediaAssetProp[];
};

const uploadInitialState: MediaActionState = { status: 'idle' };

export function MediaUploadForm({ objectId, mediaAssets }: Props) {
  const [uploadState, uploadFormAction, isUploading] = useActionState(
    uploadMediaAction.bind(null, objectId),
    uploadInitialState,
  );

  return (
    <article className="card">
      <p className="eyebrow">Media</p>
      <h2>Upload image</h2>

      <form action={uploadFormAction} className="form-grid">
        <div className="field-span-full">
          <label htmlFor="media-file-input">Image file</label>
          <input
            id="media-file-input"
            type="file"
            name="file"
            accept="image/*"
            required
            disabled={isUploading}
          />
        </div>
        <div className="field-span-full">
          <button type="submit" className="button" disabled={isUploading}>
            {isUploading ? 'Uploading…' : 'Upload image'}
          </button>
        </div>
        {uploadState.status === 'error' && (
          <p className="field-span-full muted">{uploadState.message}</p>
        )}
        {uploadState.status === 'success' && (
          <p className="field-span-full">{uploadState.message}</p>
        )}
      </form>

      {mediaAssets.length > 0 && (
        <div className="stack-list top-gap">
          {mediaAssets.map((asset) => (
            <MediaAssetCard
              key={asset.id}
              asset={asset}
              objectId={objectId}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function MediaAssetCard({ asset, objectId }: { asset: MediaAssetProp; objectId: string }) {
  const setPrimaryInitial: MediaActionState = { status: 'idle' };
  const deleteInitial: MediaActionState = { status: 'idle' };

  const [, setPrimaryAction, isSettingPrimary] = useActionState(
    setPrimaryImageAction.bind(null, objectId, asset.id),
    setPrimaryInitial,
  );

  const [, deleteAction, isDeleting] = useActionState(
    deleteMediaAssetAction.bind(null, asset.id, objectId),
    deleteInitial,
  );

  const displayName = asset.caption ?? asset.storagePath.split('/').pop() ?? asset.id;

  return (
    <div className="mini-card">
      <img
        src={asset.publicUrl}
        alt={asset.caption ?? 'Media asset'}
        style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
      />
      <p className="compact" style={{ marginTop: '6px' }}>{displayName}</p>
      <p className="muted compact">{asset.kind} · {asset.isPrimary ? 'primary' : 'secondary'}</p>

      <div className="toolbar" style={{ marginTop: '8px', gap: '6px' }}>
        {!asset.isPrimary && (
          <form action={setPrimaryAction}>
            <button type="submit" className="button button-secondary" disabled={isSettingPrimary}>
              {isSettingPrimary ? 'Saving…' : 'Set as primary'}
            </button>
          </form>
        )}
        <form action={deleteAction}>
          <button type="submit" className="button button-secondary" disabled={isDeleting}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </form>
      </div>
    </div>
  );
}
