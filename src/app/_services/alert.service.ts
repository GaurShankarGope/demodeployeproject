import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: 'root' })
export class AlertService {
    // private subject = new Subject<any>();
    // private keepAfterRouteChange = false;

    constructor(private router: Router, private toastr: ToastrService) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        // this.router.events.subscribe(event => {
        //    // console.log(event)
        //     if (event instanceof NavigationStart) {
        //         if (this.keepAfterRouteChange) {
        //        // console.log(this.keepAfterRouteChange)
        //             // only keep for a single route change
        //             this.keepAfterRouteChange = false;
        //         } else {
        //             // clear alert message
        //             this.clear();
        //         }
        //     }
        // });
    }

    // getAlert(): Observable<any> {
    //     return this.subject.asObservable();
    // }

    success(message: string, title: string) {
        // this.keepAfterRouteChange = keepAfterRouteChange;
        // this.subject.next({ type: 'success', text: message });
        this.toastr.success(message, title);
    }

    error(message: string, title: string) {
       // console.log(message);
        this.toastr.error(message, title);
        // this.keepAfterRouteChange = keepAfterRouteChange;
        // this.subject.next({ type: 'error', text: message });
    }

    info(message: string, title: string) {
       // console.log(message);
        this.toastr.info(message, title);
        // this.keepAfterRouteChange = keepAfterRouteChange;
        // this.subject.next({ type: 'error', text: message });
    }
    clear() {
        // clear by calling subject.next() without parameters
        // this.subject.next();
    }
}