import {ChangeDetectorRef, Component, computed, inject, Input, input} from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputBase } from '@app/models';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { DynamicForm } from '../dynamic-form/dynamic-form';
import { isStr } from '@app/typing';
import { AGDialogSvc, InputService, TxService } from '@app/services';
import { Dialog } from 'primeng/dialog';
import { AppDataModel } from '@app/core';
import { MessageService } from 'primeng/api';
import { LineViewer } from '../line-viewer/line-viewer';

@Component({
    selector: 'app-input',
    imports: [
        ReactiveFormsModule,
        InputText,
        Select,
        FloatLabel,
        Button,
        Dialog,
        FormsModule,
    ],
    templateUrl: './dynamic-form-input.html',
    styleUrl: './dynamic-form-input.scss',
    providers: [MessageService],
})
export class DynamicFormInput {
    readonly txSvc = inject(TxService);
    readonly inputSvc = inject(InputService);
    readonly msgSvc = inject(MessageService);
    readonly dialogSvc = inject(AGDialogSvc);

    readonly formInput = input.required<InputBase<unknown>>();
    readonly form = input.required<FormGroup>();

    @Input() parentForm?: DynamicForm;

    public visible: boolean = false;
    public mappingValue: string = '';

    get isValid() {
        return this.form().controls[this.formInput().key].valid;
    }

    constructor(public cd: ChangeDetectorRef) {}

    public value = computed(() => {
        return  this.form().controls[this.formInput().key].value;

    });

    public removeElement() {
        this.parentForm?.removeInput(this.formInput());
    }

    public copyText() {
        if (isStr(this.value())) navigator.clipboard.writeText(this.value());
    }

    public ignoreText() {
        if (isStr(this.value())) {
            this.txSvc.addIgnored([this.value()]).then(resp => {
                this.parentForm?.parentDialogRef?.close({action: 'reload'});
            });
        }
    }

    public openMapping() {
        this.visible = true;
    }

    public clearMapping(close: boolean = true) {
        this.mappingValue = '';
        this.visible = false;
        this.cd.detectChanges();
        if (close) this.parentForm?.parentDialogRef?.close();
    }

    public addToMapping() {
        if (isStr(this.value())) {
            this.txSvc.addCharMapping({[this.value()]: this.mappingValue}).then(resp => {
                AppDataModel.setCharMapping(resp);
                this.clearMapping(false);
                this.msgSvc.add({
                    detail: `The name ${this.mappingValue} was successfully associated with the username ${this.value()}`,
                    sticky: false,
                });
                this.parentForm?.parentDialogRef?.close({action: 'reload'});
            });
        }
    }



    public openLineViewer() {
        const ref = this.dialogSvc.openDialog({type: LineViewer, config: {
            data: {
                searchName: this.value(),
            },
        }});
    }

}
