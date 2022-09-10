import { TestBed } from '@angular/core/testing';

import { ConsignmentsService } from './consignments.service';

describe('ConsignmentsService', () => {
  let service: ConsignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
