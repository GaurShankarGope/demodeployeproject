import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, UserService } from '../../../../_services';
// import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../../config/config';


@Component({
    selector: 'editcompany-admin',
    templateUrl: './editcompany-admin.component.html',
    styleUrls: ['./editcompany-admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditCompanyAdminComponent implements OnInit, OnDestroy {
   
    updatecompanyadminForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    username: string;
    mobileNo: string;
    firstName: string;
    lastName: string;
    company: string;
    businessPhone: string;
    role: string;
    email: string;  
    address: string;  
    submitRes: any;
    
    companyData: any;

    roleListData: any;
    companyListData: any;
    roleListRes: any;
    companyListRes: any;
    userRole: any;
    companyName: any;

    userRoleId: any;
    companyRol: any;
    dynamicVariable = false;
    
    // Private
    private _unsubscribeAll: Subject<any>;
/**
     * Constructor
     *
     
     * @param {FuseSidebarService} _fuseSidebarService
     
     */
    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService) {
        this.companyRol = localStorage.getItem('selectedRoleName');
        this.userRoleId = '2';
        // Configure the layout
        this.showLoaderImg = false;
        
        this.roleListData = [];
        this.companyListData = [];

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
        this.companyData = JSON.parse(localStorage.getItem('companyData'));
        this.userRole = this.companyData.userRoleId;
        this.companyName = this.companyData.companyId;
        this.updatecompanyadminForm = this._formBuilder.group({
            username : [this.companyData.username, Validators.required],
            mobileNo: [this.companyData.mobileNo, Validators.required],
            firstName: [this.companyData.firstName, Validators.required],
            lastName: [this.companyData.lastName, Validators.required],
            company: [this.companyName, Validators.required],
            businessPhone: [this.companyData.businessPhone, Validators.required], 
            role: [this.companyData.userRoleId, Validators.required], 
            email: [this.companyData.email, Validators.pattern("^[a-zA-Z]{1}[a-zA-Z0-9.\-_]*@[a-zA-Z]{1}[a-zA-Z.-]*[a-zA-Z]{1}[.][a-zA-Z]{2,}$")], 
            address: [this.companyData.address, Validators.required], 
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/master/company-admin'; 
        this.roleList();  
        this.companyList();     
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    get f() { return this.updatecompanyadminForm.controls; }
    

    
    onSubmit() {
        console.log("fsf");
        this.showLoaderImg = true;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.updatecompanyadminForm.invalid) {
            return;
        }else {
            const reqData = {
                "id":this.companyData.id,
                "username": this.f.username.value,
                "mobileNo": this.f.mobileNo.value,
                "firstName": this.f.firstName.value,
                "lastName":  this.f.lastName.value,
                "companyId": this.companyName,
                "businessPhone": this.f.businessPhone.value,
                "userRoleId": this.userRole,
                "email": this.f.email.value,
                "address": this.f.address.value,
            }
            console.log(reqData);
            this.loading = true;
            this._userService.updateCompanyadminList(reqData)
            .pipe(first())
            .subscribe(
            data => {
                this.showLoaderImg = false;
                this.submitRes = data;
                if (this.submitRes.success === true) {
                    this.alertService.success(this.submitRes.message, 'Success');
                    this.router.navigate([this.returnUrl]);
                } else {
                    this.alertService.error(this.submitRes.message, 'Error');
                }
                console.log(data);
            },
            error => {
                console.log(error.message);
                this.alertService.error(error.message, 'Error');
                this.loading = false;
            });
        }


    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    
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

    // Role List
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
                res => {
                   // console.log(res);
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
        this.userRole = event.target.value;
    }
    getDisabledValue() {
        //your condition, in this case textarea will be disbaled.
        return true; 
      }
    
}