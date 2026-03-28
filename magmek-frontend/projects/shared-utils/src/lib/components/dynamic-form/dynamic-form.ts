import {Component, ComponentRef, computed, inject, Input, input, model, Signal, signal, WritableSignal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { InputControlService, InputService } from '@shared/services';
import { Button } from 'primeng/button';
import { DynamicFormInput } from '../dynamic-form-input/dynamic-form-input';
import { InputBase } from '@shared/models';
import { isKVRecord, KeyValueType, WeakObj } from '@shared/typing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';



@Component({
    selector: 'mm-dynamic-form',
    templateUrl: './dynamic-form.html',
    providers: [InputControlService],
    imports: [DynamicFormInput, ReactiveFormsModule, Button],
})
export class DynamicForm {
    private readonly ctlSvc = inject(InputControlService);
    private readonly inputSvc = inject(InputService);

    //readonly inputs = input<InputBase<unknown>[] | null>([]);


    @Input() inputs!: WritableSignal<InputBase<unknown>[]>;
    @Input() showButtons: boolean = true;

    @Input() canLoad: boolean = false;
    @Input() onSubmit: (arg: WeakObj) => void = (arg: WeakObj) => {};
    @Input() onCancel: () => void = () => {};
    @Input() parentDialogRef?: DynamicDialogRef;

    readonly form = computed<FormGroup>(() =>
        this.ctlSvc.toFormGroup(this.inputs() as InputBase<unknown>[]),
    );

    public payLoad = '';

    ngOnInit() {
    }

    public handleSubmit(input?: WeakObj) {
        const data = this.inputSvc.parseFormResult(this.form(), this.inputs());
        this.onSubmit(data);
    }

    public handleCancel() {
        this.onCancel();
    }

    public removeInput(formInput: InputBase<unknown>) {
        const index = this.inputs().findIndex(item => item === formInput);
        console.log('removing', formInput.value);
        if (index >= 0) {
            this.inputs().splice(index, 1);
            this.form().removeControl(formInput.key);
        }
    }

    public reloadInputs(newInputs?: InputBase<unknown>[]) {
        this.inputs.set( newInputs ?? this.inputs());

    }
}
