import { ChangeDetectorRef, Component, computed, inject, model, signal } from '@angular/core';
import { CoreMenuItems, CoreMenuItemsMega } from '@app/core';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Toast } from 'primeng/toast';
import { MessagingSvc } from '../../services/messaging.service';
import { GalleriaResponsiveOptions } from 'primeng/galleria';
import { TxService } from '@app/services';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { isWeakObj } from '@app/typing';
import { isArray } from 'lodash';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-page-layout',
    imports: [
        FormsModule,
        Menubar,
        Toast,
    ],
    templateUrl: './page.html',
    styleUrl: './page.scss',
})
export class PageLayout {
    private msgSvc = inject(MessagingSvc);
    private pMsgSvc = inject(MessageService);
    private txSvc = inject(TxService);

    private intervalId: number | null = null;

    public interval: number = 8000;

    public currentIndex = signal(0);
    public nextIndex = signal(1);
    public showFirst: boolean = true;

    public responsiveOptions: GalleriaResponsiveOptions[] = [];

    public menuItems = signal<MenuItem[]>(CoreMenuItems);

    public megaItems: MegaMenuItem[] = CoreMenuItemsMega;

    public images = model<string[]>([]);

    public currentImage = computed<string>(() => {
        const src = this.images()[this.currentIndex()];
        //return `background-image: url(${src});`;
        return this.images()[this.nextIndex()];
    });

    public nextImage = computed<string>(() => {
        if (this.nextIndex() >= this.images().length) return '';
        return this.images()[this.nextIndex()];
    });

    constructor(public cd: ChangeDetectorRef) {
        this.msgSvc.pMsgSvc = this.pMsgSvc;
        this.txSvc.getGalleriaImages().then(resp => {
            this.images.set(resp);
        });
    }

    ngOnInit(): void {
        this.intervalId = window.setInterval(() => {
            this.transition();
        }, this.interval);
    }

    ngOnDestroy(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
        }
    }

    public transition(): void {
        this.nextIndex.set((this.currentIndex() + 1) % this.images().length);

        // toggle visible layer
        this.showFirst = !this.showFirst;

        setTimeout(() => {
            this.currentIndex.set(this.nextIndex());
        }, 1500);
    }

    /* get currentImage(): string {
        return this.images()[this.activeIndex];
    }

    get nextImage(): string {
        return this.images()[this.nextIndex];
    } */
}
