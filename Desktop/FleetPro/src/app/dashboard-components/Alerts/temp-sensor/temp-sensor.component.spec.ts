import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempSensorComponent } from './temp-sensor.component';

describe('TempSensorComponent', () => {
  let component: TempSensorComponent;
  let fixture: ComponentFixture<TempSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempSensorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TempSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
