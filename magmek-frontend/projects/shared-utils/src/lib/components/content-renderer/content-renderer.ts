import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, Input, signal, WritableSignal } from '@angular/core';
import { MMContent, MMContentType } from '@shared/models/content';
import { SectionHeader } from '../section-header/section-header';
import { SplitHeader } from '../split-header/split-header';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { range } from 'lodash';


@Component({
    selector: 'mm-content-renderer',
    imports: [
        AccordionModule,
        CommonModule,
        FieldsetModule,
        PanelModule,
        SectionHeader,
        SplitHeader,
    ],
    templateUrl: './content-renderer.html',
    styleUrl: './content-renderer.scss',
})
export class ContentRenderer {

    private _content: MMContent = {type: 'container'};
    private _prevStyleClass: string = '';
    private _init: boolean = false;

    @Input()
    get content(): MMContent {
        return {
            body: this.body(),
            header: this.header(),
            type: this.type(),
            styleClass: this.styleClass(),
            items: this.items(),
        };
    }
    set content(content: MMContent) {
        this.body.set(content.body ?? '');
        this.header.set(content.header ?? '');
        this.type.set(content.type);
        this._prevStyleClass = this.styleClass();
        this.styleClass.set(content.styleClass ?? '');
        this.updateStyleClass();
        this.items.set(content.items ?? []);
    }

    @Input() contentList = signal<MMContent[]>([]);

    body = signal<string>('');
    header = signal<string>('');
    type = signal<MMContentType>('container');
    styleClass = signal<string>('');
    items = signal<MMContent[]>([]);
    itemRange = computed(() => range(0, this.items().length));

    constructor(
        public el: ElementRef,
    ) {
    }

    ngAfterViewInit() {
        this._init = true;
        this.updateStyleClass();
    }

    public updateStyleClass() {
        if (!this._init) return;

        const nativeElement: HTMLElement = this.el.nativeElement;
        const prevClasses = this._prevStyleClass.split(' ');
        const classes = this.styleClass().split(' ');

        prevClasses.forEach(styleClass => {
            if (nativeElement.classList.contains(styleClass)) {
                nativeElement.classList.remove(styleClass);
            }
        });

        classes.forEach(styleClass => {
            if(styleClass) {
                nativeElement.classList.add(styleClass);
            }
        });
    }
}
