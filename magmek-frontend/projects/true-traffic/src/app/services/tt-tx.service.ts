import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {TxServiceBase} from '@shared/services';
import { SimSnapshot } from '@tt-app/models';
import { Environment } from '@tt-env';
import { isArray } from 'lodash';

@Injectable({providedIn: 'root'})
export class TrafficTxService extends TxServiceBase {


    public async getSimSnapshots(opts?: unknown): Promise<SimSnapshot[]> {
        return new Promise((resolve, reject) => {
            this.http.get(this.buildAppUrl('sim-snapshots', Environment)).subscribe((response) => {
                return this.handleResponse(response, resolve, reject, isArray);
            });
        });
    }
}
