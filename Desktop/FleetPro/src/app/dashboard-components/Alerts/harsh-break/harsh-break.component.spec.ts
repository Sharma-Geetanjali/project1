import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarshBreakComponent } from './harsh-break.component';

describe('HarshBreakComponent', () => {
  let component: HarshBreakComponent;
  let fixture: ComponentFixture<HarshBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarshBreakComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarshBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
