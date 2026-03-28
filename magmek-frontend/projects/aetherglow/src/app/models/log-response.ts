import { isWeakObj, WeakObj } from '@shared/typing';
import { ServerResponse } from './response-base';
import { LogLine } from './log-line';
import { fromPythonObj } from '@shared/core';

export class RpLogPayload {
    public header: string = '';
    public narrative: string = '';
    public newNames: string[] = [];
    public lines: LogLine[] = [];

    get output() {
        return this.header + this.narrative;
    }

    constructor(init?: Partial<RpLogPayload>) {
        if(init) Object.assign(this, fromPythonObj(init));
    }
}


export class RpLogResponse extends ServerResponse {
    declare public data: RpLogPayload;

    constructor(init: Partial<RpLogResponse>) {
        if (isWeakObj(init)) {
            const {data} = init;
            if (isWeakObj(data)) init.data = new RpLogPayload(data);
        }
        super(init);
    }

    public static isRpLogResponse(val: unknown): val is RpLogResponse {
        return ServerResponse.isServerResponse(val);
    }
}
