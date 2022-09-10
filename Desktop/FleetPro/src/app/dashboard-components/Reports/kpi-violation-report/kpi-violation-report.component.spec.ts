import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiViolationReportComponent } from './kpi-violation-report.component';

describe('KpiViolationReportComponent', () => {
  let component: KpiViolationReportComponent;
  let fixture: ComponentFixture<KpiViolationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiViolationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiViolationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
