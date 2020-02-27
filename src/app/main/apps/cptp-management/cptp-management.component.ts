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

import { UserService } from '../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';

export interface PeriodicElement
{
    id:String;
    CPTypeId:String;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;

    CharterPartyFormName:String;
    charterPartyTypeName: string;
    chartererName: string;
    ownerName: string;
    vesselName: string;
    charterBrokerName: string;
    ownerBrokerName: string;
}

@Component(
{
    selector: 'app-cptp-management',
    templateUrl: './cptp-management.component.html',
    styleUrls: ['./cptp-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CptpManagementComponent implements OnInit
{
    displayedColumns: string[] = ['id','cpDate', 'chartererName', 'ownerName', 'vesselName', 'progress','statusInfo', 'action'];


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
    
    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;

    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    drawManagement: any;
    drawManagementRes: any;
    drawManagementData= [];
    cols: any[];
    drawRecordsListRes: any;
    drawRecordsListData: any;

  
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */

    constructor
    (
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router
    )
    {
        this.dataSource = new MatTableDataSource(this.drawManagementData);
    }

    ngOnInit()
    {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.drawManagementRecords();
    }

    drawManagementRecords(): void
    {
        this.drawManagementData = [];
        try
        {
            this._userService.drawFormRecords()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.drawManagementRes = res;
                    console.log('Main Draw Management Records');
                    console.log(res);
                    if (this.drawManagementRes.success === true)
                    {
                        this.drawManagementData = this.drawManagementRes.data;
                        this.dataSource = new MatTableDataSource(this.drawManagementRes.data);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        console.log("Final Records");
                        console.log(this.drawManagementData);
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

    editdrawManagementData(data): void
    {
        console.log('Data For Edit');
        console.log(data);
        localStorage.setItem('drawManagementData', JSON.stringify(data));
        this.router.navigate(['/apps/draw-management/edit']);
    }

    showDeleteModal(id): void
    {
        this.id = id;
        this.showModalStatus = !this.showModalStatus;
    }

    hideDeleteModal(): void
    {
        this.showModalStatus = !this.showModalStatus;
    }

    deletedrawManagementData(): void
    {
        const req =
        {
            id: this.id,
        };
        try
        {
            this.http
                .post(`${config.baseUrl}/drawDataRemove`, req, {})
                .subscribe
                (
                    res =>
                    {
                        console.log(res);
                        this.drawManagementRes = res;
                        if (this.drawManagementRes.success === true)
                        {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.drawManagementRecords();
                        } else {
                            this.alertService.error(this.drawManagementRes.message, 'Error');
                        }
                    },
                    err =>
                    {
                        console.log(err);
                        this.alertService.error(err.message, 'Error');
                    }
                );
        } catch (err)
        {
            console.log(err);
        }
    }
}
