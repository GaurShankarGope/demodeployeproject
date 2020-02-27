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

export interface UserData 
{
    id: string;
    name: string; 
}

@Component(
{
    selector: 'app-add-clause-category',
    templateUrl: './add-clause-category.component.html',
    styleUrls: ['./add-clause-category.component.scss']
})

export class AddClauseCategoryComponent implements OnInit
{
    name:String;
    typeManagementForm: FormGroup;
    loading = false;
    submitted = false;
    createtypeRes :any;
    returnUrl: string;
    cpFormId:String;
    
    chartertypelist :any;

    cpFormRes: any;
    cpFormData: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FormBuilder} _formBuilder
     * @param {MatDialog} _matDialog
     */

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService
    ){
        this._unsubscribeAll = new Subject();
    }

    ngOnInit()
    {
        this.typeManagementForm = this._formBuilder.group(
        {
            cpFormId: ['', Validators.required],
            name: ['', Validators.required],
        });
        
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/clause-category-management';
        this.fromList()
    }
    
    get f() { return this.typeManagementForm.controls; }

    fromList(): void
    {
        try
        {
            this._userService.getFormList()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.cpFormRes = res;
                    if (this.cpFormRes.success === true)
                    {
                        this.cpFormData = this.cpFormRes.data;
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
        if (this.typeManagementForm.invalid)
        {
            return;
        } else {
            const req =
            {
                name: this.f.name.value,
                cpFormId:this.f.cpFormId.value,
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
                this.http.post(`${config.baseUrl}/clusesCategorycreate`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true)
                        {
                            this.alertService.success(this.createtypeRes.message, 'Success');
                            this.typeManagementForm.reset();
                            this.router.navigate([this.returnUrl]);
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