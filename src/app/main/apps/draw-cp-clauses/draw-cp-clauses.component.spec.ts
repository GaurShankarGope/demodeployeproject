import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawCpClausesComponent } from './draw-cp-clauses.component';

describe('DrawCpClausesComponent', () => {
  let component: DrawCpClausesComponent;
  let fixture: ComponentFixture<DrawCpClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawCpClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawCpClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
