import { Observable } from '@nativescript/core';

const viewModel = new Observable()

function deleteTask()
{
    return;
}

function deleteSubtask(args)
{
    return;
}

function createNewSubtask()
{
    return;
}

function completeSubtask(args)
{
    return;
}

function setSubtaskDescription(args)
{
    return;
}

function setSubtaskTitle(args)
{
    return;
}

export function createViewModel()
{
    viewModel.deleteTask = deleteTask;
    viewModel.deleteSubtask = deleteSubtask;
    viewModel.createNewSubtask = createNewSubtask;
    viewModel.completeSubtask = completeSubtask;
    viewModel.setSubtaskDescription = setSubtaskDescription;
    viewModel.setSubtaskTitle = setSubtaskTitle;
    return viewModel;
}

