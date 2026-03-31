import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
} from '../src/utils/validators.js';

test('validateTitle trims surrounding whitespace', () => {
  assert.equal(validateTitle('  Plan sprint  '), 'Plan sprint');
});

test('validateTitle rejects non-string values', () => {
  assert.throws(
    () => validateTitle(42),
    /title must be a string/
  );
});

test('validateTitle rejects an empty string after trim', () => {
  assert.throws(
    () => validateTitle('   '),
    /title must be between 1 and 100 characters/
  );
});

test('validateTitle rejects strings longer than 100 characters', () => {
  assert.throws(
    () => validateTitle('a'.repeat(101)),
    /title must be between 1 and 100 characters/
  );
});

test('validateDescription returns empty string when omitted', () => {
  assert.equal(validateDescription(undefined), '');
});

test('validateDescription returns empty string when null', () => {
  assert.equal(validateDescription(null), '');
});

test('validateDescription trims surrounding whitespace', () => {
  assert.equal(validateDescription('  Write docs  '), 'Write docs');
});

test('validateDescription rejects non-string values', () => {
  assert.throws(
    () => validateDescription(99),
    /description must be a string/
  );
});

test('validateDescription rejects values over 500 characters', () => {
  assert.throws(
    () => validateDescription('d'.repeat(501)),
    /description must be 500 characters or fewer/
  );
});

test('validateStatus normalizes input to lowercase', () => {
  assert.equal(validateStatus('In-Progress'), 'in-progress');
});

test('validateStatus rejects non-string values', () => {
  assert.throws(
    () => validateStatus(false),
    /status must be a string/
  );
});

test('validateStatus rejects unsupported values', () => {
  assert.throws(
    () => validateStatus('blocked'),
    /status must be one of: todo, in-progress, done/
  );
});

test('validatePriority normalizes input to lowercase', () => {
  assert.equal(validatePriority('HIGH'), 'high');
});

test('validatePriority rejects non-string values', () => {
  assert.throws(
    () => validatePriority({}),
    /priority must be a string/
  );
});

test('validatePriority rejects unsupported values', () => {
  assert.throws(
    () => validatePriority('urgent'),
    /priority must be one of: low, medium, high/
  );
});
