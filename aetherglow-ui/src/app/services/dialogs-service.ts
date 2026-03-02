import { inject, Injectable } from '@angular/core';
import { DialogOptions } from '@app/models';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export const defaultConfig: DynamicDialogConfig = {
    appendTo: 'body',
    autoZIndex: true,
    closable: true,
    maximizable: true,
    draggable: true,
    width: '65vw',
    styleClass: 'max-h-[70vh]',
    modal: true,
    resizable: false,
    closeOnEscape: true,
};
@Injectable({providedIn: 'root'})
export class AGDialogSvc {
    private readonly pDialogSvc = inject(DialogService);


    public openDialog(opts: DialogOptions): DynamicDialogRef | null{
        const config = opts.noMerge ?
            (opts.config ?? defaultConfig) :
            (Object.assign({}, defaultConfig, opts.config));
        return this.pDialogSvc.open(opts.type, config);
    }
}
