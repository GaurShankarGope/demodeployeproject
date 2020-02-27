import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService, AuthenticationService, UserService } from '../../../../_services';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
declare var $: any;

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    Email: string;
    Password: string;
    res: any;
    mobile: Number;
    userId: String;
    showModalStatus = false;
    username: string;
    title: String;
    compnaylist = [];
    // mobile: number;
    password: number;
    cid: String;
    compnay: any;

    userRoleID: string;
    country_code: string;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService,
        private location: Location) {

        this.showLoaderImg = false;
        // if (this.authenticationService.currentUserValue) {
        //     this.router.navigate(['/apps/dashboards/analytics']);
        // }

        let userToken = localStorage.getItem('userToken')
        if (userToken != undefined) {
            this.location.back();
        }

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {

        this.checkValue();

        var isLogin = localStorage.getItem('userRoleId');
        console.log(isLogin);
        if (isLogin != '' && isLogin != null && isLogin != undefined) {
            this.router.navigate(['/apps/dashboards/analytics']);
        }

        localStorage.setItem('countryCodeInfo','+91');

        this.loginForm = this._formBuilder.group({
            username: ['', Validators.required],
            mobile: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/dashboards/analytics';
    }

    checkValue() {

        if ($('#phone').length) {
            var input = document.querySelector("#phone");
            var iti = (<any>window).intlTelInput(input, {
                preferredCountries: ['in', 'us'],

                separateDialCode: true,
                placeholderNumberType: "MOBILE",

            });
            console.log(input);
            input.addEventListener("countrychange", function () {
                var countryData = iti.getSelectedCountryData();
                 localStorage.setItem('countryCodeInfo','+' + countryData.dialCode);
            });
        }
    }
    get f() { return this.loginForm.controls; }


    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        // this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }


        var countryCOdeInfo = localStorage.getItem('countryCodeInfo');

        // this.country=  ("#country_code").value;
        console.log("hello", this.f.username.value);
        console.log("hello", this.f.mobile.value);
        console.log("hello", this.f.password.value);
        console.log("hello", this.country_code);
        console.log("hello", countryCOdeInfo);

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.mobile.value, this.f.password.value, countryCOdeInfo)
            .pipe(first())
            .subscribe(
                data => {
                    this.res = data;
                    if (data.success === true) {
                        this.userId = this.res.data.id;
                        this.title = this.res.data.title;
                        this.cid = this.res.data.companyId;


                        // this.showModalStatus = !this.showModalStatus;
                        localStorage.setItem('userToken', this.res.token);
                        localStorage.setItem('userId', this.res.data.id);
                        localStorage.setItem('userName', this.res.data.username);
                        localStorage.setItem('userRoleId', this.res.data.userRoleId);
                        localStorage.setItem('ownerId', this.res.data.ownerId);
                        localStorage.setItem('userParentId', this.res.data.createdBy);
                        localStorage.setItem('companyId', this.res.data.companyId);
                        localStorage.setItem('emailId', this.res.data.email);

                        localStorage.setItem('userData', JSON.stringify(this.res.data));
                        this.router.navigate([this.returnUrl]);

                        // window.location.reload();


                    } else {
                        this.alertService.error(data.message, '');
                        this.loading = false;
                    }

                });
    }

    // showCompnayListModal(): void {

    //     this.showModalStatus = !this.showModalStatus;
    //     this.userService.getCompanyList().pipe(first())
    //         .subscribe(data => {
    //             this.compnay = data;
    //             console.log(this.cid);

    //             console.log(this.compnay, "res");
    //             if (this.compnay.success === true) {
    //                 for (let index = 0; index < this.compnay.data.length; index++) {
    //                     if(this.compnay.data[index].id == this.cid){
    //                         console.log(this.cid);

    //                         this.compnaylist.push(this.compnay.data[index]);
    //                     }
    //                 }
    //             }   
    //             console.log(this.compnaylist,'cp');
    //         });

    // }
    // submit($event) {

    //     let companyName = $event.value;

    //     localStorage.setItem('compnayName', companyName);
    //     console.log(companyName);


    // }

    // done(id) {
    //     localStorage.setItem('companyId',id);
    //     this.router.navigate(['/apps/dashboards/analytics']);

    //     console.log(localStorage.getItem('companyId'));

    // }

    // onSubmit() {
    //     this.showLoaderImg = true;
    //     // reset alerts on submit
    //     this.alertService.clear();

    //     // stop here if form is invalid
    //     if (this.loginForm.invalid) {
    //         return;
    //     }
    //     this.loading = true;
    //     this.authenticationService.login(this.f.email.value, this.f.password.value)
    //         .pipe(first())
    //         .subscribe(
    //             data => {
    //             this.showLoaderImg = false;
    //             this.res = data;
    //             if (data.success === true) {
    //                 localStorage.setItem('userToken', this.res.token);
    //                 localStorage.setItem('userId', this.res.data.id);
    //                 localStorage.setItem('userData', JSON.stringify(this.res.data));
    //                 this.router.navigate([this.returnUrl]);
    //             } else {

    //                 this.alertService.error(data.message, 'Error');
    //             }
    //             },
    //         error => {

    //             this.alertService.error(error.message, 'Error');
    //             this.loading = false;
    //         });
    //     }
}
