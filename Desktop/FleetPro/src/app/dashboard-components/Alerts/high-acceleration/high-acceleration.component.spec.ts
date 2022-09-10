import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighAccelerationComponent } from './high-acceleration.component';

describe('HighAccelerationComponent', () => {
  let component: HighAccelerationComponent;
  let fixture: ComponentFixture<HighAccelerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighAccelerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighAccelerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
