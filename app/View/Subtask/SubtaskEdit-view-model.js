import {Dialogs, Frame, Observable} from "@nativescript/core";
import {SubtaskDelete, SubtaskGet, SubtaskInvertStatus} from "~/Model/SubtaskRepository";
import {TaskEditorSetNewTitleForSubtask} from "~/Model/TaskEditor";
import {
    DatabaseErrorOccuredException,
    SubtaskNotFoundException,
    SubtaskTitleLengthMustBeMoreThanZeroException
} from "~/Model/Exceptions";


const TASK_EDITING_PATH = '/View/Subtask/Subtask';
const TASK_LIST_PATH = '/View/Task/Task';
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

function updateSubtaskInfoInViewModel()
{
    let subtask = SubtaskGet(viewModel.get('subtaskId'));
    viewModel.set('subtaskTitle', subtask.title);
    viewModel.set('subtaskCompletionStatus', subtask.isCompleted);
}

async function askUserIfHeWantsToDeleteSubtask()
{
    let result = await Dialogs.confirm({
        title: 'Удалить подзадачу',
        message: 'Удалить эту подзадачу?',
        okButtonText: 'Да',
        cancelButtonText: 'Нет',
    });
    return result;
}

async function deleteSubtask()
{
    if (!(await askUserIfHeWantsToDeleteSubtask()))
        return;
    try
    {
        let id = viewModel.get('subtaskId');
        SubtaskDelete(id);
        gotoTaskEditPage();
    }
    catch (e)
    {
        if (e instanceof SubtaskNotFoundException)
        {
            DisplayErrorMessage('Подзадача была удалена');
            gotoTaskEditPage();
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

function reverseCompletionStatusOfSubtask(args)
{
    try
    {
        let id = viewModel.get('subtaskId');
        SubtaskInvertStatus(id);
        updateSubtaskInfoInViewModel();
    }
    catch (e)
    {
        if (e instanceof SubtaskNotFoundException)
        {
            DisplayErrorMessage('Подзадача была удалена');
            gotoTaskEditPage();
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

function setSubtaskTitle(args)
{
    try
    {
        let title = args.object.text;
        let subtaskId = viewModel.get('subtaskId');
        TaskEditorSetNewTitleForSubtask(subtaskId, title);
        updateSubtaskInfoInViewModel();
    }
    catch (e)
    {
        if (e instanceof SubtaskNotFoundException)
        {
            DisplayErrorMessage('Подзадача была удалена');
            gotoTaskEditPage();
            return;
        }
        if (e instanceof SubtaskTitleLengthMustBeMoreThanZeroException)
        {
            DisplayErrorMessage('Введите название подзадачи');
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

function gotoTaskEditPage()
{
    Frame.topmost().navigate({
        moduleName: TASK_EDITING_PATH,
        clearHistory: true
    });
}

function gotoTasksList()
{
    Frame.topmost().navigate({
        moduleName: TASK_LIST_PATH,
        clearHistory: true
    });
}

export function createViewModel(context)
{
    viewModel.subtaskId = context.subtaskId;
    viewModel.deleteSubtask = deleteSubtask;
    viewModel.reverseCompletionStatusOfSubtask = reverseCompletionStatusOfSubtask;
    viewModel.setSubtaskTitle = setSubtaskTitle;
    viewModel.gotoTasksList = gotoTasksList;
    viewModel.gotoTaskEditPage = gotoTaskEditPage;
    updateSubtaskInfoInViewModel();
    return viewModel;
}
