import { PageLayout } from '@ag-app/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'ag-lore',
    imports: [
        CommonModule,
        PageLayout,
    ],
    templateUrl: './lore.html',
    styleUrl: './lore.scss',
})
export class Lore {

}
