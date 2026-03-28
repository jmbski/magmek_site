import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AppDataModel } from '@ag-app/core';
import { LogLine } from '@ag-app/models';
import { TxService } from '@ag-app/services';
import { WeakObj } from '@shared/typing';
import { getDialogData } from '@shared/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'ag-line-viewer',
    imports: [
        CommonModule,
        Card,
        Divider,
    ],
    templateUrl: './line-viewer.html',
    styleUrl: './line-viewer.scss',
})
export class LineViewer {
    private readonly txSvc = inject(TxService);
    public ref = inject(DynamicDialogRef);
    public dialogSvc = inject(DialogService);

    public lines: LogLine[] = [];
    public filteredLines = signal<LogLine[]>([]);

    public data: WeakObj = {};

    public searchName: string = '';

    constructor() {

        this.data = getDialogData(this.ref, this.dialogSvc);
        Object.assign(this, this.data);
        this.txSvc.cleanLog(AppDataModel.latestInput).then(resp => {
            this.lines = resp.lines;

            if (this.searchName) {
                this.filterLines();
            }
        });
    }

    public filterLines() {
        this.filteredLines.set([]);
        const names: string[] = [];
        this.lines.forEach(line => {
            if (line.speaker === this.searchName) {
                this.filteredLines().push(line);
                console.log(line);
            }
        });
    }


}
