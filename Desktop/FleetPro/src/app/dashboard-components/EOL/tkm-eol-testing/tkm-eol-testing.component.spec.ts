import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TKMEOLTestingComponent } from './tkm-eol-testing.component';

describe('TKMEOLTestingComponent', () => {
  let component: TKMEOLTestingComponent;
  let fixture: ComponentFixture<TKMEOLTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TKMEOLTestingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TKMEOLTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
