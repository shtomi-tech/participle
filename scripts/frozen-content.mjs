import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex').toUpperCase();
}

export function validateFrozenLessonContent(root, manifest) {
  const errors = [];
  if (!manifest || manifest.algorithm !== 'SHA-256' || !manifest.files || typeof manifest.files !== 'object') {
    return ['Frozen lesson content manifest must declare SHA-256 files.'];
  }
  for (const [relativePath, expectedHash] of Object.entries(manifest.files)) {
    const filePath = join(root, relativePath);
    if (!existsSync(filePath)) {
      errors.push(`Frozen lesson content file is missing: ${relativePath}`);
      continue;
    }
    const actualHash = sha256File(filePath);
    if (actualHash !== expectedHash) errors.push(`Frozen lesson content changed: ${relativePath}`);
  }
  return errors;
}
