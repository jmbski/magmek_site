import { AbstractControl } from '@angular/forms';

export type StrRecord = Record<string, string>;
export type WeakObj = Record<string, unknown>;

export type FormControls = Record<string, AbstractControl>;

export interface KeyValueType {
    key: string;
    value: string;
}

export type KVRecord = Record<string, KeyValueType>;
