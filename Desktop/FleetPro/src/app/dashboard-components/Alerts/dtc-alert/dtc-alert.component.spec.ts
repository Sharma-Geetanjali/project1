import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTCAlertComponent } from './dtc-alert.component';

describe('DTCAlertComponent', () => {
  let component: DTCAlertComponent;
  let fixture: ComponentFixture<DTCAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DTCAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DTCAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
