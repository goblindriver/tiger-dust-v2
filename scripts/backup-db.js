#!/usr/bin/env node
/**
 * Tiger Dust v2 — Nightly DB backup script
 * Exports the full schema + data via Supabase Management API
 * and saves to ~/tiger-dust-backups/YYYY-MM-DD.sql
 *
 * Usage: node scripts/backup-db.js
 * Scheduled via: openclaw cron (nightly 2am ET)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SUPABASE_TOKEN = process.env.SUPABASE_MANAGEMENT_TOKEN || 'sbp_93d366aa16998f5ebb43c4482a75a942198b885f';
const PROJECT_ID = 'gctxbkqdttgcfqcovslk';
const BACKUP_DIR = path.join(os.homedir(), 'tiger-dust-backups');

async function runQuery(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  return res.json();
}

async function backup() {
  const date = new Date().toISOString().split('T')[0];
  const filename = path.join(BACKUP_DIR, `${date}.json`);

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  console.log(`[backup] Starting Tiger Dust DB backup for ${date}...`);

  const tables = [
    'users', 'object_types', 'locations', 'tags', 'collections',
    'objects', 'object_tags', 'object_location_history', 'workflow_events',
    'media_assets', 'research_entries', 'collection_objects', 'sales_records',
    'publish_profiles', 'inventory_items', 'inventory_variants',
    'object_relationships', 'object_valuations'
  ];

  const backup = { date, tables: {} };

  for (const table of tables) {
    const rows = await runQuery(`SELECT * FROM ${table} ORDER BY created_at ASC`);
    backup.tables[table] = Array.isArray(rows) ? rows : [];
    console.log(`[backup]   ${table}: ${backup.tables[table].length} rows`);
  }

  fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
  console.log(`[backup] Saved to ${filename}`);

  // Keep only last 30 backups
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length > 30) {
    files.slice(30).forEach(f => {
      fs.unlinkSync(path.join(BACKUP_DIR, f));
      console.log(`[backup] Pruned old backup: ${f}`);
    });
  }

  console.log(`[backup] Done.`);
}

backup().catch(err => {
  console.error('[backup] FAILED:', err);
  process.exit(1);
});
