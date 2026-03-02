import {Component, computed, inject, Input, input, model, Signal, signal, WritableSignal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { InputControlService, InputService } from '@app/services';
import { Button } from 'primeng/button';
import { DynamicFormInput } from '../dynamic-form-input/dynamic-form-input';
import { InputBase } from '@app/models';
import { isKVRecord, KeyValueType } from '@app/typing';



@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.html',
    providers: [InputControlService],
    imports: [DynamicFormInput, ReactiveFormsModule, Button],
})
export class DynamicForm {
    private readonly qcs = inject(InputControlService);
    private readonly qSvc = inject(InputService);

    //readonly inputs = input<InputBase<unknown>[] | null>([]);
    private _inputs: InputBase<unknown>[] = [];

    @Input() inputs!: Signal<InputBase<KeyValueType>[]>;
    @Input() showButtons: boolean = true;

    readonly form = computed<FormGroup>(() =>
        this.qcs.toFormGroup(this.inputs() as InputBase<unknown>[]),
    );

    public payLoad = '';

    public onSubmit() {
        const data = this.form().getRawValue();
        if (isKVRecord(data)) {
            const kvData = this.qSvc.toStrRecord(data);
            this.payLoad = JSON.stringify(kvData);
        }
        else this.payLoad = JSON.stringify(data);
        /** @todo pipe output to txSvc */
    }

    public removeInput(formInput: InputBase<unknown>) {
        const index = this.inputs().findIndex(item => item === formInput);
        console.log('removing', formInput.value);
        if (index >= 0) {
            this.inputs().splice(index, 1);
            this.form().removeControl(formInput.key);
        }
    }
}
