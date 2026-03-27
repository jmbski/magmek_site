import {InputControlType, InputBase} from './input-base';
export class TextboxInput extends InputBase<string> {
    override controlType: InputControlType = 'textbox';
}
