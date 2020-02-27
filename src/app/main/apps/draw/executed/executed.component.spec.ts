import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutedComponent } from './executed.component';

describe('ExecutedComponent', () => {
  let component: ExecutedComponent;
  let fixture: ComponentFixture<ExecutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
