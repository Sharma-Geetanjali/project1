import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesMapComponent } from './vehicles-map.component';

describe('VehiclesMapComponent', () => {
  let component: VehiclesMapComponent;
  let fixture: ComponentFixture<VehiclesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclesMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
