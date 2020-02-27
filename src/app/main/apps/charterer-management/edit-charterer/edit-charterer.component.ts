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
import { AlertService, AuthenticationService} from '../../../../_services';

@Component({
    selector: 'edit-charterer',
    templateUrl: './edit-charterer.component.html',
    styleUrls: ['./edit-charterer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditChartererComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    updatechartererForm: FormGroup;    
    loading = false;
    username: string;   
    res: any;
    roleListRes: any;
    roleListData: any;
    roleName: string;
    mobileNo: string;
    submitted = false;
    // password: string;
    // repassword: string;
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
    company: string;
    
    updateUserRes: any;
    //companyData: any;
    chartererData: any;
    companyListRes: any;
    companyListData: any;

    alert:any;
    alertSettings: any;
    documents: any;
    signature: any;
    eSignature: any;
    onlySend: any;
    forwardAlerts: any;

    charteredDetailRes: any;
    charteredDetailData: any

    charterRol: any;

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
        this.userRoleId = '4';
        
        this._unsubscribeAll = new Subject();
        this.chartererData = [];
        this.companyListData = [];
        this.roleAccessListData = [];
        this.alert = [];
        this.alertSettings = [];
        this.documents = [];
        this.signature = [];
        this.eSignature = [];
        this.onlySend  = [];
        this.forwardAlerts = []; 

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
        let charteredID = localStorage.getItem('chartererId');
        
        this.updatechartererForm = this._formBuilder.group({
            username: ['', [ Validators.required, Validators.pattern("[A-Za-z0-9]+")]],
            email:new FormControl('',[ Validators.required, Validators.pattern("^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$")]),
            address: ['',[ Validators.required, Validators.pattern("[A-Za-z0-9]+")]],
            businessPhone: ['',[ Validators.required, Validators.pattern("[A-Za-z0-9]+")]],
            firstName: ['',[ Validators.required, Validators.pattern("[A-Za-z0-9]+")]],
            lastName: ['',[ Validators.required, Validators.pattern("[A-Za-z0-9]+")]],
            mobileNo: ['',[ Validators.required, Validators.pattern("[A-Za-z0-9]+")]],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/charterer-management';
        // this.roleList();
        // this.companyList();
        this.roleAccessList(); 
        this.charteredDetail(charteredID);
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }

    get f() { return this.updatechartererForm.controls; }
    // get f2() { return this.userManagementUpdateForm.controls; }

    onSubmit(): void {
       // console.log('add user');
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.updatechartererForm.invalid) {
            console.log('add user invalid');
            return;
        } else {
            console.log('add');
            const req = {        
            "id": localStorage.getItem('chartererId'),
            "username": this.f.username.value,
            "companyId" : localStorage.getItem('companyId'),
            "businessPhone" : this.f.businessPhone.value,             
            "userRoleId": 4,
            "mobileNo" : this.f.mobileNo.value,
            "email" : this.f.email.value,
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
                this.http.post(`${config.baseUrl}/charterupdate`, req, headerOptions).subscribe(
                    res => {
                        console.log(res);
                        this.createUserRes = res;
                        if (this.createUserRes.success === true) {
                            this.alertService.success(this.createUserRes.message, 'Success');
                            this.userRoleId = '';
                            this.updatechartererForm.reset();
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
    // companyList(): void {
    //     try {
    //         this.http.get(`${config.baseUrl}/companylist`, {}).subscribe(
    //             res => {
    //                // console.log(res);
    //                 this.companyListRes = res;
    //                 if (this.companyListRes.success) {
    //                     this.companyListData = this.companyListRes.data;
    //                 }
    //             },
    //         err => {
    //             console.log(err);
    //         });
            
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // changecompany(event): void {
    //     console.log(event.target.name)
        
    //     console.log(event.target)
        
    //     console.log(event)
    //     this.companyName = event.target.value;
    // }


    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
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

    // chartered Detail Data
    charteredDetail(id): void {
        const requestData = {
            id: id
        }
        try {
            this._userService.getChartererDetail(requestData)
            .pipe(first())
            .subscribe((res) => {
                this.charteredDetailRes = res;
                if (this.charteredDetailRes.success === true) {
                    this.charteredDetailData = this.charteredDetailRes.data[0];
                    console.log(this.charteredDetailData);
                    // this.chartererData = this.charteredDetailData;

                    
                    this.updatechartererForm.setValue({  
                        username: this.charteredDetailData.username,  
                        email: this.charteredDetailData.email,  
                        // password: this.charteredDetailData.password,  
                        // repassword: this.charteredDetailData.password,
                        // companyName: this.charteredDetailData.companyId,
                        address: this.charteredDetailData.address,
                        businessPhone: this.charteredDetailData.businessPhone,
                        firstName: this.charteredDetailData.firstName,
                        lastName: this.charteredDetailData.lastName,
                        mobileNo: this.charteredDetailData.mobileNo,
                        // userRoleId: this.charteredDetailData.userRoleId,
                    }); 
                    
                    if (this.charteredDetailData.alertdata.length > 0) {
                        for (let item of this.charteredDetailData.alertdata) {
                            // console.log(item);
                            for (let alert of this.roleAccessListData) {
                                console.log(alert);
                                if (alert.id === item.systemActivityAlertId ) {
                                    console.log(alert);
                                    for (let alertItem of alert.alertdata) {
                                        if (alertItem.id === item.systemActivityId) {
                                            alertItem.selected = true;
                                            console.log(alertItem);
                                            this.alert.push({
                                                Id: alertItem.id,
                                                parentId: alert.id
                                            })
                                        }
                                    }
                                    console.log(this.alert);
                                }
                            }
                        }
                    }
                    console.log(this.roleAccessListData);

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
    // roleList(): void {
    //     try {
    //         this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
    //             res => {
    //                 console.log(res);
    //                 this.roleListRes = res;
    //                 if (this.roleListRes.success) {
    //                     this.roleListData = this.roleListRes.data;
    //                     for(let roleName1 of this.roleListData) {
    //                         if(roleName1.id === 4)  {
    //                             this.charterRol = roleName1.roleName;
    //                             //console.log("rol", this.charterRol);
    //                         }
    //                     }
    //                 }
    //             },
    //             err => {
    //                 console.log(err);
    //             }
    //         );
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    

    changeRole(event): void {
        console.log(event.target.value);
        this.userRoleId = event.target.value;
    }


    changeSelectAccessPush(event,item, categoryName  ){
        // for (const item of this.roleAccessListData) {
        const obj = {Id:item.id, parentId: item.parentId};
        const index = this.alert.findIndex(obj => obj.Id == item.id && obj.parentId == item.parentId);
        if (index === -1) {
            this.alert.push(obj);
        } else {
            this.alert.splice(index)
        }
        console.log(this.alert);        
    }


    // public selectedRoleList = [];
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
                    // var index = this.selectedRoleList.indexOf(selectitem);
                    // this.selectedRoleList.splice(index, 1);
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
                            // var index = this.selectedRoleList.indexOf(selectitem);
                            // this.selectedRoleList.splice(index, 1);

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



