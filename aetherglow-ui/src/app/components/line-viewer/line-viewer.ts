import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AppDataModel, getDialogData } from '@app/core';
import { LogLine } from '@app/models';
import { TxService } from '@app/services';
import { WeakObj } from '@app/typing';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-line-viewer',
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
