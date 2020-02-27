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

@Component(
{
    selector: 'app-add-cp-form',
    templateUrl: './add-cp-form.component.html',
    styleUrls: ['./add-cp-form.component.scss']
})

export class AddCpFormComponent implements OnInit
{
    cpformName:String;
    cpManagementForm: FormGroup;
    loading = false;
    submitted = false;
    createtypeRes :any;
    returnUrl: string;

    helpModal = false;

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
        this.cpManagementForm = this._formBuilder.group(
        {
            cpformName: ['', [ Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
            description: ['', [ Validators.required]]
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

    onSubmit(): void
    {
        this.submitted = true;
        this.alertService.clear();
        if (this.cpManagementForm.invalid)
        {
            return;
        } else {
            const req =
            {
                cpformName: this.f.cpformName.value,
                description: this.f.description.value,
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
                this.http.post(`${config.baseUrl}/cpFromcreate`, req, headerOptions).subscribe(res =>
                {
                    this.createtypeRes = res;
                    if (this.createtypeRes.success === true)
                    {
                        this.alertService.success(this.createtypeRes.message, 'Success');
                        this.cpManagementForm.reset();
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