import { Component, OnDestroy, OnInit , ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { AlertService, AuthenticationService } from '../../../../_services';
import { first } from 'rxjs/operators';

@Component({
    selector     : 'reset-password',
    templateUrl  : './reset-password.component.html',
    styleUrls    : ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy
{
    forgotPasswordForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    showLoaderImg = false;
    email: string;
    res: any;
    resetPasswordForm: FormGroup;
    resetToken:String;
    get f() { return this.resetPasswordForm.controls; }

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor
    (
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
        this._fuseConfigService.config =
        {
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.resetToken = this.route.snapshot.queryParams["resetToken"];
        this.resetPasswordForm = this._formBuilder.group({
            email          : ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9]+.[a-z]{2,4}$")]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() =>
        {
            this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSubmit()
    {
        console.log(this.resetPasswordForm);
        if (this.resetPasswordForm.invalid)
        {
            return;
        }
        this.loading = true;

            console.log(this.resetToken);
            
        this.authenticationService.userChangePassword(this.resetToken,this.f.password.value,)
        .pipe(first()).subscribe(
        data => {
            console.log(data);
            this.showLoaderImg = false;
            this.router.navigate(['/pages/auth/login']);
        },
        error => {
            this.alertService.error(error, 'Error');
            this.loading = false;
        });
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
