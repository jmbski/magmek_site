import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementRendererComponent } from './element-renderer.component';

describe('ElementComponent', () => {
    let component: ElementRendererComponent;
    let fixture: ComponentFixture<ElementRendererComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ElementRendererComponent]
        })
            .compileComponents();
    
        fixture = TestBed.createComponent(ElementRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
