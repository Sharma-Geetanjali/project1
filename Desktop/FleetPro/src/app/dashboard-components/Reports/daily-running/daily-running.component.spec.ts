import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRunningComponent } from './daily-running.component';

describe('DailyRunningComponent', () => {
  let component: DailyRunningComponent;
  let fixture: ComponentFixture<DailyRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyRunningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
