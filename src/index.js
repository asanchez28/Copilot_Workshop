import {
  createTask,
  getTask,
  listTasks,
  updateTask,
  deleteTask,
} from './services/taskService.js';
import { colorPriority, colorStatus } from './utils/colors.js';

/**
 * Formats a task for readable CLI output with colored status and priority.
 * @param {import('./models/task.js').Task | Record<string, unknown>} task
 * @returns {Record<string, unknown>}
 */
function formatTask(task) {
  return {
    ...task,
    status: colorStatus(String(task.status)),
    priority: colorPriority(String(task.priority)),
  };
}

/**
 * Formats a list of tasks for readable CLI output.
 * @param {Array<import('./models/task.js').Task | Record<string, unknown>>} tasks
 * @returns {Array<Record<string, unknown>>}
 */
function formatTaskList(tasks) {
  return tasks.map(formatTask);
}

try {
  // --- Create tasks ---
  console.log('=== Creating tasks ===');
  const task1 = createTask({
    title: 'Design database schema',
    description: 'Define all tables and relationships',
    priority: 'high',
  });
  console.log('Created:', formatTask(task1));

  const task2 = createTask({
    title: 'Write unit tests',
    description: 'Cover all service functions',
    priority: 'medium',
  });
  console.log('Created:', formatTask(task2));

  const task3 = createTask({
    title: 'Deploy to staging',
    priority: 'low',
  });
  console.log('Created:', formatTask(task3));

  // --- Get a task by ID ---
  console.log('\n=== Getting task by ID ===');
  const fetched = getTask(task1.id);
  console.log('Fetched:', formatTask(fetched));

  // --- List all tasks ---
  console.log('\n=== Listing all tasks ===');
  console.log(formatTaskList(listTasks()));

  // --- Update a task ---
  console.log('\n=== Updating task status to in-progress ===');
  const updated = updateTask(task1.id, { status: 'in-progress' });
  console.log('Updated:', formatTask(updated));

  // --- Filter by status ---
  console.log('\n=== Filtering tasks by status: in-progress ===');
  console.log(formatTaskList(listTasks({ status: 'in-progress' })));

  // --- Filter by priority ---
  console.log('\n=== Filtering tasks by priority: high ===');
  console.log(formatTaskList(listTasks({ priority: 'high' })));

  // --- Sort by priority ---
  console.log('\n=== Listing tasks sorted by priority ===');
  console.log(formatTaskList(listTasks({ sortBy: 'priority' })));

  // --- Delete a task ---
  console.log('\n=== Deleting a task ===');
  const deleted = deleteTask(task3.id);
  console.log('Deleted:', formatTask(deleted));

  // --- Remaining tasks ---
  console.log('\n=== Remaining tasks ===');
  console.log(formatTaskList(listTasks()));

  // --- Error: task not found ---
  console.log('\n=== Error handling: task not found ===');
  try {
    getTask('00000000-0000-4000-8000-000000000000');
  } catch (err) {
    console.error('Caught expected error:', err.message);
  }

  // --- Error: invalid priority ---
  console.log('\n=== Error handling: invalid priority ===');
  try {
    createTask({ title: 'Bad task', priority: 'urgent' });
  } catch (err) {
    console.error('Caught expected error:', err.message);
  }

  // --- Error: empty update ---
  console.log('\n=== Error handling: empty update ===');
  try {
    updateTask(task1.id, {});
  } catch (err) {
    console.error('Caught expected error:', err.message);
  }
} catch (err) {
  console.error('Unexpected error:', err.message);
  process.exit(2);
}
