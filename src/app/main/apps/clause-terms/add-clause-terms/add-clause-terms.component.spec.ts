import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClauseTermsComponent } from './add-clause-terms.component';

describe('AddClauseTermsComponent', () => {
  let component: AddClauseTermsComponent;
  let fixture: ComponentFixture<AddClauseTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClauseTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClauseTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
