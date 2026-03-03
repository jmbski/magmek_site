import { AbstractControl } from '@angular/forms';

export type StrRecord = Record<string, string>;
export type WeakObj = Record<string, unknown>;

export type FormControls = Record<string, AbstractControl>;

export interface KeyValueType {
    key: string;
    value: string;
}

export type KVRecord = Record<string, KeyValueType>;
/**
 * Function that generates a union type of string literals.
 */
export function stringLiterals<T extends string>(...args: T[]): T[] {
    return args;
}

export function literalTypeUnion(...args: unknown[]): unknown[] {
    return args;
}

/**
 * Union type built from a list of string literals.
 */
export type UnionTypeOf<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
    ? ElementType
    : never;


export type Promised<T> = (arg: T | Promise<T>) => void;
export type Callback<T> = (arg: T) => void;

export type Predicate<T> = (arg: unknown) => arg is T;

export type ImageData = Partial<HTMLImageElement>;
