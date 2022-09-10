import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentGroupComponent } from './department-group.component';

describe('DepartmentGroupComponent', () => {
  let component: DepartmentGroupComponent;
  let fixture: ComponentFixture<DepartmentGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
