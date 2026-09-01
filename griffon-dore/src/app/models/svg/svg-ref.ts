import { ChangeDetectorRef } from '@angular/core';
import { SvgPreserveAspectRatio } from './svg-types';



export class GdoSVGRef {

    // #region public properties

    /* public rootElement?: SVGElement;
    public parentElement?: HTMLElement; */

    public preserveAspectRatio?: SvgPreserveAspectRatio;
    public version?: number;
    
    // #endregion public properties
    
    
    // #region private properties
    
    // #endregion private properties
    
    
    // #region getters/setters

    private _height?: string;
    get height() {
        return this._height;
    }
    set height(input: string | number | undefined) {
        if(typeof input === 'number') {
            this._height = `${input}px`;
        }
        else {
            this._height = input;
        }
    }

    private _width?: string;
    get width() {
        return this._width;
    }
    set width(input: string | number | undefined) {
        if(typeof input === 'number') {
            this._width = `${input}px`;
        }
        else {
            this._width = input;
        }
    }

    /* private _rootSvgElement?: SVGElement;
    get rootSvgElement() {
        return this._rootSvgElement;
    }
    set rootSvgElement(input: SVGElement | string | undefined) {
        const element = Utils.retrieveElement(input);
        
    } */


    
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

export type IGdoSVG = Partial<GdoSVGRef>;