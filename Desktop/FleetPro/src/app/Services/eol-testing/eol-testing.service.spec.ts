import { TestBed } from '@angular/core/testing';

import { EolTestingService } from './eol-testing.service';

describe('EolTestingService', () => {
  let service: EolTestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EolTestingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
