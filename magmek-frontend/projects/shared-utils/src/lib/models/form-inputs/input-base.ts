import { computed } from '@angular/core';
import { StrRecord } from '@app/typing';

export type InputControlType = 'textbox' | 'dropdown' | 'key-value';

export class InputBase<T> {
    public value?: T;
    public key: string = '';
    public label: string = '';
    public labels: string[] = [];
    public required: boolean = false;
    public order: number = 1;
    public controlType: InputControlType = 'key-value';
    public type: string = '';
    public options: StrRecord[] = [];
    public colSpans: number = 1;
    public removable: boolean = false;
    public copyable: boolean = false;
    public ignorable: boolean = false;
    public disabled: boolean = false;
    public showLabel: boolean = true;
    public mappable: boolean = false;
    public hasExamples: boolean = false;


    public colSpan = computed( () => `col-span-${this.colSpans}`);


    constructor(options: Partial<InputBase<T>>) {
        Object.assign(this, options);
    }
}
