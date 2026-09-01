import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, TemplateRef } from '@angular/core';
import { ANGULAR_COMMON, AppDeviceInfo, UseMobile } from '@app/common';
import { NavLogoComponent } from '../nav-logo/nav-logo.component';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MenuBarComponent } from '@app/components';
import { WSMenuItem } from '@app/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'gdo-top-nav',
    standalone: true,
    imports: [
        MenuBarComponent,
        MenubarModule,
        NavLogoComponent,
        ...ANGULAR_COMMON,
    ],
    templateUrl: './top-nav.component.html',
    styleUrl: './top-nav.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavComponent {
    // #region public properties
    public model$: BehaviorSubject<WSMenuItem[]> = new BehaviorSubject<WSMenuItem[]>([]);
    
    // #endregion public properties
    
    
    // #region private properties
    
    // #endregion private properties
    
    
    // #region getters/setters
    
    // #endregion getters/setters
    
    
    // #region standard inputs
    @Input() template: TemplateRef<unknown> | null = null;

    private _model: WSMenuItem[] = [];
    @Input() 
    set model(value: WSMenuItem[]) {
        this._model = value.slice();
        this.model$.next(value);
    }
    get model(): WSMenuItem[] {
        return this._model;
    }
    
    // #endregion standard inputs
    
    
    // #region get/set inputs
    
    // #endregion get/set inputs
    
    
    // #region outputs, emitters, and event listeners
    
    // #endregion outputs, emitters, and event listeners
    
    
    // #region viewchildren and contentchildren
    
    // #endregion viewchildren and contentchildren
    
    
    // #region constructor and lifecycle hooks
    constructor(
        public cd: ChangeDetectorRef,
    ) {
        const menuItems: WSMenuItem[] = [
            {
                label: 'About',
                isExpanded: false,
                items: [
                    {
                        label: 'Our Story',
                    },
                    {
                        label: 'Mission & Values',
                    },
                    {
                        label: 'Meet The Members',
                    }
                ]
            },
            {
                label: 'Historical Insights',
                isExpanded: false,
                items: [
                    {
                        label: 'Life in the Hundred Years\' War',
                    },
                    {
                        label: 'Weapons & Warfare',
                    },
                    {
                        label: 'Fashion & Culture',
                    }
                ]
            },
            {
                label: 'Events',
                isExpanded: false,
                items: [
                    {
                        label: 'Event Calendar',
                    },
                    {
                        label: 'Upcoming Events',
                    },
                    {
                        label: 'Past Events',
                    },
                ]
            },
            {
                label: 'Resources',
                isExpanded: false,
                items: [
                    {
                        label: 'Research Library',
                    },
                    {
                        label: 'Educational Materials',
                    },
                    {
                        label: 'Historical Recipes',
                    },
                    {
                        label: 'Historical Games',
                    },
                    {
                        label: 'External Links',
                    },
                    {
                        label: 'Tutorials'
                    }
                ]
            },
            {
                label: 'Contact Us',
                isExpanded: false,
                items: [
                    {
                        label: 'Contact Information',
                    },
                    {
                        label: 'Books Us For An Event',
                    },
                    {
                        label: 'Volunteer Opportunities',
                    },
                    {
                        label: 'Join Our Mailing List',
                    },
                    {
                        label: 'Donate',
                    },
                    {
                        label: 'Heed The Clarion Call (Join)'
                    }
                ]
            }
        ];

        this.model = [
            {
                label: 'Menu',
                items: menuItems,
                isExpanded: false,
            }
        ];
    }
    
    // #endregion constructor and lifecycle hooks
    
    
    // #region public methods
    
    // #endregion public methods
    
    
    // #region protected methods
    
    // #endregion protected methods
    
    
    // #region private methods
    
    // #endregion private methods
    
    
}
