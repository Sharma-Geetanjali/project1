import { TestBed } from '@angular/core/testing';

import { DealerDashboardService } from './dealer-dashboard.service';

describe('DealerDashboardService', () => {
  let service: DealerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
