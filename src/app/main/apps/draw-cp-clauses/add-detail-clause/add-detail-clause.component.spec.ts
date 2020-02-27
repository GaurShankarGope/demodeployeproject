import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailClauseComponent } from './add-detail-clause.component';

describe('AddDetailClauseComponent', () => {
  let component: AddDetailClauseComponent;
  let fixture: ComponentFixture<AddDetailClauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDetailClauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDetailClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
