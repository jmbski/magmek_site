import { stringLiterals, UnionTypeOf } from '@app/typing';


export class Consts {
    public static DateRegExpYYYYMMDD = RegExp(/\[\d{4}\/\d{2}\/\d{2}\s*\d{2}:\d{2}\]/);
    public static TimestampRegExp = RegExp(/^\[\d.+?\]\s*/);
    public static LineRegExp = RegExp(/^\[(\d.+?)\]\s*(.+?):(.+?$)/);
    public static OocRegExp = RegExp(/^\(\(.+?/);
}

export interface IApiErrorData {
    type: string;
    title: string;
    status?: number;
}

export const BaseUrl = '/api/v1';
export const ProbsUrl = `${BaseUrl}/problems`;
export const WarningsUrl = `${BaseUrl}/warnings`;

export enum Endpoints {
    HEALTH = 'health',
    CHAR_MAPPING = 'char-mapping',
    IGNORED = 'ignored',
    CLEAN_LOG = 'clean-log',
    UNMAPPED_NAMES = 'unmapped-names',
    GALLERIA_IMAGES = 'galleria-images',
}

export type ApiErrorNames = 'GENERIC_ERROR' | 'REQ_TYPE_ERROR' | 'RESP_PARSE_ERROR' | 'GENERIC_WARNING';

export const ApiErrorData: Record< ApiErrorNames, IApiErrorData> = {
    GENERIC_ERROR: {
        type: `${ProbsUrl}/generic`,
        title: 'generic_error',
        status: 500,
    },
    REQ_TYPE_ERROR: {
        type: `${ProbsUrl}/request_type_error`,
        title: 'req_type_error',
        status: 400,
    },
    RESP_PARSE_ERROR: {
        type: `${ProbsUrl}/resp_parse_error`,
        title: 'resp_parse_error',
        status: 500,
    },
    GENERIC_WARNING: {
        type: `${WarningsUrl}/generic_warning`,
        title: 'generic_warning',
    },
};

export const SupportedExtensions = stringLiterals('txt');
export type SupportedExtension = UnionTypeOf<typeof SupportedExtensions>;

