import { TestBed } from '@angular/core/testing';

import { CommodityReportService } from './commodity-report.service';

describe('CommodityReportService', () => {
  let service: CommodityReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommodityReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
