import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePluggedInComponent } from './device-plugged-in.component';

describe('DevicePluggedInComponent', () => {
  let component: DevicePluggedInComponent;
  let fixture: ComponentFixture<DevicePluggedInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicePluggedInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePluggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
