import {Injectable} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {InputBase} from '@app/models';
import { FormControls, isArray, isKVType, isNum, isObject, isStr, isWeakObj } from '@app/typing';


@Injectable({providedIn: 'root'})
export class InputControlService {

    public toFormGroup(inputs: InputBase<unknown>[]) {
        const group = new FormGroup({});
        inputs.forEach((input) => {
            this.addControl(group, input);
        });
        return group;
    }



    public addControl(form: FormGroup, input: InputBase<unknown>) {
        const validators = input.required ? Validators.required : null;

        let control: FormGroup | FormControl | undefined;

        if (isKVType(input.value)) {
            control = new FormGroup({
                key: new FormControl(input.value.key, validators),
                value: new FormControl(input.value.value, validators),
            });
            //control = new FormControl(input.value || {key: '', value: ''}, validators);
        }
        else control = new FormControl(input.value || '', validators);

        form.addControl(input.key, control);
    }
}
