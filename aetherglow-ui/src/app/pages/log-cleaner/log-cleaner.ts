import { Component, inject, signal, ViewChild, ViewChildren } from '@angular/core';
import { PageLayout } from '@app/layout';
import { CardModule } from 'primeng/card';
import { Textarea, TextareaModule } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';

import { AGDialogSvc, InputService, TxService } from '@app/services';
import { CharMap } from '@app/components';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { isStrRecord } from '@app/typing';
import { AppDataModel } from '@app/core';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
    selector: 'app-log-cleaner',
    imports: [
        CharMap,
        PageLayout,
        TextareaModule,
        CardModule,
        Button,
        Panel,
        DialogModule,
        CharMap,
        FormsModule,
    ],
    templateUrl: './log-cleaner.html',
    providers: [InputService],
    styleUrl: './log-cleaner.scss',

})
export class LogCleaner {

    private readonly dialogSvc = inject(AGDialogSvc);
    private readonly txSvc = inject(TxService);

    public dividerClassFull: string = 'w-full m-4! bg-white h-[1px] shadow-[0px_0px_12px_1px_#ABF]';
    public visible = signal(false);

    public inputText = signal<string>('');
    public outputText = signal<string>('');

    public ref: DynamicDialogRef | null = null;

    @ViewChildren(Textarea) textAreas!: Textarea[];

    constructor() {}

    ngAfterViewInit() {
        const cookieText = localStorage.getItem('input-text');
        if (cookieText) this.inputText.set(cookieText);

        this.textAreas.forEach(area => {
            if (area.el.nativeElement.id === 'inputTextArea') {
                area.ngControl?.valueChanges?.subscribe(val => {
                    localStorage.setItem('input-text', val);
                });
            }
        });
    }

    public openCharMapEditor() {
        this.ref = this.dialogSvc.openDialog({type: CharMap, config: {
            header: 'Edit Character Name Mappings',

            data: {
                showButtons: false,
            }
        }});

        this.ref?.onClose.subscribe(formValues => {
            if (isStrRecord(formValues)) {
                this.txSvc.addCharMapping(formValues).then(resp => {
                    AppDataModel.charMapping$.next(resp);
                });
            }
        });
    }

    public submitText() {
        this.txSvc.cleanLog(this.inputText()).then(resp => {
            this.outputText.set(resp);
        });
    }
}
