import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesDetailComponent } from './clauses-detail.component';

describe('ClausesDetailComponent', () => {
  let component: ClausesDetailComponent;
  let fixture: ComponentFixture<ClausesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClausesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClausesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
