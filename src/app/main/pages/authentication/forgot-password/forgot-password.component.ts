import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, AuthenticationService } from '../../../../_services';
import { first } from 'rxjs/operators';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    email: string;
    res: any;

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
        private alertService: AlertService
    )
    {
        // Configure the layout
        this.showLoaderImg = false;
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
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
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.forgotPasswordForm.controls; }
    forgot() { }

    onSubmit() {
        // this.router.navigate([this.returnUrl]);
        this.showLoaderImg = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.forgotPassword(this.f.email.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.showLoaderImg = false;
                    this.router.navigate(['/pages/auth/login']);
                },
                error => {
                    this.alertService.error(error, 'Error');
                    this.loading = false;
                });
              }
}
