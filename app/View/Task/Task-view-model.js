import { Observable } from '@nativescript/core';

const viewModel = new Observable()

function completeTask(args)
{
    return;
}

function createNewTask()
{
    return;
}

function editTask(args)
{
    return;
}

export function createViewModel()
{
    viewModel.createNewTask = createNewTask;
    viewModel.completeTask = completeTask;
    viewModel.editTask = editTask;
    return viewModel;
}

