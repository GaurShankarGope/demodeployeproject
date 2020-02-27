import { Injectable } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
 
@Injectable()
export class MyService {
 
  constructor(private _scrollToService: ScrollToService) { }
 
  public triggerScrollTo() {
    
    const config: ScrollToConfigOptions = {
      target: 'destination'
    };
 
    this._scrollToService.scrollTo(config);
  }
}