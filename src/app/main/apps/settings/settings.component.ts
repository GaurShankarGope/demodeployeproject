import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AlertService, AuthenticationService } from '../../../../_services';
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


@Component(
{
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class SettingsComponent implements OnInit
{

    companyId: string;

    companyManagementRes: any;
    companyManagementData= [];

    SettingsManagementForm : FormGroup;

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
        
    )
    {
        
    }

    ngOnInit()
    {
        
        this.companyId = localStorage.getItem('companyId');
        // localStorage.setItem('companyId','1');
        
        this.SettingsManagementForm = this._formBuilder.group(
        {
            companyId: [this.companyId, '']
        });

        this.companyRecords();
    }

    get settingsForm() { return this.SettingsManagementForm.controls; }

    // Fetch Company Records Start
    
        companyRecords(): void
        {
            var companyIds = localStorage.getItem('companyIds');
            var arrfilterInfo = {};
                arrfilterInfo["companyIDS"] = companyIds.split(',');
            try
            {
                this._userService.getUsersCompanyList(arrfilterInfo)
                    .pipe(first())
                    .subscribe((res) =>
                    {
                        this.companyManagementRes = res;
                        if (this.companyManagementRes.success === true)
                        {
                            this.companyManagementData = this.companyManagementRes.data;
                        }
                        console.log(this.companyManagementData);
                    },
                    err =>
                    {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err)
            {}
        }

        setCurrentCompany(event): void
        {
            this.companyId = event.target.value;
            localStorage.setItem('companyId',this.companyId);
            console.log(event.target.value);
            if(this.settingsForm.companyId.value == 0)
            {
                this.alertService.error('You need to select a company.', 'Company Error');
            } else {
                // this.alertService.success('Current Company Updated Successfully.', 'Updated Successfully');
                // setTimeout(() => location.reload(),3000);
            }
        }

    // Fetch Company Records End

    // On Setting Submit Start

        onSubmit(): void
        {
            this.alertService.clear();
        
            var isValid = 1;

            if(this.settingsForm.companyId.value == 0)
            {
                isValid = 0;
                this.alertService.error('Please Select Company', 'Required');
            } else 
            {
                localStorage.setItem('companyId',this.companyId);
            }

            if(isValid == 0)
            {
                return;
            }  else {
                location.reload();    
            }
        }
    
    // On Setting Submit End
}
