import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeComponent } from './consignee.component';

describe('ConsigneeComponent', () => {
  let component: ConsigneeComponent;
  let fixture: ComponentFixture<ConsigneeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsigneeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
