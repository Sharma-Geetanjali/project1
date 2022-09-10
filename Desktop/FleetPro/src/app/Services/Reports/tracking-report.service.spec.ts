import { TestBed } from '@angular/core/testing';

import { TrackingReportService } from './tracking-report.service';

describe('TrackingReportService', () => {
  let service: TrackingReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
