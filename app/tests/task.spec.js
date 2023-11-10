import {
    TaskChangeDescription,
    TaskChangeTitle,
    TaskCreate,
    TaskDelete,
    TaskGetAll
} from "~/Model/TaskRepository";
import {ResetDatabase} from "~/Model/database";

QUnit.test("creating task test", testCreatingTask);

function testCreatingTask(assert)
{
    TaskCreate();
    assert.deepEqual(TaskGetAll().length, 1);
    let task = TaskGetAll()[0];
    TaskChangeTitle(task.id, 'My task haha');
    TaskChangeDescription(task.id, 'My holy desc');
    task = TaskGetAll()[0];
    assert.deepEqual(task.title, 'My task haha');
    assert.deepEqual(task.description, 'My holy desc');
    TaskDelete(task.id);
    assert.deepEqual(TaskGetAll().length, 0);
}
