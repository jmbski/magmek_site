import { SupportedExtension } from '@ag-app/core';

export class LogCleanInputSettings {
    public eventCategory: string = 'SL RP Transcript';
    public title: string = 'RP Event';
}

export class LogCleanOutputSettings {
    public filename: string = 'sl_rp_chat_log_' + new Date(Date.now()).toDateString() ;
    public format: SupportedExtension = 'txt';

    get filePath() {
        return `${this.filename}.${this.format}`;
    }
}
