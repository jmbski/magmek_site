import { fromPythonObj } from '@shared/core';
import { isStr, isWeakObj, WeakObj } from '@shared/typing';

export class ResponseMeta {
    public timestamp?: Date;
    public version?: string;

    constructor(data?: unknown) {
        if (!isWeakObj(data)) return;

        const init: WeakObj = fromPythonObj(data);

        const {timestamp} = init;

        if (isStr(timestamp)) init['timestamp'] = new Date(timestamp);

        Object.assign(this, init);
    }
}
