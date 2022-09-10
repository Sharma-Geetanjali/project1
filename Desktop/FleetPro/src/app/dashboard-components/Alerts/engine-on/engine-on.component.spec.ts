import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineOnComponent } from './engine-on.component';

describe('EngineOnComponent', () => {
  let component: EngineOnComponent;
  let fixture: ComponentFixture<EngineOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineOnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
