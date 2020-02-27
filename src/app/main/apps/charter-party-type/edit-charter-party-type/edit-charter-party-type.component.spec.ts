import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharterPartyTypeComponent } from './edit-charter-party-type.component';

describe('EditCharterPartyTypeComponent', () => {
  let component: EditCharterPartyTypeComponent;
  let fixture: ComponentFixture<EditCharterPartyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCharterPartyTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCharterPartyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
