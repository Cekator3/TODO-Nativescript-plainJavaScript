import {Frame, Observable} from '@nativescript/core';
import {
    TaskCreate,
    TaskGetCompletedTasks, TaskGetUncompletedTasks,
} from "~/Model/TaskRepository";
import {DatabaseErrorOccuredException, TaskNotFoundException} from "~/Model/Exceptions";
import {
    TaskEditorGetCurrentlyModifiableTask,
    TaskEditorSetCurrentlyModifiableTask,
} from "~/Model/TaskEditor";

const TASK_EDITING_PATH = '/View/Subtask/Subtask';
const viewModel = new Observable();

function DisplayErrorMessage(message)
{
    Dialogs.alert({
        title: 'Ошибка',
        message: message,
        okButtonText: 'Ок',
        cancelable: true
    });
}

function updateTasksListInViewModel()
{
    try
    {
        if (viewModel.get('isWatchingCompletedTasks'))
        {
            viewModel.set('tasks', TaskGetCompletedTasks());
            return;
        }
        viewModel.set('tasks', TaskGetUncompletedTasks());
    }
    catch (e)
    {
        if (e instanceof DatabaseErrorOccuredException)
        {
            DisplayErrorMessage('Невозможно взаимодействовать с хранилищем данных на телефоне');
            return;
        }
        throw e;
    }
}

function createNewTask()
{
    try
    {
        TaskCreate('Новая задача', '');
        updateTasksListInViewModel();
    }
    catch (e)
    {
        if (e instanceof DatabaseErrorOccuredException)
        {
            DisplayErrorMessage('Невозможно взаимодействовать с хранилищем данных на телефоне');
            return;
        }
        throw e;
    }
}

function editTask(args)
{
    if (args.object.items !== undefined)
    {
        let id = +args.object.items[args.index].id;
        TaskEditorSetCurrentlyModifiableTask(id);
    }
    if (TaskEditorGetCurrentlyModifiableTask() === null)
        return;
    Frame.topmost().navigate({
        moduleName: TASK_EDITING_PATH
    });
}

function watchCompletedTasks()
{
    viewModel.set('isWatchingCompletedTasks', true);
    updateTasksListInViewModel();
}

function watchUncompletedTasks()
{
    viewModel.set('isWatchingCompletedTasks', false);
    updateTasksListInViewModel();
}

export function createViewModel()
{
    let task = TaskEditorGetCurrentlyModifiableTask();
    viewModel.isWatchingCompletedTasks = (task !== null) && task.isCompleted;
    viewModel.createNewTask = createNewTask;
    viewModel.watchCompletedTasks = watchCompletedTasks;
    viewModel.watchUncompletedTasks = watchUncompletedTasks;
    viewModel.editTask = editTask;
    updateTasksListInViewModel();
    return viewModel;
}

