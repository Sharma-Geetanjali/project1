import { TestBed } from '@angular/core/testing';

import { EolReportService } from './eol-report.service';

describe('EolReportService', () => {
  let service: EolReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EolReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
