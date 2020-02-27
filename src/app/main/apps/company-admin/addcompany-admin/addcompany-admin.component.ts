
import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AlertService, AuthenticationService } from '../../../../_services';
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

const dummyData = [{
    'id': '1',
    'roleName': 'admin'
}];
export interface UserData {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    mobileno: string;
}
@Component({
    selector: 'addcompany-admin',
    templateUrl: './addcompany-admin.component.html',
    styleUrls: ['./addcompany-admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AddCompanyAdminComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role', 'mobileno', 'action'];
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    dataSource: MatTableDataSource<UserData>;

    addChartererForm: FormGroup;
    userManagementUpdateForm: FormGroup;
    loading = false;
    username: string;   
    res: any;
    roleListRes: any;
    roleListData: any;
    roleName: string;
    mobileNo: string;
    submitted = false;
    password: string;
    repassword: string;
     firstName: string;
     lastName: string;
    companyName: any;
    businessPhone: string;
    userRole: string;
    email: string;
    userLocation: string;
    
    addRoleRes: any;
    userListRes: any;
    userListData: any;
    createUserRes: any;
    filterValue: string;
    userRoleId: any;
    tempUserListData: any;
    address: string;
    returnUrl: string;
    status = 'Y';
    deleteRoleRes: any;

    roleAccessListData: any;
    roleAccessListRes: any;

    updateUserData: any;
    
    updateUserRes: any;
    companyData: any;
    companyListRes: any;
    companyListData: any;

    alert:any;
    alertSettings: any;
    documents: any;
    signature: any;
    eSignature: any;
    onlySend: any;
    forwardAlerts: any;
    companyRol:any;


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
        this.companyRol = localStorage.getItem('selectedRoleName');
        // Set the defaults
        this.filterValue = '';
        this.userListData = [];
        this.roleListData = [];
        this.userRoleId = '2';
        this.dataSource = new MatTableDataSource(this.userListData);
        this._unsubscribeAll = new Subject();
        this.companyListData = [];
        this.roleAccessListData = [];
        this.alert = [];
        this.alertSettings = [];
        this.documents = [];
        this.signature = [];
        this.eSignature = [];
       // this.onlySend  = [];
        this.forwardAlerts = []; 

        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }
    }


    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
      }
      
      
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        
        this.addChartererForm = this._formBuilder.group({
            username: ['',  [ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            email: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$")]],
            password: ['', Validators.required],
            repassword: ['', [Validators.required, confirmPasswordValidator]],
            companyName: ['',  [ Validators.required, Validators.pattern("[a-zA-Z0-9._&][ a-zA-Z0-9._&]+")]],
            address: ['',  [ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            businessPhone: ['', Validators.required],
            firstName: ['', [ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            lastName: ['',  [ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            mobileNo: ['', Validators.required],
            userRoleId: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/master/company-admin';
        this.addChartererForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.addChartererForm.get('repassword').updateValueAndValidity();
            });


        
       
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        
        this.roleList();
        this.companyList();
        this.roleAccessList(); 
    }


    
    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }

    get f() { return this.addChartererForm.controls; }
    // get f2() { return this.userManagementUpdateForm.controls; }

    onSubmit(): void {
       // console.log('add user');
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        console.log(this.addChartererForm)
        // stop here if form is invalid
        if (this.addChartererForm.invalid) {
            console.log('add user invalid');
            return;
        } else {
            console.log('add');
            const req = {      
            
            "username": this.f.username.value,
            "companyId" : this.companyName,
            "businessPhone" : this.f.businessPhone.value,             
            "userRoleId": this.userRoleId,
            "mobileNo" : this.f.mobileNo.value,
            "email" : this.f.email.value,
            "password" : this.f.password.value,    
            "address" : this.f.address.value,  
            "data" : this.alert,
            "firstName" : this.f.firstName.value,
            "lastName" : this.f.lastName.value,
                       
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
                this.http.post(`${config.baseUrl}/companyadmincreate`, req, headerOptions).subscribe(
                    res => {
                        console.log(res);
                        this.createUserRes = res;
                        if (this.createUserRes.success === true) {
                            this.alertService.success(this.createUserRes.message, 'Success');
                            // this.userList();
                            this.userRoleId = '';
                            this.addChartererForm.reset();
                            this.router.navigate([this.returnUrl]);
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

    
    //Checkbox Role List
    roleAccessList(): void {
        try {
            this.http.get(`${config.baseUrl}/BrokerManegeAlerlist`).subscribe(
                res => {
                    console.log(res);
                    this.roleAccessListRes = res;
                    if (this.roleAccessListRes.success === true) {
                        this.roleAccessListData = this.roleAccessListRes.data;
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

    

    // Role List
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
                res => {
                    console.log(res);
                    this.roleListRes = res;
                    if (this.roleListRes.success) {
                        this.roleListData = this.roleListRes.data;
                        for(let roleName1 of this.roleListData) {
                            if(roleName1.id === 2)  {
                                this.companyRol = roleName1.roleName;
                                //console.log("rol", this.companyRol);
                            }
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

    

    changeRole(event): void {
        console.log(event.target.value);
        this.userRoleId = event.target.value;
    }


    changeSelectAccessPush(event,item, categoryName  ){
        // for (const item of this.roleAccessListData) {
        const obj = {Id:item.id, parentId: item.parentId};
        this.alert.push(obj);
        console.log(this.alert);        
    }


    public selectedRoleList = [];
    public innerSelectData = [];
    changeSelectAccess(event, data): void {
        const checked = event.checked;
        console.log(event);
        console.log(data);
        for (let selectitem of this.roleAccessListData) {
            if (selectitem === data) {
                if (selectitem.selected === true) {
                    selectitem.selected = checked;
                    // this.selectedRoleList.push(selectitem);
                    for (let innerLoop of selectitem.alertdata) {
                        innerLoop.selected = true;
                    }
                } else {
                    var index = this.selectedRoleList.indexOf(selectitem);
                    this.selectedRoleList.splice(index, 1);
                    for (let innerLoop of selectitem.alertdata) {
                        innerLoop.selected = false;
                    }
                }

            } else {
                for (let innerList of selectitem.alertdata) {
                    // selectitem.selected = false;
                    if (selectitem.id === innerList.parentId) {
                        if (selectitem.selected === true) {
                            selectitem.selected = false;
                            var index = this.selectedRoleList.indexOf(selectitem);
                            this.selectedRoleList.splice(index, 1);

                        } else {
                            console.log('inner');
                            if (data.parentId === innerList.parentId && data.categoryName === innerList.categoryName) {
                                if (event.checked === true) {
                                    console.log('inner check');
                                    innerList.selected = checked;
                                    // this.innerSelectData.push(data);
                                } else {
                                    console.log('inner uncheck');
                                    innerList.selected = checked;
                                    var index = this.innerSelectData.indexOf(innerList);
                                    this.innerSelectData.splice(index, 1);
                                }
                            }

                        }
                    }

                }
            }
        }
      
        console.log('all', this.roleAccessListData)
        // console.log('inner', this.innerSelectData)

    
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

