import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import * as moment from 'moment';
@Component(
{
    selector: 'app-edit-clause-terms',
    templateUrl: './edit-clause-terms.component.html',
    styleUrls: ['./edit-clause-terms.component.scss']
})

export class EditClauseTermsComponent implements OnInit
{
    clauseTermsForm: FormGroup;
    typeData: any;
    loading = false;
    submitted = false;
    parentId: String;
    nos: Number;
    termsName: String;
    returnUrl: String;
    showLoaderImg = false;
    // Private
    submitRes: any;
    clauseTermsId:String;
    clauseTermsListRes:any;
    clauseTermsData:any;
    clauseTerms:String;
    cpId:String;

    cpFormListRes : any;
    cpFormListData : [];

    cpFormId : any;

    clauseTermsRes : any;
    helpModal = false;

    current_date : any;
    current_time : any;

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
        this.showLoaderImg = false;
    }

    ngOnInit()
    {
        this.typeData = JSON.parse(localStorage.getItem('clauseTermsData'));
        this.current_date = moment(new Date()).format("YYYY-MM-DD");
        this.current_time = moment().format("H:MM");
        console.log(this.typeData);

        this.clauseTermsForm = this._formBuilder.group(
        {
            cpFormId : [this.typeData.cpFormId, Validators.required],
            parentId: [this.typeData.parentId, Validators.required],
            nos: [this.typeData.nos, Validators.required],
            termsName: [this.typeData.termsName, Validators.required],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/clause-terms-management';
        
        this.cpFormRecords();

        this.cpFormId = this.typeData.cpFormId;
        this.clauseTermsForm.controls['parentId'].setValue('');
        this.getClauseCategoryRecords();
        this.parentId = this.typeData.parentId;

        setTimeout(()=> this.clauseTermsForm.controls['parentId'].setValue(this.typeData.parentId),500);
    }

    showHelpModal()
    {
        console.log('HERE IN MODAL');
        console.log(this.helpModal);
        this.helpModal = !this.helpModal;
    }


    get f() { return this.clauseTermsForm.controls; }

    cpFormRecords(): void {
        try {
            this._userService.getFormList()
            .pipe(first())
            .subscribe((res) => {
                this.cpFormListRes = res;
                console.log(res);
                if (this.cpFormListRes.success === true)
                {
                    this.cpFormListData = this.cpFormListRes.data;
                    console.log(this.cpFormListData);
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
        this.parentId = event.target.value;
    }

    onChangeCPForm(event)
    {
        this.cpFormId = event.value;
        this.clauseTermsForm.controls['parentId'].setValue('');
        this.getClauseCategoryRecords();
    }

    getClauseCategoryRecords(): void
    {
        try
        {
            var arrfilterInfo = {};
            arrfilterInfo["cpFormId"] = this.cpFormId;

            this._userService.clauseCategoryServerSideRecords(arrfilterInfo)
                .pipe(first())
                .subscribe((res) =>
                {
                    console.log(res);
                    this.clauseTermsRes = res;
                    
                    if (this.clauseTermsRes.success === true)
                    {
                        this.clauseTermsData = this.clauseTermsRes.data;
                        console.log(this.clauseTermsData);
                    }
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });
        } catch (err)
        {
            console.log(err);
        }
    }
    
    onSubmit()
    {
        this.showLoaderImg = true;
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.clauseTermsForm.invalid)
        {
            console.log("VALIDATION ERROR");
            console.log(this.clauseTermsForm);
            console.log(this.clauseTermsForm.invalid);
        } else {
            console.log("add");
            const reqData =
            {
                id: this.typeData.id,
                parentId: this.f.parentId.value,
                nos: this.f.nos.value,
                termsName: this.f.termsName.value,
                updatedBy: localStorage.getItem('userId'),
                // "clauseTermsId":this.f.clauseTermsId.value
            }
            console.log(reqData);
            this.loading = true;
            this._userService.getclusesupdate(reqData)
                .pipe(first())
                .subscribe(
                data =>
                {
                    console.log(data);
                    this.showLoaderImg = false;
                    this.submitRes = data;
                    if (this.submitRes.success === true)
                    {
                        this.alertService.success(this.submitRes.message, 'Success');
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.alertService.error(this.submitRes.message, 'Error');
                    }
                    console.log(data);
                },
                error =>
                {
                    console.log(error.message);
                    this.alertService.error(error.message, 'Error');
                    this.loading = false;
                });
        }
    }
}