import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseCategoryTermsComponent } from './clause-category-terms.component';

describe('ClauseCategoryTermsComponent', () => {
  let component: ClauseCategoryTermsComponent;
  let fixture: ComponentFixture<ClauseCategoryTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClauseCategoryTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClauseCategoryTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
