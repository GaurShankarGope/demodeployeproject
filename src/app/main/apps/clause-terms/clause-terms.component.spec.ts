import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseTermsComponent } from './clause-terms.component';

describe('ClauseTermsComponent', () => {
  let component: ClauseTermsComponent;
  let fixture: ComponentFixture<ClauseTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClauseTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClauseTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
