
import { KeyValueType } from '@app/typing';
import { InputBase, InputControlType } from './input-base';

export class KeyValueInput extends InputBase<KeyValueType> {
    public override controlType: InputControlType = 'key-value';
    public override colSpans: number = 2;
    public override removable: boolean = true;

}
