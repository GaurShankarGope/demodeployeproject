import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCharterPartyTypeComponent } from './add-charter-party-type.component';

describe('AddCharterPartyTypeComponent', () => {
  let component: AddCharterPartyTypeComponent;
  let fixture: ComponentFixture<AddCharterPartyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCharterPartyTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCharterPartyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
