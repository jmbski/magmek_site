import {Injectable, input} from '@angular/core';
import {DropdownInput} from '../models/form-inputs/input-dropdown';
import {InputBase} from '../models/form-inputs/input-base';
import {TextboxInput} from '../models/form-inputs/input-textbox';
import {Observable, of} from 'rxjs';
import { camelCase } from 'change-case';
import { isKVRecord, isKVType, isWeakObj, StrRecord } from '@app/typing';
import { KeyValueInput } from '../models/form-inputs/input-key-value';
import { KeyValueType, WeakObj } from '../typing/types';
import { FormControl, FormGroup } from '@angular/forms';


@Injectable({providedIn: 'root'})
export class InputService {
    // TODO: get from a remote source of question metadata
    getQuestions() {
        const inputs: InputBase<string>[] = [
            new DropdownInput({
                key: 'favoriteAnimal',
                label: 'Favorite Animal',
                options: [
                    {key: 'cat', value: 'Cat'},
                    {key: 'dog', value: 'Dog'},
                    {key: 'horse', value: 'Horse'},
                    {key: 'capybara', value: 'Capybara'},
                ],
                colSpans: 2,
                order: 3,
            }),
            new TextboxInput({
                key: 'firstName',
                label: 'First name',
                value: 'Alex',
                required: true,
                order: 1,
            }),
            new TextboxInput({
                key: 'emailAddress',
                label: 'Email',
                type: 'email',
                order: 2,
            }),
        ];
        return of(inputs.sort((a, b) => a.order - b.order));
    }

    public kvFromStrRecord(data: StrRecord): InputBase<KeyValueType>[] {
        const inputs: KeyValueInput[] = [];
        Object.entries(data).forEach(([key,value], index) => {
            inputs.push(
                new KeyValueInput({
                    key: `charMapping${index}`,
                    labels: ['User Name', 'Character Name'],
                    order: index,
                    required: true,
                    value: {key, value},
                }),
            );
        });

        return inputs.sort((a, b) => a.order - b.order);
    }

    public toStrRecord(data: Record<string,KeyValueType>): StrRecord {
        const record: StrRecord = {};

        Object.values(data).forEach(({key,value}) => {
            record[key] = value;
        });

        return record;
    }

    public fromArray(items: string[], opts?: Partial<InputBase<unknown>>): InputBase<string>[] {
        const inputs = items.map((item,idx) => this.newTextboxQuestion(`item-${idx}`,item, idx, opts));
        console.log('inputs', inputs);
        return inputs;
    }

    public parseFormResult(form: FormGroup, inputs: InputBase<unknown>[]) {
        const raw: WeakObj = form.getRawValue();
        const result: WeakObj = {};

        inputs.forEach(input => {
            const entry = raw[input.key];

            switch(input.controlType) {
                case 'dropdown':
                case 'textbox':
                    result[input.key] = entry;
                    return;
                case 'key-value':
                    if (isKVType(entry)) {
                        const {key, value} = entry;
                        result[key] = value;
                    }

                    return;
            }
        });

        return result;
    }



    public newTextboxQuestion(label: string, value?: string, order?: number, opts?: Partial<InputBase<unknown>>): TextboxInput {
        opts ??= {};
        const config = Object.assign({key: camelCase(label), value, label, order}, opts);

        return new TextboxInput(config);
    }

    public newKVInput(index: number, kvData?: KeyValueType) {
        return new KeyValueInput({
            key: `charMapping${index}`,
            labels: ['User Name', 'Character Name'],
            order: index,
            required: true,
            value: kvData ?? {key: '', value: ''},
        });
    }
}
