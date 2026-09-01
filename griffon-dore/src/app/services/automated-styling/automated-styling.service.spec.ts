import { TestBed } from '@angular/core/testing';

import { AutomatedStylingService } from './automated-styling.service';

describe('AutomatedStylingService', () => {
  let service: AutomatedStylingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomatedStylingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
