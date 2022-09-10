import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EolTestingComponent } from './eol-testing.component';

describe('EolTestingComponent', () => {
  let component: EolTestingComponent;
  let fixture: ComponentFixture<EolTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EolTestingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EolTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
