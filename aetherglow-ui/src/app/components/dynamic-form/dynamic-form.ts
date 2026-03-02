import {Component, computed, inject, Input, input, model, Signal, signal, WritableSignal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { InputControlService, InputService } from '@app/services';
import { Button } from 'primeng/button';
import { DynamicFormInput } from '../dynamic-form-input/dynamic-form-input';
import { InputBase } from '@app/models';
import { isKVRecord, KeyValueType, WeakObj } from '@app/typing';



@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.html',
    providers: [InputControlService],
    imports: [DynamicFormInput, ReactiveFormsModule, Button],
})
export class DynamicForm {
    private readonly ctlSvc = inject(InputControlService);
    private readonly inputSvc = inject(InputService);

    //readonly inputs = input<InputBase<unknown>[] | null>([]);
    private _inputs: InputBase<unknown>[] = [];

    @Input() inputs!: Signal<InputBase<unknown>[]>;
    @Input() showButtons: boolean = true;

    @Input() canLoad: boolean = false;
    @Input() onSubmit: (arg: WeakObj) => void = (arg: WeakObj) => {};
    @Input() onCancel: () => void = () => {};

    readonly form = computed<FormGroup>(() =>
        this.ctlSvc.toFormGroup(this.inputs() as InputBase<unknown>[]),
    );

    public payLoad = '';

    ngOnInit() {
        console.log('dynamic form', this.form());
        console.log('inputs', this.inputs());
    }

    public handleSubmit() {
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
}
