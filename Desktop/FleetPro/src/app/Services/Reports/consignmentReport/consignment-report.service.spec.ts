import { TestBed } from '@angular/core/testing';

import { ConsignmentReportService } from './consignment-report.service';

describe('ConsignmentReportService', () => {
  let service: ConsignmentReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsignmentReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
