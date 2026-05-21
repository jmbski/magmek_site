import { PageLayout } from '@ag-app/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'ag-locations',
    imports: [

        CommonModule,
        PageLayout,
    ],
    templateUrl: './locations.html',
    styleUrl: './locations.scss',
})
export class Locations {

}
