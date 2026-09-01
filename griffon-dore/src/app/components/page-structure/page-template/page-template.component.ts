import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { TopNavComponent } from '../_index';

@Component({
    selector: 'gdo-page-template',
    standalone: true,
    imports: [
        TopNavComponent,

    ],
    templateUrl: './page-template.component.html',
    styleUrl: './page-template.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTemplateComponent {

    // #region public properties
    
    // #endregion public properties
    
    
    // #region private properties
    
    // #endregion private properties
    
    
    // #region getters/setters
    
    // #endregion getters/setters
    
    
    // #region standard inputs
    
    // #endregion standard inputs
    
    
    // #region get/set inputs
    
    // #endregion get/set inputs
    
    
    // #region outputs, emitters, and event listeners
    
    // #endregion outputs, emitters, and event listeners
    
    
    // #region viewchildren and contentchildren
    
    @Input() topNavTemplate: TemplateRef<unknown> | null = null;

    // #endregion viewchildren and contentchildren
    
    
    // #region constructor and lifecycle hooks
    
    // #endregion constructor and lifecycle hooks
    
    
    // #region public methods
    
    // #endregion public methods
    
    
    // #region protected methods
    
    // #endregion protected methods
    
    
    // #region private methods
    
    // #endregion private methods
    
    
}
