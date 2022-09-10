import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsigneeComponent } from './edit-consignee.component';

describe('EditConsigneeComponent', () => {
  let component: EditConsigneeComponent;
  let fixture: ComponentFixture<EditConsigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConsigneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
