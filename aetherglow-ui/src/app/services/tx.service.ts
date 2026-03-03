import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { AppDataModel, Endpoints, toPythonObj } from '@app/core';
import { environment } from '@app/environment';
import { LogCleanInputSettings, RpLogPayload, RpLogResponse, ServerResponse } from '@app/models';
import { Callback, isStrArray, isStrRecord, Predicate, Promised, StrRecord, WeakObj } from '@app/typing';
import { MessagingSvc } from './messaging.service';
import { isArray } from 'lodash';


@Injectable({ providedIn: 'root' })
export class TxService {
    private readonly msgSvc = inject(MessagingSvc);

    constructor(

        private http: HttpClient,
        @Inject(APP_BASE_HREF) private readonly baseHref: string,
    ) {

    }

    // #endregion constructor and lifecycle hooks


    // #region public methods

    public configureHeaders(config?: unknown): WeakObj {
        let requestOptions = {};

        if (config ?? false) {
            //TODO: convert input into HttpHeaders object
        }
        else {
            const headerDict = {
                'Content-Type': 'application/json',
                Accept: '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            };

            requestOptions = {
                headers: new Headers(headerDict),
            };
        }

        return requestOptions;
    }

    public handleResponse<T>(
        response: unknown,
        resolve: CallableFunction,
        reject: CallableFunction,
        predicate: Predicate<T>,
    ) {

        if (response == null) {
            const msg = 'No response from server';
            reject(msg);
            this.msgSvc.errorToast(msg);
            return;
        }

        if(ServerResponse.isServerResponse(response)) {
            const resp = new ServerResponse(response);
            if (predicate(resp.data)) {
                resolve(resp.data);
                if (resp.message) this.msgSvc.successToast(resp.message);
                return;
            }
        }

        let msg = `Response has invalid type of: '${typeof response}'`;
        reject(msg);
        msg += `\n ${response}`;
        this.msgSvc.errorToast(msg);

        return;
    }

    public async health(): Promise<string> {
        return new Promise((resolve, reject) => {
            const url: string = this._buildAppUrl(Endpoints.HEALTH) + '?arg1=test&arg2=test2';
            this.http.get(url, { responseType: 'text' }).subscribe((response?: unknown) => {

                if (response == null) {
                    reject('No response from server');
                    return;
                }
                if (typeof response === 'string') {
                    resolve(response);
                    return;
                }
                reject('Invalid response from server');
            });
        });
    }

    public async getCharMapping(): Promise<StrRecord> {
        return new Promise((resolve, reject) => {
            this.http.get<ServerResponse>(this._buildAppUrl(Endpoints.CHAR_MAPPING)).subscribe(response => {

                this.handleResponse(response, resolve, reject, isStrRecord);
            });
        });
    }

    public async setCharMapping(mapping: StrRecord): Promise<StrRecord> {

        const body = {mapping};
        const options = this.configureHeaders();

        return new Promise((resolve, reject) => {
            this.http.put(this._buildAppUrl(Endpoints.CHAR_MAPPING), body, options).subscribe(response => {
                if (response == null) {
                    reject(this.addCharMapping.name + '::No response from server');
                    return;
                }

                if(ServerResponse.isServerResponse(response)) {
                    const resp = new ServerResponse(response);
                    if (isStrRecord(resp.data)) {
                        resolve(resp.data);
                        return;
                    }
                }


                reject(`${this.addCharMapping.name}::Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;


            });
        });
    }

    public async addCharMapping(mapping: StrRecord): Promise<StrRecord> {

        const body = {mapping};
        const options = this.configureHeaders();

        return new Promise((resolve, reject) => {
            this.http.post(this._buildAppUrl(Endpoints.CHAR_MAPPING), body, options).subscribe(response => {
                return this.handleResponse(response, resolve, reject, isStrRecord);
            });
        });
    }

    public async remCharMapping(keys: string[]): Promise<StrRecord> {
        return new Promise((resolve, reject) => {
            this.http.delete(this._buildAppUrl(Endpoints.CHAR_MAPPING),{body: {keys}}).subscribe((response?: unknown) => {
                return this.handleResponse(response, resolve, reject, isStrRecord);
            });
        });
    }

    public async getIgnored(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.http.get(this._buildAppUrl(Endpoints.IGNORED)).subscribe((response?: unknown) => {
                return this.handleResponse(response, resolve, reject, isStrArray);
            });
        });
    }

    public async addIgnored(keys: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.http.post(this._buildAppUrl(Endpoints.IGNORED), {keys}).subscribe((response?: unknown) => {
                return this.handleResponse(response, resolve, reject, isStrArray);
            });
        });
    }

    public async setIgnored(keys: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.http.put(this._buildAppUrl(Endpoints.IGNORED), {keys}).subscribe((response?: unknown) => {
                return this.handleResponse(response, resolve, reject, isStrArray);
            });
        });
    }

    public async remIgnored(keys: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.http.delete(this._buildAppUrl(Endpoints.IGNORED),{body: {keys}}).subscribe((response?: unknown) => {
                return this.handleResponse(response, resolve, reject, isStrArray);
            });
        });
    }

    public async cleanLog(inputText: string, settings?: LogCleanInputSettings): Promise<RpLogPayload> {
        const lines = inputText.split('\n');
        settings ??= new LogCleanInputSettings();
        const payload = {lines};
        Object.assign(payload, settings);
        AppDataModel.latestInput = inputText;

        return new Promise((resolve, reject) => {
            this.http.post(this._buildAppUrl(Endpoints.CLEAN_LOG), toPythonObj(payload)).subscribe((response) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }

                if (RpLogResponse.isRpLogResponse(response)) {
                    const resp = new RpLogResponse(response);
                    this.msgSvc.successToast('Log successfully parsed & cleaned');
                    resolve (new RpLogPayload(resp.data));
                    return;
                }

                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;
            });
        });
    }

    public async getUnmappedNames(inputText: string): Promise<string[]> {
        const lines = inputText.split('\n');

        const payload = {lines};

        return new Promise((resolve, reject) => {
            this.http.post(this._buildAppUrl(Endpoints.UNMAPPED_NAMES), toPythonObj(payload)).subscribe((response) => {
                return this.handleResponse(response, resolve, reject, isStrArray);
            });
        });
    }

    public async getGalleriaImages(): Promise<string[]> {


        return new Promise((resolve, reject) => {
            this.http.get(this._buildAppUrl(Endpoints.GALLERIA_IMAGES)).subscribe((response) => {
                return this.handleResponse(response, resolve, reject, isStrArray);
            });
        });
    }



    // #endregion public methods


    // #region protected methods

    // #endregion protected methods


    // #region private methods


    /**
     * Build an app-relative URL that respects the configured <base href>.
     * Ensures there's exactly one slash between segments.
     */
    private _buildAppUrl(path: string): string {

        const base = environment.production ? this.baseHref : 'http://localhost:7000';

        const prefix = base.endsWith('/') ? base : `${base}/`;

        const suffix = path.startsWith('/') ? path.slice(1) : path;
        return `${prefix}${environment.serviceEndpoint}${suffix}`;
    }

    // #endregion private methods


}
