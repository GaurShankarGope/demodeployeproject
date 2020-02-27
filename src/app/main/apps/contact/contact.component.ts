import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AlertService, AuthenticationService } from '../../../../_services';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { UserService } from '../../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';

export interface UserData {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  mobileno: string;
}
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit {


  userListRes :any;
 
  tempUserListData  =[];
  userListData =[];
  constructor(  private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private _userService: UserService,
    private _fuseSidebarService: FuseSidebarService,
    private http: HttpClient,
    private alertService: AlertService,) { }

  ngOnInit() {
    this.userList();
  }

  userList(): void {
    try {
        this._userService.getUserList()
            .pipe(first())
            .subscribe((res) => {
                this.userListRes = res;
                if (this.userListRes.success === true) {
                  this.tempUserListData = this.userListRes.data;
                  for (let index = 0; index < this.tempUserListData.length; index++) {
                  if(this.tempUserListData[index].companyId == localStorage.getItem('companyId')){
                    this.userListData.push(this.userListRes.data[index]);
                  }
                   
                 }

                    
                    
                  
                    console.log(this.userListData);
                }
            },
                err => {
                    console.log(err);
                });

    } catch (err) {
        console.log(err);
    }
}


}
