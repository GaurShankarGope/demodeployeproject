import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../../../_services';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { config } from '../../../config/config';
export interface UserData {
    id: string;
    name: string;
    status: string;
}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'role-access-management',
    templateUrl: './role-access-management.component.html',
    styleUrls: ['./role-access-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RoleAccessManagementComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name',];
    dataSource: MatTableDataSource<UserData>;
    roleListRes: any;
    roleListData: any;
    roleAccessListRes: any;
    roleAccessListData: any;
    userRoleId: any;
    returnUrl: string;
    alertData: any;
    sedata: any;
    updateRoleRes: any;
    getRoleAccessData: any;
    rolshow: string;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router,
        private _userService: UserService,
        private route: ActivatedRoute, ) {
        this.roleAccessListData = [];
        this.userRoleId = '';
        this.alertData = [];
        this.sedata = [];
        this.getRoleAccessData = [];
        let userToken = localStorage.getItem('userToken')
        if (userToken == undefined) {
            this.router.navigate(['/']);
        }

    }

    ngOnInit(): void {
        this.roleList();
        this.roleAccessList();
        roleName: ['', Validators.required]
    }


    // Role Access List
    roleAccessList(): void {
        try {
            this._userService.roleListshow()
            .subscribe(
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

    submitdata(): void {
        try {
            const req = {
                "userroleid": this.userRoleId,
                "data": this.sedata,
                "createdBy": localStorage.getItem('userId'),
                "updatedBy": localStorage.getItem('userId'),
            };
            console.log(req);
            this._userService.moduleAction(req)
                .subscribe(
                    res => {
                        console.log(res);
                        this.updateRoleRes = res;
                        if (this.updateRoleRes.success === true) {
                            this.alertService.success(this.updateRoleRes.message, 'Success');
                            this.roleList();
                            this.roleAccessList();

                        } else {

                            this.alertService.error(this.updateRoleRes.message, 'Error');
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


    /**
     * Confirm password validator
     *
     * @param {AbstractControl} control
     * @returns {ValidationErrors | null}
     */

    selectRoleForRole(id): void {
        try {
            const req = {
                "id": id
            };
            console.log(req);
            this._userService.selectList(req)
                .subscribe(
                    res => {
                        console.log(res);
                        let response: any = res;
                        if (response.success === true) {
                            this.getRoleAccessData = response.data;
                            for (let items of this.getRoleAccessData) {
                                for (let item of this.roleAccessListData) {
                                    if (items.moduleId === item.id) {
                                        for (let arr of item.action_arr) {
                                            if (items.actionId === arr.id) {
                                                console.log(arr);
                                                arr.checked = true;
                                                arr.selected = true;
                                                var da = {
                                                    "moduleId": items.moduleId,
                                                    "actionId": items.actionId
                                                }
                                                this.sedata.push(da);

                                            }
                                        }
                                    }
                                }
                            }
                            console.log(this.roleAccessListData);
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


    resetdata(): void {
        this.roleAccessList();
        this.roleList();
    }

    // Role List
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {})
            .subscribe(
                res => {
                    console.log(res);
                    this.roleListRes = res;
                    if (this.roleListRes.success === true) {
                        this.roleListData = this.roleListRes.data;
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

    changeRole(event): void {
        console.log(event.target.value);
        this.userRoleId = event.target.value;
        this.selectRoleForRole(event.target.value)
    }

    // Get Satus
    getStatus(html): void {
        // this.status = html.value;
    }


    changeSelectAccessPara(event, item, userMangeName) {
        const obje = { id: item.id, moduleName: item.userMangeName, checked: item.checked };
        this.alertData.push(obje);
        console.log(this.alertData);
    }

    changeSelectAccess(event, data): void {
        const checked = event.checked;
        console.log(event);
        console.log(data);
        for (let selectitem of this.roleAccessListData) {
            if (selectitem.id === data.id && selectitem.moduleName === data.moduleName) {
                if (selectitem.selected === true) {
                    console.log('if-true', checked);
                    selectitem.selected = checked;
                    selectitem.checked = checked;
                    for (let innerLoop of selectitem.action_arr) {
                        innerLoop.selected = true;
                        innerLoop.checked = true;
                    }
                } else {
                    selectitem.selected = checked;
                    for (let innerLoop of selectitem.action_arr) {
                        innerLoop.selected = false;
                        innerLoop.checked = false;
                    }
                }

            } else {
                for (let innerList of selectitem.action_arr) {
                    if (selectitem.id === innerList.moduleId) {
                        if (selectitem.selected === true) {
                            if (innerList.selected === true) {
                                selectitem.selected = true;
                                selectitem.checked = true;
                            } else {
                                selectitem.selected = false;
                                selectitem.checked = false;
                            }

                        } else {
                            console.log('inner');
                            if (data.moduleId === innerList.moduleId && data.actionName === innerList.actionName) {
                                if (checked === true) {
                                    console.log('inner check' + "=" + innerList.moduleId + "=" + innerList.id);
                                    console.log(innerList);
                                    var da = {
                                        "moduleId": innerList.moduleId,
                                        "actionId": innerList.id
                                    }
                                    this.sedata.push(da);
                                    innerList.selected = checked;
                                    innerList.checked = checked;

                                } else {
                                    console.log('inner uncheck' + "=" + data.moduleId);
                                    innerList.selected = checked;
                                    innerList.checked = checked;
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
