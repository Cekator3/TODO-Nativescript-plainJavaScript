/**
 * @fileoverview A subsystem for changing data of task's subtasks.
 */

import {
    TaskNotFoundException,
    SubtaskNotFoundException,
    DatabaseErrorOccuredException,
    SubtaskTitleLengthMustBeMoreThanZeroException
} from "~/Model/Exceptions";
import {DatabaseGetInstance} from "~/Model/database";
import {Task, TaskExist, TaskSetCompletionStatus} from "~/Model/TaskRepository";

/**
 * Object for storing data of task's subtask.
 */
export class Subtask
{
    id;
    taskId;
    title;
    isCompleted;
    constructor(id, taskId, title, isCompleted)
    {
        this.id = id;
        this.taskId = taskId;
        this.title = title;
        this.isCompleted = isCompleted !== 0;
    }
}

/**
 * Creates a new subtask for the task, filling it with default data.
 * @param {number} taskId Task's identifier.
 * @param {string} title Subtask's title.
 * @throws {TaskNotFoundException}
 * @throws {DatabaseErrorOccuredException}
 * @return {void}
 */
export function SubtaskCreate(taskId, title)
{
    if (!TaskExist(taskId))
        throw new TaskNotFoundException();
    let db = DatabaseGetInstance();
    db.execSQL('INSERT INTO Subtask (task_id, title) VALUES (' + taskId + ", '" + title + "')",
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
    TaskSetCompletionStatus(taskId, false);
}

/**
 * Returns a list of the task's subtasks.
 * @param {number} taskId. Task's identifier.
 * @throws {TaskNotFoundException}
 * @throws {DatabaseErrorOccuredException}
 * @return {Subtask[]}
 */
export function SubtaskGetAll(taskId)
{
    if (!TaskExist(taskId))
        throw new TaskNotFoundException();
    let result = [];
    let db = DatabaseGetInstance();
    db.all('SELECT * FROM Subtask WHERE task_id = ' + taskId,
        (err, rows) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
            for (let row of rows)
                result.push(new Subtask(row[0], row[1], row[2], row[3]));
        });
    return result;
}

/**
 * Checks if subtask with that identifier exists.
 * @param {number} subtaskId subtask's identifier.
 * @throws {DatabaseErrorOccuredException}
 * @return {boolean}
 */
export function SubtaskExist(subtaskId)
{
    let result = false;
    let db = DatabaseGetInstance();
    db.get("SELECT 1 FROM Subtask WHERE id = '" + subtaskId + "' LIMIT 1",
        (err, rows) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
            if (rows.length === 0)
                return;
            result = true;
        });
    return result;
}

/**
 * Returns subtask of the task.
 * @param {number} subtaskId Subtask's identifier.
 * @throws {DatabaseErrorOccuredException}
 * @return {Subtask | null}
 */
export function SubtaskGet(subtaskId)
{
    let result = null;
    let db = DatabaseGetInstance();
    db.get('SELECT * FROM Subtask WHERE id = ' + subtaskId + ' LIMIT 1',
        (err, rows) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
            if (rows.length === 0)
                return;
            result = new Subtask(rows[0], rows[1], rows[2], rows[3]);
        });
    return result;
}


function getTaskIdOfSubtask(subtaskId)
{
    let result = -1;
    let db = DatabaseGetInstance();
    db.get("SELECT task_id FROM Subtask WHERE id = " + subtaskId,
        (err, res) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
            result = res[0];
        });
    return result;
}

/**
 * Deletes subtask.
 * @param {number} subtaskId SubtaskRepository's identifier.
 * @throws {SubtaskNotFoundException}
 * @throws {DatabaseErrorOccuredException}
 * @return {void}
 */
export function SubtaskDelete(subtaskId)
{
    if (!SubtaskExist(subtaskId))
        throw new SubtaskNotFoundException();
    let taskId = getTaskIdOfSubtask(subtaskId);
    let db = DatabaseGetInstance();
    db.execSQL('DELETE FROM Subtask WHERE id = ' + subtaskId,
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
    if (SubtaskIsAllSubtasksCompleted(taskId))
        TaskSetCompletionStatus(taskId, true);
}

/**
 * Changes title of the subtask.
 * @param {number} subtaskId Subtask's identifier
 * @param {string} newTitle Subtask's new title.
 * @throws {SubtaskNotFoundException}
 * @throws {DatabaseErrorOccuredException}
 * @return {void}
 */
export function SubtaskChangeTitle(subtaskId, newTitle)
{
    if (!SubtaskExist(subtaskId))
        throw new SubtaskNotFoundException();
    let db = DatabaseGetInstance();
    db.execSQL('UPDATE Subtask SET title = \'' + newTitle + '\' WHERE id = ' + subtaskId,
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
}

/**
 * Inverts completion status of the subtask.
 * @param {number} subtaskId Subtask's identifier.
 * @throws {SubtaskNotFoundException}
 * @throws {DatabaseErrorOccuredException}
 * @return {void}
 */
export function SubtaskInvertStatus(subtaskId)
{
    if (!SubtaskExist(subtaskId))
        throw new SubtaskNotFoundException();
    let db = DatabaseGetInstance();
    db.execSQL('UPDATE Subtask SET is_completed = ((is_completed | 1) - (is_completed & 1)) WHERE id = ' + subtaskId,
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
    let taskId = getTaskIdOfSubtask(subtaskId);
    TaskSetCompletionStatus(taskId, SubtaskIsAllSubtasksCompleted(taskId));
}

/**
 * Checks that all subtasks of the user's task have been completed.
 * @param {number} taskId User's task identifier.
 * @throws {DatabaseErrorOccuredException}
 * @throws {TaskNotFoundException}
 * @return {boolean}
 */
export function SubtaskIsAllSubtasksCompleted(taskId)
{
    if (!TaskExist(taskId))
        throw new TaskNotFoundException();
    let result = false;
    let db = DatabaseGetInstance();
    db.get("SELECT 1 FROM Subtask WHERE (task_id = " + taskId + ") AND (is_completed = 0) LIMIT 1",
        (err, res) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
            console.log(res);
            result = res === null;
        });
    return result;
}
