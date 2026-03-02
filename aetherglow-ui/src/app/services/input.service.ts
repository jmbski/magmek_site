import {Injectable} from '@angular/core';
import {DropdownInput} from '../models/form-inputs/input-dropdown';
import {InputBase} from '../models/form-inputs/input-base';
import {TextboxInput} from '../models/form-inputs/input-textbox';
import {Observable, of} from 'rxjs';
import { camelCase } from 'change-case';
import { StrRecord } from '@app/typing';
import { KeyValueInput } from '../models/form-inputs/input-key-value';
import { KeyValueType } from '../typing/types';


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

    public fromStrRecord(data: StrRecord): InputBase<KeyValueType>[] {
        const inputs: KeyValueInput[] = [];
        Object.entries(data).forEach(([key,value], index) => {
            inputs.push(
                new KeyValueInput({
                    key: `charMapping${index}`,
                    labels: ['User Name', 'Character Name'],
                    order: index,
                    required: true,
                    value: {key, value},
                })
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



    newTextboxQuestion(label: string, value?: string, order?: number): TextboxInput {

        return new TextboxInput({
            key: camelCase(label),
            value,
            label,
            order,
        });
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
