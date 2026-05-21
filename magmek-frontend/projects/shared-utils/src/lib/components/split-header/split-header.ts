import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'mm-split-header',
    imports: [
        CommonModule,
    ],
    templateUrl: './split-header.html',
    styleUrl: './split-header.css',
})
export class SplitHeader {

    @Input() header: string = '';

}
