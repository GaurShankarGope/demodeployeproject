import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClauseCategoryComponent } from './add-clause-category.component';

describe('AddClauseCategoryComponent', () => {
  let component: AddClauseCategoryComponent;
  let fixture: ComponentFixture<AddClauseCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClauseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClauseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
