import {Component, Input, input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { InputBase } from '@app/models';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { DynamicForm } from '../dynamic-form/dynamic-form';

@Component({
    selector: 'app-input',
    imports: [
        ReactiveFormsModule,
        InputText,
        Select,
        FloatLabel,
        Button,
    ],
    templateUrl: './dynamic-form-input.html',
    styleUrl: './dynamic-form-input.scss',
})
export class DynamicFormInput {
    readonly formInput = input.required<InputBase<unknown>>();
    readonly form = input.required<FormGroup>();

    @Input() parentForm?: DynamicForm;

    get isValid() {
        return this.form().controls[this.formInput().key].valid;
    }

    public removeElement() {
        this.parentForm?.removeInput(this.formInput());
    }

}
