import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityReportComponent } from './commodity-report.component';

describe('CommodityReportComponent', () => {
  let component: CommodityReportComponent;
  let fixture: ComponentFixture<CommodityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommodityReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
