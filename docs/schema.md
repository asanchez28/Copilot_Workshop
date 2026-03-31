# Task Manager CLI - Technical Design

## 1. Data models

### Task

| Property | Type | Required | Validation rules |
| --- | --- | --- | --- |
| `id` | `string` (UUID v4) | Yes | Must be a non-empty string matching UUID v4 format (`xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx`); must be unique in the in-memory store; immutable after creation. |
| `title` | `string` | Yes | Must be a string; trimmed value is required; trimmed length must be 1-100 characters; leading/trailing whitespace is removed before persistence. |
| `description` | `string` | No | If omitted, defaults to empty string; if provided, must be a string; trimmed length must be 0-500 characters; leading/trailing whitespace is removed before persistence. |
| `status` | `'todo' \| 'in-progress' \| 'done'` | Yes | Must be one of `todo`, `in-progress`, `done`; input is normalized to lowercase before validation; any other value is rejected. |
| `priority` | `'low' \| 'medium' \| 'high'` | Yes | Must be one of `low`, `medium`, `high`; input is normalized to lowercase before validation; any other value is rejected. |
| `createdAt` | `Date` | Yes | Set automatically at creation; must be a valid `Date` instance (`!Number.isNaN(createdAt.getTime())`); immutable after creation. |
| `updatedAt` | `Date` | Yes | Set automatically at creation and on each successful update; must be a valid `Date` instance; must be greater than or equal to `createdAt`. |

### TaskCreateInput

| Property | Type | Required | Validation rules |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Same as `Task.title`. |
| `description` | `string` | No | Same as `Task.description`. |
| `priority` | `'low' \| 'medium' \| 'high'` | Yes | Same as `Task.priority`. |

Defaults applied during creation:
- `status = 'todo'`
- `createdAt = new Date()`
- `updatedAt = createdAt`

### TaskUpdateInput

| Property | Type | Required | Validation rules |
| --- | --- | --- | --- |
| `title` | `string` | No | If present, same as `Task.title`. |
| `description` | `string` | No | If present, same as `Task.description`. |
| `status` | `'todo' \| 'in-progress' \| 'done'` | No | If present, same as `Task.status`. |
| `priority` | `'low' \| 'medium' \| 'high'` | No | If present, same as `Task.priority`. |

Rules:
- At least one field must be provided.
- Unknown fields are rejected.
- `updatedAt` is always refreshed after a successful update.

## 2. File structure

```text
src/
├── index.js                 # CLI entry point; boots app and delegates to command execution.
├── cli.js                   # Parses argv into normalized command objects and prints output/errors.
├── taskManager.js           # Orchestrates CRUD/filter/sort operations and business rules.
├── taskStore.js             # In-memory repository for task records (Map-based storage).
├── validation.js            # Input validation and normalization helpers for create/update/query options.
├── constants.js             # Shared enums and lookup tables (status, priority, sort ordering).
└── errors.js                # Custom error classes used across modules.

test/
├── taskManager.create.test.js   # Verifies task creation behavior.
├── taskManager.list.test.js     # Verifies list, filter, and sort behavior.
├── taskManager.update.test.js   # Verifies update behavior and timestamp refresh.
└── taskManager.delete.test.js   # Verifies delete behavior and not-found errors.
```

## 3. Module responsibilities

### `src/constants.js`
Exports:
- `TASK_STATUS` array: `['todo', 'in-progress', 'done']`
- `TASK_PRIORITY` array: `['low', 'medium', 'high']`
- `PRIORITY_WEIGHT` map/object for sort precedence (`high > medium > low`)

Dependencies:
- None.

### `src/errors.js`
Exports:
- `ValidationError extends Error`
- `NotFoundError extends Error`
- `ConflictError extends Error`

Dependencies:
- None.

### `src/validation.js`
Exports:
- `validateCreateInput(input)`
- `validateUpdateInput(input)`
- `validateTaskId(id)`
- `validateFilterOptions(options)`
- `validateSortOption(sortBy)`

Dependencies:
- Imports `TASK_STATUS`, `TASK_PRIORITY` from `constants.js`.
- Imports `ValidationError` from `errors.js`.

### `src/taskStore.js`
Exports:
- `TaskStore` class with methods:
- `create(task)`
- `getById(id)`
- `getAll()`
- `update(id, patch)`
- `delete(id)`

Dependencies:
- Imports `NotFoundError` from `errors.js`.

Storage design:
- `Map<string, Task>` keyed by task id.
- `getAll()` returns a shallow-copied array to avoid external mutation.

### `src/taskManager.js`
Exports:
- `TaskManager` class with methods:
- `createTask(input)`
- `listTasks({ status, priority, sortBy })`
- `updateTask(id, updates)`
- `deleteTask(id)`

Dependencies:
- Imports `TaskStore` from `taskStore.js`.
- Imports validation functions from `validation.js`.
- Imports `PRIORITY_WEIGHT` from `constants.js`.
- Imports Node built-ins for id/time generation as needed (`crypto`).

Behavior:
- Applies validation before store operations.
- Sets timestamps and generated IDs.
- Implements non-mutating filtering/sorting on listed data.

### `src/cli.js`
Exports:
- `runCli(argv, manager)` function

Dependencies:
- Imports `TaskManager` from `taskManager.js` (or receives manager instance via parameter).
- Imports custom errors from `errors.js`.

Behavior:
- Parses commands: `create`, `list`, `update`, `delete`.
- Supports list options: `--status`, `--priority`, `--sort`.
- Converts errors to user-facing messages and exit codes.

### `src/index.js`
Exports:
- None (application executable module).

Dependencies:
- Imports `runCli` from `cli.js`.
- Wraps top-level startup in `try/catch` and logs with `console.error`.

## 4. Error handling strategy

Error types and throw locations:
- `ValidationError`
- Thrown in `validation.js` when input fields are missing, malformed, out of range, or unsupported.
- Also thrown by `taskManager.js` when command-level constraints fail (for example, empty update patch).
- `NotFoundError`
- Thrown in `taskStore.js` for update/delete/get-by-id when task ID does not exist.
- `ConflictError`
- Reserved for business-rule conflicts if introduced later; currently not expected in single-user in-memory flow.

Handling flow:
- `taskManager.js` allows domain errors to bubble to `cli.js`.
- `cli.js` catches expected domain errors and prints concise user messages.
- `index.js` catches unexpected failures and logs with `console.error`.

Exit code mapping:
- `0`: success.
- `1`: expected user/input/domain error (`ValidationError`, `NotFoundError`, `ConflictError`).
- `2`: unexpected internal/runtime error.

Conventions:
- Always throw `Error` objects (custom subclasses where applicable).
- Use descriptive, actionable messages.
- Keep state unchanged when an operation fails validation or lookup.
