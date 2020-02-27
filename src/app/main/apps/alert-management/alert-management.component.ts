import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray ,  Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
// import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { UserService } from '../../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
import { AlertService } from '../../../_services';
import { Router, ActivatedRoute } from '@angular/router';
export interface UserData {
    id: string;
    categoryName: string;
}

@Component({
    selector: 'alert-management',
    templateUrl: './alert-management.component.html',
    styleUrls: ['./alert-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AlertManagementComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'categoryName', 'action'];
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showAlertModalStatus = false;
    showSubModalStatus = false;
    dataSource: MatTableDataSource<UserData>;
    alertForm: FormGroup;
    addAlertForm: FormGroup;
    alertListRes: any;
    alertListData: any;
    roleName: string;
    userRole: string;
    showModaldeleteStatus = false;
    AddAlertRes: any;
    userListRes: any;
    userListData: any;
    categoryAddRes: any;
    showInput: boolean;
    alertId: any;
    userDeleteRoleId: any;
    editRoleRes: any;
    editalertRes: any;
    editshowModalStatus = false;
    editCatId: any;
    alertOptions: any;

    alertUpdateForm: FormGroup;
    enableSubmitStatus: boolean;
    enableSubmitAddStatus: boolean;

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
        private fb: FormBuilder,
        private alertService: AlertService,
        private router: Router,
        private _formBuilder: FormBuilder,
    ) {
        // Set the defaults
        this.alertId = '';
        this.userListData = [];
        this.alertListData = [];
        this.dataSource = new MatTableDataSource(this.alertListData);
        this.showInput = false;
        this.alertOptions = [];
        // this.roleName = [];
        this.enableSubmitStatus = true;

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
    get f() { return this.addAlertForm.controls; }
    get ff() { return this.alertUpdateForm.controls; }

    ngOnInit(): void {
        this.userListData.paginator = this.paginator;
        this.userListData.sort = this.sort;
    
        this.alertList();
   
        this.addAlertForm = this._formBuilder.group({
            roleName : ['', Validators.required],
        });

        this.alertUpdateForm = this._formBuilder.group({
            roleName : ['', Validators.required],
        });


        /* Initiate the form structure */
        this.alertForm = this.fb.group({
          alertOptions: this.fb.array([this.fb.group({option:''})])
        })
      }

      ///////// This is new ////////
    get alertOptionsList() {
        return this.alertForm.get('alertOptions') as FormArray;
    }

    addOption() {
        this.alertOptionsList.push(this.fb.group({option:''}));
    }
    
    deleteOption(index) {
        this.alertOptionsList.removeAt(index);
    }
    addSubAlert() {
        console.log(this.alertForm.value);
    }
  ///////////End ////////////////
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

    // Add Alert Model
        showAddAlertModal(): void {
            this.showAlertModalStatus = !this.showAlertModalStatus;
            // this.roleName = '';
        }

    // Add Sub Alert Model
        showAddSubAlertModal(): void {
            this.showSubModalStatus = !this.showSubModalStatus;
        }

    // hide show input 
        selectAlert(value: string) {
            this.alertId = value;
            console.log(value);
            if (this.alertId !== '') {
                this.showInput = true;
            } else {
                this.showInput = false;
            }
        }

    // Add alert
        AddAlert() {
            if (this.addAlertForm.invalid) {
                return;
            }else {
                const roleId = localStorage.getItem('userId')
            const req = {
                categoryName: this.f.roleName.value,
                createdBy: roleId,
                updatedBy: roleId
            };
            console.log(req);
            try {
                this.http.post(`${config.baseUrl}/categoryAdd`, req, {}).subscribe(
                    res => {
                        console.log(res);
                        this.categoryAddRes = res;
                        if (this.categoryAddRes.success === true) {
                            this.categoryAddRes = this.categoryAddRes.data;
                            this.alertService.success('Successfully Added', 'Success');
                            // this.roleName = '';
                            this.alertList();
                            // this.addAlertForm().reset;
                            this.addAlertForm.reset();
                            this.showAlertModalStatus = false;
                            
                        }
                            else {
                                this.alertService.error(this.categoryAddRes.message, 'Error');
                            }
                        // }
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

  

    // redirect page 
        goSubAlert(data) {
            console.log(data);
            localStorage.setItem('alertId', data.id);
            this.router.navigate(['/apps/alert-management/sub-list']);
        }

    // delete alert
        deleteRole(id): void {
            const req = {
                // id: id,
                category_id: this.userDeleteRoleId,
                isDelete: 'Y',
            };
            console.log(req);
            try {
                this.http
                    .post(`${config.baseUrl}/categoryDelete`, req, {})
                    .subscribe(
                        res => {
                            console.log(res);
                            this.editRoleRes = res;
                            if (this.editRoleRes.success === true) {
                                this.showModaldeleteStatus = false;
                                this.alertService.success('Successfully Deleted', 'Success');
                                this.alertList();
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
    
    // Select Alert List
        alertList(): void {
            try {
                this.http.get(`${config.baseUrl}/BrokerManegeAlerlist`).subscribe(
                    res => {
                        console.log(res);
                        this.alertListRes = res;
                        if (this.alertListRes.success) {
                            this.alertListData = this.alertListRes.data;
                            this.dataSource = new MatTableDataSource(this.alertListData);
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

    // Update Role Modal
    editalert(id, roleName): void {
        this.alertUpdateForm.patchValue({
            roleName: roleName
        })
        this.editCatId = id;
        this.alertId = roleName;
        this.enableSubmitStatus = true;
        this.editshowModalStatus = !this.editshowModalStatus;
        console.log(this.enableSubmitStatus);
    }

    

    // edit show Modal
    editshowModal(): void {
        this.editshowModalStatus = !this.editshowModalStatus;
    }

   
    // edit alert
        updatealert(): void {
            const roleId = localStorage.getItem('userId')
            const req = {
                category_id: this.editCatId,
                CategoryName: this.ff.roleName.value,
                updatedBy: roleId
            };
            console.log(req) 
            try {
                this.http
                    .post(`${config.baseUrl}/categoryEdit`, req, {})
                    .subscribe(
                        res => {
                            this.editRoleRes = res;
                            if (this.editRoleRes.success) {
                                this.editshowModalStatus = false;
                                this.alertService.success('Successfully Updated', 'Success');
                                this.alertList();
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


     showDeleteModal(id): void {
        this.userDeleteRoleId = id;
        this.showModaldeleteStatus = !this.showModaldeleteStatus;
    }
    hideDeleteModal(): void {
        this.showModaldeleteStatus = !this.showModaldeleteStatus;
    }
    enableSubmit(value) {
        if (value !== this.ff.roleName) {
            this.enableSubmitStatus = false;
        } else {
            this.enableSubmitStatus = true;
        }
    }
    enableAddSubmit(value) {
        if (value !== this.f.roleName) {
            this.enableSubmitAddStatus = false;
        } else {
            this.enableSubmitAddStatus = true;
        }
    }
}
