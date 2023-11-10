/**
 * @fileoverview subsystem for user interaction with his/her tasks
 * @throws {CantOpenDatabaseException}
 *
 * prepared sql queries are available only in the paid version of
 * nativescript-sqlite plugin, so, please, ignore SQL-injection moments.
 */

import {DatabaseGetInstance} from "~/Model/database";
import {DatabaseErrorOccuredException, TaskNotFoundException} from "~/Model/Exceptions";

/**
 * Object for storing data of user's task.
 */
export class Task
{
    id;
    title;
    description;
    constructor(id, title, description)
    {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}

/**
 * Creates a new task for the user, filling it with default data.
 * @param {string} title Task's title.
 * @param {string} description Task's description.
 * @throws {DatabaseErrorOccuredException}
 * @return {void}
 */
export function TaskCreate(title, description)
{
    let db = DatabaseGetInstance();
    db.execSQL('INSERT INTO Task (title, description) VALUES (\'' + title + '\', \'' + description + '\')',
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
}

/**
 * Returns a list of the user's tasks.
 * @throws {DatabaseErrorOccuredException}
 * @return {Task[]}
 */
export function TaskGetAll()
{
    let result = [];
    let db = DatabaseGetInstance();
    db.all('SELECT * FROM Task', (err, rows) =>
    {
        if (err)
            throw new DatabaseErrorOccuredException();
        for (let row of rows)
            result.push(new Task(row[0], row[1], row[2]));
    });
    return result;
}

/**
 * Checks if task with that identifier exists.
 * @param {number} taskId Task's identifier.
 * @throws {DatabaseErrorOccuredException}
 * @return {boolean}
 */
export function TaskExist(taskId)
{
    let result = false;
    let db = DatabaseGetInstance();
    db.get("SELECT 1 FROM Task WHERE id = '" + taskId + "' LIMIT 1",
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
 * Returns user's task if exists.
 * @param {number} taskId Task's identifier.
 * @throws {DatabaseErrorOccuredException}
 * @return {Task | null}
 */
export function TaskGet(taskId)
{
    let result = null;
    let db = DatabaseGetInstance();
    db.get('SELECT * FROM Task WHERE id = ' + taskId + ' LIMIT 1',
        (err, rows) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
            if (rows.length === 0)
                return;
            result = new Task(rows[0], rows[1], rows[2]);
        });
    return result;
}

/**
 * Deletes user's task.
 * @param {number} taskId Task's identifier
 * @throws {TaskNotFoundException}
 * @throws {DatabaseErrorOccuredException}
 * @return {void}
 */
export function TaskDelete(taskId)
{
    if (!TaskExist(taskId))
        throw new TaskNotFoundException();
    let db = DatabaseGetInstance();
    db.execSQL('DELETE FROM Task WHERE id = ' + taskId,
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
}

/**
 * Changes title of the user's task.
 * @param {number} taskId  Task's identifier
 * @param {string} newTitle Task's new title.
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function TaskChangeTitle(taskId, newTitle)
{
    if (!TaskExist(taskId))
        throw new TaskNotFoundException();
    let db = DatabaseGetInstance();
    db.execSQL('UPDATE Task SET title = \'' + newTitle + '\' WHERE id = ' + taskId,
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
}

/**
 * Changes description of the user's task.
 * @param {number} taskId Task's identifier
 * @param {string} newDescription Task's new description.
 * @throws {TaskNotFoundException}
 * @return {void}
 */
export function TaskChangeDescription(taskId, newDescription)
{
    if (!TaskExist(taskId))
        throw new TaskNotFoundException();
    let db = DatabaseGetInstance();
    db.execSQL('UPDATE Task SET description = "' + newDescription + '" WHERE id = ' + taskId,
        (err, _) =>
        {
            if (err)
                throw new DatabaseErrorOccuredException();
        });
}
