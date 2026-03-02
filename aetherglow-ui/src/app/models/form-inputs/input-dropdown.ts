import {InputControlType, InputBase} from './input-base';
export class DropdownInput extends InputBase<string> {
    override controlType: InputControlType = 'dropdown';
}
