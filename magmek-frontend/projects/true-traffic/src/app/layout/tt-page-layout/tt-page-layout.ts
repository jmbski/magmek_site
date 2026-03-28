import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'tt-page-layout',
    imports: [
        CommonModule,
        Toast,
    ],
    templateUrl: './tt-page-layout.html',
    styleUrl: './tt-page-layout.scss',
})
export class TtPageLayout {

    @Input() bgImg: string = '';
    @Input() logo: string = 'truetraffic-logo-full.png';

}
