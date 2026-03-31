import chalk from 'chalk';

/**
 * Returns a colorized task status label.
 * @param {string} status
 * @returns {string}
 */
export function colorStatus(status) {
  switch (status) {
    case 'done':
      return chalk.green(status);
    case 'in-progress':
      return chalk.yellow(status);
    case 'todo':
      return chalk.red(status);
    default:
      return status;
  }
}

/**
 * Returns a colorized task priority label.
 * @param {string} priority
 * @returns {string}
 */
export function colorPriority(priority) {
  switch (priority) {
    case 'high':
      return chalk.bold.red(priority);
    case 'medium':
      return chalk.bold.yellow(priority);
    case 'low':
      return chalk.dim(priority);
    default:
      return priority;
  }
}
