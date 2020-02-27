import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import {Component} from '@angular/core';
import { UserService } from '../../../_services/user.service';
// import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService } from '../../../_services';
import { Router } from '@angular/router';

@Component({
    selector: 'vessel-management',
    templateUrl: './vessel-management.component.html',
    styleUrls: ['./vessel-management.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class VesselManagementComponent implements OnInit, OnDestroy {
    cols: any[];
    vesselList: any;
    selectedVessels: any[];
    VesselListRes: any;
    VesselListData: any;
    showModalStatus = false;
    deleteVesselRes: any;
    userDeleteVesselId: any;
    // Privat

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router
    ) {
        this.vesselList = [];
        this.selectedVessels = [];
        console.log(this.selectedVessels);

        let userToken = localStorage.getItem('userToken')
        if(userToken==undefined){
            this.router.navigate(['/']);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.VesselList();
        // this.carService.getCarsSmall().then(cars => this.cars = cars);
        this.cols = [
            { field: 'imo', header: 'imo' },
            { field: 'vessel_name', header: 'Vessel-Name' },
            { field: 'dwt', header: 'dwt' },
            { field: 'id_port', header: 'Port' },
            { field: '', header: 'Lay-Can' },
            { field: '', header: 'Zone' },
            { field: 'ideas', header: 'ideas' },
            { field: 'id_comment', header: 'Comment' },
            { field: 'last_update', header: 'Last Updated' }
            // { field: 'button', header: 'Action' }
        ];
        console.log(this.selectedVessels);
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }


    VesselList(): void {
        try {
            this._userService.VesselList()
                .pipe(first())
                .subscribe((res) => {
                    this.VesselListRes = res;
                    console.log(res);
                    if (this.VesselListRes.success === true) {
                        this.VesselListData = this.VesselListRes.data;
                        console.log(this.VesselListData);
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                        console.log(err);
                    });

        } catch (err) {
            console.log(err);
        }
    }

    showVesselDeleteModal(): void {
        console.log(this.userDeleteVesselId);
        this.userDeleteVesselId = this.userDeleteVesselId;
        this.showModalStatus = !this.showModalStatus;
    }
    hideDeleteModal(): void {
        this.showModalStatus = !this.showModalStatus;
    }

    // Delete Vessel
    doDeleteVessel(): void {
        const requestData = {
            id: this.userDeleteVesselId,
            isDelete: 'Y',
        };
        try {
            this._userService.deleteVessel(requestData)
                .subscribe(
                    res => {
                        console.log(res);
                        this.deleteVesselRes = res;
                        if (this.deleteVesselRes.success === true) {
                            this.showModalStatus = false;
                            this.alertService.success('Successfully Deleted', 'Success');
                            this.VesselList();
                        } else {
                            this.alertService.error(this.deleteVesselRes.message, 'Error');
                        }
                    },
                    err => {
                        console.log(err);
                        this.alertService.error(err.message, 'Error');
                    }
                );
        } catch (err) {
            console.log(err);
        }
    }

    // Edit Vessel
    editVessel(data): void {
        console.log(data);         
        localStorage.setItem('vesselId', data.id);
        this.router.navigate(['/apps/vessel-management/edit-vessel']);
    }

     // Detail Vessel
     detailVessel(data): void {
        console.log('asdasdfffsfsdfsd',data);
        localStorage.setItem('vesselId', data.id);
        this.router.navigate(['/apps/vessel-management/vessel-detail']);
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    changeRole(event): void {
        console.log(event.target.value);
    }
}
