import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverSpeedingComponent } from './over-speeding.component';

describe('OverSpeedingComponent', () => {
  let component: OverSpeedingComponent;
  let fixture: ComponentFixture<OverSpeedingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverSpeedingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverSpeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
