import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolentTempComponent } from './coolent-temp.component';

describe('CoolentTempComponent', () => {
  let component: CoolentTempComponent;
  let fixture: ComponentFixture<CoolentTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoolentTempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolentTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
