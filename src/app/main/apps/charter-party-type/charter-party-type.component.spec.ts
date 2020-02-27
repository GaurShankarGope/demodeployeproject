import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharterPartyTypeComponent } from './charter-party-type.component';

describe('CharterPartyTypeComponent', () => {
  let component: CharterPartyTypeComponent;
  let fixture: ComponentFixture<CharterPartyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharterPartyTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharterPartyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
