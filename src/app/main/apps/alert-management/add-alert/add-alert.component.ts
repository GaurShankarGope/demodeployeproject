import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
export interface UserData {
    id: string;
    // username: string;
    name: string;
    mobileno: string;
    email: string;
    company: string;
   
}

const dummyData = [
    {
        'id': '1',
        'moduleName': 'Alert',
    },
    {
        'id': '2',
        'moduleName': 'Documents Validation Alert',
    },
    {
        'id': '2',
        'actionName': 'Update',
    },
    {
        'id': '3',
        'actionName': 'List',
    },
    {
        'id': '4',
        'actionName': 'View',
    },
    {
        'id': '5',
        'actionName': 'Active/Inactive',
    },
    {
        'id': '6',
        'actionName': 'Delete',
    },
    {
        'id': '7',
        'actionName': 'Import',
    },
    {
        'id': '8',
        'actionName': 'Export',
    },
    
]

@Component({
    selector: 'add-alert',
    templateUrl: './add-alert.component.html',
    styleUrls: ['./add-alert.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AddAlertComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'name', 'mobileno', 'email', 'company', 'action'];
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    dataSource: MatTableDataSource<UserData>;

    roleListRes: any;
    roleListData: any;
    roleName: string;
    mobileNo: string;
    password: string;
    confirmPaassword: string;
    firstName: string;
    lastName: string;
    companyName: string;
    businessPhone: string;
    userRole: string;
    email: string;
    userLocation: string;
    addRoleRes: any;
    userListRes: any;
    userListData: any;
    createUserRes: any;


    filterValue: string;
    // Private

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        // private _contactsService: ContactsService,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private router: Router
    ) {
        // Set the defaults
        this.filterValue = '';
        this.userListData = dummyData;
        this.roleListData = [];
        this.dataSource = new MatTableDataSource(this.userListData);

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
        this.userListData.paginator = this.paginator;
        this.userListData.sort = this.sort;
        
        this.userList();
        this.roleList();
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
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

    applyFilter(filterValue: string): void {
        this.userListData.filter = filterValue.toLowerCase();
        if (this.userListData.paginator) {
            this.userListData.paginator.firstPage();
        }
    }
    doFilter(value: string): void {
        console.log(this.filterValue);
        console.log(value);
        this.dataSource.filter = value.trim().toLowerCase();
    }
    addRole(): void {
        const req = {
            // username: this.roleName,
            mobileno: this.mobileNo,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            companyName: this.companyName,
            businessPhone: this.businessPhone,
            userRole: this.userRole,
            email: this.email,
            userLocation: this.userLocation
        };
        console.log(req);
        try {
            this.http.post(`${config.baseUrl}/createUser`, req, {}).subscribe(
                res => {
                    console.log(res);
                    this.createUserRes = res;
                    if (this.createUserRes.success) {
                        this.createUserRes = this.createUserRes.data;
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

    userList(): void {
        try {
            this._userService.getUserList()
            .pipe(first())
            .subscribe((res) => {
                this.userListRes = res;
                if (this.userListRes.success === true) {
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
    
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
                res => {
                    console.log(res);
                    this.roleListRes = res;
                    if (this.roleListRes.success) {
                        this.roleListData = this.roleListRes.data;
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
}
