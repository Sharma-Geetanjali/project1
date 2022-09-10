import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineOffComponent } from './engine-off.component';

describe('EngineOffComponent', () => {
  let component: EngineOffComponent;
  let fixture: ComponentFixture<EngineOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineOffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
