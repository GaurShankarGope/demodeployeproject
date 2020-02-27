import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCpFormComponent } from './edit-cp-form.component';

describe('EditCpFormComponent', () => {
  let component: EditCpFormComponent;
  let fixture: ComponentFixture<EditCpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCpFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
