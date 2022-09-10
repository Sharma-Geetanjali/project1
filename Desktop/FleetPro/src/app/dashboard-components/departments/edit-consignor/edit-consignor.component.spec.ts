import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsignorComponent } from './edit-consignor.component';

describe('EditConsignorComponent', () => {
  let component: EditConsignorComponent;
  let fixture: ComponentFixture<EditConsignorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConsignorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsignorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
