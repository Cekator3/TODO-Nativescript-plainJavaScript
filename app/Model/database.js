/**
 * @file subsystem for opening connection with sqlite database.
 */

export class CantOpenDatabaseException {}

const DB_NAME = 'TODO';
const SQLITE = require( "nativescript-sqlite" );
let DATABASE = undefined;
new SQLITE(DB_NAME, DatabaseInit);


function IsDatabaseSchemeReady()
{
    let result = false;
    DATABASE.get('SELECT 1 FROM Task', (err, res) =>
    {
        result = res[0] === 1;
    });
    return result;
}

function DatabaseInit(err, db)
{
    if (err)
        throw new CantOpenDatabaseException();
    DATABASE = db;
    if (IsDatabaseSchemeReady())
        return;
    DATABASE.execSQL(
        'CREATE TABLE Task(' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'title TEXT,' +
        'description TEXT)'
    );
    DATABASE.execSQL(
        'CREATE TABLE Subtask(' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'task_id INTEGER' +
        'title TEXT,' +
        'is_completed bool,' +
        'FOREIGN KEY (task_id) REFERENCES TaskRepository (id))'
    );
}

/**
 * Returns instance for interaction with sqlite database.
 * @return {SQLITE}
 */
export function DatabaseGetInstance()
{
    return DATABASE;
}

export function ResetDatabase()
{
    SQLITE.deleteDatabase(DB_NAME);
    new SQLITE(DB_NAME, DatabaseInit);
}
