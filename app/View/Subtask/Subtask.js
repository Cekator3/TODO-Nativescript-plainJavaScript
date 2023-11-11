import { createViewModel } from './Subtask-view-model';

export function onNavigatingTo(args) {
  const page = args.object
  page.bindingContext = createViewModel()
}
