import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, afterNextRender } from '@angular/core';

@Component({
    selector: 'gdo-svg',
    standalone: true,
    imports: [],
    templateUrl: './svg.component.html',
    styleUrl: './svg.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgComponent {
    public widthVal: string = '0';
    public heightVal: string = '48';

    public xOffset: number = 0;
    public yOffset: number = 0;

    // public points: string = '10,10 200,10 200,200, 10,200';
    // #region public properties
    
    // #endregion public properties
    
    
    // #region private properties
    
    // #endregion private properties
    
    
    // #region getters/setters
	
    
    get points() {
        return this.pointsList.join(' ');
    }
    
    // #endregion getters/setters
    
    
    // #region standard inputs
    @Input() pointsList: string[] = [
        '0,0',
        '96,0',
        '48,24',
        '0,0'
    ];
    
    // #endregion standard inputs
    
    
    // #region get/set inputs
    
    // #endregion get/set inputs
    
    
    // #region outputs, emitters, and event listeners

    @Output() mousePos: EventEmitter<string> = new EventEmitter();

    /* @HostListener('mousemove',['$event']) updateMouse(event: MouseEvent) {
        this.mousePos.emit(`${event.x - this.xOffset}, ${event.y - this.yOffset}`);
		
    } */
    
    // #endregion outputs, emitters, and event listeners
    
    
    // #region viewchildren and contentchildren
    
    @ViewChild('svgElement') svgElement?: SVGElement;
    
    // #endregion viewchildren and contentchildren
    
    
    // #region constructor and lifecycle hooks
    constructor(
        private el: ElementRef,
        private cd: ChangeDetectorRef
    ) {
        /* afterNextRender(() => {
            if(this.el?.nativeElement) {
                const element: HTMLElement = this.el.nativeElement;
                const rootElement = element.closest('.gdo-menubar-item');
                
                if(rootElement instanceof HTMLElement) {
                    this.widthVal = `${rootElement?.offsetWidth}`;
                    
                    this.cd.detectChanges();
                }
                
    
            }

        }); */
    }
    
    // #endregion constructor and lifecycle hooks
    
    
    // #region public methods
    
    // #endregion public methods
    
    
    // #region protected methods
    
    // #endregion protected methods
    
    
    // #region private methods
    
    // #endregion private methods
    
    
}
