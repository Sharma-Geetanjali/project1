import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsMainComponent } from './alerts-main.component';

describe('AlertsMainComponent', () => {
  let component: AlertsMainComponent;
  let fixture: ComponentFixture<AlertsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
