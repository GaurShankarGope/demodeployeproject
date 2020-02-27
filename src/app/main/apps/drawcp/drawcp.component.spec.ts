import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawcpComponent } from './drawcp.component';

describe('DrawcpComponent', () => {
  let component: DrawcpComponent;
  let fixture: ComponentFixture<DrawcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawcpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
