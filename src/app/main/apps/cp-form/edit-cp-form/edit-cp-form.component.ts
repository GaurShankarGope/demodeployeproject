
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, UserService } from '../../../../_services';
// import { FuseConfigService } from '@fuse/services/config.service';
// import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { HttpClient } from '@angular/common/http';
// import { config } from '../../../../config/config';

@Component(
{
    selector: 'app-edit-cp-form',
    templateUrl: './edit-cp-form.component.html',
    styleUrls: ['./edit-cp-form.component.scss']
})

export class EditCpFormComponent implements OnInit
{
    cpformName: String;
    cpManagementForm: FormGroup;
    typeData: any;
    loading = false;
    submitted = false;
    returnUrl: String;
    showLoaderImg = false;
    submitRes: any;

    helpModal = false;
    
    /**
    * Constructor
    *
    * @param {FuseSidebarService} _fuseSidebarService
    * */
    
    constructor
    (
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _userService: UserService,
        private http: HttpClient,
        private alertService: AlertService
    )
    {
        this.showLoaderImg = false;
    }

    ngOnInit()
    {
        this.typeData = JSON.parse(localStorage.getItem('cpformdata'));
        this.cpManagementForm = this._formBuilder.group(
        {
            cpformName: [this.typeData.cpformName, [ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            description: [this.typeData.description, [ Validators.required]]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/cp-form-management';
    }

    showHelpModal()
    {
        console.log('HERE IN MODAL');
        console.log(this.helpModal);
        this.helpModal = !this.helpModal;
    }


    get f() { return this.cpManagementForm.controls; }

    onSubmit()
    {
        this.showLoaderImg = true;
        this.submitted = true;
        this.alertService.clear();
        if (this.cpManagementForm.invalid)
        {
            return;
        } else {
            const reqData =
            {
                "id": this.typeData.id,
                "cpformName": this.f.cpformName.value,
                "description": this.f.description.value,
            }
            this.loading = true;
            this._userService.getFormedit(reqData).pipe(first()).subscribe(data =>
            {
                this.showLoaderImg = false;
                this.submitRes = data;
                if (this.submitRes.success === true)
                {
                    this.alertService.success(this.submitRes.message, 'Success');
                    this.router.navigate([this.returnUrl]);
                } else {
                    this.alertService.error(this.submitRes.message, 'Error');
                }
            },
            error =>
            {
                this.alertService.error(error.message, 'Error');
                this.loading = false;
            });
        }
    }
}