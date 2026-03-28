import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { isWeakObj, Predicate, WeakObj } from '@shared/typing';
import { isString } from 'lodash';

import { MessagingSvc } from 'shared-utils';

@Injectable({providedIn: 'root'})
export class TxServiceBase {
    private readonly msgSvc = inject(MessagingSvc);
    public readonly http: HttpClient = inject(HttpClient);

    constructor(

        @Inject(APP_BASE_HREF) private readonly baseHref: string,
    ) {

    }

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

        if (predicate(response)) {
            // if (response.message) this.msgSvc.successToast(resp.message);
            if (isWeakObj(response)) {
                const {message, data} = response;
                if (Object.hasOwn(response, 'data')) {
                    resolve(data);
                }
                else {
                    resolve(response);
                }
                if (isString(message)) {
                    this.msgSvc.successToast(message);
                }
            }
            else {
                resolve(response);
            }
            return;
        }

        let msg = `Response has invalid type of: '${typeof response}'`;
        reject(msg);
        msg += `\n ${response}`;
        this.msgSvc.errorToast(msg);

        return;
    }




    /**
     * Build an app-relative URL that respects the configured <base href>.
     * Ensures there's exactly one slash between segments.
     */
    public buildAppUrl(path: string, env: WeakObj): string {
        const {production, serviceEndpoint} = env;

        const base = production ? this.baseHref : 'http://localhost:7000';

        const prefix = base.endsWith('/') ? base : `${base}/`;

        const suffix = path.startsWith('/') ? path.slice(1) : path;
        return `${prefix}${serviceEndpoint ?? 'api/v1/'}${suffix}`;
    }

}
