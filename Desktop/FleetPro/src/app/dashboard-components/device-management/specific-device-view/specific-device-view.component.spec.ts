import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificDeviceViewComponent } from './specific-device-view.component';

describe('SpecificDeviceViewComponent', () => {
  let component: SpecificDeviceViewComponent;
  let fixture: ComponentFixture<SpecificDeviceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecificDeviceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificDeviceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
