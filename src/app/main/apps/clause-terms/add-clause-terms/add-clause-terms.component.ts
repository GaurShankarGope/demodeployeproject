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
import { $ } from 'protractor';
import * as moment from 'moment';

export interface UserData
{
    id: string;
    parentId: string; 
    nos: Number; 
    termsName: string; 
}

@Component(
{
    selector: 'app-add-clause-terms',
    templateUrl: './add-clause-terms.component.html',
    styleUrls: ['./add-clause-terms.component.scss']
})

export class AddClauseTermsComponent implements OnInit
{
    formId : string;

    cpFormIdInfo : any;

    parentId:String;
    nos:Number;
    termsName:String;
    clauseTermsForm: FormGroup;
    loading = false;
    submitted = false;
    createtypeRes :any;
    returnUrl: string;
    cpFormId:String;
    clauseTerms :any;
    clauseTermsRes: any;
    clauseTermsData: any;

    cpFormListRes : any;
    cpFormListData : [];

    helpModal = false;

    current_date : any;
    current_time : any;

    // Private
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     *  @param {ContactsService} _contactsService
     *  @param {FuseSidebarService} _fuseSidebarService
     *  @param {FormBuilder} _formBuilder
     *  @param {MatDialog} _matDialog
     */

    constructor
    (
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService
    )
    {
        this._unsubscribeAll = new Subject();
    }
 
    ngOnInit()
    {
        this.current_date = moment(new Date()).format("YYYY-MM-DD");
        this.current_time = moment().format("H:MM");
        this.clauseTermsForm = this._formBuilder.group(
        {
            cpFormId: ['', Validators.required],
            parentId: ['', Validators.required],
            // nos: ['', Validators.required],
            termsName: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/clause-terms-management';
        this.cpFormRecords();
    }

    showHelpModal()
    {
        console.log('HERE IN MODAL');
        console.log(this.helpModal);
        this.helpModal = !this.helpModal;
    }


    get f() { return this.clauseTermsForm.controls; }

    cpFormRecords(): void
    {
        try
        {
            this._userService.getFormList()
            .pipe(first())
            .subscribe((res) =>
            {
                this.cpFormListRes = res;
                if (this.cpFormListRes.success === true)
                {
                    this.cpFormListData = this.cpFormListRes.data;
                }
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err) {}
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
                    this.clauseTermsRes = res;
                    
                    if (this.clauseTermsRes.success === true)
                    {
                        this.clauseTermsData = this.clauseTermsRes.data;
                    }
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                });
        } catch (err)
        {
        }
    }
 
    onSubmit(): void
    {
        this.submitted = true;
        this.alertService.clear();
        if (this.clauseTermsForm.invalid)
        { 
            return;
        } else {
            const req =
            {
                
                parentId:this.f.parentId.value,
                nos:this.f.nos.value,
                termsName: this.f.termsName.value,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            };

            this.loading = true;
            try
            {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/clusescreate`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true)
                        {
                            this.alertService.success(this.createtypeRes.message, 'Success');
                            this.clauseTermsForm.reset(); this.router.navigate([this.returnUrl]);
                        } else {
                            this.alertService.error(this.createtypeRes.message, 'Error');
                        }
                    },
                    err =>
                    {
                        this.alertService.error(err, 'Error');
                    }
                );
            } catch (err)
            {
            } 
        }
    }
}