import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpManagementComponent } from './cptp-management.component';

describe('CptpManagementComponent', () => {
  let component: CptpManagementComponent;
  let fixture: ComponentFixture<CptpManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
