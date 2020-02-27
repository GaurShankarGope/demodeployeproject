import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
// import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
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
import { AlertService } from '../../../../_services';
export interface UserData {
    id: string;
    categoryName: string;
}



@Component({
    selector: 'sub-list',
    templateUrl: './sub-list.component.html',
    styleUrls: ['./sub-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SubListComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['id', 'categoryName', 'subalert', 'action'];
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showAlertModalStatus = false;
    showSubModalStatus = false;
    dataSource: MatTableDataSource<UserData>;
    alertForm: FormGroup;
    alertListRes: any;
    alertListData: any;
    roleName: string;
    userRole: string;
    showModaldeleteStatus = false;
    showModalUpdateStatus = false;
    AddAlertRes: any;
    userListRes: any;
    userListData: any;
    categoryAddRes: any;
    showInput: boolean;
    alertId: any;
    userDeleteRoleId: any;
    subcategory: any;
    createSubAlertRes: any;
    subCategoryName: any;
    submitted = false;
    listparentId: any;
    alertSubcategoryName: any;
    alertSubCatParentId: any;
    alertSubCatUpdatedBy: any;
    alertSubCatId: any;

    alertUpdateForm: FormGroup;
    enableSubmitStatus: boolean;

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
        private _formBuilder: FormBuilder,
        private router: Router,
    ) {
        // Set the defaults
        this.alertId = '';
        this.userListData = [];
        this.alertListData = [];
        this.showInput = false;
        this.subcategory = [];
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

    get ff() { return this.alertUpdateForm.controls; }

    ngOnInit(): void {
        this.alertId = localStorage.getItem('alertId');
        
        this.alertList();
   

        /* Initiate the form structure */
        this.alertForm = this.fb.group({
            subcategory: this.fb.array([this.fb.group({
                subcategory_name:['', Validators.required]})])
        })

        this.alertUpdateForm = this._formBuilder.group({
            roleName : ['', Validators.required],
        });

    }


        ///////// This is new ////////
    get alertOptionsList() {
        return this.alertForm.get('subcategory') as FormArray;
    }

    addOption() {
        this.alertOptionsList.push(this.fb.group({
            subcategory_name:['', Validators.required],}));
    }
    
    deleteOption(index) {
        this.alertOptionsList.removeAt(index);
    }

    initItemRows() {
        let ctrl = <FormArray>this.alertForm.controls.subcategory;
        ctrl.push(this.fb.group({
            subcategory_name: ['', Validators.required],     
        }))
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
    }

    // Add Sub Alert Model
    showAddSubAlertModal(): void {
        this.showSubModalStatus = !this.showSubModalStatus;
    }
 
    // Select Alert List
    alertList(): void {
        try {
            this.http.get(`${config.baseUrl}/BrokerManegeAlerlist`).subscribe(
                res => {
                    console.log(res);
                    this.alertListRes = res;
                    if (this.alertListRes.success) {
                        for (let item of this.alertListRes.data) {
                            if (Number(item.id) === Number(this.alertId)) {
                                console.log(item);
                                this.alertListData = item;
                            }
                        }
                        console.log(this.alertListData);
                        this.dataSource = new MatTableDataSource(this.alertListData.alertdata);
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

    // Delete sub Alert
     deletesubalert(): void {
        const req = {
            category_id: this.userDeleteRoleId,
            parentId: this.listparentId,
            isDelete: 'Y',
        };
        console.log(req);
        try {
            this.http
                .post(`${config.baseUrl}/subcategoryDelete`, req, {})
                .subscribe(
                    res => {
                        console.log(res);
                        this.categoryAddRes = res;
                        if (this.categoryAddRes.success === true) {
                            this.showModaldeleteStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.alertList();
                        } else {
                            this.alertService.error(this.categoryAddRes.message, 'Error');
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

     showDeleteModal(id, parentId): void {
        this.userDeleteRoleId = id;
        this.listparentId = parentId;
        this.showModaldeleteStatus = !this.showModaldeleteStatus;
    }
    hideDeleteModal(): void {
        this.showModaldeleteStatus = !this.showModaldeleteStatus;
    }

  
    showeditModal(obj): void {
        this.alertSubCatId = obj.id
        this.alertSubcategoryName = obj.categoryName,
        this.alertSubCatParentId = obj.parentId,
        this.alertSubCatUpdatedBy = obj.updatedBy
        this.enableSubmitStatus = true;
        this.showModalUpdateStatus = !this.showModalUpdateStatus;
        console.log(this.enableSubmitStatus);
    }
    hideeditModal(): void {
        this.showModalUpdateStatus = !this.showModalUpdateStatus;
    }

    // Edit Sub Alert
    editalert(): void {
        const req = {
            category_id: this.alertSubCatId,
            parentId: this.alertSubCatParentId,
            subCategoryName: this.alertSubcategoryName,
            updatedBy: this.alertSubCatUpdatedBy
        };
        console.log(req);
        try {
            this.http
                .post(`${config.baseUrl}/subcategoryEdit`, req, {})
                .subscribe(
                    res => {
                        console.log(res);
                        this.categoryAddRes = res;
                        if (this.categoryAddRes.success === true) {
                            this.showModalUpdateStatus = false;
                            this.alertService.success('Successfully Updated', 'Success');
                            this.alertList();
                        } else {
                            this.alertService.error(this.categoryAddRes.message, 'Error');
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


    addSubAlert(): void {
        this.submitted = true;
 
        // reset alerts on submit
        this.alertService.clear();

        if (this.alertForm.invalid) {
            console.log('add user invalid');
            return;
        } else {
            const requestData = {
                "parentId"	  :	this.alertId,
                "createdBy"   : localStorage.getItem('userId'),
                "updatedBy"   : localStorage.getItem('userId'),
                "subcategory" : this.alertForm.value.subcategory,
            }
            console.log(requestData);
            try {
                this._userService.addSubAlert(requestData)
                .pipe(first())
                .subscribe((res) => {
                    this.createSubAlertRes = res;
                    if (this.createSubAlertRes.success === true) {
                        this.alertService.success(this.createSubAlertRes.message, 'Success');
                        this.alertList();
                        this.showSubModalStatus = false;
                    } else {
                        this.alertService.error(this.createSubAlertRes.message, 'Error');
                    }
                },
                err => {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });
                
            } catch (err) {
                console.log(err);
            }
        }
    }
    enableSubmit(value) {
        if (value !== this.roleName) {
            this.enableSubmitStatus = false;
        } else {
            this.enableSubmitStatus = true;
        }
    }
}
