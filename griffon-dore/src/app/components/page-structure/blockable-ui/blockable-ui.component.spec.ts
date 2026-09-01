import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockableUiComponent } from './blockable-ui.component';

describe('BlockableUiComponent', () => {
    let component: BlockableUiComponent;
    let fixture: ComponentFixture<BlockableUiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlockableUiComponent]
        })
            .compileComponents();
    
        fixture = TestBed.createComponent(BlockableUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
