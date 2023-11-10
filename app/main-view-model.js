import { Observable } from '@nativescript/core';

export function createViewModel()
{
  const viewModel = new Observable()
  viewModel.counter = 42

  return viewModel
}

