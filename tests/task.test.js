import test from 'node:test';
import assert from 'node:assert/strict';

import { Task } from '../src/models/task.js';

test('Task constructor requires title', () => {
  assert.throws(
    () => new Task({ priority: 'high' }),
    /title is required/
  );
});

test('Task constructor requires priority', () => {
  assert.throws(
    () => new Task({ title: 'Ship release' }),
    /priority is required/
  );
});

test('Task constructor sets defaults for id, description, status, and timestamps', () => {
  const task = new Task({ title: 'Ship release', priority: 'medium' });

  assert.equal(typeof task.id, 'string');
  assert.ok(task.id.length > 0);
  assert.equal(task.description, '');
  assert.equal(task.status, 'todo');
  assert.ok(task.createdAt instanceof Date);
  assert.ok(task.updatedAt instanceof Date);
  assert.equal(task.updatedAt.getTime(), task.createdAt.getTime());
});

test('Task constructor normalizes title, description, status, and priority', () => {
  const task = new Task({
    title: '  Build dashboard  ',
    description: '  Add charts  ',
    status: 'DONE',
    priority: 'HIGH',
  });

  assert.equal(task.title, 'Build dashboard');
  assert.equal(task.description, 'Add charts');
  assert.equal(task.status, 'done');
  assert.equal(task.priority, 'high');
});

test('Task constructor uses provided id and timestamps when valid', () => {
  const createdAt = new Date('2024-01-01T00:00:00.000Z');
  const updatedAt = new Date('2024-01-02T00:00:00.000Z');

  const task = new Task({
    id: 'fixed-id',
    title: 'Test migration',
    priority: 'low',
    createdAt,
    updatedAt,
  });

  assert.equal(task.id, 'fixed-id');
  assert.equal(task.createdAt, createdAt);
  assert.equal(task.updatedAt, updatedAt);
});

test('Task constructor falls back to createdAt when updatedAt is invalid', () => {
  const createdAt = new Date('2024-02-01T00:00:00.000Z');
  const task = new Task({
    title: 'Record notes',
    priority: 'low',
    createdAt,
    updatedAt: 'bad-date',
  });

  assert.equal(task.updatedAt.getTime(), createdAt.getTime());
});

test('Task constructor validates status values', () => {
  assert.throws(
    () => new Task({ title: 'A', priority: 'low', status: 'blocked' }),
    /status must be one of: todo, in-progress, done/
  );
});

test('Task constructor validates priority values', () => {
  assert.throws(
    () => new Task({ title: 'A', priority: 'urgent' }),
    /priority must be one of: low, medium, high/
  );
});

test('Task constructor accepts title boundary lengths of 1 and 100', () => {
  const minTitleTask = new Task({ title: 'A', priority: 'low' });
  const maxTitleTask = new Task({ title: 'x'.repeat(100), priority: 'medium' });

  assert.equal(minTitleTask.title, 'A');
  assert.equal(maxTitleTask.title.length, 100);
});

test('Task constructor rejects a title longer than 100 characters', () => {
  assert.throws(
    () => new Task({ title: 'x'.repeat(101), priority: 'high' }),
    /title must be between 1 and 100 characters/
  );
});

test('Task constructor rejects whitespace-only title', () => {
  assert.throws(
    () => new Task({ title: '   ', priority: 'low' }),
    /title must be between 1 and 100 characters/
  );
});

test('Task constructor accepts description length boundary of 500', () => {
  const task = new Task({
    title: 'Boundary description',
    description: 'd'.repeat(500),
    priority: 'medium',
  });

  assert.equal(task.description.length, 500);
});

test('Task constructor rejects description longer than 500 characters', () => {
  assert.throws(
    () =>
      new Task({
        title: 'Too long description',
        description: 'd'.repeat(501),
        priority: 'medium',
      }),
    /description must be 500 characters or fewer/
  );
});

test('Task constructor treats null description as missing optional field', () => {
  const task = new Task({ title: 'Optional description', description: null, priority: 'low' });

  assert.equal(task.description, '');
});

test('Task constructor rejects non-string title type', () => {
  assert.throws(
    () => new Task({ title: 123, priority: 'low' }),
    /title must be a string/
  );
});

test('Task constructor rejects non-string status type', () => {
  assert.throws(
    () => new Task({ title: 'Type mismatch', status: 42, priority: 'low' }),
    /status must be a string/
  );
});

test('Task constructor rejects non-string priority type', () => {
  assert.throws(
    () => new Task({ title: 'Type mismatch', priority: Number.MAX_SAFE_INTEGER }),
    /priority must be a string/
  );
});

test('Task constructor allows duplicate ids because uniqueness is service-level concern', () => {
  const first = new Task({ id: 'duplicate-id', title: 'First', priority: 'low' });
  const second = new Task({ id: 'duplicate-id', title: 'Second', priority: 'high' });

  assert.equal(first.id, 'duplicate-id');
  assert.equal(second.id, 'duplicate-id');
  assert.notEqual(first.title, second.title);
});

test('Task toJSON returns a plain object with task fields', () => {
  const task = new Task({
    id: 'json-id',
    title: 'Serialize',
    description: 'Check payload',
    status: 'in-progress',
    priority: 'medium',
  });

  const json = task.toJSON();

  assert.deepEqual(Object.keys(json).sort(), [
    'createdAt',
    'description',
    'id',
    'priority',
    'status',
    'title',
    'updatedAt',
  ]);
  assert.equal(json.id, 'json-id');
  assert.equal(json.title, 'Serialize');
  assert.equal(json.description, 'Check payload');
  assert.equal(json.status, 'in-progress');
  assert.equal(json.priority, 'medium');
  assert.ok(json.createdAt instanceof Date);
  assert.ok(json.updatedAt instanceof Date);
});
