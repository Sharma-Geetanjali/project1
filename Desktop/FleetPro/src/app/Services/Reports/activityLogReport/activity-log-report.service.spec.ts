import { TestBed } from '@angular/core/testing';

import { ActivityLogReportService } from './activity-log-report.service';

describe('ActivityLogReportService', () => {
  let service: ActivityLogReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityLogReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
