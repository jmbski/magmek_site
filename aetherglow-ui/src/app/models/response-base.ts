import { fromPythonObj } from '@app/core';
import { isWeakObj, WeakObj } from '@app/typing';
import { ApiWarning } from './api-errors';
import { ResponseMeta } from './resp-meta';
import { RpLogPayload } from './log-response';

export class ServerResponse {
    public data: unknown = '';
    public message: string = '';
    public correlationId: string = '';
    public warnings: ApiWarning[] = [];
    public meta?: ResponseMeta;


    constructor(init?: Partial<ServerResponse>) {

        if (isWeakObj(init)) Object.assign(this, fromPythonObj(init, 'data'));
        this.warnings = this.warnings.map(warn => new ApiWarning(warn));
        this.meta = new ResponseMeta(this.meta);
    }

    public static isServerResponse(val: unknown): val is Partial<ServerResponse> {
        return isWeakObj(val);// && Object.keys(fromPythonObj(val)).every(key => key in Object.getOwnPropertyNames(this));
    }

}
