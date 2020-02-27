import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawFirstCounterManagementComponent } from './draw-first-counter-management.component';

describe('DrawFirstCounterManagementComponent', () => {
  let component: DrawFirstCounterManagementComponent;
  let fixture: ComponentFixture<DrawFirstCounterManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawFirstCounterManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawFirstCounterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
