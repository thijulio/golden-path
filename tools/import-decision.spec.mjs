import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { adrs } from '../apps/site/src/app/data/adrs.ts';

test('import proposal and documentation-site mirror agree', async () => {
  const text = await readFile(new URL('../decisions/0009-lossless-incremental-import.md', import.meta.url), 'utf8');
  const adr = adrs.find((entry) => entry.id === '0009');
  assert.deepEqual(adr && { title: adr.title, status: adr.status, date: adr.date }, {
    title: text.split('\n')[0].replace(/^# 0009 — /, ''),
    status: text.match(/\*\*Status:\*\* (.+)/)?.[1],
    date: text.match(/\*\*Date:\*\* (.+)/)?.[1],
  });
  assert.equal(adr?.status, 'accepted');
});

test('import workflow routes to extraction, replay, merge and rollback evidence', async () => {
  const text = await readFile(new URL('../workflows/lossless-incremental-import.md', import.meta.url), 'utf8');
  for (const phrase of ['original bytes', 'read-only', 'three-way', 'native edits', 'accepted assessments', 'unknown commit', 'independent review', 'two clean']) {
    assert.ok(text.includes(phrase), phrase);
  }
});
