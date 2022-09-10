import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConsignorComponent } from './create-consignor.component';

describe('CreateConsignorComponent', () => {
  let component: CreateConsignorComponent;
  let fixture: ComponentFixture<CreateConsignorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConsignorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConsignorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
