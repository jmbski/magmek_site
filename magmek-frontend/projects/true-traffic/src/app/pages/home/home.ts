import { Component, inject, model, SimpleChanges } from '@angular/core';
import { TtPageLayout } from '@tt-app/layout';
import { SimSnapshot } from '@tt-app/models';
import { TrafficTxService } from '@tt-app/services';
import { SimSnapshots } from '../../components/sim-snapshots/sim-snapshots';
import { Select, SelectItem } from 'primeng/select';
import { WeakObj } from '@shared/typing';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'tt-home',
    imports: [
        TtPageLayout,
        SimSnapshots,
        Select,
        FormsModule,
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class TtHome {
    private readonly txSvc: TrafficTxService = inject(TrafficTxService);

    public simSnapshots = model<SimSnapshot[]>([]);

    private _simName: string = 'Pacific Palisades';
    public get simName() {
        return this._simName;
    }

    public set simName(value: string) {
        this._simName = value;
        this.fetchUpdates();
    }

    public dropdownOptions: WeakObj[] = [
        {
            name: 'Pacific Palisades',
            value: 'Pacific Palisades',
        },
        {
            name: 'WelcomeHubSandbox',
            value: 'WelcomeHubSandbox',
        },
        {
            name: 'Hill Valley',
            value: 'Hill Valley',
        },
    ];

    constructor() {
        this.fetchUpdates();
    }

    ngAfterViewInit() {
        const fetchUpdates = this.fetchUpdates;
        setInterval(() => {
            fetchUpdates();
        }, 20000);
    }

    public fetchUpdates() {
        this.txSvc.getSimSnapshots(this.simName).then(response => {
            this.simSnapshots.set(response);
        });
    }
}
