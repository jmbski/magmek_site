import { PageLayout } from '@ag-app/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'ag-factions',
    imports: [

        CommonModule,
        PageLayout,
    ],
    templateUrl: './factions.html',
    styleUrl: './factions.scss',
})
export class Factions {

}
