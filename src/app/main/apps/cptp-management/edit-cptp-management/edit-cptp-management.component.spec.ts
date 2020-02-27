import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCptpManagementComponent } from './edit-cptp-management.component';

describe('EditCptpManagementComponent', () => {
  let component: EditCptpManagementComponent;
  let fixture: ComponentFixture<EditCptpManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCptpManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCptpManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
