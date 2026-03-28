import { Component, Input, signal, ViewChild } from '@angular/core';
import createPanZoom, { PanZoom, PanZoomOptions } from 'panzoom';

@Component({
    selector: 'ag-map-renderer',
    imports: [],
    templateUrl: './map-renderer.html',
    styleUrl: './map-renderer.scss',
})
export class MapRenderer {

    public panzoom?: PanZoom;

    @Input() panZoomCfg = signal<PanZoomOptions>({});

    @Input() mapSrc = signal<string>('');

    @ViewChild('map') mapElement!: HTMLDivElement;

    ngAfterViewInit() {
        this.panzoom = createPanZoom(this.mapElement, this.panZoomCfg());

    }
}
