import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDeviceInfo, GlobalResizeObserver, PRIME_COMMON } from '@app/common';
import { BlockableUiComponent, PullToRefreshComponent } from '@app/components';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AutomatedStylingService } from './services/automated-styling/automated-styling.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        BlockableUiComponent,
        CommonModule,
        PullToRefreshComponent,
        RouterOutlet,
        ...PRIME_COMMON,
    ],
    providers: [MessageService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'griffon-dore';

    public resizeObserver?: ResizeObserver;

    constructor(
        private cd: ChangeDetectorRef,
        private primengConfig: PrimeNGConfig,
        private deviceDetector: DeviceDetectorService,
        private automatedStylingService: AutomatedStylingService,
    ) {
        
        //AppDeviceInfo.isDesktop = this.deviceDetector.isDesktop();
        AppDeviceInfo.isMobile = this.deviceDetector.isMobile();
        AppDeviceInfo.isTablet = this.deviceDetector.isTablet();
        afterNextRender(() => {
            console.log(this.deviceDetector.getDeviceInfo());

            this.resizeObserver = new ResizeObserver((data: ResizeObserverEntry[]) => {
                const width: number = data[0].contentRect.width;
                const height: number = data[0].contentRect.height;
            
                if (width <= 761 || height <= 600) {
                    AppDeviceInfo.isMobile = true;
                }
                else {
                    AppDeviceInfo.isMobile = false;
                }
                const appTopNav: HTMLElement = <HTMLElement>document.querySelector('.app-top-nav');
                const appTopNavShadow: HTMLElement = <HTMLElement>document.querySelector('.app-top-nav-shadow');
                appTopNavShadow.style.height = `${appTopNav.offsetHeight}px`;
                this.cd.detectChanges();
            });
            const appTopNav: HTMLElement = <HTMLElement>document.querySelector('.app-top-nav');
            const appTopNavShadow: HTMLElement = <HTMLElement>document.querySelector('.app-top-nav-shadow');
            appTopNavShadow.style.height = `${appTopNav.offsetHeight}px`;
            this.resizeObserver.observe(document.body);
            GlobalResizeObserver.next(this.resizeObserver);
            
        });
    }

    ngOnInit(
    ) {
        this.primengConfig.ripple = true;


        this.primengConfig.zIndex = {
            modal: 11100,    // dialog, sidebar
            overlay: 10000,  // dropdown, overlaypanel
            menu: 11000,     // overlay menus
            tooltip: 11050  // tooltip
        };
    }

}
