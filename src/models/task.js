import { randomUUID } from 'crypto';
import {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
} from '../utils/validators.js';

/**
 * Represents a task in the task manager.
 */
export class Task {
  /**
   * Creates a new Task instance.
   * @param {object} params
   * @param {string} [params.id] - UUID v4; auto-generated if omitted.
   * @param {string} params.title
   * @param {string} [params.description]
   * @param {'todo'|'in-progress'|'done'} [params.status]
   * @param {'low'|'medium'|'high'} params.priority
   * @param {Date} [params.createdAt]
   * @param {Date} [params.updatedAt]
   */
  constructor({
    id,
    title,
    description,
    status = 'todo',
    priority,
    createdAt,
    updatedAt,
  } = {}) {
    if (title === undefined) {
      throw new TypeError('title is required');
    }
    if (priority === undefined) {
      throw new TypeError('priority is required');
    }

    this.id = typeof id === 'string' && id.length > 0 ? id : randomUUID();
    this.title = validateTitle(title);
    this.description = validateDescription(description);
    this.status = validateStatus(status);
    this.priority = validatePriority(priority);
    this.createdAt = createdAt instanceof Date ? createdAt : new Date();
    this.updatedAt = updatedAt instanceof Date ? updatedAt : this.createdAt;
  }

  /**
   * Returns a plain object representation of this task.
   * @returns {{ id: string, title: string, description: string, status: string, priority: string, createdAt: Date, updatedAt: Date }}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
