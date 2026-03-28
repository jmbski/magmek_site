import { ApiErrorData } from '@ag-app/core';
import { fromPythonObj } from '@shared/core';
import { isWeakObj } from '@shared/typing';

export class ApiError {
    type: string = '';
    title: string = '';
    status?: number;
    detail: string = '';
    instance: string = '';

    constructor(init: unknown) {
        if (isWeakObj(init)) Object.assign(this, fromPythonObj(init));
    }
}

export class ApiWarning extends ApiError {
    public override type: string = ApiErrorData.GENERIC_WARNING.type;
    public override title: string = ApiErrorData.GENERIC_WARNING.title;
    public override status?: number = ApiErrorData.GENERIC_WARNING.status;
}
