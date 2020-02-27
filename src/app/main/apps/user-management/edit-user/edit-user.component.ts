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
    selector: 'edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditUserComponent implements OnInit, OnDestroy {
    enableSubmitStatus = false;
    userManagementeditForm: FormGroup;
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

    userData: any;

    roleListData: any;
    companyListData: any;
    roleListRes: any;
    companyListRes: any;
    userRole: any;
    companyName: any;
    // clicked = false;

    // enableSubmitStatus: boolean;


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
        // Configure the layout
        this.showLoaderImg = false;
        // this.enableSubmitStatus = true;
        this.roleListData = [];
        this.companyListData = [];

        let userToken = localStorage.getItem('userToken')
        if (userToken == undefined) {
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
        this.userData = JSON.parse(localStorage.getItem('userInfoData'));
        this.userRole = this.userData.userRoleId;
        console.log(this.userRole);
        this.companyName = this.userData.companyId;
        this.userManagementeditForm = this._formBuilder.group({
            username: [this.userData.username, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            mobileNo: [this.userData.mobileNo, [Validators.required, Validators.pattern("[0-9]+")]],
            firstName: [this.userData.firstName, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            lastName: [this.userData.lastName, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            userRoleId: [this.userData.userRoleId, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            email: [this.userData.email, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9]+.[a-z]{2,4}$")]],
            address: [this.userData.address, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            whatsappId: [this.userData.whatsappId, Validators.required],
            skypeId: [this.userData.skypeId, Validators.required],
        });

        // setTimeout(() => {

        //     this.userManagementeditForm = this._formBuilder.group({
        //         username: [this.userData.username, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
        //         mobileNo: [this.userData.mobileNo, [Validators.required, Validators.pattern("[0-9]+")]],
        //         firstName: [this.userData.firstName, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
        //         lastName: [this.userData.lastName, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
        //         userRoleId: [this.userData.userRoleId, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
        //         email: [this.userData.email, [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9]+.[a-z]{2,4}$")]],
        //         address: [this.userData.address, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
        //     });

        //     console.log(this.userManagementeditForm);
        // }, 3000);

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/user-management';
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
    get f() { return this.userManagementeditForm.controls; }


    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    onSubmit() {
        console.log("fsf");
        this.showLoaderImg = true;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.userManagementeditForm.invalid) {
            console.log("if");
            // this.clicked = true;
            // this.enableSubmitStatus = true;
            return;
        } else {
            console.log("add");
            const reqData = {
                "id": this.userData.id,
                "username": this.f.username.value,
                "mobileNo": this.f.mobileNo.value,
                "firstName": this.f.firstName.value,
                "lastName": this.f.lastName.value,
                "companyId": this.companyName,
                "userRoleId": this.userRole,
                "whatsappId": this.f.whatsappId.value,
                "skyeId": this.f.skypeId.value,
                "email": this.f.email.value,
                "address": this.f.address.value,
            }
            console.log(reqData);
            this.loading = true;
            this._userService.updateUserManagement(reqData)
                .pipe(first())
                .subscribe(
                    data => {
                        this.router.navigate([this.returnUrl]);
                        this.showLoaderImg = false;
                        this.submitRes = data;
                        if (this.submitRes.success === true) {
                            this.alertService.success(this.submitRes.message, 'Success');
                           
                            // this.enableSubmitStatus = false;
                            // this.clicked = false;
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

    // Role List
    roleList(): void {
        try {
            this.http.post(`${config.baseUrl}/userroleread`, {}, {}).subscribe(
                res => {
                    // console.log(res);
                    this.roleListRes = res;
                    if (this.roleListRes.success) {
                        for (let index = 0; index < this.roleListRes.data.length; index++) {
                            if (this.roleListRes.data[index].id == '6' || this.roleListRes.data[index].id == '4' || this.roleListRes.data[index].id == '3') {
                                this.roleListData.push(this.roleListRes.data[index]);

                            }
                        }


                    }
                    console.log(this.roleListData);
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

    // enableSubmit(value) {
    //     if (value !== this.roleNameForUpdate) {
    //         this.enableSubmitStatus = false;
    //     } else {
    //         this.enableSubmitStatus = true;
    //     }
    // }


}