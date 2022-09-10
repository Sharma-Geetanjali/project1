import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogReportComponent } from './activity-log-report.component';

describe('ActivityLogReportComponent', () => {
  let component: ActivityLogReportComponent;
  let fixture: ComponentFixture<ActivityLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityLogReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
