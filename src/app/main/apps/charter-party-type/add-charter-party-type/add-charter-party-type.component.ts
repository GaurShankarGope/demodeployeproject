import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';

export interface UserData {
  id: string;
  name: string;
 
}
@Component({
  selector: 'app-add-charter-party-type',
  templateUrl: './add-charter-party-type.component.html',
  styleUrls: ['./add-charter-party-type.component.scss']
})
export class AddCharterPartyTypeComponent implements OnInit {

  name:String;
  typeManagementForm: FormGroup;
  loading = false;
  submitted = false;
  createtypeRes :any;
  returnUrl: string;



// Private
private _unsubscribeAll: Subject<any>;
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;


/**
 * Constructor
 *
 * @param {ContactsService} _contactsService
 * @param {FuseSidebarService} _fuseSidebarService
 * @param {FormBuilder} _formBuilder
 * @param {MatDialog} _matDialog
 */
constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private _userService: UserService,
    private _fuseSidebarService: FuseSidebarService,
    private http: HttpClient,
    private alertService: AlertService
) {
    // Set the defaults
   
    this._unsubscribeAll = new Subject();

    // let userToken = localStorage.getItem('userToken')
    // if(userToken==undefined){
    //     this.router.navigate(['/']);
    // }

    
}
  ngOnInit() {
    this.typeManagementForm = this._formBuilder.group({
      name: ['', Validators.required],
     
  });
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/charter-type-management';
  }
  get f() { return this.typeManagementForm.controls; }



  onSubmit(): void {
    console.log('add user');
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.typeManagementForm.invalid) {
        console.log('add user invalid');
        return;
    } else {
        console.log('add');
        const req = {
      
            name: this.f.name.value,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            
        };
        console.log(req);

        this.loading = true;
        try {
            console.log('sadd')
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = {
                headers: header
            }
            this.http.post(`${config.baseUrl}/charterpartytypecreate`, req, headerOptions).subscribe(
                res => {
                    console.log(res);
                    this.createtypeRes = res;
                    if (this.createtypeRes.success === true) {
                        this.alertService.success(this.createtypeRes.message, 'Success');
                  
                    
                        this.typeManagementForm.reset();
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.alertService.error(this.createtypeRes.message, 'Error');
                    }
                },
                err => {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                }
            );
        } catch (err) {
            console.log(err);
        }
    }
}

}
