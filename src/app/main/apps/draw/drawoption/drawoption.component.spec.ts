import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawoptionComponent } from './drawoption.component';

describe('DrawoptionComponent', () => {
  let component: DrawoptionComponent;
  let fixture: ComponentFixture<DrawoptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawoptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
