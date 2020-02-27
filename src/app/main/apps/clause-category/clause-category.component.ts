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
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';

export interface PeriodicElement
{
    id:string;
    cpformName: String;
    name: string;
    isActive : string; 
}

@Component(
{
    selector: 'app-clause-category',
    templateUrl: './clause-category.component.html',
    styleUrls: ['./clause-category.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ClauseCategoryComponent implements OnInit
{
    displayedColumns: string[] = ['id', 'cpformName', 'name', 'isActive', 'action'];
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
    name: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    clauseCategory: any;
    clauseCategoryRes: any;
    clauseCategoryData= [];
    cols: any[];
    cpFormListRes: any;
    cpFormListData: any;

    clauseCategoryEditDataRes:any;
    clauseCategoryEditData:[];

    dataID : string;
    statusAction : string;

    updateDataReqeust : any;

    activeModalStatus = false;
    inActiveModalStatus = false;


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
        this.dataSource = new MatTableDataSource(this.clauseCategoryData);
    }

    ngOnInit()
    {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.clauseCategoryType();
    }

    fromList(): void 
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
        } catch (err)
        {
        }
    }

    clauseCategoryType(): void
    {
        this.clauseCategoryData = [];
        try
        {
            this._userService.getclusesCategoryList()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.clauseCategoryRes = res;
                    if (this.clauseCategoryRes.success === true)
                    {
                        this.clauseCategoryData = this.clauseCategoryRes.data;
                        this.dataSource = new MatTableDataSource(this.clauseCategoryData);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                });
        } catch (err)
        {
            console.log(err);
        }
    }

    editUser(data): void
    {
        localStorage.setItem('clauseCategoryData', JSON.stringify(data));
        this.router.navigate(['/apps/clause-category-management/edit']);
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

    deleteCharterPartyType(): void
    {
        const req =
        {
            id: this.id,
        };
        try
        {
            this.http
                .post(`${config.baseUrl}/clusesCategorydelete`, req, {})
                .subscribe(
                    res =>
                    {
                        this.clauseCategoryRes = res;
                        if (this.clauseCategoryRes.success === true)
                        {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.clauseCategoryType();
                        } else {
                            this.alertService.error(this.clauseCategoryRes.message, 'Error');
                        }
                    },
                    err => 
                    {
                        this.alertService.error(err.message, 'Error');
                    }
                );
        } catch (err)
        {
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
        this._userService.clauseCategoryStatusUpdate(req)
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
                    this.clauseCategoryType();
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