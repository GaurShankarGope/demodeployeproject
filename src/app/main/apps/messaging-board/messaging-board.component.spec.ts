import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingBoardComponent } from './messaging-board.component';

describe('MessagingBoardComponent', () => {
  let component: MessagingBoardComponent;
  let fixture: ComponentFixture<MessagingBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagingBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
