import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpFormManagementComponent } from './cptp-form-management.component';

describe('CptpFormManagementComponent', () => {
  let component: CptpFormManagementComponent;
  let fixture: ComponentFixture<CptpFormManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpFormManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpFormManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
