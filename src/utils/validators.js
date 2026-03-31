const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validates and normalizes a task title.
 * @param {unknown} title
 * @returns {string} Trimmed title.
 */
export function validateTitle(title) {
  if (typeof title !== 'string') {
    throw new TypeError('title must be a string');
  }
  const trimmed = title.trim();
  if (trimmed.length === 0 || trimmed.length > 100) {
    throw new TypeError('title must be between 1 and 100 characters');
  }
  return trimmed;
}

/**
 * Validates and normalizes a task description.
 * @param {unknown} [description]
 * @returns {string} Trimmed description, or empty string when omitted.
 */
export function validateDescription(description) {
  if (description === undefined || description === null) {
    return '';
  }
  if (typeof description !== 'string') {
    throw new TypeError('description must be a string');
  }
  const trimmed = description.trim();
  if (trimmed.length > 500) {
    throw new TypeError('description must be 500 characters or fewer');
  }
  return trimmed;
}

/**
 * Validates and normalizes a task status value.
 * @param {unknown} status
 * @returns {string} Normalized status.
 */
export function validateStatus(status) {
  if (typeof status !== 'string') {
    throw new TypeError('status must be a string');
  }
  const normalized = status.toLowerCase();
  if (!VALID_STATUSES.includes(normalized)) {
    throw new TypeError(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  return normalized;
}

/**
 * Validates and normalizes a task priority value.
 * @param {unknown} priority
 * @returns {string} Normalized priority.
 */
export function validatePriority(priority) {
  if (typeof priority !== 'string') {
    throw new TypeError('priority must be a string');
  }
  const normalized = priority.toLowerCase();
  if (!VALID_PRIORITIES.includes(normalized)) {
    throw new TypeError(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  return normalized;
}
