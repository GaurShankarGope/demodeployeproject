import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCptpManagementComponent } from './add-cptp-management.component';

describe('AddCptpManagementComponent', () => {
  let component: AddCptpManagementComponent;
  let fixture: ComponentFixture<AddCptpManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCptpManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCptpManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
