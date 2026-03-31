# Task Manager CLI - Project Plan

## Project Overview

Task Manager CLI is a command-line application for managing personal tasks with full CRUD functionality. Users can create, list, update, and delete tasks, with support for filtering and sorting by status, priority, and creation date. All data is stored in memory, making it ideal for simple task tracking during a single session.

## User Stories

1. **Create a task**
   - As a user, I want to create a new task with a title, description, and priority
   - Acceptance criteria:
     - User can specify title (required), description (optional), and priority (low/medium/high)
     - Status defaults to "todo"
     - `createdAt` and `updatedAt` timestamps are automatically set
     - Confirmation message displays task ID and details

2. **List all tasks**
   - As a user, I want to view all tasks in a formatted table
   - Acceptance criteria:
     - All tasks display with ID, title, priority, status, and timestamps
     - Table is properly formatted and readable
     - Works with empty task list

3. **Update a task**
   - As a user, I want to update task properties (title, description, status, priority)
   - Acceptance criteria:
     - User can update one or more fields by task ID
     - `updatedAt` timestamp is refreshed
     - Confirmation shows updated task
     - Error if task ID doesn't exist

4. **Delete a task**
   - As a user, I want to remove a task by ID
   - Acceptance criteria:
     - Task is removed from the list
     - Confirmation message displays deleted task details
     - Error if task ID doesn't exist

5. **Filter tasks by status**
   - As a user, I want to view only tasks with a specific status
   - Acceptance criteria:
     - User can filter by "todo", "in-progress", or "done"
     - Only matching tasks are displayed
     - Works with empty results

6. **Filter tasks by priority**
   - As a user, I want to view only tasks with a specific priority level
   - Acceptance criteria:
     - User can filter by "low", "medium", or "high"
     - Only matching tasks are displayed
     - Works with empty results

7. **Sort tasks by priority**
   - As a user, I want to view tasks ordered by priority (high → medium → low)
   - Acceptance criteria:
     - Tasks display in correct priority order
     - Sorting doesn't modify the original task list

8. **Sort tasks by creation date**
   - As a user, I want to view tasks ordered by creation date (newest first)
   - Acceptance criteria:
     - Tasks display with most recently created first
     - Sorting doesn't modify the original task list

## Data Model

### Task Entity
- **id** (string | UUID): Unique identifier for the task
- **title** (string): Task title (required, max 100 characters)
- **description** (string): Detailed task description (optional, max 500 characters)
- **status** (enum): Current task status - "todo", "in-progress", or "done"
- **priority** (enum): Task priority level - "low", "medium", or "high"
- **createdAt** (Date): Timestamp when task was created (auto-generated)
- **updatedAt** (Date): Timestamp of last modification (auto-generated, updated on changes)

## Error Handling & Input Validation

### Input Validation Rules

**Task Title**
- Required field (must be non-empty)
- Maximum 100 characters
- Must contain only alphanumeric characters, spaces, and punctuation (-, _, !, ?, .)
- Error message: "Title is required and must be 1-100 characters"

**Task Description**
- Optional field
- Maximum 500 characters if provided
- Error message: "Description cannot exceed 500 characters"

**Task Status**
- Must be one of: "todo", "in-progress", "done" (case-insensitive input)
- Error message: "Status must be 'todo', 'in-progress', or 'done'"

**Task Priority**
- Must be one of: "low", "medium", "high" (case-insensitive input)
- Error message: "Priority must be 'low', 'medium', or 'high'"

**Task ID**
- Must be a valid UUID format when referencing existing task
- Error message: "Invalid task ID format"

### Error Handling Conventions

**Error Categories**
- **ValidationError**: Input validation failures (invalid format, missing required fields)
- **NotFoundError**: Task ID doesn't exist in store
- **ConflictError**: Operation violates business logic constraints

**Error Message Format**
- Prefix error type: `[ERROR]` or `[WARN]`
- Clear, user-friendly description
- Suggest corrective action when possible
- Example: `[ERROR] Task not found. Use 'list' to see all tasks.`

**Exit Codes**
- `0`: Successful operation
- `1`: Validation or logic error (operation not performed)
- `2`: System/internal error (unexpected failure)

**Error Recovery Strategy**
- Catch errors at CLI command handler level
- Display error message to user without crashing
- Keep application state unchanged on failed operations
- Provide guidance for retry or alternative actions
- Log error details only in debug mode

### Validation Flow

1. **Sanitization**: Trim whitespace, normalize case for enums
2. **Type Check**: Verify field types match expected types
3. **Format Validation**: Check length, format, and character constraints
4. **Business Logic**: Verify constraints (e.g., task existence before update/delete)
5. **Error Collection**: Gather all validation errors before reporting
6. **User Feedback**: Display clear, actionable error messages

## File Structure

```
src/
├── index.js           # CLI entry point, command routing
├── taskManager.js     # Core task management logic (CRUD, filtering, sorting)
├── taskStore.js       # In-memory data storage
├── utils.js           # Utility functions (ID generation, date formatting, validation)
├── cli.js             # Command parser and UI handlers
└── constants.js       # Priority/status enums and config values
```

## Implementation Phases

### Phase 1: Foundation (Core Data Management)
- Set up project structure and entry point
- Implement `TaskStore` class for in-memory storage
- Implement `TaskManager` class with CRUD operations (create, read, update, delete)
- Add utility functions for ID generation and validation
- Deliverable: Basic task creation and retrieval working

### Phase 2: CLI Interface
- Implement command parser to handle user input
- Create command handlers for: `create`, `list`, `update`, `delete`
- Add basic output formatting for task display
- Deliverable: All CRUD operations functional via CLI

### Phase 3: Filtering & Sorting
- Implement filter methods by status and priority
- Implement sort methods by priority and date
- Add CLI commands: `filter`, `sort`
- Deliverable: Users can filter and sort tasks

### Phase 4: Polish & Validation
- Add input validation for all operations
- Implement error handling and user-friendly messages
- Add help documentation
- Improve table formatting and output readability
- Deliverable: Production-ready CLI with robust error handling

### Phase 5: Testing & Documentation
- Write unit tests for core functions
- Create user documentation and examples
- Add inline code comments
- Deliverable: Fully tested and documented application
