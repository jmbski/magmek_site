import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { isObject, isStr, isStrArray, isStrRecord, isWeakObj, StrRecord, WeakObj } from '@app/typing';
import { body } from '@primeuix/themes/aura/card';

@Injectable({ providedIn: 'root' })
export class TxService {
    // #region public properties

    // #endregion public properties


    // #region private properties

    // #endregion private properties


    // #region getters/setters

    // #endregion getters/setters


    // #region standard inputs

    // #endregion standard inputs


    // #region get/set inputs

    // #endregion get/set inputs


    // #region outputs, emitters, and event listeners

    // #endregion outputs, emitters, and event listeners


    // #region viewchildren and contentchildren

    // #endregion viewchildren and contentchildren


    // #region constructor and lifecycle hooks

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

    public async health(): Promise<string> {
        return new Promise((resolve, reject) => {
            const url: string = this._buildAppUrl('health') + '?arg1=test&arg2=test2';
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
            this.http.get(this._buildAppUrl('char-mapping'),).subscribe((response?: unknown) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }

                if (isStrRecord(response)) {
                    resolve(response);
                    return;
                }

                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;
            });
        });
    }

    public async addCharMapping(mapping: StrRecord): Promise<StrRecord> {
        const body = {mapping};
        console.log('Sending body:', body);
        const options = this.configureHeaders();

        return new Promise((resolve, reject) => {
            this.http.post(this._buildAppUrl('char-mapping'), body, options).subscribe((response?: unknown) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }

                if(isWeakObj(response)) {
                    const {payload} = response;
                    if (isStrRecord(payload)) {
                        resolve(payload);
                        return;
                    }
                }

                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;


            });
        });
    }

    public async remCharMapping(keys: string[]): Promise<StrRecord> {
        return new Promise((resolve, reject) => {
            this.http.delete(this._buildAppUrl('char-mapping'),{body: {keys}}).subscribe((response?: unknown) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }


                if(isStrRecord(response)) {
                    resolve(response);
                }

                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;
            });
        });
    }

    public async getIgnored(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.http.get(this._buildAppUrl('char-mapping'),).subscribe((response?: unknown) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }

                if (isStrArray(response)) {
                    resolve(response);
                    return;
                }

                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;
            });
        });
    }

    public async addIgnored(keys: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.http.post(this._buildAppUrl('char-mapping'),{body: {keys}}).subscribe((response?: unknown) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }

                if(isStrArray(response)) {
                    resolve(response);
                }

                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;


            });
        });
    }

    public async remIgnored(keys: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.http.delete(this._buildAppUrl('char-mapping'),{body: {keys}}).subscribe((response?: unknown) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }

                if(isStrArray(response)) {
                    resolve(response);
                }

                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;
            });
        });
    }

    public async cleanLog(inputText: string): Promise<string> {
        const lines = inputText.split('\n');
        return new Promise((resolve, reject) => {
            this.http.post(this._buildAppUrl('clean-log'), {lines}).subscribe((response) => {
                if (response == null) {
                    reject('No response from server');
                    return;
                }


                if(!isWeakObj(response)) {
                    reject('Bad data received');
                    return;
                }


                const {payload} = response;

                if (!isWeakObj(payload)) {
                    reject('Sub-data invalid structure');
                    return;
                }

                const {text, names} =  payload;

                if (isStr(text)) {
                    resolve(text);
                    return;
                }


                reject(`Response has invalid type of: '${typeof response}'`);
                console.log('Response:', response);
                return;
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
