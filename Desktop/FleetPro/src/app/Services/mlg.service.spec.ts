import { TestBed } from '@angular/core/testing';

import { MLGService } from './mlg.service';

describe('MLGService', () => {
  let service: MLGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MLGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
