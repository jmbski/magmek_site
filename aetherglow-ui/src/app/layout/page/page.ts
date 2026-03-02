import { Component } from '@angular/core';
import { CoreMenuItems, CoreMenuItemsMega } from '@app/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';


@Component({
    selector: 'app-page-layout',
    imports: [Menubar],
    templateUrl: './page.html',
    styleUrl: './page.scss',
})
export class PageLayout {
    public menuItems: MenuItem[] = CoreMenuItems;
    public megaItems: MegaMenuItem[] = CoreMenuItemsMega;

    constructor() {
    }
}
