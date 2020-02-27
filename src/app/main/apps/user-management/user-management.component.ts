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

// const dummyData = [{
//     'id': '1',
//     'roleName': 'admin'
// }];
export interface UserData {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    mobileno: string;
}
@Component({
    selector: 'user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UserManagementComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role', 'mobileno', 'action'];
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    dataSource: MatTableDataSource<UserData>;

    userManagementForm: FormGroup;
    userManagementUpdateForm: FormGroup;
    loading = false;
    res: any;
    roleListRes: any;
    roleListData: any;
    roleName: string;
    submitted = false;
    addRoleRes: any;
    userListRes: any;
    userListData: any;
    createUserRes: any;
    filterValue: string;
    userRoleId: any;
    tempUserListData =[];    
    status = 'Y';
    deleteRoleRes: any;

    // Update User variables

    updateUserData: any;
    updateUserRes: any;
    userDeleteRoleId: any;

    selectId: any;
    public countries: any[];

    // disabled?: boolean;

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
        // private countryPickerService: CountryPickerService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService,
        
    ) {
        // Set the defaults
        this.filterValue = '';
        this.userListData = [];
        this.roleListData = [];
        this.userRoleId = '';
        this.dataSource = new MatTableDataSource(this.userListData);
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
       
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.userList();
        this.roleList();
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }

    get f() { return this.userManagementForm.controls; }

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

    showDeleteModal(id): void {
        this.userDeleteRoleId = id;
        this.showModalStatus = !this.showModalStatus;
    }
    hideDeleteModal(): void {
        this.showModalStatus = !this.showModalStatus;
    }
    closeEditModal(): void {
        this.showUpdateModalStatus = !this.showUpdateModalStatus;
    }
    
    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            console.log(this.dataSource.filter);
        }
    }

    resetRole() {
        console.log(this.userListData);
        this.filterValue = ''
        this.userList();
    }

    doFilter(value): void {
        this.selectId = value;
        this.userListData = this.tempUserListData.filter((item) => {
            console.log(item,value);
            return item.userRoleId === value;
        });
        console.log(value);
        if (this.roleListRes.success === true) {
            
        }
        this.dataSource = new MatTableDataSource(this.userListData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    //User List
    userList(): void {
        try {
            this._userService.getUserList()
                .pipe(first())
                .subscribe((res) => {
                    this.userListRes = res;
                    if (this.userListRes.success === true) {
                        for (let index = 0; index < this.userListRes.data.length; index++) {
                           if (this.userListRes.data[index].companyId == localStorage.getItem('companyId') && this.userListRes.data[index].userRoleId == '6' || this.userListRes.data[index].userRoleId == '4' || this.userListRes.data[index].userRoleId == '3') {
                            // if()                    {
                                // this.roleListData.push(this.roleListRes.data[index]);
                                     this.userListData.push(this.userListRes.data[index]);
                                                
                            // } 
                           }
                        }
                        this.tempUserListData = this.userListRes.data;
                        console.log(this.userListData);
                        // this.userListData = this.userListRes.data;
                        this.dataSource = new MatTableDataSource(this.userListData);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        console.log(this.dataSource);

                        setTimeout(() =>
                        {
                            console.log(this.userListData);
                            console.log('HERE IN FUNCATOIOPN');
                            this.dataSource = new MatTableDataSource(this.userListData);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                        }, 5000);
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
                        }
                        console.log(this.roleListData);
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

    // Edit User
    editUser(data): void {
        console.log(data);       
        localStorage.setItem('userInfoData', JSON.stringify(data));
        this.router.navigate(['/apps/user-management/edit-user']);
    }


    // Delete Role
    deleteRole(): void {
        const req = {
            id: this.userDeleteRoleId,
            isDelete: 'Y',
        };
        try {
            this.http
                .post(`${config.baseUrl}/removeUser`, req, {})
                .subscribe(
                    res => {
                        console.log(res);
                        this.deleteRoleRes = res;
                        if (this.deleteRoleRes.success === true) {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            
                            setTimeout(() =>
                            {
                                this.userList();
                            }, 2000);
                        } else {
                            this.alertService.error(this.deleteRoleRes.message, 'Error');
                        }
                    },
                    err => {
                        console.log(err);
                        this.alertService.error(err.message, 'Error');
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

export const confirmPasswordValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password2');
    const passwordConfirm = control.parent.get('repassword2');

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