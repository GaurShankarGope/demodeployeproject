import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClauseCategoryComponent } from './edit-clause-category.component';

describe('EditClauseCategoryComponent', () => {
  let component: EditClauseCategoryComponent;
  let fixture: ComponentFixture<EditClauseCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClauseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClauseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
