import { TestBed } from '@angular/core/testing';

import { BuzzListService } from './buzz-list.service';

describe('BuzzListService', () => {
  let service: BuzzListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuzzListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
