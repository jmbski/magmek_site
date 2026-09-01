import { GeneralFunction, RecordObject } from '@app/models';

/**
     * Checks if the input is a string indexed object.
     * 
     * @param input- The value to check if it is a string indexed object
     * @returns true if the input is a string indexed object, false otherwise
     */
export function IsRecordObject(input: unknown): input is RecordObject {
    return typeof input === 'object' && input != null && !Array.isArray(input) && Object.keys(input).every(key => typeof key === 'string');
}

/**
 * Checks if the input is an array of string indexed objects.
 * 
 * @param input - The value to check if it is an array of string indexed objects
 * @returns true if the input is an array of string indexed objects, false otherwise
 */
export function IsRecordObjectArray(input: unknown): input is RecordObject[] {
    return Array.isArray(input) && input.every(IsRecordObject);
}

/**
 * Checks if the input is numeric.
 * 
 * @param value - The value to check if it is numeric
 * @returns true if the input is numeric, false otherwise 
 */
export function IsNumeric(value: unknown): value is number | string {
    if(typeof value === 'number') {
        return true;
    }
    if(typeof value === 'string') {
        return !isNaN(parseFloat(value));
    }
    return false;
}

/**
 * Checks if the input is a string.
 * 
 * @param value - The value to check if it is a string
 * @returns true if the input is a string, false otherwise
 */
export function IsString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * Checks if the input is an array of strings.
 * 
 * @param value - The value to check if it is an array of strings
 * @returns true if the input is an array of strings, false otherwise
 */
export function IsStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(IsString);
}

/**
 * Checks if the input is a number.
 * 
 * @param value - The value to check if it is a number
 * @returns true if the input is a number, false otherwise
 */
export function IsNumber(value: unknown): value is number {
    return typeof value === 'number';
}

/**
 * Checks if the input is an array of numbers.
 * 
 * @param value - The value to check if it is an array of numbers
 * @returns true if the input is an array of numbers, false otherwise
 */
export function IsNumberArray(value: unknown): value is number[] {
    return Array.isArray(value) && value.every(IsNumber);
}

/**
 * Checks if the input is a boolean.
 * 
 * @param value - The value to check if it is a boolean
 * @returns true if the input is a boolean, false otherwise
 */
export function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

/**
 * Checks if the input is an array of booleans.
 * 
 * @param value - The value to check if it is an array of booleans
 * @returns true if the input is an array of booleans, false otherwise
 */
export function IsBooleanArray(value: unknown): value is boolean[] {
    return Array.isArray(value) && value.every(IsBoolean);
}

/**
 * Checks if the input is a function.
 * 
 * @param value - The value to check if it is a function
 * @returns true if the input is a function, false otherwise
 */
export function IsFunction(value: unknown): value is GeneralFunction<unknown> {
    return typeof value === 'function';
}

/**
 * Checks if the input is a date.
 * 
 * @param value - The value to check if it is a date
 * @returns true if the input is a date, false otherwise
 */
export function IsDate(value: unknown): value is Date {
    return value instanceof Date;
}

/**
 * Checks if the input is an array of dates.
 * 
 * @param value - The value to check if it is an array of dates
 * @returns true if the input is an array of dates, false otherwise
 */
export function IsDateArray(value: unknown): value is Date[] {
    return Array.isArray(value) && value.every(IsDate);
}

export function IsUndefined(value: unknown): value is undefined {
    return value === undefined;
}