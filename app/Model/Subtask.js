/**
 * @fileoverview A subsystem for user interaction with subtasks of a certain task.
 */

import {TaskNotFoundException} from "~/Model/Task";

/**
 * Object for storing data of task's subtask.
 */
export class Subtask
{
    id;
    title;
    isCompleted;
}

export class SubtaskNotFoundException {}

/**
 * Creates a new subtask for the task, filling it with default data.
 * @param {number} taskId. Task's identifier.
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function SubtaskCreate(taskId) {}

/**
 * Returns a list of the task's subtasks.
 * @param {number} taskId. Task's identifier.
 * @throws {TaskNotFoundException}
 * @return {Subtask[]}
 */
export function SubtaskGetAll(taskId) {}

/**
 * Checks if subtask with that identifier exists.
 * @param {number} subtaskId subtask's identifier.
 * @return {boolean}
 */
export function SubtaskExist(subtaskId) {}

/**
 * Returns subtask of the task.
 * @param {number} subtaskId Subtask's identifier.
 * @throws {SubtaskNotFoundException}
 * @return {Subtask}
 */
export function SubtaskGet(subtaskId) {}

/**
 * Deletes subtask.
 * @param {number} subtaskId Subtask's identifier.
 * @throws {SubtaskNotFoundException}
 * @return {void}
 */
export function SubtaskDelete(subtaskId) {}

/**
 * Changes title of the subtask.
 * @param {number} subtaskId Subtask's identifier
 * @param {string} newTitle Subtask's new title.
 * @throws {SubtaskNotFoundException}
 * @return {void}
 */
export function SubtaskChangeTitle(subtaskId, newTitle) {}

/**
 * Inverts completion status of the subtask.
 * @param {number} subtaskId Subtask's identifier.
 * @throws {SubtaskNotFoundException}
 * @return {void}
 */
export function SubtaskInvertStatus(subtaskId) {}
