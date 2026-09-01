import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, afterNextRender } from '@angular/core';
import { ANGULAR_COMMON, AppDeviceInfo, UseMobile } from '@app/common';
import { WSMenuItem } from '@app/models';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgStyleValues } from 'src/app/models/styles';
import { SvgComponent } from '../svg/svg.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';


export interface MenuBarConfig {
    model: WSMenuItem[];

    menuBarClass?: string;
    menuBarStyle?: NgStyleValues;

    menuItemClass?: string;
    menuItemStyle?: NgStyleValues;

    [key: string]: unknown;

}

@Component({
    selector: 'gdo-menu-bar',
    standalone: true,
    imports: [
        CollapseModule,
        SvgComponent,
        MenubarModule,
        ...ANGULAR_COMMON
    ],
    templateUrl: './menu-bar.component.html',
    styleUrl: './menu-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuBarComponent {

    // #region public properties
    public model$: BehaviorSubject<WSMenuItem[]> = new BehaviorSubject<WSMenuItem[]>([]);
    
    public activeMenuElement: HTMLElement | null = null;

    public modelElementMap: Map<HTMLElement, WSMenuItem> = new Map<HTMLElement, WSMenuItem>();

    public useMobile: boolean = UseMobile();

    public showMenu: boolean = false;

    public mobileCollapsed: boolean = true;

    // #endregion public properties
    
    
    // #region private properties
    
    // #endregion private properties
    
    
    // #region getters/setters
    get barModel() {
        return <MenuItem[]>this.model$.getValue();
    }
    // #endregion getters/setters
    
    
    // #region standard inputs
    
    // #endregion standard inputs
    
    // #region get/set inputs
    private _model: WSMenuItem[] = [];
    @Input()
    get model() {
        return this._model;
    }
    set model(input: WSMenuItem[]) {
        if(UseMobile()) {
            this._model = input;
        }
        else {
            this._model = input[0]?.items || [];
        }
        this.model$.next(this._model);
    }
    
    // #endregion get/set inputs
    
    
    // #region outputs, emitters, and event listeners
    
    // #endregion outputs, emitters, and event listeners
    
    
    // #region viewchildren and contentchildren
    
    // #endregion viewchildren and contentchildren
    
    
    // #region constructor and lifecycle hooks
    constructor(
        public cd: ChangeDetectorRef,
        public el: ElementRef,
    ) {
        this.useMobile = UseMobile();
        
        afterNextRender(() => {
            this.showMenu = true;
            this.cd.detectChanges();
            const element: HTMLElement = this.el.nativeElement;

            const models = this.model;
            
            const cd = this.cd;
            if(!this.useMobile) {
                const gdoMenuItems: HTMLElement[] = Array.from(element.querySelectorAll('.gdo-menubar-item'));
                
                gdoMenuItems.forEach((gdoMenuItem: HTMLElement, index: number) => {
                    this.modelElementMap.set(gdoMenuItem, models[index]);
                });

                gdoMenuItems.forEach((gdoMenuItem: HTMLElement, index: number) => {
                    const model = models[index];
                    const subMenuItems: HTMLElement[] = <HTMLElement[]>Array.from(gdoMenuItem.getElementsByClassName('gdo-menubar-submenu'));
                    subMenuItems.forEach((subMenuItem: HTMLElement) => {
                        subMenuItem.style.maxWidth = `${gdoMenuItem.offsetWidth}px`;
                    });
                    gdoMenuItem.addEventListener('mouseenter', () => {
                        model.isExpanded = true;
                        cd.detectChanges();
                    });
        
                    gdoMenuItem.addEventListener('mouseleave', () => {
                        model.isExpanded = false;
                        cd.detectChanges();
                    });
                });
            }

            this.showMenu = true;
            this.cd.detectChanges();


            /* const { isDesktop, isMobile, isTablet } = AppDeviceInfo;
            console.log(AppDeviceInfo); */
            //if(isDesktop) {
            //}

            /* document.body.addEventListener('touchstart', (event: TouchEvent) => {
                const menuRootElement = (<HTMLElement>event.target).closest('.gdo-menubar-item');
                console.log('touch event', event);
                console.log('touch event target', event.target);
                console.log('touches', event.targetTouches);
                if(!menuRootElement) {

                    if(this.activeMenuElement) {
                        const activeModel = this.modelElementMap.get(this.activeMenuElement);
                        if(activeModel) {
                            activeModel.isExpanded = false;
                            cd.detectChanges();
                        }
                    }
                    return;
                }
                if(menuRootElement instanceof HTMLElement) {
                    const model = this.modelElementMap.get(menuRootElement);
                    if(model) {
                        if(menuRootElement !== this.activeMenuElement) {
                            if(this.activeMenuElement) {
                                const activeModel = this.modelElementMap.get(this.activeMenuElement);
                                if(activeModel) {
                                    activeModel.isExpanded = true;
                                    cd.detectChanges();
                                }
                            }
                            this.activeMenuElement = menuRootElement;
                            //model.isCollapsed = false;
                        }
                    }
                }
            }); */
            
        });
    }
    
    // #endregion constructor and lifecycle hooks
    
    
    // #region public methods

    /* public handleItemClick(itemElement: HTMLElement) {
        const model = this.modelElementMap.get(itemElement);
        
        if(model) {
            if(this.useMobile) {
                model.isExpanded = !model.isExpanded;
            }
            this.cd.detectChanges();
        }
    } */

    public handleItemClick(model: WSMenuItem) {
        
        
        if(model) {
            model.isExpanded = !model.isExpanded;
            if(model.isExpanded || model.label === 'Menu') {
                this.model[0]?.items?.forEach((menuItem) => {
                    if(menuItem !== model) {
                        menuItem.isExpanded = false;
                    }
                });
            
            }
            this.cd.detectChanges();
        }
    }
    
    // #endregion public methods
    
    
    // #region protected methods
    
    // #endregion protected methods
    
    
    // #region private methods
    
    // #endregion private methods
    
    
}
