import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Utils } from '../utils/utils';
import { ElementConfig } from '@app/models';
import { IsNumeric } from '@app/common';

@Injectable({
    providedIn: 'root'
})
export class AutomatedStylingService {

    // #region public properties
    
    // #endregion public properties
    
    
    // #region private properties
    private _mutationObserver?: MutationObserver;
    
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
    
    // #endregion viewchildren and contentchildren
    
    
    // #region constructor and lifecycle hooks
    constructor(@Inject(PLATFORM_ID) private platformId: NonNullable<unknown>) {
    }
    // #endregion constructor and lifecycle hooks
    
    
    // #region public methods
    public setupMutationObserver() {
        const mutationObserverCallback = (mutationsList: MutationRecord[]) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if(node instanceof HTMLElement) {
                            
                            const buttons: HTMLElement[] = Array.from(node.querySelectorAll('.gdo-button'));
                            if(buttons && (buttons.length ?? 0) > 0) {
                                for (const button of buttons) {
                                    const parent: HTMLElement | null = button.parentElement;
                                    if(parent) {
                                        const zindex = getComputedStyle(parent).getPropertyValue('z-index');
                                        if(IsNumeric(zindex)) {
                                            button.style.zIndex = `${parseInt(zindex) + 1}`;
                                        }
                                    }
                                    
                                }
                            }
                        }
                    });
                }
            }
        };
  
        if (isPlatformBrowser(this.platformId)) {
            this._mutationObserver = new MutationObserver(mutationObserverCallback);
            this._mutationObserver.observe(document, { childList: true, subtree: true });
        }
    }

    public stopObserving() {
        this._mutationObserver?.disconnect();
    }

    public startObserving() {

        this._mutationObserver?.observe(document, {
            childList: true,
            subtree: true
        });
    }

    public static AdjustElementZindexes(baseElement?: HTMLElement | string, elementConfigs?: ElementConfig[], baseZIndex?: string | number ): void {
        baseElement = Utils.retrieveElement(baseElement);

        if(baseElement instanceof HTMLElement) {
            
            if(!baseZIndex) {
                baseZIndex = getComputedStyle(baseElement).getPropertyValue('z-index');
            }

            if(IsNumeric(baseZIndex)) {
                const baseZIndexNum = typeof baseZIndex === 'string' ? parseInt(baseZIndex) : baseZIndex;
                baseElement.style.zIndex = `${baseZIndexNum}`;

                if(elementConfigs) {
                    for (const elementConfig of elementConfigs) {
                        elementConfig.baseElement = baseElement;
                        elementConfig.baseZIndexNum = baseZIndexNum;
                        AutomatedStylingService.ApplyElementConfig(elementConfig);
                    }
                }
            }
        }
    }

    public static ApplyElementConfig(elementConfig: ElementConfig) {
        const { baseElement } = elementConfig;

        if(baseElement) {
            const elements = Array.from(baseElement.querySelectorAll(elementConfig.selector));
                            
            for (const element of elements) {
                AutomatedStylingService.ApplyConfigToElement(elementConfig, element);
            }
        }
    }

    public static ApplyConfigToElement(elementConfig: ElementConfig, element: Element) {
        const { 
            baseZIndexNum, 
            zIndexIncrement, 
            customEvents, 
            hoverZIndexIncrement, 
            useDefaultHover 
        } = elementConfig;

        if(element instanceof HTMLElement) {
            let elementZIndex: number = 0;

            if(!baseZIndexNum) {
                const elementZIndexStr = getComputedStyle(element).getPropertyValue('z-index');
                if(IsNumeric(elementZIndexStr)) {
                    elementZIndex = parseInt(elementZIndexStr);
                }
            }
            else {
                elementZIndex = baseZIndexNum;
            }

            if(elementZIndex > 0) {
                if(zIndexIncrement) {
                    elementZIndex += zIndexIncrement;
                }
                
                element.style.zIndex = `${elementZIndex}`;

                if(useDefaultHover) {
                    const hoverZIndex = hoverZIndexIncrement ? elementZIndex + hoverZIndexIncrement : elementZIndex + 1;

                    element.addEventListener('mouseenter', () => {
                        element.style.zIndex = `${hoverZIndex}`;
                    });

                    element.addEventListener('mouseleave', () => {
                        element.style.zIndex = `${elementZIndex}`;
                    });
                }
                
            }

            if(customEvents) {
                for (const customEvent of customEvents) {
                    element.addEventListener(customEvent.eventName, customEvent.eventCallback);
                }
            }
        }
    }
    
    // #endregion public methods
    
    
    // #region protected methods
    
    // #endregion protected methods
    
    
    // #region private methods
    
    // #endregion private methods
    
    
}
