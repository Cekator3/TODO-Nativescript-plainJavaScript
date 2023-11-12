import {Dialogs, Frame, Observable} from '@nativescript/core';
import {
    SubtaskDelete, SubtaskGet,
    SubtaskGetAll,
    SubtaskInvertStatus
} from "~/Model/SubtaskRepository";
import {
    DatabaseErrorOccuredException,
    SubtaskNotFoundException,
    SubtaskTitleLengthMustBeMoreThanZeroException,
    TaskDescriptionLengthMustBeMoreThanZeroException,
    TaskEditorNotInitialisedException,
    TaskNotFoundException,
    TaskTitleLengthMustBeMoreThanZeroException
} from "~/Model/Exceptions";
import {
    TaskEditorCreateNewSubtask,
    TaskEditorDeleteTask,
    TaskEditorGetCurrentlyModifiableTask,
    TaskEditorSetNewDescription,
    TaskEditorSetNewTitle,
    TaskEditorSetNewTitleForSubtask
} from "~/Model/TaskEditor";

const TASK_LIST_PATH = '/View/Task/Task';
const SUBTASK_EDITING_PATH = '/View/Subtask/SubtaskEdit';
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

function updateSubtasksListInViewModel()
{
    let task = TaskEditorGetCurrentlyModifiableTask();
    if (task === null)
        gotoTasksList();
    viewModel.set('subtasks', SubtaskGetAll(task.id));
    console.log(viewModel.get('subtasks'))
}

function updateTaskDetails()
{
    let task = TaskEditorGetCurrentlyModifiableTask();
    if (task === null)
        gotoTasksList();
    viewModel.set('taskTitle', task.title);
    viewModel.set('taskDescription', task.description);
}

function setTaskTitle(args)
{
    let title = args.object.text;
    try
    {
        TaskEditorSetNewTitle(title);
    }
    catch (e)
    {
        if (e instanceof TaskTitleLengthMustBeMoreThanZeroException)
        {
            DisplayErrorMessage('Введите название задачи.');
            return;
        }
        if (e instanceof TaskNotFoundException)
        {
            DisplayErrorMessage('Задача была удалена.')
            gotoTasksList();
            return;
        }
        if (e instanceof TaskEditorNotInitialisedException)
        {
            DisplayErrorMessage('Внутренняя ошибка.');
            gotoTasksList();
            return;
        }
        if (e instanceof DatabaseErrorOccuredException)
        {
            DisplayErrorMessage('Невозможно взаимодействовать с хранилищем данных на телефоне');
            return;
        }
        throw e;
    }
}

function setTaskDescription(args)
{
    let description = args.object.text;
    try
    {
        TaskEditorSetNewDescription(description);
    }
    catch (e)
    {
        if (e instanceof TaskNotFoundException)
        {
            DisplayErrorMessage('Задача была удалена.')
            gotoTasksList();
            return;
        }
        if (e instanceof TaskEditorNotInitialisedException)
        {
            DisplayErrorMessage('Внутренняя ошибка.');
            gotoTasksList();
            return;
        }
        if (e instanceof DatabaseErrorOccuredException)
        {
            DisplayErrorMessage('Невозможно взаимодействовать с хранилищем данных на телефоне');
            return;
        }
        throw e;
    }
}

async function askUserIfHeWantsToDeleteTask()
{
    let result = await Dialogs.confirm({
        title: 'Удалить задачу',
        message: 'Удалить эту задачу?',
        okButtonText: 'Да',
        cancelButtonText: 'Нет',
    });
    return result;
}

async function deleteTask()
{
    if (!(await askUserIfHeWantsToDeleteTask()))
        return;
    try
    {
        TaskEditorDeleteTask();
        gotoTasksList();
    }
    catch (e)
    {
        if (e instanceof TaskNotFoundException)
        {
            DisplayErrorMessage('Задача уже была удалена');
            gotoTasksList();
            return;
        }
        if (e instanceof TaskEditorNotInitialisedException)
        {
            DisplayErrorMessage('Внутренняя ошибка');
            gotoTasksList();
            return;
        }
        if (e instanceof DatabaseErrorOccuredException)
        {
            DisplayErrorMessage('Невозможно взаимодействовать с хранилищем данных на телефоне');
            return;
        }
        throw e;
    }
}

function createNewSubtask()
{
    try
    {
        TaskEditorCreateNewSubtask();
        updateSubtasksListInViewModel();
    }
    catch (e)
    {
        if (e instanceof TaskNotFoundException)
        {
            DisplayErrorMessage('Задача уже была удалена');
            gotoTasksList();
            return;
        }
        if (e instanceof DatabaseErrorOccuredException)
        {
            DisplayErrorMessage('Невозможно взаимодействовать с хранилищем данных на телефоне');
            return;
        }
        throw e;

    }
}

function editSubtask(args)
{
    let id = +args.object.items[args.index].id;
    Frame.topmost().navigate({
        moduleName: SUBTASK_EDITING_PATH,
        context: {subtaskId: id}
    });
}

function gotoTasksList()
{
    Frame.topmost().navigate({
        moduleName: TASK_LIST_PATH,
        clearHistory: true
    });
}

export function createViewModel()
{
    if (TaskEditorGetCurrentlyModifiableTask() === null)
        gotoTasksList();
    viewModel.setTaskTitle = setTaskTitle;
    viewModel.setTaskDescription = setTaskDescription;
    viewModel.deleteTask = deleteTask;
    viewModel.createNewSubtask = createNewSubtask;
    viewModel.gotoTasksList = gotoTasksList;
    viewModel.editSubtask = editSubtask;
    updateTaskDetails();
    updateSubtasksListInViewModel();
    return viewModel;
}
