import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseCategoryComponent } from './clause-category.component';

describe('ClauseCategoryComponent', () => {
  let component: ClauseCategoryComponent;
  let fixture: ComponentFixture<ClauseCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClauseCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClauseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
