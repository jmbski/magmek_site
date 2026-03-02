import { Component } from '@angular/core';
import { CoreMenuItems } from '@app/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';


@Component({
    selector: 'app-page-layout',
    imports: [Menubar,],
    templateUrl: './page.html',
    styleUrl: './page.scss',
})
export class PageLayout {
    public menuItems: MenuItem[] = CoreMenuItems;
}
