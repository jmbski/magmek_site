import { fromPythonObj } from '@app/core';
import { isStr, WeakObj } from '@app/typing';

export class LogLine {
    public timestampStr: string = '';
    public speaker: string = '';
    public lineText: string = '';
    public charName: string = '';
    public formattedLine: string = '';
    public timestamp: Date = new Date(Date.now());

    constructor(data?: string | WeakObj | Partial<LogLine>) {
        data = data ?? {};

        if (isStr(data)) {
            data = LogLine.parseLine(data);
        }

        data = fromPythonObj(data);

        const {timestamp} = data;
        console.log('timestamp orig', typeof timestamp, timestamp);
        if (isStr(timestamp)) data.timestamp = new Date(timestamp);

        Object.assign(this, data);

    }

    public static fromLine(line: string): LogLine {
        return new LogLine();
    }

    public static parseLine(line: string): Partial<LogLine> {
        const data: Partial<LogLine> = {};

        return {};
    }
}
