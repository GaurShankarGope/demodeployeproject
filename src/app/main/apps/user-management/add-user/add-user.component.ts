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

declare var $: any;
export interface UserData {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    mobileno: string;
}
@Component({
    selector: 'add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AddUserComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    dataSource: MatTableDataSource<UserData>;
    userManagementForm: FormGroup;
    userManagementUpdateForm: FormGroup;
    loading = false;
    username: string;
    res: any;
    roleListRes: any;
    roleListData: any;
    mobileNo: string;
    submitted = false;
    password: string;
    repassword: string;
    confirmPaassword: string;
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    addRoleRes: any;
    userListRes: any;
    userListData: any;
    createUserRes: any;
    filterValue: string;
    userRoleId: any;
    tempUserListData: any;
    enterlocation: string;
    returnUrl: string;
    status = 'Y';
    deleteRoleRes: any;

    companyListData: any;
    companyListRes: any;

    // Update User variables

    updateUserData: any;
    updateUserRes: any;


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
        this.filterValue = '';
        this.userListData = [];
        this.roleListData = [];
        this.userRoleId = '';
        this.companyListData = [];
        this.dataSource = new MatTableDataSource(this.userListData);
        this._unsubscribeAll = new Subject();

        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }

        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.userManagementForm = this._formBuilder.group({
            username: ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
            password: ['', Validators.required],
            repassword: ['', [Validators.required, confirmPasswordValidator]],
            // companyName:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
            enterlocation:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
            firstName:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
            lastName:  ['',[ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")] ],
            mobileNo: ['',[Validators.required, Validators.pattern("[0-9]+") ] ],
            email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9]+.[a-z]{2,4}$")]], 
            whatsappId: new FormControl('',[Validators.required, Validators.pattern("[0-9]+") ]),
            skypeId:new FormControl('',[Validators.required]),
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/user-management';
        this.userManagementForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.userManagementForm.get('repassword').updateValueAndValidity();
            });

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.userList();
        this.roleList();
        this.companyList(); 
        $("#phoneField").CcPicker();

    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }

    get f() { return this.userManagementForm.controls; }
    // get f2() { return this.userManagementUpdateForm.controls; }




    
    onSubmit(): void {
        console.log('add user');
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        
        console.log(this.userManagementForm.invalid);
        console.log(this.userManagementForm);

        // stop here if form is invalid
        if (this.userManagementForm.invalid) {
            console.log('add user invalid');
            return;
        } else {
            console.log('add');
            const req = {
                companyId: localStorage.getItem('companyId'),
                userRoleId: this.userRoleId,
                firstName: this.f.firstName.value,
                lastName: this.f.lastName.value,
                username: this.f.username.value,
                mobileNo: this.f.mobileNo.value,
                password: this.f.password.value,
                email: this.f.email.value,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                address: this.f.enterlocation.value,
                whatsappId:this.f.whatsappId.value,
                skypeId:this.f.skypeId.value
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
                this.http.post(`${config.baseUrl}/createUser`, req, headerOptions).subscribe(
                    res => {
                        this.router.navigate([this.returnUrl]);

                        console.log(res);
                        this.createUserRes = res;
                        if (this.createUserRes.success === true) {
                            this.alertService.success(this.createUserRes.message, 'Success');
                            this.userList();
                            this.userRoleId = '';
                            this.userManagementForm.reset();
                        } else {
                            this.alertService.error(this.createUserRes.message, 'Error');
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    showModal(): void {
        this.showModalStatus = !this.showModalStatus;
        // console.log(this.showModalStatus);
    }
    
    closeEditModal(): void {
        this.showUpdateModalStatus = !this.showUpdateModalStatus;
    }
    applyFilter(filterValue: string): void {
        this.userListData.filter = filterValue.toLowerCase();
        if (this.userListData.paginator) {
            this.userListData.paginator.firstPage();
        }
    }

    doFilter(value): void {

        this.userListData = this.tempUserListData.filter((item) => {
            return item.userRoleId === value;
        });
        console.log(this.userListData);
        this.dataSource = new MatTableDataSource(this.userListData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

   
    // User List
    userList(): void {
        try {
            this._userService.getstateList()
                .pipe(first())
                .subscribe((res) => {
                    this.userListRes = res;
                    if (this.userListRes.success === true) {
                        this.tempUserListData = this.userListRes.data;
                        this.userListData = this.userListRes.data;
                        this.dataSource = new MatTableDataSource(this.userListData);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                },
                    err => {
                        console.log(err);
                    });

        } catch (err) {
            console.log(err);
        }
    }

    // Role List
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
                res => {
                    console.log(res);
                    this.roleListRes = res;
                    if (this.roleListRes.success) {
                        for (let index = 0; index < this.roleListRes.data.length; index++) {
                            if(this.roleListRes.data[index].id == '6' || this.roleListRes.data[index].id == '4' || this.roleListRes.data[index].id == '3')                    {
                                this.roleListData.push(this.roleListRes.data[index]);

                            }   
                            console.log(this.roleListData,"data");
                        }
                    }
                },
                err => {
                    console.log(err);
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

     //companylist
     companyList(): void {
        try {
            this.http.get(`${config.baseUrl}/companylist`, {}).subscribe(
                res => {
                   // console.log(res);
                    this.companyListRes = res;
                    if (this.companyListRes.success) {
                        this.companyListData = this.companyListRes.data;
                    }
                },
            err => {
                console.log(err);
            });
            
        } catch (err) {
            console.log(err);
        }
    }

    changecompany(event): void {
        this.companyName = event.target.value;
        console.log(this.companyName);
    }

    changeRole(event): void {
        console.log(event.target.value);
        this.userRoleId = event.target.value;
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      }
}


/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('repassword');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};
