import { TestBed } from '@angular/core/testing';

import { DailyRunningService } from './daily-running.service';

describe('DailyRunningService', () => {
  let service: DailyRunningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyRunningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
