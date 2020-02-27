import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermManagementComponent } from './term-management.component';

describe('TermManagementComponent', () => {
  let component: TermManagementComponent;
  let fixture: ComponentFixture<TermManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
