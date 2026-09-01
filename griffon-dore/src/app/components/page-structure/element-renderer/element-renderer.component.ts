import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ANGULAR_COMMON, IsTextBlock, PRIME_COMMON } from '@app/common';
import { ElementBase } from '@app/models';
import { BehaviorSubject } from 'rxjs';
import { TextBlockComponent } from '../../general/_index';

@Component({
    selector: 'gdo-element-renderer',
    standalone: true,
    imports: [
        TextBlockComponent,
        ...ANGULAR_COMMON,
        ...PRIME_COMMON
    ],
    templateUrl: './element-renderer.component.html',
    styleUrl: './element-renderer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementRendererComponent {

    // #region public properties

    public model$: BehaviorSubject<ElementBase[]> = new BehaviorSubject<ElementBase[]>([]);

    // #endregion public properties
    
    
    // #region private properties
    
    // #endregion private properties
    
    
    // #region getters/setters
    
    // #endregion getters/setters
    
    
    // #region standard inputs

    private _model: ElementBase[] = [];
    @Input()
    get model() {
        return this._model;
    }
    set model(input: ElementBase[]) {
        this._model = input;
        this.model$.next(input);
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
        
    }
    // #endregion constructor and lifecycle hooks
    
    
    // #region public methods
    public isTextBlock = IsTextBlock;
    
    // #endregion public methods
    
    
    // #region protected methods
    
    // #endregion protected methods
    
    
    // #region private methods
    
    // #endregion private methods
    
    
}
