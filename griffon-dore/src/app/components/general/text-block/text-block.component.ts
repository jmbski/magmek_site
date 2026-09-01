import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ANGULAR_COMMON, IsTextBlock } from '@app/common';
import { ElementBase, TextBlock } from '@app/models';

@Component({
    selector: 'gdo-text-block',
    standalone: true,
    imports: [
        ...ANGULAR_COMMON
    ],
    templateUrl: './text-block.component.html',
    styleUrl: './text-block.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextBlockComponent {

    // #region public properties

    public body?: string = '';

    public illuminatedChar?: string;
    
    // #endregion public properties
    
    
    // #region private properties
    
    // #endregion private properties
    
    
    // #region getters/setters
    
    get illuminated(): boolean {
        return this._textBlock?.illuminated || false;
    }

    get illuminatedColor(): string {
        return this._textBlock?.illuminatedColor || 'illuminated';
    }

    get illuminatedBorder(): string {
        return this._textBlock?.illuminatedBorder || 'illuminated-border';
    }

    // #endregion getters/setters
    
    
    // #region standard inputs
    
    
    // #endregion standard inputs
    
    
    // #region get/set inputs

    private _textBlock?: TextBlock;

    @Input()
    get model() {
        return this._textBlock;
    }
    set model(input: ElementBase | undefined) {
        if(IsTextBlock(input)) {
            this._textBlock = input;
            if(input.illuminated && input.content?.length > 0) {
                this.illuminatedChar = input.content.charAt(0);
                this.body = input.content.substring(1);
            }
            else {
                this.body = input.content;
            }
        }
    }
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
    
    // #endregion public methods
    
    
    // #region protected methods
    
    // #endregion protected methods
    
    
    // #region private methods
    
    // #endregion private methods
    
    
}
