import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineIdlingComponent } from './engine-idling.component';

describe('EngineIdlingComponent', () => {
  let component: EngineIdlingComponent;
  let fixture: ComponentFixture<EngineIdlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineIdlingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineIdlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
