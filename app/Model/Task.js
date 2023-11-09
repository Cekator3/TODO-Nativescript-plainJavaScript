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
export function AddNewTask() {}

/**
 * Returns a list of the user's tasks.
 * @return {Task[]}
 */
export function GetTasks() {}

/**
 * Returns user's task.
 *
 * If the task with this identifier does not exist, null will be returned.
 * @param {number} id Task's identifier.
 * @return {Task | null}
 */
export function GetTask(id) {}

/**
 * Deletes user's task.
 *
 * If the task with such identifier does not exist, TaskNotFoundException will be thrown.
 * @param {number} id Task's identifier
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function DeleteTask(id) {}

/**
 * Changes title of the user's task.
 *
 * If the task with such identifier does not exist, TaskNotFoundException will be thrown.
 * @param id {number} Task's identifier
 * @param newTitle {string} Task's new title.
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function ChangeTaskTitle(id, newTitle) {}

/**
 * Changes title of the user's task.
 *
 * If the task with such identifier does not exist, TaskNotFoundException will be thrown.
 * @param id {number} Task's identifier
 * @param newDescription {string} Task's new description.
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function ChangeTaskDescription(id, newDescription) {}
