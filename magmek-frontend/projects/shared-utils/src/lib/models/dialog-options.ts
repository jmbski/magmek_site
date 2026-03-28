import { Type } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

export interface DialogOptions {
    type: Type<unknown>;
    config?: DynamicDialogConfig;
    noMerge?: boolean;
}
