import { KeyValueType, KVRecord, StrRecord, WeakObj } from './types';

export function isArray(val: unknown): val is unknown[] {
    return Array.isArray(val);
}
export function isStr(val: unknown): val is string {
    return typeof val === 'string';
}

export function isNum(val:  unknown): val is number {
    return typeof val === 'number';
}

export function isObject(val: unknown): val is object {
    return val != null && typeof val == 'object' && !Array.isArray(val);
}

export function isStrArray(val: unknown): val is string[] {
    return isArray(val) && val.every(isStr);
}

export function isWeakObj(val: unknown): val is WeakObj {
    return isObject(val) && Object.keys(val).every(isStr);
}

export function isStrRecord(val: unknown): val is StrRecord {
    return isWeakObj(val) && Object.values(val).every(isStr);
}

export function isKVType(val: unknown): val is KeyValueType {
    return isObject(val) && Object.hasOwn(val, 'key') && Object.hasOwn(val, 'value');
}

export function isKVRecord(val: unknown): val is KVRecord {
    return isWeakObj(val) && Object.values(val).every(isKVType);
}
