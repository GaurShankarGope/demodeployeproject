import {
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    ViewChild
} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from '../../../_services';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { config } from '../../../config/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../_services/user.service';
export interface UserData {
    id: string;
    name: string;
    status: string;
}


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'role-management',
    templateUrl: './role-management.component.html',
    styleUrls: ['./role-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RoleManagementComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'status', 'active/inactive', 'action'];
    dataSource: MatTableDataSource<UserData>;
    roleForm: FormGroup;
    roleUpdateForm: FormGroup;
    roleName: string;
    roleNameadd: string;
    roleId: any;
    showModalStatus = false;
    editshowModalStatus: boolean;
    status = 'Y';
    userDeleteRoleId: any;
    addRoleRes: any;
    showModaldeleteStatus = false;

    showModalactiveStatus = false;
    showModalinactiveStatus = false;

    roleListRes: any;
    roleListData: any;
    deleteRoleRes: any;
    activeRoleRes: any;
    editRoleRes: any;
    enableSubmitStatus: boolean;
    enableAddSubmitStatus: boolean;
    roleNameForUpdate: string;
    // pokemon: Pokemon[];

    clicked: boolean = false;

    activeId = ''
    inactiveId = ''

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private router: Router,) {

        // Assign the data to the data source for the table to render
        this.roleListData = [];
        this.editshowModalStatus = false;
        this.enableSubmitStatus = true;
        this.enableAddSubmitStatus = true;
        this.roleNameForUpdate = '';
      
        this.dataSource = new MatTableDataSource(this.roleListData);

        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }
    }
    get f() { return this.roleForm.controls; }
    get ff() { return this.roleUpdateForm.controls; }
    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // calling roleList api function
        this.roleList();
        this.roleForm = this._formBuilder.group({
            roleNameadd : ['', Validators.required],
        });
        this.roleUpdateForm = this._formBuilder.group({
            roleName : ['', Validators.required],
        });
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
            console.log(this.dataSource.filter);
        }
    }

    // Add role api function
    addRole(): void {
        this.alertService.clear();
        if (this.roleForm.invalid) {
            this.enableAddSubmitStatus = true;
            return;
        }else {
            this.clicked = true;
            try {
                const req = {
                    rolename: this.f.roleNameadd.value,
                    active: this.status,
                    delete: 'N'
                };
                console.log(req);
                this.http
                    .post(`${config.baseUrl}/userrolecreate`, req, {})
                    .subscribe(
                        res => {
                            console.log(res);
                            this.addRoleRes = res;
                            if (this.addRoleRes.success === true) {
                                this.alertService.success(this.addRoleRes.message, 'Success');
                                this.roleList();
                                this.roleName = '';
                                this.showModal();
                                this.roleForm.reset();
                                // this.showModalStatus = false;
                                this.enableAddSubmitStatus = false;
                                // this.clicked = false;
                                
                            }else {
                                this.alertService.error(this.addRoleRes.message, 'Error');
                                this.clicked = false;
                            }
                        },
                        err => {
                            console.log(err);
                            this.alertService.error(err.message, 'Error');
                            this.clicked = false;
                        }
                    );
            } catch (err) {
                console.log(err);
            }
        }
    }

    // Role List
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
                res => {
                    // console.log(res);
                    this.roleListRes = res;
                    if (this.roleListRes.success === true) {
                        this.roleListData = this.roleListRes.data;
                        this.dataSource = new MatTableDataSource(this.roleListData);
                        console.log(this.dataSource);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
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

    // delete role second 
    deleteRole(): void {
        const req = {
            // id: id,
            id: this.userDeleteRoleId,
            isDelete: 'Y',
        };
        try {
            this.http
                .post(`${config.baseUrl}/userroledelete`, req, {})
                .subscribe(
                    res => {
                        console.log(res);
                        this.deleteRoleRes = res;
                        if (this.deleteRoleRes.success === true) {
                            this.showModaldeleteStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.roleList();
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

    // Update Role Modal
    editRole(id, roleName): void {
        this.roleUpdateForm.patchValue({
            roleName: roleName
        })
        this.roleId = id;
        this.roleNameForUpdate = roleName;
        this.enableSubmitStatus = true;
        this.editshowModalStatus = true;
    }

      // show Modal
      showModal(): void {
        this.showModalStatus = !this.showModalStatus;
        this.roleName = '';
        this.enableAddSubmitStatus = true;
        // this.showModalStatus = true;
    }
    
    doActiveInactive(): void {
        const req = {
            id: this.activeId,
            isActive: status,
            // id: this.inactiveId
        };
        console.log(req);
        this._userService.roleActiveInactive(req)
        .subscribe(
            res => {
                console.log(res);
                this.activeRoleRes = res;
                    this.roleList();
                    this.showModalactiveStatus = false;
                    this.showModalinactiveStatus = false;
            },
            err => {
                console.log(err);
                this.alertService.error(err.message, 'Error');
            }
        );
    }

    
    // update role
    updateRole(): void {
        console.log('update')
        this.alertService.clear();
        if (this.roleUpdateForm.invalid) {
            this.enableSubmitStatus = true;
            return;
        }else {
            const req = {
                id: this.roleId,
                roleName: this.ff.roleName.value,
            };
            try {
                this.http.post(`${config.baseUrl}/userroleupdate`, req, {})
                    .subscribe(
                        res => {
                            
                            this.editRoleRes = res;
                            if (this.editRoleRes.success) {
                                this.alertService.success(this.editRoleRes.message, 'Success');
                                this.roleList();
                                this.editshowModalStatus = false;
                                this.enableSubmitStatus = false;
                            } else {
                                this.alertService.error(this.editRoleRes.message, 'Error');
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
    }


    // edit show Modal
    editshowModal(): void {
        this.editshowModalStatus = false;
    }
   
    // Get Satus
    getStatus(html): void {
        this.status = html.value;
    }

    //showdeletemodel

    showDeleteModal(): void {
        this.userDeleteRoleId = this.userDeleteRoleId;
        this.showModaldeleteStatus = !this.showModaldeleteStatus;
    }
    hideDeleteModal(): void {
        this.showModaldeleteStatus = !this.showModaldeleteStatus;
    }

    showActiveModal(): void {
        const req = {
            id: this.userDeleteRoleId,
            isActive: this.status
        };
        this.activeId = this.userDeleteRoleId
        console.log(req);
        this.showModalactiveStatus = !this.showModalactiveStatus;
    }

    

    showInActiveModal(): void {
        const req = {
            id: this.userDeleteRoleId,
            isActive: status
        };
        this.activeId = this.userDeleteRoleId
        console.log(req);
        this.showModalinactiveStatus = !this.showModalinactiveStatus;
    }

    enableSubmit(value) {
        if (value !== this.roleNameForUpdate) {
            this.enableSubmitStatus = false;
        } else {
            this.enableSubmitStatus = true;
        }
    }

    enableAddSubmit(value) {
        if (value !== this.roleNameForUpdate) {
            this.enableAddSubmitStatus = false;
        } else {
            this.enableAddSubmitStatus = true;
        }
    }
}
