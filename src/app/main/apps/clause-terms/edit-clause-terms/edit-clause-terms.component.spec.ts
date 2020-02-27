import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClauseTermsComponent } from './edit-clause-terms.component';

describe('EditClauseTermsComponent', () => {
  let component: EditClauseTermsComponent;
  let fixture: ComponentFixture<EditClauseTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClauseTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClauseTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
