import { TestBed } from '@angular/core/testing';

import { ServiceDashboardService } from './service-dashboard.service';

describe('ServiceDashboardService', () => {
  let service: ServiceDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
