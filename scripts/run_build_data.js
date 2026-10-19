#!/usr/bin/env node
/**
 * scripts/run_build_data.js - Runs scripts/build_data.py with whichever Python is installed.
 * `python3` is the name on Linux build images (Vercel, CI); `python` / `py` on Windows.
 * Fails the build when no interpreter is found or generation fails, so a stale
 * src/data/ is never shipped silently.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'build_data.py');

for (const cmd of ['python3', 'python', 'py']) {
  const result = spawnSync(cmd, [script], { stdio: 'inherit' });
  if (result.error?.code === 'ENOENT') continue;
  // The Windows Store "python3" alias exists but exits 9009 without running anything
  if (result.status === 9009) continue;
  process.exit(result.status ?? 1);
}

console.error('[ERROR] Python 3 was not found; it is required to build the blog directory data.');
process.exit(1);
