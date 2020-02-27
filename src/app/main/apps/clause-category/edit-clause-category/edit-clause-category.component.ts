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
    selector: 'app-edit-clause-category',
    templateUrl: './edit-clause-category.component.html',
    styleUrls: ['./edit-clause-category.component.scss']
})

export class EditClauseCategoryComponent implements OnInit
{
    typeManagementeditForm: FormGroup;
    typeData: any;
    loading = false;
    submitted = false;
    name: String;
    returnUrl: String;
    showLoaderImg = false;
    
    // Private
    submitRes: any;
    cpFormId:String;
    cpFormListRes:any;
    cpFormData:any;
    cpForm:String;
    cpId:String;

    dataID:string;
    statusAction:string;

    updateDataReqeust : any;
    activeModalStatus = false;
    inActiveModalStatus = false;

    
    /*

    * @param {FuseSidebarService} _fuseSidebarService

    */
    constructor
    (
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _userService: UserService,
        
        // private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService
    )
    {
        // Configure the layout
        this.showLoaderImg = false;
    }

    ngOnInit()
    {
        this.typeData = JSON.parse(localStorage.getItem('clauseCategoryData'));
        this.typeManagementeditForm = this._formBuilder.group(
        {
            cpFormId: [this.typeData.cpFormId, Validators.required],
            name: [this.typeData.name, Validators.required],
        });
        this.cpFormId = this.typeData.cpFormId;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/clause-category-management';
        this.fromList();
    }
    
    get f() { return this.typeManagementeditForm.controls; }

    fromList(): void
    {
        try 
        {
            this._userService.getFormList()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.cpFormListRes = res;
                    console.log(res);
                    if (this.cpFormListRes.success === true)
                    {
                        this.cpFormData = this.cpFormListRes.data;
                        console.log(this.cpFormData);
                    }
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    }

    selectCpType(event)
    {
        this.cpFormId = event.target.value;
    }

    onSubmit()
    {
        this.showLoaderImg = true;
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.typeManagementeditForm.invalid)
        {
            return;
        } else {
            const reqData =
            {
                "id": this.typeData.id,
                "name": this.f.name.value,
                "cpFormId":this.cpFormId
            }
            this.loading = true;
            this._userService.getclusesCategoryupdate(reqData)
                .pipe(first())
                .subscribe(
                data => 
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

    updateDataStatus(): void
    {
        const req =
        {
            id: this.dataID,
            isActive: this.statusAction,
            updatedBy: localStorage.getItem('userId'),
        };
        this._userService.cpFormStatusUpdate(req)
            .pipe(first())
            .subscribe(
            data =>
            {
                this.updateDataReqeust = data;
                if (this.updateDataReqeust.success === true)
                {
                    this.alertService.success(this.updateDataReqeust.message, 'Success');
                    if(req.isActive == 'Y')
                    {
                        this.activeModalStatus = !this.activeModalStatus;
                    } else {
                        this.inActiveModalStatus = !this.inActiveModalStatus;
                    }
                    this.fromList();
                } else {
                    this.alertService.error(this.updateDataReqeust.message, 'Error');
                }
            },
            error =>
            {
                this.alertService.error(error.message, 'Error');
            });
    }

    showActiveModal(status,id): void
    {
        this.dataID = id;
        this.statusAction = status;
        this.activeModalStatus = !this.activeModalStatus;
    }

    hideActiveModal(): void
    {
        this.activeModalStatus = !this.activeModalStatus;
    }

    showInActiveModal(status,id): void
    {
        this.dataID = id;
        this.statusAction = status;
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }

    hideInActiveModal(): void
    {
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }
}