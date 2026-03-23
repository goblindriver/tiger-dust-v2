#!/usr/bin/env node
/**
 * Tiger Dust v2 — One-time Supabase storage bucket setup
 * Creates the 'tiger-dust-media' private bucket for object media assets.
 *
 * Usage: node scripts/create-storage-bucket.js
 * Reads: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 */

const fs = require('fs');
const path = require('path');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('No .env.local found — relying on process environment.');
    return;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const BUCKET_NAME = 'tiger-dust-media';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Creating bucket: ${BUCKET_NAME} ...`);

  const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: false,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: 20971520, // 20 MB
  });

  if (error) {
    if (error.message?.includes('already exists')) {
      console.log(`Bucket "${BUCKET_NAME}" already exists — nothing to do.`);
    } else {
      console.error('Failed to create bucket:', error.message);
      process.exit(1);
    }
  } else {
    console.log(`Bucket "${BUCKET_NAME}" created.`, data);
  }

  // List buckets to confirm
  const { data: buckets } = await supabase.storage.listBuckets();
  const found = buckets?.find((b) => b.name === BUCKET_NAME);
  if (found) {
    console.log(`Confirmed: "${BUCKET_NAME}" is ready (public=${found.public}).`);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
