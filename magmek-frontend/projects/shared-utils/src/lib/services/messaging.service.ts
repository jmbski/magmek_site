import { inject, Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

export const MsgSettings = {
    toastTime: 10000,

};
@Injectable({providedIn: 'root'})
export class MessagingSvc {
    public pMsgSvc = inject(MessageService);

    public successToast(detail: string, opts?: ToastMessageOptions): void {
        this.pMsgSvc.add(Object.assign({
            detail,
            severity: 'success',
            closable: true,
            sticky: false,
            life: MsgSettings.toastTime,
            summary: 'Success',
        }, opts ?? {}));
    }

    public infoToast(detail: string, opts?: ToastMessageOptions): void {
        this.pMsgSvc.add(Object.assign({
            detail,
            severity: 'info',
            closable: true,
            sticky: false,
            life: MsgSettings.toastTime,
            summary: 'Info',
        }, opts ?? {}));
    }

    public warnToast(detail: string, opts?: ToastMessageOptions): void {
        this.pMsgSvc.add(Object.assign({
            detail,
            severity: 'warn',
            closable: true,
            sticky: false,
            life: MsgSettings.toastTime,
            summary: 'Warning',
        }, opts ?? {}));
    }

    public errorToast(detail: string, opts?: ToastMessageOptions): void {
        this.pMsgSvc.add(Object.assign({
            detail,
            severity: 'error',
            closable: true,
            sticky: false,
            life: MsgSettings.toastTime,
            summary: 'Error',
        }, opts ?? {}));
    }
}
