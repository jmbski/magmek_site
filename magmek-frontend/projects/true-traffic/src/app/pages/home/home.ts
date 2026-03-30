import { Component, inject, model } from '@angular/core';
import { TtPageLayout } from '@tt-app/layout';
import { SimSnapshot } from '@tt-app/models';
import { TrafficTxService } from '@tt-app/services';
import { SimSnapshots } from '../../components/sim-snapshots/sim-snapshots';
@Component({
    selector: 'tt-home',
    imports: [
        TtPageLayout,
        SimSnapshots,
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class TtHome {
    private readonly txSvc: TrafficTxService = inject(TrafficTxService);

    public simSnapshots = model<SimSnapshot[]>([]);

    constructor() {
        this.txSvc.getSimSnapshots('Hill Valley').then(response => {
            this.simSnapshots.set(response);
        });
    }
}
