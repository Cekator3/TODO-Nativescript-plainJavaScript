import { createViewModel } from './SubtaskEdit-view-model';

export function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = createViewModel(page.navigationContext);
}
