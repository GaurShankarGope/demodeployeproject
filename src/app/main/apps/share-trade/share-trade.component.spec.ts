import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTradeComponent } from './share-trade.component';

describe('ShareTradeComponent', () => {
  let component: ShareTradeComponent;
  let fixture: ComponentFixture<ShareTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
