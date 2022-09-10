import { TestBed } from '@angular/core/testing';

import { ReconciliationReportService } from './reconciliation-report.service';

describe('ReconciliationReportService', () => {
  let service: ReconciliationReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReconciliationReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
