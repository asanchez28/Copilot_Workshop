import { Task } from '../models/task.js';
import { validateStatus, validatePriority } from '../utils/validators.js';

/** @type {Map<string, Task>} */
const store = new Map();

const ALLOWED_UPDATE_FIELDS = new Set(['title', 'description', 'status', 'priority']);

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

/**
 * Creates a new task and persists it in the in-memory store.
 * @param {{ title: string, description?: string, priority: 'low'|'medium'|'high' }} input
 * @returns {object} The created task as a plain object.
 */
export function createTask(input) {
  const task = new Task(input);
  store.set(task.id, task);
  return { ...task.toJSON() };
}

/**
 * Returns a single task by its ID.
 * @param {string} id
 * @returns {object} The task as a plain object.
 */
export function getTask(id) {
  const task = store.get(id);
  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }
  return { ...task.toJSON() };
}

/**
 * Returns all tasks, optionally filtered and sorted.
 * @param {{ status?: string, priority?: string, sortBy?: 'priority'|'createdAt'|'updatedAt' }} [options]
 * @returns {object[]} Array of task plain objects.
 */
export function listTasks({ status, priority, sortBy } = {}) {
  let tasks = [...store.values()];

  if (status !== undefined) {
    const normalized = validateStatus(status);
    tasks = tasks.filter(t => t.status === normalized);
  }

  if (priority !== undefined) {
    const normalized = validatePriority(priority);
    tasks = tasks.filter(t => t.priority === normalized);
  }

  if (sortBy === 'priority') {
    tasks = tasks.sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]);
  } else if (sortBy === 'createdAt') {
    tasks = tasks.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sortBy === 'updatedAt') {
    tasks = tasks.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  return tasks.map(t => ({ ...t.toJSON() }));
}

/**
 * Updates an existing task by ID.
 * @param {string} id
 * @param {{ title?: string, description?: string, status?: string, priority?: string }} updates
 * @returns {object} The updated task as a plain object.
 */
export function updateTask(id, updates) {
  const task = store.get(id);
  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }

  const keys = Object.keys(updates);
  if (keys.length === 0) {
    throw new Error('At least one field must be provided for update');
  }

  for (const key of keys) {
    if (!ALLOWED_UPDATE_FIELDS.has(key)) {
      throw new Error(`Unknown update field: ${key}`);
    }
  }

  if (updates.title !== undefined) {
    task.title = updates.title;
  }
  if (updates.description !== undefined) {
    task.description = updates.description;
  }
  if (updates.status !== undefined) {
    task.status = validateStatus(updates.status);
  }
  if (updates.priority !== undefined) {
    task.priority = validatePriority(updates.priority);
  }
  task.updatedAt = new Date();

  return { ...task.toJSON() };
}

/**
 * Deletes a task by ID and returns it.
 * @param {string} id
 * @returns {object} The deleted task as a plain object.
 */
export function deleteTask(id) {
  const task = store.get(id);
  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }
  store.delete(id);
  return { ...task.toJSON() };
}
