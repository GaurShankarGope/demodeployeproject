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
import { FormGroupDirective, NgForm, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import { stat } from 'fs';

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
    approval: string;

    ownershipChange: string;
}

@Component(
    {
        selector: 'app-trading-platform-management',
        templateUrl: './trading-platform-management.component.html',
        styleUrls: ['./trading-platform-management.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations
    })

export class TradingPlatformManagementComponent implements OnInit {

    current_date = moment(new Date()).format("YYYY-MM-DD");

    displayedColumns: string[] = ['identifier', 'cpDateInfo', 'brokerName', 'chartererName', 'ownerName', 'vesselName',
        'progress', 'statusInfo', 'newAction']


    dataSource = new MatTableDataSource<PeriodicElement>();
    dataSourceFilter = new MatTableDataSource<PeriodicElement>();


    applyFilterExecuted(filterValue: string) {
        this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
    }
    // Assign Div Name For Hide And Show Start
    tradeRecordsDiv = true;
    createTradeButtonView = false;
    tradingFormDiv = false;
    tradeBothView = false;
    tradeChartererView = false;
    tradeOwnerView = false;
    tradeSubmitInformationView = false;
    isEditView = false;
    isRecapView = false;
    // Assign Div Name For Hide And Show End

    // Form Setting Start
    tradingForm: FormGroup;
    tradingFormSubmitResponse: any;
    tradingFormSubmitResponseData = [];
    get tradingFormValue() { return this.tradingForm.controls; }

    performaForm: FormGroup;
    performaFormSubmitResponse: any;
    performaFormSubmitResponseData = [];
    get performaFormValue() { return this.performaForm.controls; }

    executedForm: FormGroup;
    executedFormSubmitResponse: any;
    executedFormSubmitResponseData = [];
    get executedFormValue() { return this.executedForm.controls; }
    // Form Setting End
    charterLogin = true;
    // Assign Variables Start
    tradingId: string;
    companyId: string;
    vesselId: string;
    brokerId: string;
    perfoma = false;
    ownerId: string;
    ownerName: string;
    ownerNameNotification: string;
    ownerEmailID: string;
    ownerMobileNumber: string;
    ownerStatus: string;
    ownerStatusInfo: string;
    socket: any;
    chartererId: string;
    chartererName: string;
    chartererNameNotification: string;
    chartererEmailID: string;
    chartererMobileNumber: string;
    chartererStatus: string;
    chartererStatusInfo: string;

    companyName: string;
    tradeType: string;
    bidNameLabel: string;
    bidNameLabelDropdown:string;
    std_bid_name: string;

    isBrokerView: any;
    isChartererView: any;
    isOwnerView: any;

    acceptRejectTitle: any;
    afteracceptRejectTitle: any;

    statusAction: any;
    activeModalStatus: any;
    inActiveModalStatus: any;

    actionTypeModal: any;
    performaModal: any;
    executedModal: any;
    cpFormId: string;
    copyTradingId: string;
    CPTypeId: String;
    tradeTypeInfo: string;
    // Assign Variables End

    // Assign API Variable Start
    tradingRecordsServerSideResponse: any;
    tradingRecordsServerSideResponseData = [];
    chartererRecordsServerSideResponse: any;
    chartererRecordsServerSideResponseData = [];
    ownerRecordsServerSideResponse: any;
    ownerRecordsServerSideResponseData = [];
    vesselRecordsServerSideResponse: any;
    vesselRecordsServerSideResponseData = [];
    companyRecordsServerSideResponse: any;
    companyRecordsServerSideResponseData = [];
    tradingDataUpdateResponse: any;
    tradingDataUpdateResponseData = [];
    cpFormRecordsServerSideResponse: any;
    cpFormRecordsServerSideResponseData = [];
    fixtureRecordsServerSideResponse: any;
    fixtureRecordsServerSideResponseData = [];
    formId: String;
    // vesselId:String;
    cpDate: String;
    // chartererId:String;
    // ownerId:String;

    formIdSearch: String;
    vesselIdSearch: String;
    cpDateSearch: String;
    // chartererId:String;
    // ownerId:String;
    drawRecordsFilterShow = false;
    drawRecordsFilterForDocumentShow = false;
    drawRecordsTableShow = false;
    drawRecordsTableShowButton = false;
    drawFormDivShow = false;
    drawFormDivShowForDocumentUser = false;
    tradingbids = false;
    VesselList: any;
    VesselData = [];
    DrawManagementForm: FormGroup;
    DrawManagementFormForDocumentUser: FormGroup;

    DrawManagementSearchForm: FormGroup;
    DrawManagementSearchFormDocument: FormGroup;
    cpFormList: any;
    cpFormData = [];
    ChartereInfoList: any;
    ChartereInfoData = [];
    chartererRecordResponse: any;
    chartererRecordData = [];
    drawManagementRes: any;
    drawCPDataData = [];
    drawManagementResFilter: any;
    drawManagementData = [];
    show = false;
    createtypeRes: any;
    drawId: String;
    loading = false;
    submitted = false;
    formIdValueForDrawRecords;
    vesselIdValueForDrawRecords;
    cpDateValueForDrawRecords;
    chartererIdValueForDrawRecords;
    ownerIdValueForDrawRecords;
    drawCPIDForDrawRecords;
    updateMessageForNotification: string;


    ownerShipChangeModal: any;

    changeOwnerId: any;
    changeOwnerName: any;
    tradeIdentifier: any;
    changeOwnerEmailID: any;

    userRecordsServerSideResponse: any;
    userRecordsServerSideResponseData = [];
    userNameNotification: String;

    charterRecordsServerSideResponse: any;
    charterRecordsServerSideResponseData = [];
    charterNameNotification: String;

    shareChangeModal = false;
    brokerDropdown = false;

    shareToUserID : any;

    // Assign API Variable End
    notification = [];
    // Datatable Settings Start
    tradingRecordsDisplayColumn: string[] = ['identifier', 'cpDateInfo', 'brokerName', 'chartererName', 'ownerName', 'vesselName',
        'progress', 'statusInfo', 'isChartererAccepted', 'isOwnerAccepted', 'approvalStatus', 'ownershipChange', 'action'];
    tradingRecordsData = new MatTableDataSource<PeriodicElement>();
    applyFilter(filterValue: string) {
        this.tradingRecordsData.filter = filterValue.trim().toLowerCase();
    }
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    // Datatable Settings End

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

    ) {
        this.socket = io('http://18.216.106.180:3001');
        this.socket.on('new-notification', (result) => {
            console.log(result);
            this.notification.push(result.data);

        });

        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponseData);
    }

    ngOnInit() {
        this.vesselRecords();
        this.ChartereRecords();
        this.cpFormsRecords();
        this.fetchChartererData();
        this.drawCPRecords();
        // Assign Default Values To Variable Start
        this.bidNameLabel = 'Trade Name';
        this.bidNameLabelDropdown = 'Trade';
        this.ownerName = ' ------ ';
        this.ownerEmailID = ' ------ ';
        this.ownerMobileNumber = ' ------ ';
        this.chartererName = ' ------ ';
        this.chartererEmailID = ' ------ ';
        this.chartererMobileNumber = ' ------ ';
        // Assign Default Values To Variable End

        // Data Table On Page Load Settings Start
        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;

        // Data Table On Page Load Settings End

        // Set Form And Its Validation Start
        this.tradingForm = this._formBuilder.group(
            {
                tradeType: ['', Validators.required],
                std_bid_name: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
                chartererId: ['', Validators.required],
                ownerId: ['', Validators.required],
                vesselId: ['', Validators.required],
                savedBids: ['', ''],
            });

        this.performaForm = this._formBuilder.group(
            {
                cpFormId: ['', Validators.required]
            });

        this.executedForm = this._formBuilder.group(
            {
                copyTradingId: ['', Validators.required]
            });
        // Set Form And Its Validation End

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
            this.charterLogin = false;
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            this.acceptRejectTitle = 'Offer Accept / Reject';
            this.afteracceptRejectTitle = 'OFFER';
            this.isOwnerView = 'Y';
            this.isEditView = true;
            this.isRecapView = true;
        }

        this.chartererRecordsServerSide();
        this.ownerRecordsServerSide();
        this.tradingRecordsServerSide();
        // this.savedBidRecords();
    }

    savedBidRecordsResponse : any;
    savedBidRecordsResponseData = [];

    tradeTypeInfoValue : any;
    savedBidCheckedClauses : any;

    resetexecutedForm(){
        // this.dataSourceFilter = null;
        this.drawRecordsTableShow = false;
        this.DrawManagementSearchForm.reset();
        this.DrawManagementSearchFormDocument.reset();
    }
    savedBidRecords(type)
    {
        this.tradeTypeInfoValue = type;
        var conditionData = {};
            conditionData["companyId"] = localStorage.getItem('companyId');
            conditionData["createdBy"] = localStorage.getItem('userId');
            conditionData["bid_type"] = type;
        try {
            this._userService.saveBidRecords(conditionData).pipe(first()).subscribe((res) => {
                this.savedBidRecordsResponse = res;
                if (this.savedBidRecordsResponse.success === true) {
                    this.savedBidRecordsResponseData = this.savedBidRecordsResponse.data;
                    console.log(this.savedBidRecordsResponseData);
                }
            }, err => { this.alertService.error(err, 'Error'); });
        } catch (err) { }
    }

    savedBidID : any;

    setBIDNAME(event)
    {
        this.savedBidID = event.value;
        for(let index = 0; index < this.savedBidRecordsResponseData.length; index++)
        {
            if(this.savedBidRecordsResponseData[index].id == this.savedBidID)
            {
                this.savedBidCheckedClauses = this.savedBidRecordsResponseData[index].checked_clauses;
                this.std_bid_name = event.value;
                if(this.tradeTypeInfoValue == 'BID')
                {
                    this.tradingForm = this._formBuilder.group(
                    {
                        tradeType: [this.tradeTypeInfoValue, Validators.required],
                        std_bid_name: [this.savedBidRecordsResponseData[index].bid_name, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
                        chartererId: [this.tradingFormValue.chartererId.value, Validators.required],
                        ownerId: [this.tradingFormValue.ownerId.value, ''],
                        savedBids: [this.std_bid_name, ''],
                        vesselId: ['', ''],
                    });
                }

                if(this.tradeTypeInfoValue == 'OFFER')
                {
                    this.tradingForm = this._formBuilder.group(
                    {
                        tradeType: [this.tradeTypeInfoValue, Validators.required],
                        std_bid_name: [this.savedBidRecordsResponseData[index].bid_name, [Validators.required, Validators.pattern("[a-zA-Z0-9][ a-zA-Z0-9]+")]],
                        chartererId: [this.tradingFormValue.chartererId.value, ''],
                        ownerId: [this.tradingFormValue.ownerId.value, Validators.required],
                        savedBids: [this.std_bid_name, ''],
                        vesselId: ['', ''],
                    });
                }
                
            }
        }
        
    }

    changeOwnerShip(event, identifier, brokerId, chartererId, tradingId) {
        this.tradingId = tradingId;
        this.brokerId = brokerId;
        this.chartererId = chartererId;
        this.tradeIdentifier = identifier;
        this.changeOwnerName = event.target.options[event.target.options.selectedIndex].text;
        this.changeOwnerId = event.target.value;
        this.ownerShipChangeModal = !this.ownerShipChangeModal;
    }

    hideOwnerShipChangeModal(): void {
        this.ownerShipChangeModal = !this.ownerShipChangeModal;
    }

    changeOwnerShipTrade() {

        var userName = localStorage.getItem('userName');
        var emailID = localStorage.getItem('email');

        for (let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++) {
            if (this.ownerRecordsServerSideResponseData[index].id == this.changeOwnerId) {
                this.changeOwnerEmailID = this.ownerRecordsServerSideResponseData[index].email;
            }
        }

        var message = userName + ' has transfer a ownership of trade - ' + this.tradeIdentifier + ' to ' + this.changeOwnerName;

        var ownerShipData = {};
        ownerShipData["tradingId"] = this.tradingId;
        ownerShipData["companyId"] = localStorage.getItem('companyId');
        ownerShipData["ownerId"] = localStorage.getItem('userId');
        ownerShipData["changeOwnerId"] = this.changeOwnerId;
        ownerShipData["fromUserId"] = localStorage.getItem('userId');
        ownerShipData["toUserId"] = this.changeOwnerId;
        ownerShipData["date"] = moment(new Date()).format("YYYY-MM-DD");
        ownerShipData["time"] = moment().format("H:mm A");
        ownerShipData["message"] = message;
        ownerShipData["email_id"] = this.changeOwnerEmailID;
        ownerShipData["createdBy"] = localStorage.getItem('userId');
        ownerShipData["updatedBy"] = localStorage.getItem('userId');

        console.log(ownerShipData);

        try {
            this._userService.changeOwnerShip(ownerShipData).pipe(first()).subscribe((res) => {
                this.alertService.success('Ownership transfered successfully', 'Success');
                this.ownerShipChangeModal = !this.ownerShipChangeModal;
            }, err => { this.alertService.error(err, 'Error'); });
        } catch (err) { }

        var emailData = {};
        emailData["email_id"] = emailID;
        emailData["message"] = message;
        emailData["subject"] = 'Ownership Transfered';
        try {
            this._userService.emailSendCommon(emailData).pipe(first()).subscribe((res) => {

            }, err => { this.alertService.error(err, 'Error'); });
        } catch (err) { }

        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        const tradingDataUpdate =
        {
            id: this.tradingId,
            ownerId: this.changeOwnerId,
            updatedBy: localStorage.getItem('userId')
        };
        this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe(res => { });

        const tradingMessageData =
        {
            tradingId: this.tradingId,
            message: message,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        this.http.post(`${config.baseUrl}/tradingMessageInsert`, tradingMessageData, headerOptions).subscribe(res => { }, err => { });

        const tradingNotificationData =
        {
            fromUserId: localStorage.getItem('userId'),
            toUserId: this.brokerId,
            notification: message,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };

        this.socket.emit('new-notification', tradingNotificationData);

        this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationData, headerOptions).subscribe(res => { }, err => { });

        const tradingNotificationDataCharterer =
        {
            fromUserId: localStorage.getItem('userId'),
            toUserId: this.chartererId,
            notification: message,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };

        this.socket.emit('new-notification', tradingNotificationDataCharterer);

        this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationDataCharterer, headerOptions).subscribe(res => { }, err => { });

        this.tradingRecordsServerSide();

    }

    get f() { return this.DrawManagementForm.controls; }
    get fDoc() { return this.DrawManagementFormForDocumentUser.controls; }
    get fSearch() { return this.DrawManagementSearchForm.controls; }


    setApplicabelCharterParty(Type): void {
        this.formId = '';
        this.vesselId = '';
        this.cpDate = '';
        this.chartererId = '';
        this.ownerId = '';

        this.formIdSearch = '';
        this.vesselIdSearch = '';
        this.cpDateSearch = '';
        this.chartererId = '';
        this.ownerId = '';

        this.DrawManagementForm = this._formBuilder.group(
            {

                formId: ['', Validators.required],
                vesselId: ['', Validators.required],
                cpDate: ['', Validators.required],
                chartererId: ['', Validators.required],
            });

        this.DrawManagementSearchForm = this._formBuilder.group(
            {
                formIdSearch: ['', ''],
                vesselIdSearch: ['', ''],
                cpDateSearch: ['', ''],
                drawCPIDSearch: ['', ''],
                chartererIdSearch: ['', ''],
                ownerIdSearch: ['', ''],
            });

        // this.DrawManagementSearchForm.reset(); 
        // this.DrawManagementForm.reset(); 


        this.drawRecordsFilterShow = false;
        this.drawRecordsFilterForDocumentShow = false;
        this.drawRecordsTableShow = false;
        this.drawRecordsTableShowButton = false;
        this.drawFormDivShow = false;
        this.tradingbids = false;
        this.tradeSubmitInformationView = false;
        this.drawFormDivShowForDocumentUser = false;
        this.CPTypeId = Type;
        if (Type == 1) {
            if (JSON.parse(localStorage.getItem('userRoleId')) == '7') {
                this.drawRecordsFilterForDocumentShow = true;
            } else {
                this.drawRecordsFilterShow = true;
            }

        }
        if (Type == 2) {
            if (JSON.parse(localStorage.getItem('userRoleId')) == '7') {
                this.drawFormDivShowForDocumentUser = true;
            } else {
                this.drawFormDivShow = true;
            }
        }
        if (Type == 3) {
            if (JSON.parse(localStorage.getItem('userRoleId')) == '7') {
                this.drawFormDivShowForDocumentUser = true;
            } else {
                this.tradingbids = true;
            }
        }
    }
    // Trading Records Server Side Start
    tradingRecordsServerSide(): void {
        this.tradingRecordsServerSideResponseData = [];
        var conditionData = {};
        conditionData["dcm.companyId"] = localStorage.getItem('companyId');
        conditionData["dcm.brokerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        try {
            this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success === true) {
                    this.tradingRecordsServerSideResponseData = this.tradingRecordsServerSideResponse.data;
                    console.log(this.tradingRecordsServerSideResponseData);

                    setTimeout(() => { this.setPaginatorOfTradingRecordsDataTable(); }, 2000);
                }
            }, err => { this.alertService.error(err, 'Error'); });
        } catch (err) { }
    }
    // Trading Records Server Side End

    // Trading Records Paginator Set Start
    setPaginatorOfTradingRecordsDataTable() {
        this.tradingRecordsData = new MatTableDataSource(this.tradingRecordsServerSideResponse.data);
        // console.log(tradingRecordsData);
        console.log(this.tradingRecordsData)
        this.tradingRecordsData.paginator = this.paginator;
        this.tradingRecordsData.sort = this.sort;
    }
    // Trading Records Paginator Set End

    // Trading Div Hide Show Start
    divShowHide(type): void {
        this.tradeSubmitInformationView = false;

        this.ownerName = ' ------ ';
        this.ownerEmailID = ' ------ ';
        this.ownerMobileNumber = ' ------ ';
        this.chartererName = ' ------ ';
        this.chartererEmailID = ' ------ ';
        this.chartererMobileNumber = ' ------ ';

        this.tradingForm = this._formBuilder.group(
            {
                tradeType: ['', Validators.required],
                std_bid_name: ['', Validators.required],
                chartererId: ['', Validators.required],
                ownerId: ['', Validators.required],
                vesselId: ['', Validators.required],
                savedBids: ['', ''],
            });

        this.tradingFormDiv = false;
        this.tradeRecordsDiv = false;
        if (type == 1) {
            this.tradingFormDiv = false;
            this.tradeRecordsDiv = true;
            this.tradingbids = false;
            this.drawFormDivShow = false;
            this.drawRecordsFilterShow = false;
            this.tradingRecordsServerSide();
        }
        if (type == 2) {
            this.tradingFormDiv = true;
            this.tradeRecordsDiv = false;
            // Fetch Company Data Start
            this.fetchCompanyData();
            // Fetch Company Data End
        }

    }
    // Trading Div Hide Show End

    // Trading Form Inputs Hide Show Start
    setTradeFormView(event) {
        this.tradeBothView = false;
        this.tradeChartererView = false;
        this.tradeOwnerView = false;
        var tradeType = event.value;

        if (tradeType == 1) {
            this.tradeTypeInfo = 'BID';
            // Set Form And Its Validation Start
            this.tradingForm = this._formBuilder.group(
                {
                    tradeType: [tradeType, Validators.required],
                    std_bid_name: ['', Validators.required],
                    chartererId: ['', Validators.required],
                    ownerId: ['', ''],
                    vesselId: ['', ''],
                    savedBids: ['', ''],
                });
            // Set Form And Its Validation End
            this.bidNameLabel = 'Bid Name';
            this.bidNameLabelDropdown = 'BIDS';
            this.tradeBothView = true;
            this.tradeChartererView = true;
            this.chartererRecordsServerSide();
            this.savedBidRecords('BID');
        }
        if (tradeType == 2) {
            this.tradeTypeInfo = 'OFFER';
            // Set Form And Its Validation Start
            this.tradingForm = this._formBuilder.group(
                {
                    tradeType: [tradeType, Validators.required],
                    std_bid_name: ['', Validators.required],
                    chartererId: ['', ''],
                    ownerId: ['', Validators.required],
                    vesselId: ['', Validators.required]
                });
            // Set Form And Its Validation End
            this.bidNameLabel = 'Offer Name';
            this.bidNameLabelDropdown = 'OFFERS';
            this.tradeBothView = true;
            this.tradeOwnerView = true;
            this.ownerRecordsServerSide();
            this.savedBidRecords('OFFERS');
        }
        if (tradeType == 3) {
            // Set Form And Its Validation Start
            this.tradingForm = this._formBuilder.group(
                {
                    tradeType: [tradeType, Validators.required],
                    std_bid_name: ['', Validators.required],
                    chartererId: ['', Validators.required],
                    ownerId: ['', Validators.required],
                    vesselId: ['', Validators.required],
                    savedBids: ['', ''],
                });
            // Set Form And Its Validation End
            this.bidNameLabel = 'Trade Name';
            this.bidNameLabelDropdown = 'Trade';
            this.tradeBothView = true;
            this.tradeChartererView = true;
            this.tradeOwnerView = true;
            this.chartererRecordsServerSide();
            this.ownerRecordsServerSide();
        }
    }
    // Trading Form Inputs Hide Show End

    // Charterer Records Server Side Start
    chartererRecordsServerSide(): void {
        var conditionData = {};
        conditionData['companyId'] = JSON.parse(localStorage.getItem('companyId'));
        conditionData['userRoleId'] = '4';
        try {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.chartererRecordsServerSideResponse = res;
                if (this.chartererRecordsServerSideResponse.success === true) {
                    this.chartererRecordsServerSideResponseData = this.chartererRecordsServerSideResponse.data;
                    if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                        var userID = JSON.parse(localStorage.getItem('userId'));
                        for (let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++) {
                            if (userID == this.chartererRecordsServerSideResponseData[index].id) {
                                this.chartererNameNotification = this.chartererRecordsServerSideResponseData[index].username;
                            }
                        }
                    }
                }
            }, err => { console.log(err); });
        } catch (err) { console.log(err); }
    }
    // Charterer Records Server Side End

    // On Charterer Change Start
    onChangeCharterer(event): void {
        this.chartererId = event.value;
        let target = event.source.selected._element.nativeElement;
        this.chartererName = target.innerText.trim();
        for (let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++) {
            if (this.chartererId == this.chartererRecordsServerSideResponseData[index].id) {
                this.chartererEmailID = this.chartererRecordsServerSideResponseData[index].email;
                this.chartererMobileNumber = this.chartererRecordsServerSideResponseData[index].mobileNo;
            }
        }
    }
    // On Charterer Change End

    // Owners Records Server Side Start
    ownerRecordsServerSide() {
        var conditionData = {};
        conditionData['companyId'] = JSON.parse(localStorage.getItem('companyId'));
        conditionData['userRoleId'] = '6';
        try {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.ownerRecordsServerSideResponse = res;
                if (this.ownerRecordsServerSideResponse.success === true) {
                    this.ownerRecordsServerSideResponseData = this.ownerRecordsServerSideResponse.data;
                    if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                        var userID = JSON.parse(localStorage.getItem('userId'));
                        for (let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++) {
                            if (userID == this.ownerRecordsServerSideResponseData[index].id) {
                                this.ownerNameNotification = this.ownerRecordsServerSideResponseData[index].username;
                            }
                        }
                    }
                }
            }, err => { console.log(err); });
        } catch (err) { console.log(err); }
    }
    // Owners Records Server Side End

    // On Owner Change Start
    onChangeOwner(event) {
        this.ownerId = event.value;
        let target = event.source.selected._element.nativeElement;
        this.ownerName = target.innerText.trim();
        for (let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++) {
            if (this.ownerId == this.ownerRecordsServerSideResponseData[index].id) {
                this.ownerEmailID = this.ownerRecordsServerSideResponseData[index].email;
                this.ownerMobileNumber = this.ownerRecordsServerSideResponseData[index].mobileNo;
            }
        }
        this.vesselRecordsServerSide();
    }
    // On Owner Change End

    // Vessel Records Sever Side Start
    vesselRecordsServerSide() {
        var conditionData = {};
        conditionData["vm.id_owner"] = this.ownerId;
        try {
            this._userService.vesselRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.vesselRecordsServerSideResponse = res;
                if (this.vesselRecordsServerSideResponse.success == true) {
                    this.vesselRecordsServerSideResponseData = this.vesselRecordsServerSideResponse.data;
                }
            });
        } catch (err) { }
    }
    // Vessel Records Sever Side End

    // Fetch Company Data Start
    fetchCompanyData() {
        var filter = {};
        filter['id'] = localStorage.getItem('companyId');
        try {
            this._userService.getCompanyName(filter).pipe(first()).subscribe((res) => {
                this.companyRecordsServerSideResponse = res;
                if (this.companyRecordsServerSideResponse.success === true) {
                    this.companyRecordsServerSideResponseData = this.companyRecordsServerSideResponse.data;
                    this.companyName = this.companyRecordsServerSideResponseData[0].companyName;
                }
            }, err => { });
        } catch (err) { }
    }
    // Fetch Company Data End

    // Trading Form Submit Start 
    tradingFormSubmit(): void {


        this.alertService.clear();
        if (this.tradingForm.invalid) {
            console.log("hello", this.tradingForm);

            return;
        }
        else {

            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.chartererId = this.tradingFormValue.chartererId.value;
            this.ownerId = this.tradingFormValue.ownerId.value;
            this.vesselId = this.tradingFormValue.vesselId.value;
            this.chartererId = this.tradingFormValue.chartererId.value;


            this.ownerId = (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) ? this.ownerId : null;
            this.chartererId = (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) ? this.chartererId : null;

            console.log(this.tradingFormValue.ownerId.value);

            // this.ownerId = (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) ? this.ownerId : null;
            // this.chartererId = (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) ? this.chartererId : null;
            const submitData =
            {
                CPTypeId: '3',
                trade_type: this.tradeTypeInfo,
                brokerId: localStorage.getItem('userId'),
                ownerId: this.ownerId,
                checked_clauses: this.savedBidCheckedClauses,
                vesselId: (this.vesselId != '' && this.vesselId != null && this.vesselId != undefined) ? this.vesselId : null,
                chartererId: this.chartererId,
                std_bid_name: this.tradingFormValue.std_bid_name.value,
                chartererBrokerId: localStorage.getItem('userId'),
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };
            console.log(submitData);

            try {
                this.http.post(`${config.baseUrl}/TradingStandardFormCreate`, submitData, headerOptions).subscribe(
                    res => {
                        this.tradingFormSubmitResponse = res;
                        if (this.tradingFormSubmitResponse.success === true) {
                            this.tradingId = this.tradingFormSubmitResponse.data[0];

                            const tradingMessageData =
                            {
                                tradingId: this.tradingId,
                                message: 'Broker Initiated Trade',
                                createdBy: localStorage.getItem('userId'),
                                updatedBy: localStorage.getItem('userId')
                            };
                            this.http.post(`${config.baseUrl}/tradingMessageInsert`,
                                tradingMessageData, headerOptions).subscribe(res => { }, err => { });

                            if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                                // this.router.navigate(['/apps/drawCp-Clauses-management']);

                                const ownerNotificationData =
                                {
                                    fromUserId: localStorage.getItem('userId'),
                                    toUserId: this.ownerId,
                                    ownerId: this.ownerId,
                                    chartererId: null,
                                    tradingId: this.tradingId,
                                    email: this.ownerEmailID,
                                    notification: 'You are invited for trading offer',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                console.log(ownerNotificationData);

                                this.socket.emit('new-notification', { ownerNotificationData });

                                this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`,
                                    ownerNotificationData, headerOptions).subscribe(res => { }, err => { });

                                const tradingProgressData =
                                {
                                    tradingId: this.tradingId,
                                    ownerId: this.ownerId,
                                    brokerId: localStorage.getItem('userId'),
                                    chartererId: null,
                                    message: 'Broker Initiated Trade',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                                    tradingProgressData, headerOptions).subscribe(res => { }, err => { });
                            }

                            if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                                // this.router.navigate(['/apps/drawCp-Clauses-management']);

                                const chartererNotificatioNData =
                                {
                                    fromUserId: localStorage.getItem('userId'),
                                    toUserId: this.chartererId,
                                    ownerId: null,
                                    chartererId: this.chartererId,
                                    tradingId: this.tradingId,
                                    email: this.chartererEmailID,
                                    notification: 'You are invited for trading standard bid',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                console.log(chartererNotificatioNData);

                                this.socket.emit('new-notification', { chartererNotificatioNData });

                                this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`, chartererNotificatioNData, headerOptions).subscribe(res => { }, err => { });

                                const tradingProgressData =
                                {
                                    tradingId: this.tradingId,
                                    ownerId: null,
                                    brokerId: localStorage.getItem('userId'),
                                    chartererId: this.chartererId,
                                    message: 'Broker Initiated Trade',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                                    tradingProgressData, headerOptions).subscribe(res => { }, err => { });
                            }
                            this.tradeSubmitInformationView = true;
                        }


                        this.tradingRecordsServerSide();
                    },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err) {
            }


        }
    }



    tradingFormSubmitPerfoma(): void {


        this.alertService.clear();
        if (this.DrawManagementForm.invalid) {
            console.log("hello", this.DrawManagementForm);

            return;
        }
        else {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.ownerId = this.ownerId;
            this.vesselId = this.f.vesselId.value;
            this.chartererId = this.f.chartererId.value;
            this.ownerId = (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) ? this.ownerId : null;
            this.chartererId = (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) ? this.chartererId : null;
            const submitData =
            {
                CPTypeId: '3',
                // trade_type: this.tradeTypeInfo,
                brokerId: localStorage.getItem('userId'),
                ownerId: this.ownerId,
                formId: this.f.formId.value,
                vesselId: (this.vesselId != '' && this.vesselId != null && this.vesselId != undefined) ? this.vesselId : null,
                chartererId: this.chartererId,
                chartererBrokerId: localStorage.getItem('userId'),
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };
            console.log(submitData);
            let tempres: any;
            try {
                this.http.post(`${config.baseUrl}/TradingStandardFormCreate`, submitData, headerOptions).subscribe(
                    res => {
                        tempres = res;
                        this.tradingId = tempres.data[0];
                        console.log(this.tradingId);

                        this.statusAction = "Y";
                        this.chartererId = this.chartererId;
                        this.ownerId = this.ownerId;
                        this.perfoma = true;
                        this.performaFormSubmit();
                        this.tradingFormSubmitResponse = res;
                        if (this.tradingFormSubmitResponse.success === true) {
                            this.tradingId = this.tradingFormSubmitResponse.data[0];

                            const tradingMessageData =
                            {
                                tradingId: this.tradingId,
                                message: 'Broker Initiated Trade',
                                createdBy: localStorage.getItem('userId'),
                                updatedBy: localStorage.getItem('userId')
                            };
                            this.http.post(`${config.baseUrl}/tradingMessageInsert`,
                                tradingMessageData, headerOptions).subscribe(res => { }, err => { });

                            if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                                const reqData =
                                {
                                    mainUserId: localStorage.getItem('userId'),
                                    companyId: localStorage.getItem('companyId'),
                                    tradingId: this.tradingId,
                                    isTrading: '1'
                                };
                                localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
                                this.router.navigate(['/apps/drawCp-Clauses-management']);

                                const ownerNotificationData =
                                {
                                    fromUserId: localStorage.getItem('userId'),
                                    toUserId: this.ownerId,
                                    ownerId: this.ownerId,
                                    chartererId: null,
                                    tradingId: this.tradingId,
                                    email: this.ownerEmailID,
                                    notification: 'You are invited for trading offer',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                console.log(ownerNotificationData);

                                this.socket.emit('new-notification', { ownerNotificationData });

                                this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`,
                                    ownerNotificationData, headerOptions).subscribe(res => { }, err => { });

                                const tradingProgressData =
                                {
                                    tradingId: this.tradingId,
                                    ownerId: this.ownerId,
                                    brokerId: localStorage.getItem('userId'),
                                    chartererId: null,
                                    message: 'Broker Initiated Trade',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                                    tradingProgressData, headerOptions).subscribe(res => { }, err => { });
                            }

                            if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                                this.router.navigate(['/apps/drawCp-Clauses-management']);

                                const chartererNotificatioNData =
                                {
                                    fromUserId: localStorage.getItem('userId'),
                                    toUserId: this.chartererId,
                                    ownerId: null,
                                    chartererId: this.chartererId,
                                    tradingId: this.tradingId,
                                    email: this.chartererEmailID,
                                    notification: 'You are invited for trading standard bid',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                console.log(chartererNotificatioNData);

                                this.socket.emit('new-notification', { chartererNotificatioNData });

                                this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`, chartererNotificatioNData, headerOptions).subscribe(res => { }, err => { });

                                const tradingProgressData =
                                {
                                    tradingId: this.tradingId,
                                    ownerId: null,
                                    brokerId: localStorage.getItem('userId'),
                                    chartererId: this.chartererId,
                                    message: 'Broker Initiated Trade',
                                    createdBy: localStorage.getItem('userId'),
                                    updatedBy: localStorage.getItem('userId')
                                };
                                this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                                    tradingProgressData, headerOptions).subscribe(res => { }, err => { });
                            }
                            this.tradeSubmitInformationView = true;
                        }


                        this.tradingRecordsServerSide();
                    },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
            } catch (err) {
            }

        }
    }
    // Trading Form Submit End

    // Show Active Modal Start
    showActiveModal(status, tradingId, ownerId, chartererId, brokerId): void {
        this.tradingId = tradingId;
        this.brokerId = brokerId;
        this.ownerId = ownerId;
        this.chartererId = chartererId;
        this.statusAction = status;
        this.activeModalStatus = !this.activeModalStatus;
    }
    // Show Active Modal End

    // Hide Active Modal Start
    hideActiveModal(): void {
        this.activeModalStatus = !this.activeModalStatus;
    }
    // Hide Active Modal End

    // Show Inavtive Modal Start
    showInActiveModal(status, tradingId, ownerId, chartererId, brokerId): void {
        this.tradingId = tradingId;
        this.brokerId = brokerId;
        this.ownerId = ownerId;
        this.chartererId = chartererId;
        this.statusAction = status;
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }
    // Show Inavtive Modal End

    // Hide Inactive Modal Start
    hideInActiveModal(): void {
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }
    // Hide Inactive Modal End

    // Show Action Type Modal Start
    showActionTypeModal(): void {
        this.activeModalStatus = !this.activeModalStatus;
        this.actionTypeModal = !this.actionTypeModal;
    }
    // Show Action Type Modal End

    // Hide Action Type Modal Start
    hideActionTypeModal(): void {
        this.actionTypeModal = !this.actionTypeModal;
    }
    // Hide Action Type Modal End

    // Show Performa Modal Start
    showPerformaModal(): void {
        this.actionTypeModal = !this.actionTypeModal;
        this.performaModal = !this.performaModal;
        // Set Form And Its Validation Start
        this.performaForm = this._formBuilder.group(
            {
                cpFormId: ['', Validators.required]
            });
        // Set Form And Its Validation End
        this.cpFormRecordsServerSide();
    }
    // Show Performa Modal End

    // Hide Performa Modal Start
    hidePerformaModal(): void {
        this.performaModal = !this.performaModal;
    }
    // Hide Performa Modal End

    // Fetch CP Form Data Records Server Side Start
    cpFormRecordsServerSide() {
        try {
            this.http.get(`${config.baseUrl}/cpFromlist`).subscribe((res) => {
                this.cpFormRecordsServerSideResponse = res;
                if (this.cpFormRecordsServerSideResponse.success == true) {
                    this.cpFormRecordsServerSideResponseData = this.cpFormRecordsServerSideResponse.data;
                }
            });
        } catch (err) { }
    }
    // Fetch CP Form Data Records Server Side End

    // Performa Form Submit Start 
    performaFormSubmit(): void {
        this.alertService.clear();
        this.activeModalStatus = !this.activeModalStatus;

        // this.cpFormId = null;
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }


        var updateData = {};
        updateData['tradingId'] = this.tradingId;
        updateData['isAccepted'] = "Y";
        updateData['updatedBy'] = localStorage.getItem('userId');
        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            updateData['chartererId'] = this.chartererId;
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            updateData['ownerId'] = this.ownerId;
        }


        // if (this.perfoma == true) {
        //     updateData['chartererId'] = this.chartererId;
        //     updateData['ownerId'] = this.ownerId;
        // }

        console.log(updateData);

        this._userService.TradingPlatformRequestStatusUpdateCommon(updateData).pipe(first()).subscribe(data => {
            this.tradingDataUpdateResponse = data;
            if (this.tradingDataUpdateResponse.success === true) {
                this.alertService.success(this.tradingDataUpdateResponse.message, 'Success');

            } else {
                this.alertService.error(this.tradingDataUpdateResponse.message, 'Error');
            }
        },
            error => {
                this.alertService.error(error.message, 'Error');
            });

        if (updateData['isAccepted'] == 'Y') {
            const tradingDataUpdate =
            {
                id: this.tradingId,
                progress: '20',
                progress_info: '2',
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe(res => { });
        } else {
            var finalUpdateData = {};
            finalUpdateData['id'] = this.tradingId;
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                finalUpdateData['chartererId'] = null;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                finalUpdateData['ownerId'] = null;
                finalUpdateData['vesselId'] = null;
            }
            this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, finalUpdateData, headerOptions).subscribe(res => { });
        }

        if (localStorage.getItem('userRoleId') == '4') {
            var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Charterer Accepted Bid' : 'Charterer Rejected Bid';

            var userName = this.chartererNameNotification;
            var identifier = this.tradingId;

            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';

            var updateMessageForNotification = userName + ' ' + acceptedRejected + ' Bid ' + identifier;

        }

        if (localStorage.getItem('userRoleId') == '6') {
            var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Owner Accepted Offer' : 'Owner Rejected Offer';

            var userName = this.ownerNameNotification;
            var identifier = this.tradingId;

            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';

            var updateMessageForNotification = userName + ' ' + acceptedRejected + ' Bid ' + identifier;
        }

        const tradingMessageData =
        {
            tradingId: this.tradingId,
            message: UpdateMessage,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        this.http.post(`${config.baseUrl}/tradingMessageInsert`,
            tradingMessageData, headerOptions).subscribe(res => { }, err => { });

        const tradingNotificationData =
        {
            fromUserId: localStorage.getItem('userId'),
            toUserId: this.brokerId,
            notification: updateMessageForNotification,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        this.socket.emit('new-notification', tradingNotificationData);

        this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
            tradingNotificationData, headerOptions).subscribe(res => { }, err => { });

        if (localStorage.getItem('userRoleId') == '4') {
            if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                const tradingNotificationData =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: this.ownerId,
                    notification: updateMessageForNotification,
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };

                console.log(tradingNotificationData);

                this.socket.emit('new-notification', tradingNotificationData);
                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
            }
        }

        if (localStorage.getItem('userRoleId') == '6') {
            if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                const tradingNotificationData =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: this.chartererId,
                    notification: updateMessageForNotification,
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };
                console.log(tradingNotificationData);

                this.socket.emit('new-notification', tradingNotificationData);

                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
            }
        }

        if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
            const tradingProgressData =
            {
                tradingId: this.tradingId,
                ownerId: this.ownerId,
                brokerId: localStorage.getItem('userId'),
                chartererId: null,
                message: UpdateMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };

            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res => { }, err => { });
        }

        if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
            const tradingProgressData =
            {
                tradingId: this.tradingId,
                ownerId: null,
                brokerId: localStorage.getItem('userId'),
                chartererId: this.chartererId,
                message: UpdateMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res => { }, err => { });
        }
        this.tradingRecordsServerSide();
        // }
    }
    // Trading Form Submit End

    // Show Executed Modal Start
    showExecutedModal(): void {
        this.actionTypeModal = !this.actionTypeModal;
        this.executedModal = !this.executedModal;
        // Set Form And Its Validation Start
        this.executedForm = this._formBuilder.group(
            {
                copyTradingId: ['', Validators.required]
            });
        // Set Form And Its Validation End
        this.fixtureRecordsServerSide();
    }
    // Show Performa Modal End

    // Fetch Fixture Records Server Side Start
    fixtureRecordsServerSide() {
        var ConditionData = {};
        ConditionData["dcm.progress"] = '100';
        try {
            this._userService.TradingFormRecordsServerSide(ConditionData).pipe(first()).subscribe((res) => {
                this.fixtureRecordsServerSideResponse = res;
                if (this.fixtureRecordsServerSideResponse.success == true) {
                    this.fixtureRecordsServerSideResponseData = this.fixtureRecordsServerSideResponse.data;
                }
            });
        } catch (err) { }
    }
    // Fetch CP Form Data Records Server Side End

    // Executed Form Submit Start 
    executedFormSubmit(id, ctid): void {
        this.alertService.clear();
        // if (this.executedForm.invalid)
        // { 
        //     return;
        // } else {
        // this.executedModal = !this.executedModal;
        this.copyTradingId = ctid;
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }

        const copyTradingData =
        {
            tradingId: id,
            copyID: this.copyTradingId,
            updatedBy: localStorage.getItem('userId')
        };
        console.log(copyTradingData);

        this.http.post(`${config.baseUrl}/copyTradingData`, copyTradingData, headerOptions).subscribe(res => {

            console.log(res);

            this.tradingRecordsServerSide();

            this.tradingFormDiv = false;
            this.tradeRecordsDiv = true;
            this.drawRecordsFilterShow = false;
            // this.tradingFormDiv ==false;
            this.tradingbids = false;
            this.drawRecordsFilterForDocumentShow = false;
            this.drawRecordsTableShow = false;
            this.drawFormDivShow = false;
        });

        var updateData = {};
        updateData['tradingId'] = id;
        updateData['isAccepted'] = "Y";
        updateData['updatedBy'] = localStorage.getItem('userId');

    }
    executedFormcopySubmit(id, fromId): void {
        this.alertService.clear();

        // this.executedModal = !this.executedModal;
        this.copyTradingId = fromId;
        let tradeId = this.tradingId;
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        console.log("hello success check");

        const copyTradingData =
        {
            tradingId: tradeId,
            copyID: this.copyTradingId,
            updatedBy: localStorage.getItem('userId')
        };

        console.log(copyTradingData);

        this.http.post(`${config.baseUrl}/copyTradingData`, copyTradingData, headerOptions).subscribe(res => {
            console.log("hello sucess");
            this.tradingRecordsServerSide();

        });


        // this.divShowHide(1);
        // this.tradeRecordsDiv =true;
        // this.drawRecordsFilterShow = false;
        // this.drawRecordsFilterForDocumentShow= false;
        // this.drawRecordsTableShow = false;
        // this.drawRecordsTableShowButton = false;
        // this.drawFormDivShow = false;
        // this.tradingbids =false;
        // this.tradeSubmitInformationView =false;
        // this.drawFormDivShowForDocumentUser = false;

        this.tradingFormDiv = false;
        this.tradeRecordsDiv = true;
        this.drawRecordsFilterShow = false;
        // this.tradingFormDiv ==false;
        this.tradingbids = false;
        this.drawRecordsFilterForDocumentShow = false;
        this.drawRecordsTableShow = false;
        this.drawFormDivShow = false;
        this.tradingRecordsServerSide();
        var updateData = {};
        updateData['tradingId'] = this.tradingId;
        updateData['isAccepted'] = "Y";
        updateData['updatedBy'] = localStorage.getItem('userId');

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            updateData['chartererId'] = this.chartererId;
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            updateData['ownerId'] = this.ownerId;
        }

        const statusUpdateData =
        {
            tradingId: this.tradingId,
            ownerId: this.ownerId,
            chartererId: this.chartererId,
            isAccepted: "Y",
            updatedBy: localStorage.getItem('userId'),
        };


        if (localStorage.getItem('userRoleId') == '4') {
            var UpdateMessage = (statusUpdateData.isAccepted == 'Y') ? 'Charterer Accepted Bid' : 'Charterer Rejected Bid';
            var userName = this.chartererNameNotification;
            var identifier = this.tradingId;
            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
            this.updateMessageForNotification = userName + ' ' + acceptedRejected + ' Bid ' + identifier;
        }

        if (localStorage.getItem('userRoleId') == '6') {
            var UpdateMessage = (statusUpdateData.isAccepted == 'Y') ? 'Owner Accepted Offer' : 'Owner Rejected OfferfownerDropdownView';
            var userName = this.ownerNameNotification;
            var identifier = this.tradingId;
            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
            this.updateMessageForNotification = userName + ' ' + acceptedRejected + ' Bid ' + identifier;
        }

        const tradingMessageData =
        {
            tradingId: this.tradingId,
            message: UpdateMessage,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        this.http.post(`${config.baseUrl}/tradingMessageInsert`,
            tradingMessageData, headerOptions).subscribe(res => { }, err => { });

        const tradingNotificationData =
        {
            fromUserId: localStorage.getItem('userId'),
            toUserId: this.chartererId,
            notification: this.updateMessageForNotification,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };

        console.log(tradingNotificationData);

        this.socket.emit('new-notification', tradingNotificationData);
        this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
            tradingNotificationData, headerOptions).subscribe(res => { }, err => { });

        if (localStorage.getItem('userRoleId') == '4') {
            if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                const tradingNotificationData =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: this.ownerId,
                    notification: this.updateMessageForNotification,
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };
                this.socket.emit('new-notification', tradingNotificationData);
                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
            }
        }

        if (localStorage.getItem('userRoleId') == '6') {
            if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                const tradingNotificationData =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: this.chartererId,
                    notification: this.updateMessageForNotification,
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };

                this.socket.emit('new-notification', tradingNotificationData);
                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
            }
        }

        if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
            const tradingProgressData =
            {
                tradingId: this.tradingId,
                ownerId: this.ownerId,
                brokerId: localStorage.getItem('userId'),
                chartererId: null,
                message: UpdateMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res => { }, err => { });
        }

        if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
            const tradingProgressData =
            {
                tradingId: this.tradingId,
                ownerId: null,
                brokerId: localStorage.getItem('userId'),
                chartererId: this.chartererId,
                message: UpdateMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res => { }, err => { });
        }
        this.tradingRecordsServerSide();

    }
    // Executed Form Submit End

    // Hide Performa Modal Start
    hideExecutedModal(): void {
        this.executedModal = !this.executedModal;
    }
    // Hide Performa Modal End

    // Accept / Reject Charterer Owner Request Start
    acceptRejectChartererOwnerTradeRequest(): void {
        var updateData = {};
        updateData['tradingId'] = this.tradingId;
        updateData['isAccepted'] = this.statusAction;
        updateData['updatedBy'] = localStorage.getItem('userId');


        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            updateData['chartererId'] = this.chartererId;
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            updateData['ownerId'] = this.ownerId;
        }
        console.log(updateData);

        this._userService.TradingPlatformRequestStatusUpdateCommon(updateData).pipe(first()).subscribe(data => {
            this.tradingDataUpdateResponse = data;
            if (this.tradingDataUpdateResponse.success === true) {
                this.alertService.success(this.tradingDataUpdateResponse.message, 'Success');
                if (updateData['isAccepted'] == 'Y') {
                    this.activeModalStatus = !this.activeModalStatus;
                } else {
                    this.inActiveModalStatus = !this.inActiveModalStatus;
                }
                this.tradingRecordsServerSide();
            } else {
                this.alertService.error(this.tradingDataUpdateResponse.message, 'Error');
            }
        },
            error => {
                this.alertService.error(error.message, 'Error');
            });

        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        if (updateData['isAccepted'] == 'Y') {
            const tradingDataUpdate =
            {
                id: this.tradingId,
                progress: '20',
                progress_info: '2',
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, tradingDataUpdate, headerOptions).subscribe(res => { });
        } else {
            var finalUpdateData = {};
            finalUpdateData['id'] = this.tradingId;
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                finalUpdateData['chartererId'] = null;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                finalUpdateData['ownerId'] = null;
                finalUpdateData['vesselId'] = null;
            }
            this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`, finalUpdateData, headerOptions).subscribe(res => { });
        }

        if (localStorage.getItem('userRoleId') == '4') {
            var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Charterer Accepted Bid' : 'Charterer Rejected Bid';
            var userName = this.chartererNameNotification;
            var identifier = this.tradingId;
            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
            this.updateMessageForNotification = userName + ' ' + acceptedRejected + ' Bid ' + identifier;
        }

        if (localStorage.getItem('userRoleId') == '6') {
            var UpdateMessage = (updateData['isAccepted'] == 'Y') ? 'Owner Accepted Offer' : 'Owner Rejected Offer';
            var userName = this.ownerNameNotification;
            var identifier = this.tradingId;
            var acceptedRejected = (updateData['isAccepted'] == 'Y') ? 'Accepted' : 'Rejected';
            this.updateMessageForNotification = userName + ' ' + acceptedRejected + ' Bid ' + identifier;
        }

        const tradingMessageData =
        {
            tradingId: this.tradingId,
            message: UpdateMessage,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        this.http.post(`${config.baseUrl}/tradingMessageInsert`,
            tradingMessageData, headerOptions).subscribe(res => { }, err => { });

        // const tradingNotificationData =
        // {
        //     fromUserId      :       localStorage.getItem('userId'),
        //     toUserId        :       this.brokerId,
        //     notification    :       this.updateMessageForNotification,
        //     createdBy       :       localStorage.getItem('userId'),
        //     updatedBy       :       localStorage.getItem('userId')
        // };

        // console.log(tradingNotificationData);

        // this.socket.emit('new-notification', tradingNotificationData);
        // this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
        // tradingNotificationData, headerOptions).subscribe(res =>{},err =>{});

        if (localStorage.getItem('userRoleId') == '4') {
            if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                const tradingNotificationData =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: this.ownerId,
                    notification: this.updateMessageForNotification,
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
            }
        }

        if (localStorage.getItem('userRoleId') == '6') {
            console.log("helloo check", this.chartererId);

            if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                const tradingNotificationData =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: this.chartererId,
                    notification: this.updateMessageForNotification,
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
            }
            else {
                const tradingNotificationData =
                {
                    fromUserId: localStorage.getItem('userId'),
                    toUserId: this.brokerId,
                    notification: this.updateMessageForNotification,
                    createdBy: localStorage.getItem('userId'),
                    updatedBy: localStorage.getItem('userId')
                };
                this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                    tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
            }
        }

        if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
            const tradingProgressData =
            {
                tradingId: this.tradingId,
                ownerId: this.ownerId,
                brokerId: localStorage.getItem('userId'),
                chartererId: null,
                message: UpdateMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res => { }, err => { });
        }

        if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
            const tradingProgressData =
            {
                tradingId: this.tradingId,
                ownerId: null,
                brokerId: localStorage.getItem('userId'),
                chartererId: this.chartererId,
                message: UpdateMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingProgressInsert`,
                tradingProgressData, headerOptions).subscribe(res => { }, err => { });
        }
    }
    // Accept / Reject Charterer Owner Request End

    // Trade Edit View Start
    editView(tradingId): void {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            tradingId: tradingId,
            isTrading: '1'
        };
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));

        this.router.navigate(['/apps/drawCp-Clauses-management']);
    }
    // Trade Edit View End

    // Trade Recap View Start
    recapView(tradingId) {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            tradingId: tradingId,
            isTrading: '1',
        };
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        this.router.navigate(['/apps/recap-management']);
    }
    // Trade Recap View End


    cpFormsRecords(): void {
        try {
            this.http.get(`${config.baseUrl}/cpFromlist`).subscribe(
                res => {

                    this.cpFormList = res;
                    if (this.cpFormList.success) {
                        this.cpFormData = this.cpFormList.data;
                    }
                },
                err => {
                }
            );
        } catch (err) {
        }
    }

    changeCPForm(event): void {
        this.formId = event.value;
    }

    vesselRecords(): void {
        try {
            this.http.get(`${config.baseUrl}/vessellist`).subscribe(
                res => {

                    this.VesselList = res;
                    if (this.VesselList.success) {
                        this.VesselData = this.VesselList.data;
                    }
                },
                err => {
                }
            );
        } catch (err) {
        }
    }

    changeVesselEvent(event): void {
        this.vesselId = event.value;
        for (let index = 0; index < this.VesselData.length; index++) {
            if (this.VesselData[index].id == this.vesselId) {
                this.ownerId = this.VesselData[index].id_owner;
            }
        }
    }

    fetchChartererData() {
        if (JSON.parse(localStorage.getItem('userRoleId')) != '7') {
            this.companyId = JSON.parse(localStorage.getItem('companyId'));
        }
        var filter = {};
        filter['companyId'] = this.companyId;
        filter['userRoleId'] = '4';
        try {
            this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) => {

                this.chartererRecordResponse = res;
                if (this.chartererRecordResponse.success === true) {
                    this.chartererRecordData = this.chartererRecordResponse.data;
                }
            }, err => { console.log(err); });
        } catch (err) { console.log(err); }
    }
    ChartereRecords(): void {
        try {
            this.http.get(`${config.baseUrl}/userList`).subscribe(
                res => {

                    this.ChartereInfoList = res;
                    if (this.ChartereInfoList.success) {
                        this.ChartereInfoList.data.forEach(valueData => {
                            if (valueData.userRoleId === 4) {
                                this.ChartereInfoData.push(valueData);
                            }
                        });

                    }
                },
                err => {
                }
            );
        } catch (err) {
        }
    }

    changeChartererType(event): void {
        this.chartererId = event.value;
    }
    drawCPRecords(): void {
        var arrfilterInfo = {};

        arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            arrfilterInfo["dcm.brokerId"] = localStorage.getItem('userId');
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            // arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
        }
        // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');
        try {
            this._userService.drawRecordsServerSide(arrfilterInfo)
                .pipe(first())
                .subscribe((res) => {

                    this.drawManagementRes = res;
                    if (this.drawManagementRes.success === true) {
                        this.drawCPDataData = this.drawManagementRes.data;
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');

                    });
        } catch (err) {
        }
    }

    changeDrawCP(event): void {
        this.formId = event.value;
    }

    fetchDrawRecords(): void {
        this.alertService.clear();

        var isValid = 1;

        if (isValid == 0) {
            return;
        } else {

            this.tradingRecordsServerSideResponseData = [];
            var convertedDate = moment(this.fSearch.cpDateSearch.value).format("YYYY-MM-DD");

            var conditionData = {};
            conditionData["dcm.companyId"] = localStorage.getItem('companyId');
            conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
            conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
            conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
            conditionData["dcm.progress"] = 100;
            if (this.fSearch.formIdSearch.value) {
                conditionData["dcm.formId"] = this.fSearch.formIdSearch.value;
                this.formIdValueForDrawRecords = this.fSearch.formIdSearch.value;
            }
            if (this.fSearch.vesselIdSearch.value) {
                conditionData["dcm.vesselId"] = this.fSearch.vesselIdSearch.value;
                this.vesselIdValueForDrawRecords = this.fSearch.vesselIdSearch.value;
            }
            if (this.fSearch.cpDateSearch.value) {
                conditionData["dcm.cpDate"] = convertedDate;
                this.cpDateValueForDrawRecords = convertedDate;
            }
            if (this.fSearch.drawCPIDSearch.value) {
                conditionData["dcm.id"] = this.fSearch.drawCPIDSearch.value;
                this.drawCPIDForDrawRecords = this.fSearch.drawCPIDSearch.value;
            }
            if (this.fSearch.chartererIdSearch.value) {
                conditionData["dcm.chartererId"] = this.fSearch.chartererIdSearch.value;
                this.chartererIdValueForDrawRecords = this.fSearch.chartererIdSearch.value;
            }
            if (this.fSearch.ownerIdSearch.value) {
                conditionData["dcm.ownerId"] = this.fSearch.ownerIdSearch.value;
                this.ownerIdValueForDrawRecords = this.fSearch.ownerIdSearch.value;
            }
            console.log(this.fSearch);
            console.log(this.fSearch.ownerIdSearch);
            console.log(conditionData);
            try {
                this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                    this.tradingRecordsServerSideResponse = res;
                    if (this.tradingRecordsServerSideResponse.success === true) {
                        this.drawManagementResFilter = res;
                        this.drawFormDivShow = false;
                        this.drawFormDivShowForDocumentUser = false;
                        this.drawRecordsTableShow = true;
                        this.drawManagementResFilter = this.tradingRecordsServerSideResponse.data;
                        setTimeout(() => { this.updateFilterPaginator(); }, 500);
                        console.log(this.drawManagementResFilter);
                    } else {
                        this.drawManagementResFilter = [];
                        this.drawFormDivShow = false;
                        this.drawFormDivShowForDocumentUser = false;
                        this.drawRecordsTableShow = true;
                        this.drawManagementResFilter = [];
                        setTimeout(() => { this.updateFilterPaginator(); }, 500);
                        console.log(this.drawManagementResFilter);
                    }
                    this.show = true;
                }, err => { this.alertService.error(err, 'Error'); });
            } catch (err) { }
        }
    }

    drawRecordsServerSide(): void {
        // this.drawManagementData = [];

        // var arrfilterInfo = {};

        // if(this.formIdValueForDrawRecords > 0)
        // {
        //     arrfilterInfo["dcm.formId"] = this.formIdValueForDrawRecords;
        // }
        // if(this.vesselIdValueForDrawRecords > 0)
        // {
        //     arrfilterInfo["dcm.vesselId"] = this.vesselIdValueForDrawRecords;
        // }
        // if(this.cpDateValueForDrawRecords != '')
        // {
        //     arrfilterInfo["dcm.cpDate"] = this.cpDateValueForDrawRecords;
        // }
        // if(this.drawCPIDForDrawRecords > 0)
        // {
        //     arrfilterInfo["dcm.id"] = this.drawCPIDForDrawRecords;
        // }

        // if(this.chartererIdValueForDrawRecords > 0)
        // {
        //     arrfilterInfo["dcm.chartererId"] = this.chartererIdValueForDrawRecords;
        // }

        // if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        // {
        //     arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        //     arrfilterInfo["dcm.brokerId"] = localStorage.getItem('userId');
        // }
        // if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        // {
        //     arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        //     arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        // }

        // if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        // {
        //     arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        //     arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
        // }

        // if(JSON.parse(localStorage.getItem('userRoleId')) == '7')
        // {
        //     if(this.companyId != '' && this.companyId != null)
        //     {
        //         arrfilterInfo["dcm.companyId"] = (this.companyId != '' && this.companyId != null) ? this.companyId : null;
        //     }
        //     if(this.ownerId != '' && this.ownerId != null)
        //     {
        //         arrfilterInfo["dcm.ownerId"] = (this.ownerId != '' && this.ownerId != null) ? this.ownerId : null;
        //     }
        //     if(this.brokerId != '' && this.brokerId != null)
        //     {
        //         arrfilterInfo["dcm.brokerId"] = (this.brokerId != '' && this.brokerId != null) ? this.brokerId : null;
        //     }
        //     if(this.chartererId != '' && this.chartererId != null)
        //     {
        //         arrfilterInfo["dcm.chartererId"] = (this.chartererId != '' && this.chartererId != null) ? this.chartererId : null;
        //     }

        //     // arrfilterInfo["dcm.ownerId"] = (this.ownerId != '' && this.ownerId != null) ? this.ownerId : null;
        //     // arrfilterInfo["dcm.brokerId"] = (this.brokerId != '' && this.brokerId != null) ? this.brokerId : null;
        //     // arrfilterInfo["dcm.chartererId"] = (this.chartererId != '' && this.chartererId != null) ? this.chartererId : null;
        // }

        // arrfilterInfo["dcm.progress"] = 100;

        // // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');

        // console.log(arrfilterInfo);

        // try
        // {
        //     this._userService.drawRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
        //     {


        //         this.drawManagementResFilter = res;
        //         this.drawFormDivShow = false;
        //         this.drawFormDivShowForDocumentUser = false;
        //         this.drawRecordsTableShow = true;
        //         this.drawManagementData = this.drawManagementResFilter.data;

        //         setTimeout(() => {
        //             this.updateFilterPaginator();
        //         }, 100);

        //         if (this.drawManagementResFilter.success === true)
        //         {

        //         }
        //         this.show = true;
        //     },
        //     err =>
        //     {
        //         this.alertService.error(err, 'Error');
        //     });
        // } catch (err)
        // {
        // }

        this.tradingRecordsServerSideResponseData = [];
        var conditionData = {};
        conditionData["dcm.companyId"] = localStorage.getItem('companyId');
        conditionData["dcm.createdBy"] = (JSON.parse(localStorage.getItem('userRoleId')) == '3') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.chartererId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '4') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.ownerId"] = (JSON.parse(localStorage.getItem('userRoleId')) == '6') ? localStorage.getItem('userId') : undefined;
        conditionData["dcm.progress"] = 100;

        try {
            this._userService.TradingFormRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success === true) {
                    this.drawManagementResFilter = res;
                    this.drawFormDivShow = false;
                    this.drawFormDivShowForDocumentUser = false;
                    this.drawRecordsTableShow = true;
                    this.drawManagementResFilter = this.tradingRecordsServerSideResponse.data;
                    setTimeout(() => { this.updateFilterPaginator(); }, 100);
                    console.log(this.drawManagementResFilter);


                }
                this.show = true;
            }, err => { this.alertService.error(err, 'Error'); });
        } catch (err) { }

    }
    updateFilterPaginator() {
        this.dataSourceFilter = new MatTableDataSource(this.drawManagementResFilter);
        console.log(this.dataSourceFilter);

        this.dataSourceFilter.paginator = this.paginator;
        this.dataSourceFilter.sort = this.sort;
    }

    fetchDrawRecordsDocument(): void {
        this.alertService.clear();

        var isValid = 1;

        if (isValid == 0) {
            return;
        } else {

            var convertedDate = moment(this.fSearch.cpDateSearch.value).format("YYYY-MM-DD");

            if (this.fSearch.formIdDocSearch.value) {
                this.formIdValueForDrawRecords = this.fSearch.formIdDocSearch.value;
            }
            if (this.fSearch.vesselIdDocSearch.value) {
                this.vesselIdValueForDrawRecords = this.fSearch.vesselIdDocSearch.value;
            }
            if (this.fSearch.cpDateDocSearch.value) {
                this.cpDateValueForDrawRecords = convertedDate;
            }
            if (this.fSearch.drawCPIDDocSearch.value) {
                this.drawCPIDForDrawRecords = this.fSearch.drawCPIDDocSearch.value;
            }
            if (this.fSearch.chartererIdDocSearch.value) {
                this.chartererIdValueForDrawRecords = this.fSearch.chartererIdDocSearch.value;
            }
            this.drawRecordsServerSide();
        }
    }

    onSubmit(): void {
        console.log(localStorage.getItem('companyId'));
        this.submitted = true;
        this.alertService.clear();
        if (this.DrawManagementForm.invalid) {
            return;
        } else {

            var convertedDate = moment(this.f.cpDate.value).format("YYYY-MM-DD");
            this.formIdValueForDrawRecords = this.f.formId.value;
            this.vesselIdValueForDrawRecords = this.f.vesselId.value,
                this.cpDateValueForDrawRecords = convertedDate,
                this.chartererIdValueForDrawRecords = this.f.chartererId.value;

            const req =
            {
                brokerId: localStorage.getItem('userId'),
                CPTypeId: this.CPTypeId,
                formId: this.formIdValueForDrawRecords,
                vesselId: this.vesselIdValueForDrawRecords,
                ownerId: this.ownerId,
                cpDate: this.cpDateValueForDrawRecords,
                chartererBrokerId: localStorage.getItem('userId'),
                chartererId: this.chartererIdValueForDrawRecords,
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };

            localStorage.setItem('cpFormId', req.formId);

            this.loading = true;
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/DrawFormCreate`, req, headerOptions).subscribe(
                    res => {
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true) {
                            this.drawId = this.createtypeRes.data[0];
                            console.log(this.drawId);

                            this.alertService.success(this.createtypeRes.message, 'Success');
                            this.DrawManagementForm.reset();
                            this.drawIdServerSide();


                            const reqData =
                            {
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                drawId: this.drawId,
                                formId: req.formId,
                                chartererId: this.chartererIdValueForDrawRecords,
                                isTrading: '2',
                            };
                            console.log(reqData);
                            localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
                            this.router.navigate(['/apps/drawCp-Clauses-management']);

                            // this.drawRecordsServerSide();
                        } else {
                            this.alertService.error(this.createtypeRes.message, 'Error');
                        }
                    },
                    err => {
                        this.alertService.error(err, 'Error');
                    }
                );
            } catch (err) {
            }
        }
    }



    drawIdServerSide(): void {
        this.drawManagementData = [];

        var arrfilterInfo = {};

        var isCondition = 0;

        if (this.formIdValueForDrawRecords > 0) {
            isCondition = 1;
            arrfilterInfo["dcm.formId"] = this.formIdValueForDrawRecords;
        }
        if (this.vesselIdValueForDrawRecords > 0) {
            isCondition = 1;
            arrfilterInfo["dcm.vesselId"] = this.vesselIdValueForDrawRecords;
        }
        if (this.cpDateValueForDrawRecords != '') {
            isCondition = 1;
            arrfilterInfo["dcm.cpDate"] = this.cpDateValueForDrawRecords;
        }
        if (this.drawCPIDForDrawRecords > 0) {
            isCondition = 1;
            arrfilterInfo["dcm.chartererBrokerId"] = this.chartererIdValueForDrawRecords;
        }

        arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');

        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            arrfilterInfo["dcm.brokerId"] = localStorage.getItem('userId');
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            // arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
        }


        try {
            this._userService.drawRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) => {
                this.drawManagementResFilter = res;
                this.drawFormDivShow = false;
                this.drawFormDivShowForDocumentUser = false;
                this.drawRecordsTableShow = true;
                this.drawManagementData = this.drawManagementResFilter.data;
                this.dataSourceFilter = new MatTableDataSource(this.drawManagementResFilter.data);
                this.dataSourceFilter.paginator = this.paginator;
                this.dataSourceFilter.sort = this.sort;
                if (this.drawManagementResFilter.success === true) {

                    localStorage.setItem('drawId', this.drawManagementResFilter.data[0].id);
                }
                this.show = true;
            },
                err => {
                    this.alertService.error(err, 'Error');
                });
        } catch (err) {
        }
    }
    onSubmitDoc(): void {
        this.submitted = true;
        this.alertService.clear();
        if (this.DrawManagementFormForDocumentUser.invalid) {
            return;
        } else {

            var convertedDate = moment(this.fDoc.cpDateDocForm.value).format("YYYY-MM-DD");
            this.formIdValueForDrawRecords = this.fDoc.formIdDocForm.value;
            this.vesselIdValueForDrawRecords = this.fDoc.vesselIdDocForm.value,
                this.cpDateValueForDrawRecords = convertedDate,
                this.chartererIdValueForDrawRecords = this.fDoc.chartererIdDocForm.value;

            const req =
            {
                companyId: this.companyId,
                ownerId: this.ownerId,
                brokerId: this.brokerId,
                chartererId: this.chartererIdValueForDrawRecords,

                CPTypeId: this.CPTypeId,
                formId: this.formIdValueForDrawRecords,
                vesselId: this.vesselIdValueForDrawRecords,
                cpDate: null,
                chartererBrokerId: localStorage.getItem('userId'),
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            };

            localStorage.setItem('cpFormId', req.formId);

            this.loading = true;
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/DrawFormCreate`, req, headerOptions).subscribe(
                    res => {

                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true) {
                            this.drawId = this.createtypeRes.data[0];
                            console.log(this.drawId);

                            this.alertService.success(this.createtypeRes.message, 'Success');
                            this.DrawManagementFormForDocumentUser.reset();
                            this.drawIdServerSide();

                            const reqData =
                            {
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                drawId: this.drawId,
                                formId: req.formId,
                                chartererId: this.chartererIdValueForDrawRecords,
                                isTrading: '2',
                            };
                            console.log(reqData);
                            localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
                            this.router.navigate(['/apps/drawCp-Clauses-management']);

                            // this.drawRecordsServerSide();
                        } else {
                            this.alertService.error(this.createtypeRes.message, 'Error');
                        }
                    },
                    err => {
                        this.alertService.error(err, 'Error');
                    }
                );
            } catch (err) {
            }
        }
    }



    ChangeUserList(event) {
        console.log(event);

        // alert("hello");
        let roleId: String;
        let idValue = event.target.value;
        if (idValue == 1) {
            roleId = '3';
        }

        else if (idValue == 2) {
            roleId = '4';
        }


        else if (idValue == 3) {
            roleId = '6';
        }

        console.log(roleId);
        this.brokerDropdown = true;

        var conditionData = {};
        conditionData['companyId'] = JSON.parse(localStorage.getItem('companyId'));
        conditionData['userRoleId'] = roleId;

        try {

            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.userRecordsServerSideResponse = res;
                if (this.userRecordsServerSideResponse.success === true) {
                    this.userRecordsServerSideResponseData = this.userRecordsServerSideResponse.data;
                    console.log(this.userRecordsServerSideResponseData);
                    if (JSON.parse(localStorage.getItem('userRoleId')) == roleId) {
                        var userID = JSON.parse(localStorage.getItem('userId'));
                        for (let index = 0; index < this.userRecordsServerSideResponseData.length; index++) {
                            if (userID == this.userRecordsServerSideResponseData[index].id) {
                                this.userNameNotification = this.userRecordsServerSideResponseData[index].username;
                            }
                        }
                    }
                }
            }, err => { console.log(err); });
        } catch (err) { console.log(err); }


    }

    changeTradeModal(identifier, brokerId, chartererId, ownerId, tradingId) {

        console.log(tradingId, "check");
        this.tradingId = tradingId;
        this.ownerId = ownerId;
        this.brokerId = brokerId;
        this.chartererId = chartererId;
        this.tradeIdentifier = identifier;
        this.shareChangeModal = !this.shareChangeModal;
    }

    hideShareModal()
    {
        this.shareChangeModal = !this.shareChangeModal;
    }

    UserDetail(event) {
        this.changeOwnerId = event.target.value;
    }

    setShareToUserID(event)
    {
        this.shareToUserID = event.target.value;
    }

    userData : any;

    toShareUserEmailID : any;

    shareTrade() {

        var userName = localStorage.getItem('userName');
        
        var conditionData = {};
        conditionData['id'] = this.shareToUserID;
        try {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) => {
                this.userData = res;
                if (this.userData.success === true) {
                    this.userData = this.userData.data[0];
                    console.log(this.userData);
                    this.toShareUserEmailID = this.userData.email;
                }
            }, err => { console.log(err); });
        } catch (err) { console.log(err); }

        

        setTimeout(() => { 
            console.log(this.toShareUserEmailID);
            
            var message = userName + ' has Share trade - ' + this.tradeIdentifier + ' to ' + this.changeOwnerName;

            var ownerShipData = {};
            ownerShipData["tradingId"] = this.tradingId;
            ownerShipData["companyId"] = localStorage.getItem('companyId');
            ownerShipData["ownerId"] = this.ownerId;
            ownerShipData["changeOwnerId"] = localStorage.getItem('userId');
            ownerShipData["fromUserId"] = localStorage.getItem('userId');
            ownerShipData["toUserId"] = this.shareToUserID;
            ownerShipData["date"] = moment(new Date()).format("YYYY-MM-DD");
            ownerShipData["time"] = moment().format("H:mm A");
            ownerShipData["message"] = message;
            ownerShipData["email_id"] = this.changeOwnerEmailID;
            ownerShipData["createdBy"] = localStorage.getItem('userId');
            ownerShipData["updatedBy"] = localStorage.getItem('userId');

            console.log("check change", ownerShipData);

            try {
                this._userService.shareTrade(ownerShipData).pipe(first()).subscribe((res) => {
                    this.alertService.success('Trade Share successfully', 'Success');
                    this.shareChangeModal = !this.shareChangeModal;
                }, err => { this.alertService.error(err, 'Error'); });
            } catch (err) { }

            var emailData = {};
            emailData["email_id"] = this.toShareUserEmailID;
            emailData["message"] = message;
            emailData["subject"] = 'Trade Share ';
            try {
                this._userService.emailSendCommon(emailData).pipe(first()).subscribe((res) => {

                }, err => { this.alertService.error(err, 'Error'); });
            } catch (err) { }

            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            
            const tradingMessageData =
            {
                tradingId: this.tradingId,
                message: message,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingMessageInsert`, tradingMessageData, headerOptions).subscribe(res => { }, err => { });

            const tradingNotificationData =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.brokerId,
                notification: message,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', tradingNotificationData);
            this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationData, headerOptions).subscribe(res => { }, err => { });

            const tradingNotificationDataCharterer =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.chartererId,
                notification: message,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', tradingNotificationDataCharterer);
            this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationDataCharterer, headerOptions).subscribe(res => { }, err => { });

            const tradingNotificationDataOwner =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.ownerId,
                notification: message,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', tradingNotificationDataOwner);
            this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationDataOwner, headerOptions).subscribe(res => { }, err => { });


        }, 2000);
        // this.tradingRecordsServerSide();

    }

}