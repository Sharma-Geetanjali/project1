import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TKMEOLReportComponent } from './tkm-eol-report.component';

describe('TKMEOLReportComponent', () => {
  let component: TKMEOLReportComponent;
  let fixture: ComponentFixture<TKMEOLReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TKMEOLReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TKMEOLReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
