import { Component, inject } from '@angular/core';
import { CoreMenuItems, CoreMenuItemsMega } from '@app/core';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Toast } from 'primeng/toast';
import { MessagingSvc } from '../../services/messaging.service';


@Component({
    selector: 'app-page-layout',
    imports: [
        Menubar,
        Toast,
    ],
    templateUrl: './page.html',
    styleUrl: './page.scss',
})
export class PageLayout {
    private msgSvc = inject(MessagingSvc);
    private pMsgSvc = inject(MessageService);
    public menuItems: MenuItem[] = CoreMenuItems;
    public megaItems: MegaMenuItem[] = CoreMenuItemsMega;

    constructor() {
        this.msgSvc.pMsgSvc = this.pMsgSvc;
    }
}
