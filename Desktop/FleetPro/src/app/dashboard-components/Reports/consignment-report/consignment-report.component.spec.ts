import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentReportComponent } from './consignment-report.component';

describe('ConsignmentReportComponent', () => {
  let component: ConsignmentReportComponent;
  let fixture: ComponentFixture<ConsignmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
