import {
  createTask,
  getTask,
  listTasks,
  updateTask,
  deleteTask,
} from './services/taskService.js';

try {
  // --- Create tasks ---
  console.log('=== Creating tasks ===');
  const task1 = createTask({
    title: 'Design database schema',
    description: 'Define all tables and relationships',
    priority: 'high',
  });
  console.log('Created:', task1);

  const task2 = createTask({
    title: 'Write unit tests',
    description: 'Cover all service functions',
    priority: 'medium',
  });
  console.log('Created:', task2);

  const task3 = createTask({
    title: 'Deploy to staging',
    priority: 'low',
  });
  console.log('Created:', task3);

  // --- Get a task by ID ---
  console.log('\n=== Getting task by ID ===');
  const fetched = getTask(task1.id);
  console.log('Fetched:', fetched);

  // --- List all tasks ---
  console.log('\n=== Listing all tasks ===');
  console.log(listTasks());

  // --- Update a task ---
  console.log('\n=== Updating task status to in-progress ===');
  const updated = updateTask(task1.id, { status: 'in-progress' });
  console.log('Updated:', updated);

  // --- Filter by status ---
  console.log('\n=== Filtering tasks by status: in-progress ===');
  console.log(listTasks({ status: 'in-progress' }));

  // --- Filter by priority ---
  console.log('\n=== Filtering tasks by priority: high ===');
  console.log(listTasks({ priority: 'high' }));

  // --- Sort by priority ---
  console.log('\n=== Listing tasks sorted by priority ===');
  console.log(listTasks({ sortBy: 'priority' }));

  // --- Delete a task ---
  console.log('\n=== Deleting a task ===');
  const deleted = deleteTask(task3.id);
  console.log('Deleted:', deleted);

  // --- Remaining tasks ---
  console.log('\n=== Remaining tasks ===');
  console.log(listTasks());

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
