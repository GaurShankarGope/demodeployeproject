import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import {FormGroupDirective, NgForm,} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import * as moment from 'moment';

@Component(
{
    selector: 'app-term-management',
    templateUrl: './term-management.component.html',
    styleUrls: ['./term-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TermManagementComponent implements OnInit
{

    panelOpenState = false;
    // Assign API Data Response And Array Variables Start
    termRecordsResponse: any;
    termRecordsResponseArray = [];
    // Assign API Data Response And Array Variables End
    
    /**
     * Constructor
     *
     *  @param {ContactsService} _contactsService
     *  @param {FuseSidebarService} _fuseSidebarService
     *  @param {MatDialog} _matDialog
     *  @param {FormBuilder} _formBuilder
     */

    constructor
    (
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router,

        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
    ){}

    ngOnInit()
    {
        this.termRecords();
    }

    // term Records
    termRecords(): void
    {
        try 
        {
            this._userService.tclist()
            .pipe(first())
            .subscribe((res) =>
            {
                this.termRecordsResponse = res;
                if (this.termRecordsResponse.success === true)
                {
                    this.termRecordsResponseArray = this.termRecordsResponse.data;
                }
            },err => {});
        } catch (err) {}
    }
}
