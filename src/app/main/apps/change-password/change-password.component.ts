import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService, AuthenticationService } from '../../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn, FormControl } from '@angular/forms';
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
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    oldpassword : string;
    newpassword : string;
    repassword: string;
    usersId: any;
    res: any;

    // pokemon: Pokemon[];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,        
        private _userService: UserService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,) {

        // Assign the data to the data source for the table to render
     
        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }
        
    }

    ngOnInit(): void {
        this.usersId = JSON.parse(localStorage.getItem('userId'));
        this.changePasswordForm = this._formBuilder.group({        
            oldpassword: ['', Validators.required],
            newpassword: ['', Validators.required],
            repassword: ['', [Validators.required, confirmPasswordValidator]],        
        });
      
        this.changePasswordForm.get('newpassword').valueChanges
        // .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
        this.changePasswordForm.get('repassword').updateValueAndValidity();
        });
        
    }
    get f()
    { 
        return this.changePasswordForm.controls; 
    }

    onSubmit() 
    {

        this.submitted = true;
        console.log('log', this.submitted);
        
        if (this.changePasswordForm.invalid) 
        {
        return;
        }
        this.authenticationService.changePassword(this.f.oldpassword.value, this.f.newpassword.value, this.usersId)
        .pipe(first())
        .subscribe(
        data => {
            this.res = data;
            console.log(this.res,"res");
            if (data.success === true) {
                this.alertService.success('Password updated successfully', 'Success'); 
                console.log(this.alertService.success); 
                this.router.navigate(['/pages/auth/login']);
                localStorage.clear();               
            }else {
                this.alertService.error(data.message, 'Error');            
            }
            
            err => {
                console.log(err);
                this.alertService.error(err.message, 'Error');
            }
            
        });    
         
    }
 
    // logout() {
    //     console.log('log');
    //     this.authenticationService.logout();
    //     this.router.navigate(['/pages/auth/login']);
    //  } 
}






export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('newpassword');
    const passwordConfirm = control.parent.get('repassword');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};

