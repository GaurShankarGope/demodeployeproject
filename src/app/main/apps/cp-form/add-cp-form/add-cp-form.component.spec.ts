import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCpFormComponent } from './add-cp-form.component';

describe('AddCpFormComponent', () => {
  let component: AddCpFormComponent;
  let fixture: ComponentFixture<AddCpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCpFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
