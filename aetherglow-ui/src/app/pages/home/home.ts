import { Component } from '@angular/core';
import { PageLayout } from '@app/layout';
import { DividerModule } from 'primeng/divider';



@Component({
    selector: 'app-home',
    imports: [PageLayout, DividerModule],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home {
    public dividerClass: string = 'flex-4 m-[0_6px_0_6px]! bg-white h-[1px] shadow-[0px_0px_12px_1px_#ABF]';
    public dividerClassFull: string = 'w-full m-4! bg-white h-[1px] shadow-[0px_0px_12px_1px_#ABF]';
    public sectionHeader: string = 'text-lg font-bold text-cyan-600';
}
