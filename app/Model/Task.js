/**
 * @fileoverview subsystem for user interaction with his/her tasks
 */

/**
 * Object for storing data of user's task.
 */
export class Task
{
    id;
    title;
    description;
}

export class TaskNotFoundException {}

/**
 * Creates a new task for the user, filling it with default data.
 * @return {void}
 */
export function TaskCreate() {}

/**
 * Returns a list of the user's tasks.
 * @return {Task[]}
 */
export function TaskGetAll() {}

/**
 * Checks if task with that identifier exists.
 * @param {number} taskId Task's identifier.
 * @return {boolean}
 */
export function TaskExist(taskId) {}

/**
 * Returns user's task.
 * @param {number} taskId Task's identifier.
 * @throws {TaskNotFoundException}
 * @return {Task}
 */
export function TaskGet(taskId) {}

/**
 * Deletes user's task.
 * @param {number} taskId Task's identifier
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function TaskDelete(taskId) {}

/**
 * Changes title of the user's task.
 * @param {number} taskId  Task's identifier
 * @param {string} newTitle Task's new title.
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function TaskChangeTitle(taskId, newTitle) {}

/**
 * Changes title of the user's task.
 * @param {number} taskId Task's identifier
 * @param {string} newDescription Task's new description.
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function TaskChangeDescription(taskId, newDescription) {}
