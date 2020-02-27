import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPlatformManagementComponent } from './trading-platform-management.component';

describe('TradingPlatformManagementComponent', () => {
  let component: TradingPlatformManagementComponent;
  let fixture: ComponentFixture<TradingPlatformManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingPlatformManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingPlatformManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
