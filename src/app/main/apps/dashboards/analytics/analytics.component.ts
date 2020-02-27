import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import { FormGroupDirective, NgForm, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';

import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import * as shape from 'd3-shape';


export interface PeriodicElement {
    id: String;
    identifier: string;
    CPTypeId: String;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpDateInfo: string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    companyId: string;
    isAccepted: string;

    chartererName: string;

    CharterPartyFormName: String;
    charterPartyTypeName: string;

    ownerName: string;
    vesselName: string;
    brokerName: string;

    newAction: string;

    std_bid_name: string;

    isOwnerAccepted: string;

    ownerActionButton: string;

    chartererNameInfo: string;

    ownerNameInfo: string;
}

@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})


export class AnalyticsDashboardComponent implements OnInit {
    widget6: any = {};


    step : 'step1';

    activeStep : any;

    widgets: any;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    name: string;
    position: number;
    date: string;
    schar: string;
    symbol: string;
    charterer: string;

    userRecordsServerSideResponse: any;
    userRecordsServerSideResponseData = [];

    tradingRecordsServerSideResponse: any;
    tradingRecordsServerSideResponseData = [];

    tradeStatusDataServerSideResponse: any;
    tradeStatusDataServerSideResponseData = [];

    // Vessel Search Form Settings Start

    vesselName: string;
    keywords: string;
    dateMin: string;
    dateMax: string;
    owner: string;
    vessel_type: string;
    status: string;
    charterer_broker: string;
    owner_broker: string;
    fixture_id: string;

    owner_signed: string;
    charterer_signed: string;

    owner_not_signed: string;
    charterer_not_signed: string;
    cp_not_signed: string;

    advanceView = false;

    createTradeButtonView: any;

    isBrokerView: any;
    isChartererView: any;
    isOwnerView: any;

    isEditView: any;
    isRecapView: any;

    acceptRejectTitle: any;
    afteracceptRejectTitle: any;
    active: number;
    notSigned: number;
    Signed: number;
    vesselSearchForm: FormGroup;

    searchdetail: any;
    get vesselSearchFormValues() { return this.vesselSearchForm.controls; }
    // Vessel Search Form Settings End

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;


    tradingRecordsDisplayColumn: string[] = ['identifier', 'cpDateInfo', 'brokerName', 'chartererName', 'ownerName', 'vesselName',
        'progress', 'statusInfo'];
    tradingRecordsData = new MatTableDataSource<PeriodicElement>();

    tradingArchivedDisplayColumn: string[] = ['identifier', 'cpDateInfo', 'brokerName', 'chartererName', 'ownerName', 'vesselName',
        'progress', 'statusInfo'];
    tradingArchivedData = new MatTableDataSource<PeriodicElement>();

    applyFilter(filterValue: string) {
        this.tradingRecordsData.filter = filterValue.trim().toLowerCase();
        this.tradingArchivedData.filter = filterValue.trim().toLowerCase();
    }


    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _analyticsDashboardService: AnalyticsDashboardService,
        private router: Router,
    ) {
        // Register the custom chart.js plugin
        // this._registerCustomChartJSPlugin();
        console.log('Application loaded. Initializing data.');
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponseData);
        let userToken = localStorage.getItem('userToken')
        if (userToken == undefined) {
            this.router.navigate(['/']);
        }

        this.widget6 = {
            currentRange: 'TW',
            legend: false,
            explodeSlices: false,
            labels: true,
            doughnut: true,
            gradient: false,
            scheme: {
                domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
            },
            onSelect: (ev) => {
                console.log(ev);
            }
        };
    }

    companyId: string;

    tradeStatusDataServerSideResponsefull: any;
    tradeStatusDataServerSideResponseDatafull = [];



    tradingFixtureRecordsServerSideResponse: any;
    tradingFixtureRecordsServerSideResponseData = [];

    brokerRecordsServerSideResponse: any;
    brokerRecordsServerSideResponseData = [];

    ownerRecordsServerSideResponse: any;
    ownerRecordsServerSideResponseData = [];

    chartererRecordsServerSideResponse: any;
    chartererRecordsServerSideResponseData = [];

    cityRecordsServerSideResponse: any;
    cityRecordsServerSideResponseData = [];

    is_owner_detail_term_sign_off: string;
    is_charterer_detail_term_sign_off: string;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {

        this.activeStep = 'Step1';

        this.companyId = JSON.parse(localStorage.getItem('companyId'));

        // Get the widgets from the service
        this.widgets = this._analyticsDashboardService.widgets;
        this.newUsersRecords();

        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
        this.tradingRecordsServerSide();

        // Vessel Search Form
        this.vesselSearchForm = this._formBuilder.group(
            {
                vesselName: ['', ''],
                ownerId: ['', ''],
                chartererId: ['', ''],
                brokerId: ['', ''],
                cpDate: ['', ''],
                fixtureId: ['', ''],
                cpCity: ['', '']
            });

        // Assign Default Values Start
        this.isBrokerView = 'N';
        this.isChartererView = 'N';
        this.isOwnerView = 'N';
        // Assign Default Values End

        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            this.createTradeButtonView = true;
            this.isBrokerView = 'Y';
            this.isEditView = true;
            this.isRecapView = true;
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            this.acceptRejectTitle = 'Participate / Boycott';
            this.afteracceptRejectTitle = 'BID';
            this.isChartererView = 'Y';
            this.isEditView = true;
            this.isRecapView = true;
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            this.acceptRejectTitle = 'Offer Accept / Reject';
            this.afteracceptRejectTitle = 'OFFER';
            this.isOwnerView = 'Y';
            this.isEditView = true;
            this.isRecapView = true;
        }

        this.tradeStatusData();

        this.brokerRecordsServerSide();
        this.ownerRecordsServerSide();
        this.chartererRecordsServerSide();
        this.tradingFixtureIDS();
        this.cityRecordsServerSide();

        this.is_charterer_detail_term_sign_off = undefined;
        this.is_owner_detail_term_sign_off = undefined;

        var pageRefresh = localStorage.getItem('pageRefresh');
        console.log(pageRefresh,"Page Refresh");
        if(pageRefresh == '' || pageRefresh == null || pageRefresh == undefined || pageRefresh == '2')
        {
            setInterval(() =>
            {
                this.checkPage();
            }, 1000);
        }

    }



    setActiveMenu(type)
    {
        this.activeStep = type;
        console.log(this.activeStep);
    }

    checkPage()
    {
        console.log('here');
        var pageRefresh = localStorage.getItem('pageRefresh');
        console.log(pageRefresh);
        if(pageRefresh != '' && pageRefresh != null && pageRefresh != undefined && pageRefresh != '1')
        {
            localStorage.setItem('pageRefresh','1');
            window.location.reload();
        }
    }


    onSelect(event) {
        this.searchdetail = event;
        if (this.searchdetail.name == "Signed") {
            this.tradingRecordsServerSideArchvied();

        }
        else if (this.searchdetail.name == "Unsigned") {
            this.tradingRecordsServerSideNotDone();
        }
        else if (this.searchdetail.name == "active") {
            this.tradingRecordsServerSideNotDone();
        }
        console.log(event);

    }
    tradingRecordsServerSideNotDone() {
        //  this.tradingRecordsServerSideResponseData  = [];
        //  var conditionData = {};
        //     conditionData["dcm.companyId"] = localStorage.getItem('companyId');
        //     conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
        //     conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
        //     conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        //  try
        //  {
        //      this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
        //      {
        //          this.tradingRecordsServerSideResponse = res;
        //          if (this.tradingRecordsServerSideResponse.success === true)
        //          {
        //             for (let index = 0; index < this.tradingRecordsServerSideResponse.data.length; index++) {
        //                 if(this.tradingRecordsServerSideResponse.data[index].progress !=100){
        //                     this.tradingRecordsServerSideResponseData.push(this.tradingRecordsServerSideResponse.data[index]);
        //                 }
        //             }

        //             //  this.tradingRecordsServerSideResponseData  = this.tradingRecordsServerSideResponse.data;
        //             //  setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 100);
        //          }
        //          setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 500);

        //          console.log(this.tradingRecordsServerSideResponseData);


        //      },err => { });
        //  } catch (err){}

      
        var conditionData = {};
        // conditionData["dcm.progress"] = '100';
        conditionData["dcm.companyId"] = localStorage.getItem('companyId');
        conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        try {
            this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success === true) {
                     this.tradingRecordsServerSideResponseData = [];
                    for (let index = 0; index < this.tradingRecordsServerSideResponse.data.length; index++) {
                        if (this.tradingRecordsServerSideResponse.data[index].progress != '100') {
                            console.log(index);
                           
                            this.tradingRecordsServerSideResponseData.push(this.tradingRecordsServerSideResponse.data[index]);
                    setTimeout(() => { this.setPaginatorOfTradingRecordsDataTablecopy(); }, 100);
                            
                        }
                    }
                    console.log(this.tradingRecordsServerSideResponseData);
                            
                    // this.tradingRecordsServerSideResponseData  = this.tradingRecordsServerSideResponse.data;
                }
            }, err => { });
        } catch (err) { }
    }

    resetForm() {
        this.vesselSearchForm.reset();
        this.advanceView = !this.advanceView;

    }

    chartererSigned(event) {
        this.is_charterer_detail_term_sign_off = (event.checked == true) ? '1' : '0';
    }

    ownerSigned(event) {
        this.is_owner_detail_term_sign_off = (event.checked == true) ? '1' : '0';
    }

    chartererNotSigned(event) {
        this.is_charterer_detail_term_sign_off = (event.checked == true) ? '0' : '1';
    }

    ownerNotSigned(event) {
        this.is_owner_detail_term_sign_off = (event.checked == true) ? '0' : '1';
    }

    // Fetch City Records Start
    cityRecordsServerSide(): void {
        try {
            this._userService.CityRecords()
                .pipe(first())
                .subscribe((res) => {
                    this.cityRecordsServerSideResponse = res;
                    if (this.cityRecordsServerSideResponse.success === true) {
                        this.cityRecordsServerSideResponseData = this.cityRecordsServerSideResponse.data;
                    }
                },
                    err => {
                    });
        } catch (err) { }
    }
    // Fetch City Records End

    tradeStatusData() {
        var filter = {};
        filter["companyId"] = JSON.parse(localStorage.getItem('companyId'));
        this._userService.tradeStatusData(filter).pipe(first())
            .subscribe(res => {
                this.tradeStatusDataServerSideResponse = res;
                if (this.tradeStatusDataServerSideResponse.success === true) {
                    this.tradeStatusDataServerSideResponseData.push(this.tradeStatusDataServerSideResponse.data);

                    this.active = this.tradeStatusDataServerSideResponseData[0].active;
                    this.Signed = this.tradeStatusDataServerSideResponseData[0].cpSigned;
                    this.notSigned = this.tradeStatusDataServerSideResponseData[0].cpNotSigned;
                    let widget7 = {
                        scheme: {
                            domain: ['#21B025', '#A833FF', '#FF5733']
                        },
                        devices: [
                            {
                                name: 'active',
                                value: this.tradeStatusDataServerSideResponseData[0].active,
                                change: -0.6
                            },
                            {
                                name: 'Signed',
                                value: this.tradeStatusDataServerSideResponseData[0].cpSigned,
                                change: 0.7
                            },
                            {
                                name: 'Unsigned',
                                value: this.tradeStatusDataServerSideResponseData[0].cpNotSigned,
                                change: 0.1
                            }
                        ]
                    }

                    this.widgets = { widget7: widget7 };
                    console.log(this.widgets);
                    console.log(this.tradeStatusDataServerSideResponse);
                    console.log(this.tradeStatusDataServerSideResponseData);
                }
            });
    }


    // Trading Records Server Side Start
    tradingFixtureIDS(): void {
        this.tradingFixtureRecordsServerSideResponseData = [];
        var conditionData = {};
        conditionData["dcm.companyId"] = localStorage.getItem('companyId');
        conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        try {
            this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.tradingFixtureRecordsServerSideResponse = res;
                if (this.tradingFixtureRecordsServerSideResponse.success === true) {
                    this.tradingFixtureRecordsServerSideResponseData = this.tradingFixtureRecordsServerSideResponse.data;
                }
            }, err => { });
        } catch (err) { }
    }



    // Broker Records Server Side Start
    brokerRecordsServerSide() {
        var conditionData = {};
        conditionData['companyId'] = this.companyId;
        conditionData['userRoleId'] = '3';
        try {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.brokerRecordsServerSideResponse = res;
                if (this.brokerRecordsServerSideResponse.success === true) {
                    this.brokerRecordsServerSideResponseData = this.brokerRecordsServerSideResponse.data;
                }
            }, err => { });
        } catch (err) { }
    }
    // Broker Records Server Side End

    // Owners Records Server Side Start
    ownerRecordsServerSide() {
        var conditionData = {};
        conditionData['companyId'] = this.companyId;
        conditionData['userRoleId'] = '6';
        try {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.ownerRecordsServerSideResponse = res;
                if (this.ownerRecordsServerSideResponse.success === true) {
                    this.ownerRecordsServerSideResponseData = this.ownerRecordsServerSideResponse.data;
                }
            }, err => { });
        } catch (err) { }
    }
    // Owners Records Server Side End

    // Charterer Records Server Side Start
    chartererRecordsServerSide() {
        var conditionData = {};
        conditionData['companyId'] = this.companyId;
        conditionData['userRoleId'] = '4';
        try {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.chartererRecordsServerSideResponse = res;
                if (this.chartererRecordsServerSideResponse.success === true) {
                    this.chartererRecordsServerSideResponseData = this.chartererRecordsServerSideResponse.data;
                }
            }, err => { });
        } catch (err) { }
    }
    // Charterer Records Server Side End

    // Trading Records Server Side According To Vessel Search Start
    tradingRecordsServerSideAccordingToVessel(): void {
        var vesselName = this.vesselSearchFormValues.vesselName.value;
        var cpDate = this.vesselSearchFormValues.cpDate.value;
        var brokerId = this.vesselSearchFormValues.brokerId.value;
        var chartererId = this.vesselSearchFormValues.chartererId.value;
        var ownerId = this.vesselSearchFormValues.ownerId.value;
        var fixtureId = this.vesselSearchFormValues.fixtureId.value;
        var cpCity = this.vesselSearchFormValues.cpCity.value;

        this.tradingRecordsServerSideResponseData = [];
        var conditionData = {};
        conditionData["companyId"] = localStorage.getItem('companyId');
        conditionData["vesselName"] = (vesselName != '' && vesselName != null && vesselName != undefined) ? vesselName : undefined;
        conditionData["cpDate"] = (cpDate != '' && cpDate != null && cpDate != undefined) ? moment(cpDate).format("YYYY-MM-DD") : undefined;
        conditionData["brokerId"] = (brokerId != '' && brokerId != null && brokerId != undefined) ? brokerId : undefined;
        conditionData["chartererId"] = (chartererId != '' && chartererId != null && chartererId != undefined) ? chartererId : undefined;
        conditionData["ownerId"] = (ownerId != '' && ownerId != null && ownerId != undefined) ? ownerId : undefined;
        conditionData["fixtureId"] = (fixtureId != '' && fixtureId != null && fixtureId != undefined) ? fixtureId : undefined;
        conditionData["cpCity"] = (cpCity != '' && cpCity != null && cpCity != undefined) ? cpCity : undefined;
        conditionData["is_charterer_detail_term_sign_off"] = (this.is_charterer_detail_term_sign_off != '' && this.is_charterer_detail_term_sign_off != null && this.is_charterer_detail_term_sign_off != undefined) ? this.is_charterer_detail_term_sign_off : undefined;
        conditionData["is_owner_detail_term_sign_off"] = (this.is_owner_detail_term_sign_off != '' && this.is_owner_detail_term_sign_off != null && this.is_owner_detail_term_sign_off != undefined) ? this.is_owner_detail_term_sign_off : undefined;
        try {
            this._userService.tradingRecordsServerSideAccordingToVessel(conditionData).pipe(first()).subscribe((res) => {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success === true) {
                    this.tradingRecordsServerSideResponseData = this.tradingRecordsServerSideResponse.data;
                    setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 100);
                }
            }, err => { });
        } catch (err) { }
    }

    advanceOptionView() {
        this.advanceView = !this.advanceView;
    }

    // Trade Status Data
    // tradeStatusData()
    // {
    //     var filter = {};
    //         filter["companyId"] = JSON.parse(localStorage.getItem('companyId'));
    //     this._userService.tradeStatusData(filter).pipe(first())
    //     .subscribe(res =>
    //     {
    //         this.tradeStatusDataServerSideResponse = res;
    //         if (this.tradeStatusDataServerSideResponse.success === true)
    //         {
    //             this.tradeStatusDataServerSideResponseData = this.tradeStatusDataServerSideResponse.data;
    //             console.log(this.tradeStatusDataServerSideResponse);
    //             console.log(this.tradeStatusDataServerSideResponseData);
    //         }   
    //     }); 
    // }

    // New Users Records
    newUsersRecords() {
        var filter = {};
        filter["companyId"] = JSON.parse(localStorage.getItem('companyId'));
        this._userService.newUsersRecords(filter).pipe(first())
            .subscribe(res => {
                this.userRecordsServerSideResponse = res;
                if (this.userRecordsServerSideResponse.success === true) {
                    this.userRecordsServerSideResponseData = this.userRecordsServerSideResponse.data;
                    console.log(this.userRecordsServerSideResponse);
                    console.log(this.userRecordsServerSideResponseData);
                }
            });
    }

    // Trading Progress Records Server Side
    tradingProgressRecordsServerSide() {
        var filter = {};
        filter["companyId"] = JSON.parse(localStorage.getItem('companyId'));
        this._userService.newUsersRecords(filter).pipe(first())
            .subscribe(res => {
                this.userRecordsServerSideResponse = res;
                if (this.userRecordsServerSideResponse.success === true) {
                    this.userRecordsServerSideResponseData = this.userRecordsServerSideResponse.data;

                }
            });
    }

    // Trading Records Server Side Start
    tradingRecordsServerSide(): void {
        this.tradingRecordsServerSideResponseData = [];
        var conditionData = {};
        conditionData["dcm.companyId"] = localStorage.getItem('companyId');
        conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        try {
            this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success === true) {
                    //  this.tradingRecordsServerSideResponseData  = this.tradingRecordsServerSideResponse.data;
                    setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 100);
                }
            }, err => { });
        } catch (err) { }
    }


    // Trading Records Archived Server Side Start
    tradingRecordsServerSideArchvied(): void {
        this.tradingRecordsServerSideResponseData = [];
        var conditionData = {};
        conditionData["dcm.progress"] = '100';
        conditionData["dcm.companyId"] = localStorage.getItem('companyId');
        conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        try {
            this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success === true) {
                    this.tradingRecordsServerSideResponseData = this.tradingRecordsServerSideResponse.data;
                    setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 100);
                }
            }, err => { });
        } catch (err) { }
    }



    // Trading Records Paginator Set Start
    setPaginatorOfTradingRecordsDataTable() {
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponse.data);
    console.log(this.tradingRecordsData,"hello check response");
        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
    }

    // Trading Records Paginator Set Start
    setPaginatorOfTradingRecordsDataTablecopy() {
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponseData);
        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
    }
    // Trading Records Paginator Set End

    public static widgets =
        {
            'widget6':
            {
                'title': 'Task Distribution',
                'ranges': {
                    'TW': 'This Week',
                    'LW': 'Last Week',
                    '2W': '2 Weeks Ago'
                },
                'mainChart': {
                    'TW': [
                        {
                            'name': 'Frontend',
                            'value': 15
                        },
                        {
                            'name': 'Backend',
                            'value': 20
                        },
                        {
                            'name': 'API',
                            'value': 38
                        },
                        {
                            'name': 'Issues',
                            'value': 27
                        }
                    ],
                    'LW': [
                        {
                            'name': 'Frontend',
                            'value': 19
                        },
                        {
                            'name': 'Backend',
                            'value': 16
                        },
                        {
                            'name': 'API',
                            'value': 42
                        },
                        {
                            'name': 'Issues',
                            'value': 23
                        }
                    ],
                    '2W': [
                        {
                            'name': 'Frontend',
                            'value': 18
                        },
                        {
                            'name': 'Backend',
                            'value': 17
                        },
                        {
                            'name': 'API',
                            'value': 40
                        },
                        {
                            'name': 'Issues',
                            'value': 25
                        }
                    ]
                },
                'footerLeft': {
                    'title': 'Tasks Added',
                    'count': {
                        '2W': 487,
                        'LW': 526,
                        'TW': 594
                    }
                },
                'footerRight': {
                    'title': 'Tasks Completed',
                    'count': {
                        '2W': 193,
                        'LW': 260,
                        'TW': 287
                    }
                }
            }
        };
}