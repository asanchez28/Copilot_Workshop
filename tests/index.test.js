import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('src/index.js runs successfully and handles expected scenarios', () => {
  const result = spawnSync(process.execPath, ['src/index.js'], {
    encoding: 'utf8',
    cwd: process.cwd(),
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /=== Creating tasks ===/);
  assert.match(result.stdout, /=== Remaining tasks ===/);
  assert.match(result.stderr, /Caught expected error: Task not found/);
  assert.match(result.stderr, /Caught expected error: priority must be one of: low, medium, high/);
  assert.match(result.stderr, /Caught expected error: At least one field must be provided for update/);
});
