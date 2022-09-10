import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingReportComponent } from './tracking-report.component';

describe('TrackingReportComponent', () => {
  let component: TrackingReportComponent;
  let fixture: ComponentFixture<TrackingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
