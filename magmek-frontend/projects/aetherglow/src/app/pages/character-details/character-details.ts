import { PageLayout } from '@ag-app/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'ag-character-details',
    imports: [
        CommonModule,
        PageLayout,
    ],
    templateUrl: './character-details.html',
    styleUrl: './character-details.scss',
})
export class CharacterDetails {

}
