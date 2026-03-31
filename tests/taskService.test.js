import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

import {
  createTask,
  getTask,
  listTasks,
  updateTask,
  deleteTask,
} from '../src/services/taskService.js';

function clearStore() {
  for (const task of listTasks()) {
    deleteTask(task.id);
  }
}

test.beforeEach(() => {
  clearStore();
});

test('createTask returns created task with normalized values', () => {
  const created = createTask({
    title: '  Implement API  ',
    description: '  Add endpoint tests  ',
    priority: 'HIGH',
  });

  assert.equal(created.title, 'Implement API');
  assert.equal(created.description, 'Add endpoint tests');
  assert.equal(created.priority, 'high');
  assert.equal(created.status, 'todo');
  assert.equal(typeof created.id, 'string');
});

test('createTask throws when input is invalid', () => {
  assert.throws(
    () => createTask({ title: 'Missing priority' }),
    /priority is required/
  );
});

test('getTask returns a copy rather than internal state reference', () => {
  const created = createTask({ title: 'Draft ADR', priority: 'medium' });

  const fetched = getTask(created.id);
  fetched.title = 'Mutated outside service';

  const fetchedAgain = getTask(created.id);
  assert.equal(fetchedAgain.title, 'Draft ADR');
});

test('getTask throws for unknown ids', () => {
  assert.throws(
    () => getTask('missing-id'),
    /Task not found: missing-id/
  );
});

test('listTasks returns all tasks by default', () => {
  createTask({ title: 'A', priority: 'low' });
  createTask({ title: 'B', priority: 'medium' });

  const all = listTasks();

  assert.equal(all.length, 2);
});

test('listTasks filters tasks by status', () => {
  const first = createTask({ title: 'A', priority: 'low' });
  createTask({ title: 'B', priority: 'medium' });
  updateTask(first.id, { status: 'done' });

  const doneOnly = listTasks({ status: 'done' });

  assert.equal(doneOnly.length, 1);
  assert.equal(doneOnly[0].id, first.id);
});

test('listTasks filters tasks by priority', () => {
  createTask({ title: 'A', priority: 'low' });
  const high = createTask({ title: 'B', priority: 'high' });

  const highOnly = listTasks({ priority: 'HIGH' });

  assert.equal(highOnly.length, 1);
  assert.equal(highOnly[0].id, high.id);
});

test('listTasks sorts by priority weight descending', () => {
  createTask({ title: 'Low', priority: 'low' });
  createTask({ title: 'High', priority: 'high' });
  createTask({ title: 'Medium', priority: 'medium' });

  const sorted = listTasks({ sortBy: 'priority' });

  assert.deepEqual(sorted.map(t => t.priority), ['high', 'medium', 'low']);
});

test('listTasks sorts by createdAt ascending', async () => {
  createTask({ title: 'First', priority: 'low' });
  await delay(5);
  createTask({ title: 'Second', priority: 'low' });

  const sorted = listTasks({ sortBy: 'createdAt' });

  assert.deepEqual(sorted.map(t => t.title), ['First', 'Second']);
});

test('listTasks sorts by updatedAt descending', async () => {
  const first = createTask({ title: 'First', priority: 'low' });
  await delay(5);
  const second = createTask({ title: 'Second', priority: 'low' });
  await delay(5);
  updateTask(first.id, { status: 'in-progress' });

  const sorted = listTasks({ sortBy: 'updatedAt' });

  assert.equal(sorted[0].id, first.id);
  assert.equal(sorted[1].id, second.id);
});

test('listTasks throws when status filter is invalid', () => {
  createTask({ title: 'A', priority: 'low' });

  assert.throws(
    () => listTasks({ status: 'blocked' }),
    /status must be one of: todo, in-progress, done/
  );
});

test('listTasks throws when priority filter is invalid', () => {
  createTask({ title: 'A', priority: 'low' });

  assert.throws(
    () => listTasks({ priority: 'urgent' }),
    /priority must be one of: low, medium, high/
  );
});

test('updateTask returns updated fields and refreshes updatedAt', async () => {
  const created = createTask({ title: 'Plan release', priority: 'medium' });
  const before = getTask(created.id);
  await delay(5);

  const updated = updateTask(created.id, {
    title: 'Plan major release',
    description: 'Coordinate release checklist',
    status: 'done',
    priority: 'high',
  });

  assert.equal(updated.title, 'Plan major release');
  assert.equal(updated.description, 'Coordinate release checklist');
  assert.equal(updated.status, 'done');
  assert.equal(updated.priority, 'high');
  assert.ok(updated.updatedAt > before.updatedAt);
});

test('updateTask throws when no update fields are provided', () => {
  const created = createTask({ title: 'A', priority: 'low' });

  assert.throws(
    () => updateTask(created.id, {}),
    /At least one field must be provided for update/
  );
});

test('updateTask throws when an unknown field is included', () => {
  const created = createTask({ title: 'A', priority: 'low' });

  assert.throws(
    () => updateTask(created.id, { estimate: 3 }),
    /Unknown update field: estimate/
  );
});

test('updateTask throws when id is not found', () => {
  assert.throws(
    () => updateTask('missing-id', { status: 'done' }),
    /Task not found: missing-id/
  );
});

test('deleteTask removes the task and returns deleted payload', () => {
  const created = createTask({ title: 'A', priority: 'low' });

  const deleted = deleteTask(created.id);

  assert.equal(deleted.id, created.id);
  assert.throws(
    () => getTask(created.id),
    /Task not found/
  );
});

test('deleteTask throws when id is not found', () => {
  assert.throws(
    () => deleteTask('missing-id'),
    /Task not found: missing-id/
  );
});
