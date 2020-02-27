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

export interface UserData
{
    id: string;
    fromUserId: string;
    toUserId: string;
    notification: string;
    is_read: string;
    fromUserName: string;
    toUserName: string;
    createdAt: string;
    updatedAt: string;

}

export interface PeriodicElement
{
    
    id:String;
    fromUserId: string;
    toUserId: string;
    notification: string;
    is_read: string;

    fromUserName: string;
    toUserName: string;
}

@Component(
{
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class NotificationComponent implements OnInit
{
    displayedColumns: string[] = ['id', 'notification', 'createdAt'];
    dataSource = new MatTableDataSource<PeriodicElement>();

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    applyFilter(filterValue: string)
    {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    id: string;
    
    fromUserId: string;
    toUserId: string;
    notification: string;
    is_read: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;

    notificationInfo: any;
    notificationInfoRes: any;
    notificationInfoData= [];
    
    cols: any[];
    
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

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
        this.dataSource = new MatTableDataSource(this.notificationInfoData);
    }

    ngOnInit()
    {
        this.notificationRecords();
    }

    notificationRecords(): void
    {
        this.notificationInfo = [];
        
        this.toUserId =  localStorage.getItem('userId');
        var arrfilterInfo = {};

        arrfilterInfo["toUserId"] = this.toUserId;
        
        try
        {
            this._userService.notificationRecords(arrfilterInfo)
                .pipe(first())
                .subscribe((res) =>
                {
                    this.notificationInfoRes = res;
                    
                    if (this.notificationInfoRes.success === true)
                    {
                        this.notificationInfoData = this.notificationInfoRes.data;
                        this.dataSource = new MatTableDataSource(this.notificationInfoRes.data);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                    console.log(this.notificationInfoData);
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                });
            } catch (err)
            {
            }
    }
}