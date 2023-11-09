// A sample QUnit test
import {TaskCreate, TaskGetAll} from "~/Model/Task";

QUnit.test("creating task test", testCreatingTask);

function testCreatingTask(assert)
{
    TaskCreate();
    assert.deepEqual(TaskGetAll(), 1);
}
