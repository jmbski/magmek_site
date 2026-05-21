import { PageLayout } from '@ag-app/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'ag-world-overview',
    imports: [
        CommonModule,
        PageLayout,
    ],
    templateUrl: './world-overview.html',
    styleUrl: './world-overview.scss',
})
export class WorldOverview {

}
