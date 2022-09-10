import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EolReportComponent } from './eol-report.component';

describe('EolReportComponent', () => {
  let component: EolReportComponent;
  let fixture: ComponentFixture<EolReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EolReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EolReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
