import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, single } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTooltip } from '@angular/material/tooltip';
import { UserService } from '../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import { FormGroupDirective, NgForm, } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import DiffMatchPatch from 'diff-match-patch';
import * as $ from 'jquery';
import { exists } from 'fs';

export interface PeriodicElement {
    userName: string;
    termsName: string;
    updatedAt: string;
    updatedDateInfo: string;

}

export interface UserData {
    userName: string;
    updatedAt: string;
    termsName: string;
    updatedDateInfo: string;
}


@Component(
    {
        selector: 'app-draw-cp-clauses',
        templateUrl: './draw-cp-clauses.component.html',
        styleUrls: ['./draw-cp-clauses.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations
    })

export class DrawCpClausesComponent implements OnInit {
    minDate = new Date();
    isFolded = false;

    panelOpenState: boolean = true;

    // panelOpenState = false;

    isValidSubmitCount: any;
    isValidSubmit = false;
    heading_msg: String = "";
    tradingPlatformLogs = [];

    clauseCategoryCheckChanged: any;
    mainTermClauseCheckChanged: any;
    mainTermClauseCustomCheckChanged: any;
    mainTermClauseCustomCheckCustomChanged: any;

    is_borker_submit: any;

    haveUpdatedTermsDetails: any;

    haveUpdatedSomeTerms: any;
    haveAddedNewCustomCluase: any;
    haveAddedNewCustomClauseTerms: any;

    loggedInUserName: any;

    oldClauseSelected: any;
    mainClausesSelected: any;

    // Review Table Start
    displayedColumns: string[] = ['userName', 'updatedDateInfo', 'clauseTracker'];

    dataSourcecustom = new MatTableDataSource<PeriodicElement>();
    dataSource = new MatTableDataSource<PeriodicElement>();

    dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause = new MatTableDataSource<PeriodicElement>();

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause.filter = filterValue.trim().toLowerCase();
    }
    id: String;
    counterId: String;
    socket: any;
    parentId: string;
    clauseId: string;
    nos: string;
    termsName: string;
    drawCharterId: string;
    status: string;

    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    updatedDateInfo: string;
    isActive: string;
    isDelete: string;

    cpCity: string;

    drawResponse: any;

    tradingResponse: any;

    commonClausesArray = [];
    commonClausesCustomArray = [];
    commonClausesCustomClauseTermArray = [];

    counterIdInfo: any;

    reviewData = [];

    customClause: String;
    termsUpdateRes: any;

    editclauses = [];
    tempedit: any;
    editid: string;
    editclausetext: String;
    tmpeditclausetext: String;
    submitResponse: any;
    notifiactionres: any;
    viewData = [];
    viewCustomData = []
    check = [];
    // Review Table End

    differentWordsArray = [];

    showReviewModal = false;


    clauseCategoryResponse: any;
    clauseCategoryData = [];

    clauseCategoryTermsResponse: any;
    clauseCategoryTermsData = [];

    clauseCategoryTermsReviewResponse: any;
    clauseCategoryTermsReviewData = [];

    customClauseDataResponse: any;
    customClauseDataResponseData = [];

    clauseCategoryRecordResponse: any;
    clauseCategoryRecordResponseData = [];

    clauseCategoryRecordResponseDataAllChecked: any;

    totalTermsReviewRecords: any;


    cpTimeInfo: string;



    stdBidForm: FormGroup;
    drawcluases = [];
    drawManagementRes: any;
    clusesId = [];
    viewtable: false;

    counterResponse: any;
    convertedWord: any;

    clauseTitle: string;
    clauseTerms: string;
    clauseTermsArray = [];
    htmlToAdd: any;

    drawResponseInformation: any;
    drawResponseInformationData = [];



    clauseTermNumber: any;

    customClauseInsertID: any;
    customClauseTermsId: string;
    customClauseTermsResponse: any;
    customClauseTermsResponseData = [];

    customClauseIDInfo: any;
    customTermsOfCustomClause: any;

    addCustomTermsOfCustomClauseResponse: any;
    addCustomTermsOfCustomClauseResponseData = [];

    editCustomTermsOfCustomClauseResponse: any;
    editCustomTermsOfCustomClauseResponseData = [];

    viewCustomTermsOfCustomClauseResponse: any;
    viewCustomTermsOfCustomClauseResponseData = [];

    customTermsOfCustomClauseEdit: any;
    customTermsOfCustomClauseEditID: any;
    customTermsOfCustomClauseEditCustomClauseID: any;
    customTermsOfCustomClauseEditParentID: any;

    checkedClauseCategory = [];
    checkedClauseCategoryRecap = [];

    checkedCheckBoxSecondScreen = [];

    checkedCheckBox = [];
    checkedCheckBoxCustom = [];
    checkedCheckBoxCustomClauseTerms = [];

    editClauseTermOfMainClauseID: any;
    editClauseTermOfMainClauseCategoryID: any;
    editClauseTermOfMainClauseResponse: any;
    editClauseTermOfMainClauseResponseData = [];

    viewClauseTermOfMainClauseResponse: any;
    viewClauseTermOfMainClauseResponseData = [];

    editCustomClauseTermDataInput: String;
    editCustomClauseTermOfMainClauseID: any;
    editCustomClauseTermOfMainClauseCategoryID: any;
    editCustomClauseTermOfMainClauseResponse: any;
    editCustomClauseTermOfMainClauseResponseData = [];

    viewCustomClauseTermOfMainClauseResponse: any;
    viewCustomClauseTermOfMainClauseResponseData = [];
    allchecked: boolean;
    allcheckedCustomClause: boolean;
    allcheckedCustomClauseOfCustomClause: boolean;
    clauseTermsCheckBox: any;

    currentSignature1: any;
    currentSignature2: any;

    lastAction: any;

    options = [];

    // panelOpenState = false;
    termsReviewRecordsResponse: any;
    termsReviewRecordsData = [];
    chartererId: String;

    termsReviewRecordsResponseRecap: any;
    termsReviewRecordsDataRecap = [];

    clauseCategoryTermsReviewResponseCustom: any;
    clauseCategoryTermsReviewDataCustom = [];

    mainScreen = true;

    thirdScreenButton = false;

    tradingLogsResponse: any;
    tradingLogsResponseData = [];


    vesselDataResponse: any;
    vesselDataResponseArray = [];

    chartererDataResponse: any;
    chartererDataResponseArray = [];



    dateMonthYearString: string;

    preamble_description: string;
    metricTonValue: string;
    customInput1: string;
    customInput2: string;
    customInput3: string;
    customInput4: string;
    customInput5: string;

    signature1ImageView = false;
    signature2ImageView = false;
    signature1DemoView = false;
    signature2DemoView = false;

    convrtedString: any;

    dynamicInputForDatePicker: any;

    mainDynamicStringArray = [];

    dynamicStringArray = [];

    dynamicStringUpdateArray = [];

    dynamicInputNumber: any;

    dynamicString: any;

    timePickerValue: any;

    cpTimeStdBid: any;
    cityIdStdBid: any;
    cpDateStdBid: any;
    fixture_subject: any;
    lifted_by: any;
    lifted_time: any;
    lifted_date: any;
    lifted_city: any;
    lifted_charter_party_place: any;
    lifted_charter_fully_style: any;
    lifted_charter_domicile: any;
    lifted_owner_type: any;
    lifted_owner_fully_style: any;
    lifted_owner_domicile: any;

    lifted_vessel_name: any;
    lifted_vessel_imo: any;
    lifted_vessel_flag: any;
    lifted_vessel_year_built: any;

    lifted_vessel_dwat_metric_tons: any;
    lifted_vessel_draft_on_marks: any;
    lifted_vessel_loa: any;
    lifted_vessel_beam: any;
    lifted_vessel_holds: any;
    lifted_vessel_hatches: any;
    lifted_vessel_gear: any;
    lifted_vessel_swl: any;

    isStdBid: any;

    loading = false;
    submitted = false;

    isDisabled: any;

    isCheckboxDisabled: any;

    isChartererAccepted: any;

    chartererEmailID: any;

    counterNumberInfo: any;

    submitButtonText: any;

    // New Code Start

    // Assign Variables Start
    drawId: String;
    brokerId: String;
    ownerId: string;
    tempChartererId: string;
    tempOwnerId: string;
    tempVesselId: string;
    tradingId: String;
    isTrading: String;
    formId: String;
    companyId: String;
    pageTitle: String;
    cityId: string;
    cityIdInfo: string;
    cpTime: string;
    cpDate: string;
    ownerName: string;
    vesselName: string;
    chartererName: string;
    ownerEmail: string;
    chartererEmail: string;
    brokerName: string;
    cpFormName: string;
    cityName: string;
    vesselId: string;
    imoNumber: string;
    vesselFlag: string;
    vesselYear: string;
    vesselDescription: string;

    appendixDescription: string;
    cp_form_description: string;

    ownerNameNotification: string;
    chartererNameNotification: string;
    brokerNameNotification: string;
    current_date = moment(new Date()).format("YYYY-MM-DD");
    current_time = moment().format("HH:mm A");


    message: any;

    ownerCounterNumber: string;
    chartererCounterNumber: string;

    ownerDetailCounterNumber: string;
    chartererDetailCounterNumber: string;

    ownerModal: any;
    chartererModal: any;
    vesselModal: any;

    is_owner_main_term_sign_off: any;
    is_charterer_main_term_sign_off: any;
    is_owner_detail_term_sign_off: any;
    is_charterer_detail_term_sign_off: any;

    ownerMainTermChecked: any;
    chartererMainTermChecked: any;
    ownerDetailTermChecked: any;
    chartererDetailTermChecked: any;

    ownerMainTermDisabled: any;
    chartererMainTermDisabled: any;
    ownerDetailTermDisabled: any;
    chartererDetailTermDisabled: any;


    ownerCheckedClauses = [];
    ownerCheckedCustomClauses = [];
    ownerCheckedCustomTermsClauses = [];

    chartererCheckedClauses = [];
    chartererCheckedCustomClauses = [];
    chartererCheckedCustomTermsClauses = [];


    brokerCheckedClauses = [];

    clauseChecked = [];
    clauseCustomChecked = [];
    clauseCustomTermsChecked = [];

    mainTermCheckedClauses = [];
    mainTermCheckedClausesCustom = [];
    mainTermCheckedClausesCustomTerms = [];
    // Assign Values End
    notification = [];
    // Set View Variables Start
    firstScreen = true;
    firstScreenStdBid = false;
    firstScreenStdBidBroker = false;
    secondScreen = false;
    thirdScreen = false;

    ownerDropdownView = false;
    ownerNameView = false;

    vesselDropdownView = false;
    vesselNameView = true;
    cpform = false;
    timeView = false;
    timeZone = false;
    cityView = false;
    // drawCPFormView = true;
    chartererDropdownView = false;
    chartererNameView = false;

    mainTermOwnerSignOffView = false;
    mainTermChartererSignOffView = false;

    detailTermOwnerSignOffView = false;
    detailTermChartererSignOffView = false;

    // Set View Variables End
    charterLogin = true;
    // Assign API Variable Start
    cpFormRecordsServerSideResponse: any;
    cpFormRecordsServerSideResponseData = [];
    cityRecordsServerSideResponse: any;
    cityRecordsServerSideResponseData = [];
    tradingRecordsServerSideResponse: any;
    tradingRecordsServerSideResponseData = [];
    ownerRecordsServerSideResponse: any;
    ownerRecordsServerSideResponseData = [];
    vesselRecordsServerSideResponse: any;
    vesselRecordsServerSideResponseData = [];

    chartererRecordsServerSideResponse: any;
    chartererRecordsServerSideResponseData = [];
    step: number;
    mainTermCheckedClausesCategory = [];
    // Assign API Variable End

    // Form Settings End
    ownerDropDownForm: FormGroup;
    ownerDropDownFormSubmitResponse: any;
    ownerDropDownFormSubmitResponseData = [];
    get ownerDropDownFormValue() { return this.ownerDropDownForm.controls; }

    vesselDropDownForm: FormGroup;
    vesselDropDownFormSubmitResponse: any;
    vesselDropDownFormSubmitResponseData = [];
    get vesselDropDownFormValue() { return this.vesselDropDownForm.controls; }

    chartererDropDownForm: FormGroup;
    chartererDropDownFormSubmitResponse: any;
    chartererDropDownFormSubmitResponseData = [];
    get chartererDropDownFormValue() { return this.chartererDropDownForm.controls; }
    // Form Settings End

    // Assign Form Values Start
    clauseForm: FormGroup;
    get clauseFormValues() { return this.clauseForm.controls; }

    drawCPPreambleForm: FormGroup;
    get drawCPPreambleFormValues() { return this.drawCPPreambleForm.controls; }
    // Assign Form Values End

    cpFormAllRecords: any;
    cpFormAllRecordsData = [];

    customClauseBrokerArray = [];

    clauseFormFirstScreen: FormGroup;
    cpFormId: String;
    isDrawCP: any;
    isOwnerLoggedIn: any;
    is_complete_draw_cp: any;

    timezone: any;

    drawCPFormView = false;
    tradeCPFormView = false;
    drawStatus = true;
    cpFormDynamicStringFormat: any;

    helpModal = false;

    formIdInfo : any;

    // panelOpenState: boolean = false;

    // New Code End


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

    ) {
        this.socket = io('http://18.216.106.180:3001');
        this.socket.on('new-notification', (result) => {
            this.notification.push(result.data);

        });

        this.dataSource = new MatTableDataSource(this.clauseCategoryTermsReviewData);
        this.dataSource = new MatTableDataSource(this.viewCustomTermsOfCustomClauseResponseData);
    }

    get fStdBidSubmit() { return this.stdBidForm.controls; }
    get clauseFormFirstScreenValues() { return this.clauseFormFirstScreen.controls; }

    htmlStr: string = '<strong>The Tortoise</strong> &amp; the Hare <button></button>';

    ownerCompleteCP() {
        var updateData = {};
        updateData['id'] = this.drawId;
        updateData['is_complete_draw_cp'] = '1';
        try {
            this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

            }, err => { });
        } catch (err) { }

        this.is_complete_draw_cp = '1';

        this.alertService.success('Draw CP Completed Successfully', 'Success');
    }

    isBorkerLogin : any;
    mainStringDemo : any;
    newStringDemo : any;
    finalStringDemo : any;
    
    ngOnInit() {
            // text box expand code gauri changes 
            // $( document ).ready( function() { 
            // function resizeInput() {
            //     $(this).attr('size', $(this).val().length);
            // }
            
            // $('input[type="text"]')
            //     // event handler
            //     .keyup(resizeInput)
            //     // resize on page load
            //     .each(resizeInput); 
            // });
        //     $( document ).ready( function() { 
        //     $.fn.textWidth = function(text, font) {
    
        //         if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
                
        //         $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));
                
        //         return $.fn.textWidth.fakeEl.width();
        //     };
            
        //     $('.width-dynamic').on('input', function() {
        //         var inputWidth = $(this).textWidth();
        //         $(this).css({
        //             width: inputWidth
        //         })
        //     }).trigger('input');
            
            
        //     function inputWidth(elem, minW, maxW) {
        //         elem = $(this);
        //         console.log(elem)
        //     }
            
                          
        // });
        // end gauri code

        // New Code Start
        var mainString = 'Vishal Upadhyay.';
        var crossTerm = 'Vishal Upadhyay. PHP Developer.';
        var text = 'VISHAL UPADHYAY PHP DEVELOPER SOFTWARE<div><br></div><div><br></div><div>THIS IS ENTERED TEXT</div>';
            // text = text.replace("<div>","#space");
            // console.log(text);
        var newText = text.split('<div>').join('#space');
        var newText = newText.split('</div>').join('#space');
        var newText = newText.split('<br>').join('#space');
        // console.log(newText);
        
            // return false;
        // var mainStringArray = mainString.split(' ');
        // var crossTermArray = crossTerm.split(' ');
        // var mainStringLength = mainStringArray.length;
        // var crossLength = crossTermArray.length;
        // var mainStringPercentageValueByPart = 100 / crossLength;
        // var String = new DiffMatchPatch();
        // var StringDifferent = String.diff_main(mainString,crossTerm);
        // var finalDifferentWordsArray = [];
        // for(let index = 0; index < StringDifferent.length; index++)
        // {
        //     var isDifferent = StringDifferent[index][0];
        //     var differentWord = StringDifferent[index][1];
        //     if(isDifferent != 0)
        //     {
        //         // finalDifferentWordsArray.push(differentWord);
        //         var words = differentWord.split(' ');
        //         for(let sindex = 0; sindex < words.length; sindex++)
        //         {
        //             finalDifferentWordsArray.push(words[sindex]);
        //         }
        //     }
        // }
        // var finalString = '';
        // for(let index = 0; index < crossTermArray.length; index++)
        // {
        //     finalString += ' ';
        //     if (finalDifferentWordsArray.indexOf(crossTermArray[index].toString()) != -1)
        //     {
        //         finalString += '#diff@'+crossTermArray[index];
        //     } else {
        //         finalString += crossTermArray[index];
        //     }
        // }
        // var resultArray = [];
        //     resultArray['differentWordsArray'] = finalDifferentWordsArray;
        //     resultArray['finalString'] = finalString;
        //     resultArray['differenceInPercentage'] = Math.floor(mainStringPercentageValueByPart * finalDifferentWordsArray.length);
        
        // console.log(resultArray);
        this.timezone = "America/New_York";

        this.current_date = moment(new Date()).format("YYYY-MM-DD");
        this.current_time = moment().format("HH:mm A");

        this.isBorkerLogin = 'N';

        // Assign Values Start
        this.isDrawCP = '2';
        this.isOwnerLoggedIn = '2';
        this.is_complete_draw_cp = '2';
        this.submitButtonText = 'Submit';

        this.loggedInUserName = (localStorage.getItem('userName') != '' && localStorage.getItem('userName') != null && localStorage.getItem('userName') != undefined) ? localStorage.getItem('userName') : '';

        this.loggedInUserName = (this.loggedInUserName != '' && this.loggedInUserName != null && this.loggedInUserName != undefined) ? this.loggedInUserName : 'User';

        var clauseFilterData = JSON.parse(localStorage.getItem('clauseFilterData'));
        this.drawId = clauseFilterData.drawId;
        this.tradingId = clauseFilterData.tradingId;
        this.isTrading = clauseFilterData.isTrading;
        this.formId = clauseFilterData.formId;
        this.companyId = localStorage.getItem('companyId');
        this.pageTitle = (this.isTrading == '2') ? 'Draw C/P Clauses' : 'Trading Clauses';
        this.message = (this.isTrading == '2') ? 'Draw C/P Clauses' : 'Trading Clauses';

        this.ownerName = '';
        this.chartererName = '';
        this.brokerName = '';
        this.ownerEmail = '';
        this.chartererEmail = '';

        this.brokerName = ' Broker';
        this.brokerNameNotification = 'Broker';

        this.ownerName = 'Owner';
        this.ownerNameNotification = 'Owner';

        this.chartererName = 'Charterer';
        this.chartererNameNotification = 'Charterer';

        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            this.pageTitle = 'Broker Updates';
            this.message = 'Broker Updates';
            this.isBorkerLogin = 'Y';
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            this.pageTitle = 'Charterer Updates';
            this.message = 'Charterer Updates';
            this.charterLogin = false;
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            this.pageTitle = 'Owner Updates';
            this.message = 'Owner Updates';
            this.isOwnerLoggedIn = '1';
        }


        // Assign Values End

        // Set Default Values Start
        this.firstScreen = true;
        this.firstScreenStdBid = false;
        this.firstScreenStdBidBroker = false;
        this.secondScreen = false;
        this.thirdScreen = false;
        this.ownerNameView = false;
        this.ownerDropdownView = false;
        this.chartererDropdownView = false;
        // Set Default Values End

        this.getCPFormRecords();

        if (this.formId != '' && this.formId != null && this.formId != undefined) {
            // Fetch CP Form Data Start
            this.cpFormRecordsServerSide();
            // Fetch CP Form Data End
        }

        // Fetch City Records Start
        this.cityRecordsServerSide();
        // Fetch City Records End

        // Set Form And Its Validation Start
        this.ownerDropDownForm = this._formBuilder.group(
            {
                ownerId: ['', Validators.required]
            });
        this.vesselDropDownForm = this._formBuilder.group(
            {
                vesselId: ['', Validators.required]
            });
        this.chartererDropDownForm = this._formBuilder.group(
            {
                chartererId: ['', Validators.required]
            });
        // Set Form And Its Validation End

        if (this.isTrading == '2') {
            this.isDrawCP = '1';
            this.drawStatus = false;
            this.fetchDrawData();
        } else {
            this.tradeCPFormView = true;
            this.fetchTradingLogs();
            this.fetchTradingData();
        }

        this.ownerRecordsServerSide();
        this.chartererRecordsServerSide();
        this.validateSubmitButton();

        // New Code End

        this.isDisabled = 'Y';
        this.clauseTermNumber = 1;
        this.isCheckboxDisabled = 'Y';
        this.mainDynamicStringArray = [];
        this.dynamicInputNumber = 0;

        this.formId = '0';

        this.clauseForm = this._formBuilder.group
            (
                {
                    cpFormId: [this.formId, Validators.required],
                    cpTime: [this.current_time, Validators.required],
                    cityId: [this.cityId, Validators.required],
                    cpDate: [this.current_date, Validators.required],
                }
            );

        // Draw CP Preamble Form Start
        this.drawCPPreambleForm = this._formBuilder.group
            (
                {
                    cpFormId: [this.formId, Validators.required],
                    cityId: [this.cityId, Validators.required]
                }
            );
        // Draw CP Preamble Form End

        this.clauseFormFirstScreen = this._formBuilder.group
            (
                {
                    cpFormId: [this.formId, Validators.required],
                    cityId: [this.cityId, Validators.required],
                    cpTime: [this.current_time, Validators.required],
                    cpDate: [this.current_date, Validators.required],
                    timezone: ["America/New_York", Validators.required],
                }
            );
        this.stdBidForm = this._formBuilder.group
            (
                {
                    cpTimeStdBid: [this.current_time, Validators.required],
                    cpFormId: [this.formId, Validators.required],
                    cityIdStdBid: ['', Validators.required],
                    cpDateStdBid: [this.current_date, Validators.required],
                    fixture_subject: ['', ''],
                    lifted_by: ['', ''],
                    lifted_time: ['', ''],
                    lifted_date: ['', ''],
                    lifted_city: ['', ''],
                    lifted_charter_party_place: ['', ''],
                    lifted_charter_fully_style: ['', ''],
                    lifted_charter_domicile: ['', ''],
                    lifted_owner_fully_style: ['', ''],
                    lifted_owner_domicile: ['', ''],
                    lifted_owner_type: ['', ''],
                    lifted_vessel_name: ['', ''],
                    lifted_vessel_imo: ['', ''],
                    lifted_vessel_flag: ['', ''],
                    lifted_vessel_year_built: ['', ''],
                    lifted_vessel_dwat_metric_tons: ['', ''],
                    lifted_vessel_draft_on_marks: ['', ''],
                    lifted_vessel_loa: ['', ''],
                    lifted_vessel_beam: ['', ''],
                    lifted_vessel_holds: ['', ''],
                    lifted_vessel_hatches: ['', ''],
                    lifted_vessel_gear: ['', ''],
                    lifted_vessel_swl: ['', ''],
                }
            );
        this.isCheckboxDisabled = 'N';
    }

    togglePanel()
    {
        this.panelOpenState = !this.panelOpenState;
    }

    showHelpModal() {
        console.log('HERE IN MODAL');
        console.log(this.helpModal);
        this.helpModal = !this.helpModal;
    }


    changeTimezone(event) {

    }

    getCPFormRecords() {
        try {
            this.http.get(`${config.baseUrl}/cpFromlist`).subscribe(
                res => {
                    this.cpFormAllRecords = res;
                    if (this.cpFormAllRecords.success) {
                        this.cpFormAllRecordsData = this.cpFormAllRecords.data;
                    }
                },
                err => {
                }
            );
        } catch (err) {
        }
    }

    formIdchange(event) {

        this.formId = event.target.value;
        this.cpFormRecordsServerSide();
        this.clauseCategoryRecordsServerSide();
        this.tradeDataUpdate();
    }

    formIdchangeMat(event) {
        this.formId = event.value;
        if (this.isTrading == '2') {
            var updateData = {};
            updateData['id'] = this.drawId;
            updateData['formId'] = this.formId;
            try {
                this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

                }, err => { });
            } catch (err) { }
        } else {
            this.tradeDataUpdate();
        }
        this.cpFormRecordsServerSide();
        this.clauseCategoryRecordsServerSide();
    }

    // Fetch CP Form Data Records Server Side Start
    cpFormRecordsServerSide() {
        var filterCondition = {};
        filterCondition['id'] = this.formId;
        try {
            this._userService.cpFormData(filterCondition).pipe(first()).subscribe((res) => {
                this.cpFormRecordsServerSideResponse = res;
                if (this.cpFormRecordsServerSideResponse.success == true) {
                    this.cpFormRecordsServerSideResponseData = this.cpFormRecordsServerSideResponse.data;
                    this.cpFormName = this.cpFormRecordsServerSideResponseData[0].cpformName;
                    this.cp_form_description = this.cpFormRecordsServerSideResponseData[0].description;
                    console.log(this.cpFormName);
                    this.cpform = true;
                    this.createDynamicStringCPFormDescription(this.cp_form_description);
                }
            });
        } catch (err) { }
    }
    // Fetch CP Form Data Records Server Side End

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
                        this.alertService.error(err, 'Error');
                    });
        } catch (err) { }
    }
    // Fetch City Records End

    // On Change City Start
    changeCity(event): void {
        this.cityId = event.target.value;
        this.tradeDataUpdate();
    }
    changeCityMat(event): void {
        this.cityId = event.value;

        if (this.isTrading == '2') {
            var updateData = {};
            updateData['id'] = this.drawId;
            updateData['cpCity'] = this.cityId;
            try {
                this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

                }, err => { });
            } catch (err) { }
        } else {
            this.tradeDataUpdate();
        }

    }
    // On Change City End

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
                    if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                        for (let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++) {
                            if (this.ownerId == this.ownerRecordsServerSideResponseData[index].id) {
                                this.ownerName = this.ownerRecordsServerSideResponseData[index].username;
                                this.ownerNameNotification = this.ownerRecordsServerSideResponseData[index].username;
                            }
                        }
                    }
                }
            }, err => { });
        } catch (err) { }
    }
    // Owners Records Server Side End

    setPageTitle() {
        if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
            for (let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++) {
                if (this.ownerId == this.ownerRecordsServerSideResponseData[index].id) {
                    this.ownerName = this.ownerRecordsServerSideResponseData[index].username;
                    this.ownerNameNotification = this.ownerRecordsServerSideResponseData[index].username;
                }
            }
        }

        if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
            for (let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++) {
                if (this.chartererId == this.chartererRecordsServerSideResponseData[index].id) {
                    this.chartererName = this.chartererRecordsServerSideResponseData[index].username;
                    this.chartererNameNotification = this.chartererRecordsServerSideResponseData[index].username;
                }
            }
        }

        // Set Page Title Start
        var ownerCounter = this.tradingRecordsServerSideResponseData['owner_counter'];
        var chartererCounter = this.tradingRecordsServerSideResponseData['charterer_counter'];

        var ownerDetailCounter = this.tradingRecordsServerSideResponseData['owner_detail_counter'];
        var chartererDetailCounter = this.tradingRecordsServerSideResponseData['charterer_detail_counter'];

        this.ownerCounterNumber = ownerCounter;
        this.chartererCounterNumber = chartererCounter;

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            this.ownerCounterNumber = ownerCounter + 1;
            this.pageTitle = this.ownerNameNotification + ' ' + this.NumInWords(ownerCounter) + ' Counter';
            this.message = this.pageTitle;
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4' && ownerCounter > 1) {
            this.chartererCounterNumber = chartererCounter + 1;
            this.pageTitle = this.chartererNameNotification + ' ' + this.NumInWords(chartererCounter) + ' Counter';
            this.message = this.pageTitle;
        }

        if (this.is_owner_main_term_sign_off == '1' && this.is_charterer_main_term_sign_off == '0') {
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                this.pageTitle = this.chartererNameNotification + ' Final Counter ';
                this.message = this.pageTitle;
            }
        }

        if (this.is_owner_main_term_sign_off == '1' && this.is_charterer_main_term_sign_off == '1') {
            this.ownerDetailCounterNumber = ownerDetailCounter;
            this.chartererDetailCounterNumber = chartererDetailCounter;

            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                if (ownerDetailCounter > 1) {
                    this.chartererDetailCounterNumber = chartererDetailCounter + 1;
                    this.pageTitle = this.chartererNameNotification + ' Detail ' + this.NumInWords(this.chartererDetailCounterNumber) + ' Counter';
                    if (this.is_owner_detail_term_sign_off == '1') {
                        this.pageTitle = this.chartererNameNotification + ' Detail Final Counter ';
                    }
                    this.message = this.pageTitle;
                }
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                this.ownerDetailCounterNumber = ownerDetailCounter + 1;
                this.pageTitle = this.ownerNameNotification + ' Detail ' + this.NumInWords(ownerDetailCounter) + ' Counter';
                this.message = this.pageTitle;
            }
        }
        // Set Page Title End
    }

    // On Owner Change Start
    onChangeOwner(event) {
        this.tempOwnerId = event.value;
        this.ownerModal = !this.ownerModal;
    }
    // On Owner Change End

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
                    if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                        for (let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++) {
                            if (this.chartererId == this.chartererRecordsServerSideResponseData[index].id) {
                                this.chartererName = this.chartererRecordsServerSideResponseData[index].username;
                                this.chartererNameNotification = this.chartererRecordsServerSideResponseData[index].username;

                                // this.pageTitle = this.chartererName+ ' Trading Updates';
                                // this.message = this.chartererName+ ' Trading Updates';
                            }
                        }
                    } else {
                        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                            var userID = JSON.parse(localStorage.getItem('userId'));
                            for (let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++) {
                                if (userID == this.chartererRecordsServerSideResponseData[index].id) {
                                    this.chartererNameNotification = this.chartererRecordsServerSideResponseData[index].username;
                                }
                            }
                        }
                    }
                }
            }, err => { });
        } catch (err) { }
    }
    // Charterer Records Server Side End

    // On Charterer Change Start
    onChangeCharterer(event) {
        this.tempChartererId = event.value;
        this.chartererModal = !this.chartererModal;
    }
    // On Charterer Change End

    // Fetch Trading Logs Start
    fetchTradingLogs() {
        var ConditionData = {};
        ConditionData["tradingId"] = this.tradingId;
        try {

            this._userService.tradingMessagesDataRecordsServerSide(ConditionData).pipe(first()).subscribe((res) => {
                this.tradingLogsResponse = res;
                if (this.tradingLogsResponse.success == true) {
                    this.tradingLogsResponseData = this.tradingLogsResponse.data;
                    for (let index = 0; index < this.tradingLogsResponseData.length; index++) {
                        this.tradingLogsResponseData[index]['dateTimeInfo'] = moment(this.tradingLogsResponseData[index].createdAt).format("YYYY-MM-DD");
                    }

                }
            })
        } catch (err) { }
    }
    // Fetch Trading Logs End

    // View Logs Start
    viewLogs() {
        var printContents = document.getElementById('printDiv').innerHTML;
        var popupWin = window.open('', '_blank', 'width=1024,height=768');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }
    // View Logs End

    // Fetch Trading Data Start
    fetchTradingData() {
        console.log('FETCH TRADING DATA');
        var ConditionData = {};
        ConditionData["dcm.id"] = this.tradingId;
        try {
            this._userService.fetchTradingData(ConditionData).pipe(first()).subscribe((res) => {
                this.tradingRecordsServerSideResponse = res;
                if (this.tradingRecordsServerSideResponse.success == true) {
                    this.tradingRecordsServerSideResponseData = this.tradingRecordsServerSideResponse.data[0];

                    this.is_owner_main_term_sign_off = this.tradingRecordsServerSideResponseData['is_owner_main_term_sign_off'];
                    this.is_charterer_main_term_sign_off = this.tradingRecordsServerSideResponseData['is_charterer_main_term_sign_off'];
                    this.is_owner_detail_term_sign_off = this.tradingRecordsServerSideResponseData['is_owner_detail_term_sign_off'];
                    this.is_charterer_detail_term_sign_off = this.tradingRecordsServerSideResponseData['is_charterer_detail_term_sign_off'];

                    // Assign Values Start
                    this.ownerName = this.tradingRecordsServerSideResponseData['ownerName'];
                    this.chartererName = this.tradingRecordsServerSideResponseData['chartererName'];
                    this.brokerName = this.tradingRecordsServerSideResponseData['brokerName'];
                    this.cityName = this.tradingRecordsServerSideResponseData['cityName'];
                    this.formId = this.tradingRecordsServerSideResponseData['formId'];
                    this.vesselId = this.tradingRecordsServerSideResponseData['vesselId'];
                    this.ownerId = this.tradingRecordsServerSideResponseData['ownerId'];
                    this.chartererId = this.tradingRecordsServerSideResponseData['chartererId'];
                    this.brokerId = this.tradingRecordsServerSideResponseData['brokerId'];
                    this.metricTonValue = this.tradingRecordsServerSideResponseData['metricTonValue'];
                    this.preamble_description = this.tradingRecordsServerSideResponseData['preamble_description'];
                    this.heading_msg = this.tradingRecordsServerSideResponseData['heading_msg'];
                    this.cp_form_description = this.tradingRecordsServerSideResponseData['cp_form_description'];

                    this.is_borker_submit = this.tradingRecordsServerSideResponseData['is_borker_submit'];


                    this.customInput1 = this.tradingRecordsServerSideResponseData['customInput1'];
                    this.customInput2 = this.tradingRecordsServerSideResponseData['customInput2'];
                    this.cpTime = this.tradingRecordsServerSideResponseData['cpTime'];
                    this.cpDate = this.tradingRecordsServerSideResponseData['cpDate'];
                    this.cityId = this.tradingRecordsServerSideResponseData['cpCity'];

                    this.std_bid_name = this.tradingRecordsServerSideResponseData['std_bid_name'];
                    this.trade_type = this.tradingRecordsServerSideResponseData['trade_type'];

                    this.cpTime = (this.cpTime != '' && this.cpTime != null && this.cpTime != undefined) ? this.cpTime : null;
                    this.cpDate = (this.cpDate != '' && this.cpDate != null && this.cpDate != undefined) ? this.cpDate : null;
                    this.cityId = (this.cityId != '' && this.cityId != null && this.cityId != undefined) ? this.cityId : undefined;
                    this.cpDate = (this.cpDate != null) ? moment(this.cpDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");



                    this.cityIdInfo = (this.cityId != '' && this.cityId != null && this.cityId != undefined) ? this.cityId : undefined;
                    this.cityId = this.cityIdInfo;

                    // Assign Values End
                    // Assign Form Values Start

                    var current_date = moment(new Date()).format("YYYY-MM-DD");
                    var current_time = moment().format("HH:mm A");

                    this.clauseForm = this._formBuilder.group
                        (
                            {
                                cpFormId: [this.formId, Validators.required],
                                cpTime: [this.cpTime, Validators.required],
                                cityId: [this.cityId, Validators.required],
                                cpDate: [this.cpDate, Validators.required],
                            }
                        );

                    this.clauseFormFirstScreen = this._formBuilder.group
                        (
                            {
                                cpFormId: [Number(this.formId), ''],
                                cityId: [Number(this.cityIdInfo), ''],
                                cpTime: [current_time, Validators.required],
                                cpDate: [current_date, Validators.required],
                                timezone: ["America/New_York", Validators.required],
                            }
                        );



                    this.lifted_by = this.tradingRecordsServerSideResponseData['lifted_by'];
                    this.lifted_time = this.tradingRecordsServerSideResponseData['lifted_time'];
                    this.lifted_date = this.tradingRecordsServerSideResponseData['lifted_date'];
                    this.lifted_city = this.tradingRecordsServerSideResponseData['lifted_city'];
                    this.lifted_charter_party_place = this.tradingRecordsServerSideResponseData['lifted_charter_party_place'];
                    this.lifted_charter_fully_style = this.tradingRecordsServerSideResponseData['lifted_charter_fully_style'];
                    this.lifted_charter_domicile = this.tradingRecordsServerSideResponseData['lifted_charter_domicile'];
                    this.lifted_owner_fully_style = this.tradingRecordsServerSideResponseData['lifted_owner_fully_style'];
                    this.lifted_owner_domicile = this.tradingRecordsServerSideResponseData['lifted_owner_domicile'];
                    this.lifted_owner_type = this.tradingRecordsServerSideResponseData['lifted_owner_type'];
                    this.lifted_vessel_name = this.tradingRecordsServerSideResponseData['lifted_vessel_name'];
                    this.lifted_vessel_imo = this.tradingRecordsServerSideResponseData['lifted_vessel_imo'];
                    this.lifted_vessel_flag = this.tradingRecordsServerSideResponseData['lifted_vessel_flag'];
                    this.lifted_vessel_year_built = this.tradingRecordsServerSideResponseData['lifted_vessel_year_built'];
                    this.lifted_vessel_dwat_metric_tons = this.tradingRecordsServerSideResponseData['lifted_vessel_dwat_metric_tons'];
                    this.lifted_vessel_draft_on_marks = this.tradingRecordsServerSideResponseData['lifted_vessel_draft_on_marks'];
                    this.lifted_vessel_loa = this.tradingRecordsServerSideResponseData['lifted_vessel_loa'];
                    this.lifted_vessel_beam = this.tradingRecordsServerSideResponseData['lifted_vessel_beam'];
                    this.lifted_vessel_holds = this.tradingRecordsServerSideResponseData['lifted_vessel_holds'];
                    this.lifted_vessel_hatches = this.tradingRecordsServerSideResponseData['lifted_vessel_hatches'];
                    this.lifted_vessel_gear = this.tradingRecordsServerSideResponseData['lifted_vessel_gear'];
                    this.lifted_vessel_swl = this.tradingRecordsServerSideResponseData['lifted_vessel_swl'];

                    this.stdBidForm = this._formBuilder.group
                        (
                            {

                                cpTimeStdBid: [this.cpTime, Validators.required],
                                cpFormId: [this.formId, Validators.required],

                                cityIdStdBid: [this.cityId, Validators.required],
                                cpDateStdBid: [this.cpDate, Validators.required],
                                fixture_subject: [this.fixture_subject, ''],
                                lifted_by: [this.lifted_by, ''],
                                lifted_time: [this.lifted_time, ''],
                                lifted_date: [this.lifted_date, ''],
                                lifted_city: [this.lifted_city, ''],
                                lifted_charter_party_place: [this.lifted_charter_party_place, ''],
                                lifted_charter_fully_style: [this.lifted_charter_fully_style, ''],
                                lifted_charter_domicile: [this.lifted_charter_domicile, ''],
                                lifted_owner_fully_style: [this.lifted_owner_fully_style, ''],
                                lifted_owner_domicile: [this.lifted_owner_domicile, ''],
                                lifted_owner_type: [this.lifted_owner_type, ''],
                                lifted_vessel_name: [this.lifted_vessel_name, ''],
                                lifted_vessel_imo: [this.lifted_vessel_imo, ''],
                                lifted_vessel_flag: [this.lifted_vessel_flag, ''],
                                lifted_vessel_year_built: [this.lifted_vessel_year_built, ''],
                                lifted_vessel_dwat_metric_tons: [this.lifted_vessel_dwat_metric_tons, ''],
                                lifted_vessel_draft_on_marks: [this.lifted_vessel_draft_on_marks, ''],
                                lifted_vessel_loa: [this.lifted_vessel_loa, ''],
                                lifted_vessel_beam: [this.lifted_vessel_beam, ''],
                                lifted_vessel_holds: [this.lifted_vessel_holds, ''],
                                lifted_vessel_hatches: [this.lifted_vessel_hatches, ''],
                                lifted_vessel_gear: [this.lifted_vessel_gear, ''],
                                lifted_vessel_swl: [this.lifted_vessel_swl, ''],
                            }
                        );

                    // Assign Form Values End
                    // Set Array For Checked Clauses Start
                    this.checkedClauseCategory = [];
                    var checkedClausesArray = this.tradingRecordsServerSideResponseData['checked_clauses'];

                    if (checkedClausesArray != '' && checkedClausesArray != null && checkedClausesArray != undefined) {
                        this.checkedClauseCategory = checkedClausesArray.split(',');
                    } else {
                        this.checkedClauseCategory = [];
                    }
                    var checkedCheckBoxArray = this.checkedClauseCategory;
                    this.checkedClauseCategory = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++) {
                        this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
                    }

                    this.validateSubmitButton();

                    localStorage.setItem('checkedClauseCategory', JSON.stringify(this.checkedClauseCategory));
                    // Set Array For Checked Clauses End
                    // Fetch Vessel Data Start
                    if (this.vesselId != '' && this.vesselId != null && this.vesselId != undefined) {
                        this.fetchVesselData();
                        this.vesselNameView = true;
                        this.vesselDropdownView = false;
                    }
                    if (this.vesselId == '' || this.vesselId == null || this.vesselId == undefined) {
                        if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                            this.vesselRecordsServerSide();
                            this.vesselDropdownView = true;
                        }
                    }
                    console.log(this.formId);
                    // Fetch Vessel Data End
                    if (this.formId != '' && this.formId != null && this.formId != undefined) {
                        // Fetch CP Form Data Start
                        this.cpFormRecordsServerSide();

                        console.log('HERE IN CP FORM RECORDS');
                        console.log(this.cp_form_description);
                        setTimeout(() => {

                            this.cp_form_description = this.tradingRecordsServerSideResponseData['cp_form_description'];
                            if (this.cp_form_description == '' || this.cp_form_description == null || this.cp_form_description == undefined) {
                                this.cp_form_description = this.cpFormRecordsServerSideResponseData[0].description;
                                this.createDynamicStringCPFormDescription(this.cp_form_description);
                            } else {
                                console.log('herE');
                                console.log(this.cp_form_description);
                                this.createDynamicStringCPFormDescription(this.cp_form_description);
                            }
                        }, 1500);

                        // Fetch CP Form Data End
                        // Clause Category Records Server Side Start
                        this.clauseCategoryRecordsServerSide();
                        // Clause Category Records Server Side End
                    }
                    if (this.ownerId == '' || this.ownerId == null || this.ownerId == undefined) {
                        // Owner Records Server Side Start
                        this.ownerRecordsServerSide();
                        // Owner Records Server Side End
                        this.ownerDropdownView = true;
                    }

                    if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                        this.ownerNameView = true;
                    }

                    if (this.chartererId == '' || this.chartererId == null || this.chartererId == undefined) {
                        // Owner Records Server Side Start
                        this.chartererRecordsServerSide();
                        // Owner Records Server Side End
                        this.chartererDropdownView = true;
                    }

                    if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                        this.chartererNameView = true;
                    }

                    if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                        this.mainTermOwnerSignOffView = true;
                    }
                    this.mainTermChartererSignOffView = false;

                    this.detailTermOwnerSignOffView = false;
                    this.detailTermChartererSignOffView = false;

                    this.ownerMainTermDisabled = 'Y';
                    this.chartererMainTermDisabled = 'Y';
                    this.ownerDetailTermDisabled = 'Y';
                    this.chartererDetailTermDisabled = 'Y';

                    this.ownerMainTermChecked = 'N';
                    this.chartererMainTermChecked = 'N';
                    this.ownerDetailTermChecked = 'N';
                    this.chartererDetailTermChecked = 'N';

                    this.ownerMainTermChecked = (this.is_owner_main_term_sign_off == '1') ? 'Y' : 'N';
                    this.chartererMainTermChecked = (this.is_charterer_main_term_sign_off == '1') ? 'Y' : 'N';
                    this.ownerDetailTermChecked = (this.is_owner_detail_term_sign_off == '1') ? 'Y' : 'N';
                    this.chartererDetailTermChecked = (this.is_charterer_detail_term_sign_off == '1') ? 'Y' : 'N';

                    if (this.is_owner_main_term_sign_off == '1') {
                        this.mainTermChartererSignOffView = true;
                    }

                    if (this.is_owner_main_term_sign_off == '1' && this.is_charterer_main_term_sign_off == '1') {
                        this.mainTermOwnerSignOffView = false;
                        this.mainTermChartererSignOffView = false;
                        this.detailTermOwnerSignOffView = true;
                    }

                    if (this.is_owner_detail_term_sign_off == '1') {
                        this.detailTermChartererSignOffView = true;
                    }

                    if (this.is_owner_detail_term_sign_off == '1') {
                        this.detailTermChartererSignOffView = true;
                        this.firstScreenStdBidBroker = true;
                        this.firstScreen = false;
                        this.submitButtonText = 'Raise A Request';
                    } else {
                        // this.firstScreen = true;
                    }

                    this.ownerMainTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '6' && this.ownerMainTermChecked == 'N') ? 'N' : 'Y';
                    this.ownerDetailTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '6' && this.ownerDetailTermChecked == 'N') ? 'N' : 'Y';

                    this.chartererMainTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '4' && this.chartererMainTermChecked == 'N') ? 'N' : 'Y';
                    this.chartererDetailTermDisabled = (JSON.parse(localStorage.getItem('userRoleId')) == '4' && this.chartererDetailTermChecked == 'N') ? 'N' : 'Y';

                    setTimeout(() => { this.setPageTitle(); }, 1000);



                }
            });
        } catch (err) { }
    }
    // Fetch Trading Data End
    std_bid_name : any;
    trade_type : any;
    saveBid()
    {
        var saveBidData = {};
            saveBidData['tradingId'] = this.tradingId;
            saveBidData['bid_name'] = this.std_bid_name;
            saveBidData['bid_type'] = this.trade_type;
            saveBidData['checked_clauses'] = this.checkedClauseCategory.join();
            saveBidData['companyId'] = JSON.parse(localStorage.getItem('companyId'));
            saveBidData['date'] = this.current_date;
            saveBidData['time'] = this.current_time;
            saveBidData['createdBy'] = JSON.parse(localStorage.getItem('userId'));
            saveBidData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
            
        try {
            this._userService.saveBid(saveBidData).pipe(first()).subscribe((res) => {
                this.alertService.success('Bid Saved Successfully', 'Success');
            });
        } catch (err) { }

        var updateData = {};
            updateData['id'] = this.tradingId;
            updateData['is_borker_submit'] = '1';
            updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));

        try { this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) => { }, err => { }); } catch (err) { }

        this.is_borker_submit = '1';

    }

    // Dynamic String Generate Input For CP Form Description
    mergeCPFormDynamicString() {
        var slides = document.getElementsByClassName('cpFormDynamicInput');
        var finalString = '';
        for (var i = 0; i < slides.length; i++) {
            var valueOfUpdatedSting = slides[i];
            if (valueOfUpdatedSting['value'] != '#text') {
                finalString += valueOfUpdatedSting['value'] + ' ';
            } else {
                finalString += '#text@';
            }
        }
        this.cp_form_description = finalString;
    }

    createDynamicStringCPFormDescription(string) {
        console.log('this is ');
        this.cpFormDynamicStringFormat = [];
        if (string != '' && string != null && string != undefined) {
            this.cpFormDynamicStringFormat = string.split(' ');
            for (let index = 0; index < this.cpFormDynamicStringFormat.length; index++) {
                var currentData = this.cpFormDynamicStringFormat[index];
                currentData = currentData.split('@');

                var stringInfo = this.cpFormDynamicStringFormat[index];

                if (currentData[1] != '' && currentData[1] != null && currentData[1] != undefined) {
                    stringInfo = '#text';
                }

                var number = index + 1;

                var mainData = {};
                mainData['string'] = stringInfo;
                mainData['dynamicInputNumber'] = this.dynamicInputNumber;
                mainData['hasValue'] = '';
                mainData['inputIdentifier'] = '';

                if (currentData[1] != '' && currentData[1] != null && currentData[1] != undefined) {
                    mainData['hasValue'] = currentData[1];
                    mainData['inputIdentifier'] = 'dynamicString' + number;
                }
                this.cpFormDynamicStringFormat[index] = mainData;
            }
        }
        console.log(this.cpFormDynamicStringFormat);
    }


    // Owner Charterer Checkgbxo Changed

    ownerMainTermCheckBoxChange(event) {
        this.is_owner_main_term_sign_off = (event.checked == true) ? '1' : '0';
        this.validateSubmitButton();
    }

    chartererMainTermCheckBoxChange(event) {
        this.is_charterer_main_term_sign_off = (event.checked == true) ? '1' : '0';
        this.validateSubmitButton();
    }

    ownerDetailTermCheckBoxChange(event) {
        this.is_owner_detail_term_sign_off = (event.checked == true) ? '1' : '0';
        this.validateSubmitButton();
    }

    chartererDetailTermCheckBoxChange(event) {
        this.is_charterer_detail_term_sign_off = (event.checked == true) ? '1' : '0';
        this.validateSubmitButton();
    }

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

    // On Vessel Change Start
    onChangeVessel(event) {
        this.tempVesselId = event.value;
        this.vesselModal = !this.vesselModal;
    }
    // On Vessel Change End

    // Fetch Vessel Data Start
    fetchVesselData() {
        var filterCondition = {};
        filterCondition["id"] = this.vesselId;
        try {
            this._userService.fetchVesselData(filterCondition).pipe(first()).subscribe((res) => {
                this.vesselDataResponse = res;
                if (this.vesselDataResponse.success == true) {
                    this.vesselName = '';
                    this.imoNumber = '';
                    this.vesselFlag = '';
                    this.vesselYear = '';
                    this.vesselDescription = '';
                    this.vesselDataResponseArray = this.vesselDataResponse.data[0];
                    if (this.vesselDataResponse.data[0] != '' && this.vesselDataResponse.data[0] != null && this.vesselDataResponse.data[0] != undefined) {
                        this.vesselName = this.vesselDataResponse.data[0].vessel_name;
                        this.imoNumber = this.vesselDataResponse.data[0].imo;
                        this.vesselFlag = this.vesselDataResponse.data[0].flageName;
                        this.vesselYear = this.vesselDataResponse.data[0].built_year;
                        this.vesselDescription = this.vesselDataResponse.data[0].vessel_info;
                    }
                }
            });
        } catch (err) { }
    }
    // Fetch Vessel Data End

    // Clause Category Records Server Side Start
    clauseCategoryRecordsServerSide() {
        var ConditionData = {};
        ConditionData['cpFormId'] = this.formId;
        ConditionData['checkedClauseCategory'] = this.checkedClauseCategory;
        try {
            this._userService.clauseCategoryRecordsServerSide(ConditionData).pipe(first()).subscribe((res) => {
                this.clauseCategoryRecordResponse = res;
                if (this.clauseCategoryRecordResponse.success == true) {
                    this.clauseCategoryRecordResponseData = this.clauseCategoryRecordResponse.data;
                    this.termsReviewRecords();
                }
            });
        } catch (err) { }
    }
    // Clause Category Records Server Side End

    // Show Owner Change Modal Start
    showOwnerChangeModal(): void {
        this.ownerModal = !this.ownerModal;
    }
    // Show Owner Change Modal End

    // Hide Owner Change Modal Start
    hideOwnerChangeModal(): void {
        this.ownerModal = !this.ownerModal;
        this.ownerDropDownForm = this._formBuilder.group(
            {
                ownerId: ['', Validators.required]
            });
    }
    // Hide Owner Change Modal End

    // Change Owner Start
    changeOwner() {
        this.ownerModal = !this.ownerModal;
        this.ownerId = this.tempOwnerId;
        for (let index = 0; index < this.ownerRecordsServerSideResponseData.length; index++) {
            if (this.ownerId == this.ownerRecordsServerSideResponseData[index].id) {
                this.ownerName = this.ownerRecordsServerSideResponseData[index].username;
                this.ownerEmail = this.ownerRecordsServerSideResponseData[index].email;
            }
        }
        var updateData = {};
        // if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
        updateData['brokerId'] = this.brokerId;
        // }

        // if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
        //     updateData['chartererId'] = this.chartererId;
        // }
        // if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
        updateData['ownerId'] = this.ownerId;
        // }

        updateData['tradingId'] = this.tradingId;
        updateData['ownerEmail'] = this.ownerEmail;
        updateData['ownerName'] = this.ownerName;
        updateData['notification'] = 'You are invited for trade';
        updateData['createdBy'] = JSON.parse(localStorage.getItem('userId'));
        updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        this.socket.emit('new-notification', { updateData });

        try {
            this._userService.chartererInviteOwnerForTrade(updateData).pipe(first()).subscribe((res) => {
                this.ownerDropdownView = false;
                this.ownerNameView = true;
                this.vesselRecordsServerSide();
                this.vesselDropdownView = true;
                this.alertService.success('Owner Updated Successfully', 'Success');
            }, err => { });
        } catch (err) { }

        var updateData = {};
        updateData['ownerId'] = this.ownerId;
        updateData['id'] = this.tradingId;
        updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        try {
            this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {
            }, err => { });
        } catch (err) { }
    }
    // Change Owner End


    // Show Vessel Change Modal Start
    showVesselChangeModal(): void {
        this.vesselModal = !this.vesselModal;
    }
    // Show Vessel Change Modal End

    // Hide Vessel Change Modal Start
    hideVesselChangeModal(): void {
        this.vesselModal = !this.vesselModal;
        this.vesselDropDownForm = this._formBuilder.group(
            {
                vesselId: ['', Validators.required]
            });
    }
    // Hide Vessel Change Modal End

    // Change Vessel Start
    changeVessel() {
        this.vesselModal = !this.vesselModal;
        this.vesselId = this.tempVesselId;
        for (let index = 0; index < this.vesselRecordsServerSideResponseData.length; index++) {
            if (this.vesselId == this.vesselRecordsServerSideResponseData[index].id) {
                this.vesselName = this.vesselRecordsServerSideResponseData[index].username;
            }
        }
        var updateData = {};
        updateData['ownerId'] = this.ownerId;
        updateData['vesselId'] = this.vesselId;
        updateData['id'] = this.tradingId;
        updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        try {
            this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {
                this.vesselDropdownView = false;
                this.vesselNameView = true;
                this.fetchVesselData();
                this.alertService.success('Vessel Updated Successfully', 'Success');
            }, err => { });
        } catch (err) { }
    }
    // Change Vessel End


    // Show Charterer Change Modal Start
    showChartererChangeModal(): void {
        this.chartererModal = !this.chartererModal;
    }
    // Show Charterer Change Modal End

    // Hide Charterer Change Modal Start
    hideChartererChangeModal(): void {
        this.chartererModal = !this.chartererModal;
        this.chartererDropDownForm = this._formBuilder.group(
            {
                chartererId: ['', Validators.required]
            });
    }
    // Hide Charterer Change Modal End

    // Change Charterer Start
    changeCharterer() {
        this.chartererModal = !this.chartererModal;
        this.chartererId = this.tempChartererId;
        for (let index = 0; index < this.chartererRecordsServerSideResponseData.length; index++) {
            if (this.chartererId == this.chartererRecordsServerSideResponseData[index].id) {
                this.chartererName = this.chartererRecordsServerSideResponseData[index].username;
                this.chartererEmail = this.chartererRecordsServerSideResponseData[index].email;
            }
        }
        var updateData = {};
        updateData['ownerId'] = JSON.parse(localStorage.getItem('userId'));
        updateData['chartererId'] = this.chartererId;
        updateData['brokerId'] = this.brokerId;
        updateData['tradingId'] = this.tradingId;
        updateData['chartererEmail'] = this.chartererEmail;
        updateData['chartererName'] = this.chartererName;
        updateData['notification'] = 'You are invited for trade';
        updateData['createdBy'] = JSON.parse(localStorage.getItem('userId'));
        updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));
        this.socket.emit('new-notification', { updateData });

        try {
            this._userService.chartererInviteOwnerForTrade(updateData).pipe(first()).subscribe((res) => {
                this.chartererDropdownView = false;
                this.chartererNameView = true;
                this.alertService.success('Charterer Updated Successfully', 'Success');
            }, err => { });
        } catch (err) { }
    }
    // Change Charterer End

    // OLD CODES START

    ChartereRecords(): void {
        var filter = {};
        filter['companyId'] = JSON.parse(localStorage.getItem('companyId'));
        filter['userRoleId'] = '4';
        try {
            this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) => {
                this.chartererDataResponse = res;
                if (this.chartererDataResponse.success === true) {
                    this.chartererDataResponseArray = this.chartererDataResponse.data;

                    var checkedCheckBoxArray = this.chartererDataResponseArray;
                    this.chartererDataResponseArray = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++) {
                        if (this.chartererId != checkedCheckBoxArray[index].id) {
                            this.chartererDataResponseArray.push(checkedCheckBoxArray[index]);
                        }
                    }

                }
            }, err => { });
        } catch (err) { }
    }

    updateCharterer(event) {
        this.chartererId = event.target.value;

        for (let index = 0; index < this.chartererDataResponseArray.length; index++) {
            if (this.chartererId == this.chartererDataResponseArray[index].id) {
                this.chartererEmailID = this.chartererDataResponseArray[index].email;
            }
        }

        if (this.isTrading == '2') {

            var updateData = {};
            updateData['drawId'] = this.drawId;
            updateData['chartererId'] = this.chartererId;
            try {
                this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

                }, err => { });
            } catch (err) { }

            var updateData = {};
            updateData['fromUserId'] = localStorage.getItem('userId');
            updateData['toUserId'] = this.chartererId;
            updateData['emailID'] = this.chartererEmailID;
            updateData['notification'] = 'Yout are invited for draw cp';
            updateData['createdBy'] = localStorage.getItem('userId');
            updateData['updatedBy'] = localStorage.getItem('userId');
            this.socket.emit('new-notification', { updateData });

            try {
                this._userService.sendNotificationToCharterer(updateData).pipe(first()).subscribe((res) => {
                    this.alertService.success('Invitation Has Been Sent To Charterer', 'Success');
                    this.ChartereRecords();
                    this.isChartererAccepted = 'P';

                }, err => { });
            } catch (err) { }

        } else {

            var updateData = {};
            updateData['tradingId'] = this.tradingId;
            updateData['chartererId'] = this.chartererId;
            try {
                this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

                }, err => { });
            } catch (err) { }

            var updateData = {};
            updateData['fromUserId'] = localStorage.getItem('userId');
            updateData['toUserId'] = this.chartererId;
            updateData['emailID'] = this.chartererEmailID;
            updateData['notification'] = 'Yout are invited for draw cp';
            updateData['createdBy'] = localStorage.getItem('userId');
            updateData['updatedBy'] = localStorage.getItem('userId');
            this.socket.emit('new-notification', { updateData });

            try {
                this._userService.sendNotificationToCharterer(updateData).pipe(first()).subscribe((res) => {
                    this.alertService.success('Invitation Has Been Sent To Charterer', 'Success');
                    this.ChartereRecords();
                    this.isChartererAccepted = 'P';

                }, err => { });
            } catch (err) { }

        }
    }


    timePickerTimeTest(event) {


        var slides = document.getElementsByClassName('testimepicker');

        var updatedStringValuesArray = [];
        if (slides.length > 0) {
            for (var i = 0; i < slides.length; i++) {
                var valueOfUpdatedSting = slides[i];


                updatedStringValuesArray.push(valueOfUpdatedSting['value']);
            }
        }

    }

    dateMonthYearFormatFunction(date) {
        var dateInfo = moment(date).format("Do");


        var monthInfo = moment(date).format("MMM");


        var yearInfo = moment(date).format("YYYY");


        var string = 'this ' + dateInfo + ' of ' + monthInfo + ',' + yearInfo;


        return string;
    }

    // Custom Input Draw Data Update
    customInputDrawDataUpdate() {
        var updateData = {};
        updateData['id'] = this.drawId;
        updateData['metricTonValue'] = this.metricTonValue;
        updateData['preamble_description'] = this.preamble_description;
        updateData['heading_msg'] = this.heading_msg;
        updateData['customInput1'] = this.customInput1;
        updateData['customInput2'] = this.customInput2;
        updateData['cpTime'] = this.cpTime;
        updateData['cpCity'] = this.cpCity;
        updateData['cpDate'] = this.cpDate;
        updateData['cp_form_description'] = this.cp_form_description;
        try {
            this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

            }, err => { });
        } catch (err) { }
    }

    // Custom Input Trading Data Update
    customInputTradingDataUpdate() {
        const req =
        {
            tradingId: this.tradingId,
            metricTonValue: this.metricTonValue,
            preamble_description: this.preamble_description,
            customInput1: this.customInput1,
            customInput2: this.customInput2
        };

        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/customInputTradingDataUpdate`, req, headerOptions).subscribe(res => {

        });


    }

    // Validate Submit Button Start
    validateSubmitButton() {
        this.tradingPlatformLogs = [];
        this.isValidSubmit = false;
        if (this.isTrading == '1') {
            var clauseCategoryChecked = 0;
            var clauseMainTermChecked = 0;
            var cluseMainTermCustomChecked = 0;
            var customTermsChecked = 0;
            var haveUpdatedSomeTerms = (this.haveUpdatedSomeTerms != '' && this.haveUpdatedSomeTerms != null && this.haveUpdatedSomeTerms != undefined) ? 1 : 0;
            var haveAddedNewCustomCluase = (this.haveAddedNewCustomCluase != '' && this.haveAddedNewCustomCluase != null && this.haveAddedNewCustomCluase != undefined) ? 1 : 0;
            var haveAddedNewCustomClauseTerms = (this.haveAddedNewCustomClauseTerms != '' && this.haveAddedNewCustomClauseTerms != null && this.haveAddedNewCustomClauseTerms != undefined) ? 1 : 0;
            var haveUpdatedTermsDetails = (this.haveUpdatedTermsDetails != '' && this.haveUpdatedTermsDetails != null && this.haveUpdatedTermsDetails != undefined) ? 1 : 0;

            // Check Clause Category Checked OR Not Start
            var checkedClausesArray = this.tradingRecordsServerSideResponseData['checked_clauses'];
            var oldCheckedClauseCategory = [];
            if (checkedClausesArray != '' && checkedClausesArray != null && checkedClausesArray != undefined) {
                oldCheckedClauseCategory = checkedClausesArray.split(',');
            }
            if (oldCheckedClauseCategory.length != this.checkedClauseCategory.length) {
                clauseCategoryChecked = 1;
                var log = this.loggedInUserName + " has checked new clause category";
                this.tradingPlatformLogs.push(log);
            }
            // Check Clause Category Checked OR Not End

            // Check Clause Terms Checked OR Not Start
            var commonClauses = this.tradingRecordsServerSideResponseData['common_clauses'];
            var oldCheckedMainTerms = [];
            if (commonClauses != '' && commonClauses != null) {
                oldCheckedMainTerms = commonClauses.split(',');
            }
            if (oldCheckedMainTerms.length != this.checkedCheckBox.length) {
                clauseMainTermChecked = 1;
                var log = this.loggedInUserName + " has checked new clause category main terms";
                this.tradingPlatformLogs.push(log);
            }
            // Check Clause Terms Checked OR Not End



            // Check Clause Terms Custom Checked OR Not Start
            var customMainTerms = this.tradingRecordsServerSideResponseData['custom_term_clause'];
            var oldCustomMainTerms = [];
            if (customMainTerms != '' && customMainTerms != null) {
                oldCustomMainTerms = customMainTerms.split(',');
            }
            if (oldCustomMainTerms.length != this.checkedCheckBox.length) {
                cluseMainTermCustomChecked = 1;
                var log = this.loggedInUserName + " has checked new clause category main custom terms";
                this.tradingPlatformLogs.push(log);
            }
            // Check Clause Terms Custom Checked OR Not End

            // Check Custom Terms Checked OR Not Start
            var customTerms = this.tradingRecordsServerSideResponseData['custom_common_clause'];
            var oldCustomTerms = [];
            if (customTerms != '' && customTerms != null) {
                oldCustomTerms = customTerms.split(',');
            }
            if (oldCustomTerms.length != this.checkedCheckBoxCustomClauseTerms.length) {
                customTermsChecked = 1;
                var log = this.loggedInUserName + " has checked new custom terms";
                this.tradingPlatformLogs.push(log);
            }
            // Check Custom Terms Checked OR Not End

            // Put Log For Updated Some Terms Start
            if (haveUpdatedSomeTerms > 0) {
                var log = this.loggedInUserName + " has updated some terms";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Updated Some Terms End

            // Put Log For Owner Main Term Sign Off Start
            if (this.is_owner_main_term_sign_off > 0) {
                var log = this.loggedInUserName + " has signed off main term";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Owner Main Term Sign Off End

            // Put Log For Charterer Main Term Sign Off Start
            if (this.is_charterer_main_term_sign_off > 0) {
                var log = this.loggedInUserName + " has signed off main term";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Charterer Main Term Sign Off End

            // Put Log For Owner Detail Term Sign Off Start
            if (this.is_owner_detail_term_sign_off > 0) {
                var log = this.loggedInUserName + " has signed off detail term";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Owner Detail Term Sign Off End

            // Put Log For Charterer Detail Term Sign Off Start
            if (this.is_charterer_detail_term_sign_off > 0) {
                var log = this.loggedInUserName + " has signed off detail term";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Charterer Detail Term Sign Off End

            // Put Log For Added New Custom Terms Start
            if (haveAddedNewCustomCluase > 0) {
                var log = this.loggedInUserName + " has added new custom clause";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Added New Custom Terms End

            // Put Log For Added New Custom Clause Terms Start
            if (haveAddedNewCustomClauseTerms > 0) {
                var log = this.loggedInUserName + " has added new custom clause terms";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Added New Custom Clause Terms End

            // Put Log For Updated Terms Details Start
            if (haveUpdatedTermsDetails > 0) {
                var log = this.loggedInUserName + " has updated terms";
                this.tradingPlatformLogs.push(log);
            }
            // Put Log For Updated Terms Details End

            var totalChanges = clauseCategoryChecked + clauseMainTermChecked + cluseMainTermCustomChecked + customTermsChecked +
                this.is_owner_main_term_sign_off + this.is_charterer_main_term_sign_off +
                this.is_owner_detail_term_sign_off + this.is_charterer_detail_term_sign_off +
                haveAddedNewCustomCluase + haveUpdatedSomeTerms + haveAddedNewCustomClauseTerms + haveUpdatedTermsDetails;

            if (totalChanges > 0) {
                this.isValidSubmit = true;
            }

        } else {
            this.isValidSubmit = true;
        }


    }
    // Validate Submit Button End

    // Fetch Draw Data
    fetchDrawData() {
        var filterCondition = {};
        filterCondition["dcm.id"] = this.drawId;
        try {
            this._userService.fetchDrawData(filterCondition).pipe(first()).subscribe((res) => {
                this.drawResponseInformation = res;
                if (this.drawResponseInformation.success == true) {
                    this.drawResponseInformationData = this.drawResponseInformation.data[0];

                    // Value Assign Start
                    this.ownerName = this.drawResponseInformationData['ownerName'];
                    this.chartererName = this.drawResponseInformationData['chartererName'];
                    this.brokerName = this.drawResponseInformationData['brokerName'];
                    this.ownerId = this.drawResponseInformationData['ownerId'];
                    this.chartererId = this.drawResponseInformationData['chartererId'];
                    this.brokerId = this.drawResponseInformationData['brokerId'];
                    this.vesselId = this.drawResponseInformationData['vesselId'];
                    this.cpTime = this.drawResponseInformationData['cpTime'];
                    this.cpDate = this.drawResponseInformationData['cpDate'];
                    this.cpCity = this.drawResponseInformationData['cpCity'];
                    this.cityName = this.drawResponseInformationData['cityName'];
                    this.formId = this.drawResponseInformationData['formId'];
                    this.isChartererAccepted = this.drawResponseInformationData['isChartererAccepted'];
                    this.heading_msg = this.drawResponseInformationData['heading_msg'];
                    this.preamble_description = this.drawResponseInformationData['preamble_description'];
                    this.customInput1 = this.drawResponseInformationData['customInput1'];
                    this.customInput2 = this.drawResponseInformationData['customInput2'];
                    this.currentSignature1 = this.drawResponseInformationData['signature1'];
                    this.currentSignature2 = this.drawResponseInformationData['signature2'];
                    this.is_complete_draw_cp = this.drawResponseInformationData['is_complete_draw_cp'];
                    this.metricTonValue = this.drawResponseInformationData['metricTonValue'];
                    this.cp_form_description = this.drawResponseInformationData['cp_form_description'];
                    this.dateMonthYearString = this.dateMonthYearFormatFunction(this.cpDate);
                    this.ownerDropdownView = false;
                    this.vesselDropdownView = false;
                  
                   
                    this.drawCPFormView = true;

                    this.cpDate = (this.cpDate != '' && this.cpDate != null && this.cpDate != undefined) ? this.cpDate : this.current_date;
                    this.cpTime = (this.cpTime != '' && this.cpTime != null && this.cpTime != undefined) ? this.cpTime : this.current_time;
                    this.cpCity = (this.cpCity != '' && this.cpCity != null && this.cpCity != undefined) ? this.cpCity : '';

                    this.cpDate = moment(this.cpDate).format("YYYY-MM-DD");

                    if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                        this.ownerNameView = true;
                    }

                    if (this.chartererId != '' && this.chartererId != null && this.chartererId != undefined) {
                        this.chartererNameView = true;
                    }
                    if (this.cpCity != '' && this.cpCity != null && this.cpCity != undefined) {
                    this.cityView = false;
                    // this.chartererNameView = true;
                    }
                    if (this.formId != '' && this.formId != null && this.formId != undefined) {
                    this.cpform = false;
                    // this.chartererNameView = true;
                    }
                    if (this.cpTime != '' && this.cpTime != null && this.cpTime != undefined) {
                        this.timeView = true;
                        this.timeZone = true;
                    }

                    setTimeout(() => {

                        this.cp_form_description = this.drawResponseInformationData['cp_form_description'];
                        console.log(this.cp_form_description);
                        if (this.cp_form_description == '' || this.cp_form_description == null || this.cp_form_description == undefined) {
                            console.log(this.cpFormRecordsServerSideResponseData);
                            this.cp_form_description = this.cpFormRecordsServerSideResponseData[0].description;
                            console.log(this.cp_form_description);
                            this.createDynamicStringCPFormDescription(this.cp_form_description);
                        } else {
                            this.createDynamicStringCPFormDescription(this.cp_form_description);
                        }
                    }, 1500);

                    // Value Assign End

                    this.drawCPPreambleForm = this._formBuilder.group
                        (
                            {
                                cpFormId: [Number(this.formId), Validators.required],
                                cityId: [Number(this.cpCity), Validators.required]
                            }
                        );

                    // Checked Clause Category Start
                    this.checkedClauseCategory = [];
                    var checked_clauses = this.drawResponseInformation.data[0].checked_clauses;
                    if (checked_clauses != '' && checked_clauses != null) {
                        this.checkedClauseCategory = checked_clauses.split(',');
                    } else {
                        this.checkedClauseCategory = [];
                    }
                    var checkedCheckBoxArray = this.checkedClauseCategory;
                    this.checkedClauseCategory = [];
                    for (let index = 0; index < checkedCheckBoxArray.length; index++) {
                        this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
                    }
                    localStorage.setItem('checkedClauseCategory', JSON.stringify(this.checkedClauseCategory));
                    // Checked Clause Category End

                    if (this.isChartererAccepted == 'N') {
                        this.ChartereRecords();
                    }

                    var signature1 = this.currentSignature1;
                    if (signature1 != '' && signature1 != null) {
                        this.signature1ImageView = true;
                    } else {
                        this.signature1DemoView = true;
                    }

                    var signature2 = this.currentSignature2;
                    if (signature2 != '' && signature2 != null) {
                        this.signature2ImageView = true;
                    } else {
                        this.signature2DemoView = true;
                    }

                    this.clauseCategoryRecordsServerSide();
                    this.fetchVesselData();
                }
            });
        } catch (err) { }
    }


    // First Screen View
    firstScreenView() {
        if (this.isTrading == '1') {
            this.fetchTradingData();
            this.stdBidForm = this._formBuilder.group
                (
                    {
                        cpTimeStdBid: [this.cpTime, Validators.required],
                        cpFormId: [this.formId, Validators.required],
                        cityIdStdBid: [this.cityId, Validators.required],
                        cpDateStdBid: [this.cpDate, Validators.required],
                        fixture_subject: [this.fixture_subject, ''],
                        lifted_by: [this.lifted_by, ''],
                        lifted_time: [this.lifted_time, ''],
                        lifted_date: [this.lifted_date, ''],
                        lifted_city: [this.lifted_city, ''],
                        lifted_charter_party_place: [this.lifted_charter_party_place, ''],
                        lifted_charter_fully_style: [this.lifted_charter_fully_style, ''],
                        lifted_charter_domicile: [this.lifted_charter_domicile, ''],
                        lifted_owner_fully_style: [this.lifted_owner_fully_style, ''],
                        lifted_owner_domicile: [this.lifted_owner_domicile, ''],
                        lifted_owner_type: [this.lifted_owner_type, ''],
                        lifted_vessel_name: [this.lifted_vessel_name, ''],
                        lifted_vessel_imo: [this.lifted_vessel_imo, ''],
                        lifted_vessel_flag: [this.lifted_vessel_flag, ''],
                        lifted_vessel_year_built: [this.lifted_vessel_year_built, ''],
                        lifted_vessel_dwat_metric_tons: [this.lifted_vessel_dwat_metric_tons, ''],
                        lifted_vessel_draft_on_marks: [this.lifted_vessel_draft_on_marks, ''],
                        lifted_vessel_loa: [this.lifted_vessel_loa, ''],
                        lifted_vessel_beam: [this.lifted_vessel_beam, ''],
                        lifted_vessel_holds: [this.lifted_vessel_holds, ''],
                        lifted_vessel_hatches: [this.lifted_vessel_hatches, ''],
                        lifted_vessel_gear: [this.lifted_vessel_gear, ''],
                        lifted_vessel_swl: [this.lifted_vessel_swl, ''],
                    }
                );

            if (this.is_owner_detail_term_sign_off == '1' && this.is_charterer_detail_term_sign_off == '1') {
                this.firstScreenStdBidBroker = true;
            } else {
                this.firstScreen = true;
            }

        } else {
            this.fetchDrawData();
            this.firstScreen = true;
        }
        this.secondScreen = false;
        this.thirdScreen = false;
    }

    // Second Screen View
    secondScreenView() {
        this.firstScreen = false;
        this.firstScreenStdBid = false;
        this.firstScreenStdBidBroker = false;
        this.secondScreen = true;
        this.thirdScreen = false;
        this.mergeCPFormDynamicString();

        setTimeout(() => {
            if (this.isTrading == '2') {
                this.customInputDrawDataUpdate();
                this.fetchDrawData();
            } else {
                this.stdBidSubmit();
            }
        }, 1000);
    }

    stdBidSubmit() {
        this.submitted = true;
        this.alertService.clear();
        var convertedDate = moment(this.fStdBidSubmit.cpDateStdBid.value).format("YYYY-MM-DD");

        this.cpTime = this.clauseFormFirstScreenValues.cpTime.value;

        this.fixture_subject = this.fStdBidSubmit.fixture_subject.value;
        this.lifted_by = this.fStdBidSubmit.lifted_by.value;


        this.lifted_time = this.fStdBidSubmit.lifted_time.value;
        this.lifted_date = this.fStdBidSubmit.lifted_date.value;
        this.lifted_city = this.fStdBidSubmit.lifted_city.value;
        this.lifted_charter_party_place = this.fStdBidSubmit.lifted_charter_party_place.value;
        this.lifted_charter_fully_style = this.fStdBidSubmit.lifted_charter_fully_style.value;
        this.lifted_charter_domicile = this.fStdBidSubmit.lifted_charter_domicile.value;
        this.lifted_owner_fully_style = this.fStdBidSubmit.lifted_owner_fully_style.value;
        this.lifted_owner_domicile = this.fStdBidSubmit.lifted_owner_domicile.value;
        this.lifted_owner_type = this.fStdBidSubmit.lifted_owner_type.value;
        this.lifted_vessel_name = this.fStdBidSubmit.lifted_vessel_name.value;
        this.lifted_vessel_imo = this.fStdBidSubmit.lifted_vessel_imo.value;
        this.lifted_vessel_flag = this.fStdBidSubmit.lifted_vessel_flag.value;
        this.lifted_vessel_year_built = this.fStdBidSubmit.lifted_vessel_year_built.value;
        this.lifted_vessel_dwat_metric_tons = this.fStdBidSubmit.lifted_vessel_dwat_metric_tons.value;
        this.lifted_vessel_draft_on_marks = this.fStdBidSubmit.lifted_vessel_draft_on_marks.value;
        this.lifted_vessel_loa = this.fStdBidSubmit.lifted_vessel_loa.value;
        this.lifted_vessel_beam = this.fStdBidSubmit.lifted_vessel_beam.value;
        this.lifted_vessel_holds = this.fStdBidSubmit.lifted_vessel_holds.value;
        this.lifted_vessel_hatches = this.fStdBidSubmit.lifted_vessel_hatches.value;
        this.lifted_vessel_gear = this.fStdBidSubmit.lifted_vessel_gear.value;
        this.lifted_vessel_swl = this.fStdBidSubmit.lifted_vessel_swl.value;

        const req =
        {
            tradingId: this.tradingId,

            cpTime: this.cpTime,
            cpDate: this.cpDate,
            cpCity: this.cityId,
            cp_form_description: this.cp_form_description,

            metricTonValue: this.metricTonValue,
            preamble_description: this.preamble_description,
            heading_msg: this.heading_msg,
            customInput1: this.customInput1,
            customInput2: this.customInput2,

            fixture_subject: this.fixture_subject,
            lifted_by: this.lifted_by,
            lifted_time: this.lifted_time,
            lifted_date: this.lifted_date,
            lifted_city: this.lifted_city,
            lifted_charter_party_place: this.lifted_charter_party_place,
            lifted_charter_fully_style: this.lifted_charter_fully_style,
            lifted_charter_domicile: this.lifted_charter_domicile,
            lifted_owner_fully_style: this.lifted_owner_fully_style,
            lifted_owner_domicile: this.lifted_owner_domicile,
            lifted_owner_type: this.lifted_owner_type,
            lifted_vessel_name: this.lifted_vessel_name,
            lifted_vessel_imo: this.lifted_vessel_imo,
            lifted_vessel_flag: this.lifted_vessel_flag,
            lifted_vessel_year_built: this.lifted_vessel_year_built,
            lifted_vessel_dwat_metric_tons: this.lifted_vessel_dwat_metric_tons,
            lifted_vessel_draft_on_marks: this.lifted_vessel_draft_on_marks,
            lifted_vessel_loa: this.lifted_vessel_loa,
            lifted_vessel_beam: this.lifted_vessel_beam,
            lifted_vessel_holds: this.lifted_vessel_holds,
            lifted_vessel_hatches: this.lifted_vessel_hatches,
            lifted_vessel_gear: this.lifted_vessel_gear,
            lifted_vessel_swl: this.lifted_vessel_swl,

            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),

            companyId: localStorage.getItem('companyId'),

        };


        this.loading = false;
        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/StandardBidFormDataUpdate`, req, headerOptions).subscribe(res => { }, err => { this.alertService.error(err, 'Error'); });
        } catch (err) { }
    }

    // Third Screen View
    thirdScreenView() {
        if (this.isTrading == '2') {
            var checkedClauseCategory = this.checkedClauseCategory.join();
            const req =
            {
                drawId: this.drawId,
                checked_clauses: checkedClauseCategory,
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/updateCheckedClauses`, req, headerOptions).subscribe(res => {
                this.firstScreen = false;
                this.firstScreenStdBid = false;
                this.firstScreenStdBidBroker = false;
                this.secondScreen = false;
                this.thirdScreen = true;
                this.termsReviewRecords();
            });
        } else {
            this.firstScreen = false;
            this.firstScreenStdBid = false;
            this.firstScreenStdBidBroker = false;
            this.secondScreen = false;
            this.thirdScreen = true;
            // 
            // this.thirdScreenView();
            // this.fetchDrawData();
            // this.fetchTradingData();

            var checkedClauseCategory = this.checkedClauseCategory.join();
            const req =
            {
                tradingId: this.tradingId,
                checked_clauses: checkedClauseCategory,
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/updateCheckedClausesTrading`, req, headerOptions).subscribe(res => {
                this.firstScreen = false;
                this.firstScreenStdBid = false;
                this.firstScreenStdBidBroker = false;
                this.secondScreen = false;
                this.thirdScreen = true;
                this.termsReviewRecords();
            });

        }

    }

    checkAllFunctionChecked() {
        var checkedCheckBoxArray = this.checkedCheckBox;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; subIndex++) {
                startLength = startLength + 1;
                if (checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTerms[subIndex].id) >= 0) {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].isallChecked = 'N';
            if (startLength == endLength) {
                this.termsReviewRecordsData[index].isallChecked = 'Y';
            }
        }

        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; subIndex++) {
                startLength = startLength + 1;
                if (checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[subIndex].id) >= 0) {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked = 'N';
            if (startLength == endLength) {
                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked = 'Y';
            }
        }

        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        for (let index = 0; index < this.customClauseDataResponseData.length; index++) {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; subIndex++) {
                startLength = startLength + 1;
                if (checkedCheckBoxArray.indexOf(this.customClauseDataResponseData[index].clauseCategoryTerms[subIndex].id) >= 0) {
                    endLength = endLength + 1;
                }
            }
            this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked = 'N';
            if (startLength == endLength) {
                this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked = 'Y';
            }
        }
    }



    // Check / Uncheck All Of Clause Terms Of Clause Category
    checkUncheckAllForClauseTerms(ev, clauseCategoryID) {
        var checkedCheckBoxArray = this.checkedCheckBox;
        ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.clauseTermsCheckBox = ev.checked;
        this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms.length; index++) {
            if (ev.checked == 'Y') {
                if (checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms[index].id) < 0) {
                    this.checkedCheckBox.push(Number(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms[index].id));
                }
            } else {
                var checkedCheckBoxArray = this.checkedCheckBox;
                this.checkedCheckBox = [];
                for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++) {
                    if (checkedCheckBoxArray[subIndex] != this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTerms[index].id) {
                        this.checkedCheckBox.push(Number(checkedCheckBoxArray[subIndex]));
                    }
                }
            }
        }
        this.validateSubmitButton();
    }

    // Check / Uncheck All Of Clause Terms Of Clause Category Second Screen
    checkUncheckAllForClauseTermsSecondScreen(ev) {
        var checkedCheckBoxArray = this.checkedClauseCategory;
        ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.clauseCategoryRecordResponseData.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++) {
            if (ev.checked == 'Y') {
                if (checkedCheckBoxArray.indexOf(this.clauseCategoryRecordResponseData[index].id) < 0) {
                    this.checkedClauseCategory.push(Number(this.clauseCategoryRecordResponseData[index].id));
                }
            }
        }

        if (ev.checked == 'Y') {
            this.validateSubmitButton();
        }

        if (ev.checked == 'N') {
            this.clauseCategoryCheckChanged = 0;
            if (this.isTrading == '2') {
                this.fetchDrawData();
            } else {
                this.fetchTradingData();
            }
        }
    }

    // Check / Uncheck Clause Category
    checkUncheckClauseCategory(ev, clauseCategoryID) {
        var checkedCheckBoxArray = this.checkedClauseCategory;
        this.checkedClauseCategory = [];
        for (let index = 0; index < checkedCheckBoxArray.length; index++) {
            if (this.checkedClauseCategory.indexOf(checkedCheckBoxArray[index]) < 0) {
                this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
            }
        }

        if (ev.checked == true) {
            this.checkedClauseCategory.push(Number(clauseCategoryID));
        } else {
            var checkedCheckBoxArray = this.checkedClauseCategory;
            this.checkedClauseCategory = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++) {
                if (checkedCheckBoxArray[index] != clauseCategoryID) {
                    this.checkedClauseCategory.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }

        this.thirdScreenButton = false;
        if (this.checkedClauseCategory.length > 0) {
            this.thirdScreenButton = true;
        }

        var checkedCheckBoxArray = this.checkedClauseCategory;
        var startLength = 0;
        var endLength = 0;
        for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++) {
            startLength = startLength + 1;
            if (checkedCheckBoxArray.indexOf(this.clauseCategoryRecordResponseData[index].id) >= 0) {
                endLength = endLength + 1;
            }
        }
        this.clauseCategoryRecordResponseDataAllChecked = 'N';
        if (startLength == endLength) {
            this.clauseCategoryRecordResponseDataAllChecked = 'Y';
        }

        this.validateSubmitButton();
    }

    // Check / Uncheck Single Of Clause Terms Of Clause Category
    onChange(event, clauseTermsID) {
        if (event.checked == true) {
            this.checkedCheckBox.push(clauseTermsID);
        } else {
            var checkedCheckBoxArray = this.checkedCheckBox;
            this.checkedCheckBox = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++) {
                if (checkedCheckBoxArray[index] != clauseTermsID) {
                    this.checkedCheckBox.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }
        var checkedCheckBoxArray = this.checkedCheckBox;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; subIndex++) {
                startLength = startLength + 1;
                if (checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTerms[subIndex].id) >= 0) {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].isallChecked = 'N';
            if (startLength == endLength) {
                this.termsReviewRecordsData[index].isallChecked = 'Y';
            }
        }
        this.validateSubmitButton();
    }

    // Check / Uncheck All Of Custom Clause Terms Of Clause Category
    checkUncheckAllForCustomClauseTermsOfClauseCategory(ev, clauseCategoryID) {
        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
        ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.clauseTermsCheckBox = ev.checked;
        this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom.length; index++) {
            if (ev.checked == 'Y') {
                if (checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom[index].id) < 0) {
                    this.checkedCheckBoxCustom.push(Number(this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom[index].id));
                }
            } else {
                var checkedCheckBoxArray = this.checkedCheckBoxCustom;
                this.checkedCheckBoxCustom = [];
                for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++) {
                    if (checkedCheckBoxArray[subIndex] != this.termsReviewRecordsData[clauseCategoryID].clauseCategoryTermsUpdateCustom[index].id) {
                        this.checkedCheckBoxCustom.push(Number(checkedCheckBoxArray[subIndex]));
                    }
                }
            }
        }
        this.validateSubmitButton();
    }

    // Check / Uncheck Single Of Custom Clause Terms Of Clause Category
    onChangeCustom(event, clauseTermsID) {
        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
        if (event.checked == true) {
            this.checkedCheckBoxCustom.push(clauseTermsID);
        } else {
            this.checkedCheckBoxCustom = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++) {
                if (checkedCheckBoxArray[index] != clauseTermsID) {
                    this.checkedCheckBoxCustom.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }

        var checkedCheckBoxArray = this.checkedCheckBoxCustom;
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; subIndex++) {
                startLength = startLength + 1;
                if (checkedCheckBoxArray.indexOf(this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[subIndex].id) >= 0) {
                    endLength = endLength + 1;
                }
            }
            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked = 'N';
            if (startLength == endLength) {
                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.isAllCustomTermsChecked = 'Y';
            }
        }
        this.validateSubmitButton();
    }

    // Check / Uncheck All Of Custom Clause Terms Of Custom Clause Category
    checkUncheckAllForCustomClauseTermsOfCustomClause(ev, clauseCategoryID) {
        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        ev.checked = (ev.checked == true) ? 'Y' : 'N';
        this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms.forEach(item => item.isChecked = ev.checked);
        for (let index = 0; index < this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms.length; index++) {
            if (ev.checked == 'Y') {
                if (checkedCheckBoxArray.indexOf(this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms[index].id) < 0) {
                    this.checkedCheckBoxCustomClauseTerms.push(Number(this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms[index].id));
                }
            } else {
                var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
                this.checkedCheckBoxCustomClauseTerms = [];
                for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++) {
                    if (checkedCheckBoxArray[subIndex] != this.customClauseDataResponseData[clauseCategoryID].clauseCategoryTerms[index].id) {
                        this.checkedCheckBoxCustomClauseTerms.push(Number(checkedCheckBoxArray[subIndex]));
                    }
                }
            }
        }
        this.validateSubmitButton();
    }

    // Check / Uncheck Single Of Custom Clause Terms Of Custom Clause Category
    onChangeCustomClauseTerms(event, clauseTermsID, clauseCategoryID) {
        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        if (event.checked == true) {
            this.checkedCheckBoxCustomClauseTerms.push(clauseTermsID);
        } else {
            this.checkedCheckBoxCustomClauseTerms = [];
            for (let index = 0; index < checkedCheckBoxArray.length; index++) {
                if (checkedCheckBoxArray[index] != clauseTermsID) {
                    this.checkedCheckBoxCustomClauseTerms.push(Number(checkedCheckBoxArray[index]));
                }
            }
        }

        var checkedCheckBoxArray = this.checkedCheckBoxCustomClauseTerms;
        for (let index = 0; index < this.customClauseDataResponseData.length; index++) {
            var startLength = 0;
            var endLength = 0;
            for (let subIndex = 0; subIndex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; subIndex++) {
                startLength = startLength + 1;
                if (checkedCheckBoxArray.indexOf(this.customClauseDataResponseData[index].clauseCategoryTerms[subIndex].id) >= 0) {
                    endLength = endLength + 1;
                }
            }
            this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked = 'N';
            if (startLength == endLength) {
                this.customClauseDataResponseData[index].isAllCustomTermsOfCustomClauseChecked = 'Y';
            }
        }
        this.validateSubmitButton();
    }


    convertNumber(num) {
        var s = num + "";
        while (s.length < 6) s = "0" + s;
        return s;
    }

    // Convert Number To Word
    NumInWords(number): void {
        const first = ['', 'First ', 'Second ', 'Third ', 'Fourth ', 'Fifth ', 'Sixth ', 'Seventh ', 'Eight ', 'Nineth ', 'Tenth ', 'Eleventh ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
        let word = '';

        for (let i = 0; i < mad.length; i++) {
            let tempNumber = number % (100 * Math.pow(1000, i));
            if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
                if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                    word = first[Math.floor(tempNumber / Math.pow(1000, i))] + mad[i] + ' ' + word;
                } else {
                    word = tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] + '-' + first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] + mad[i] + ' ' + word;
                }
            }

            tempNumber = number % (Math.pow(1000, i + 1));
            if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0) word = first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + 'hunderd ' + word;

            this.convertedWord = word;
        }
        return this.convertedWord;
    }

    dynamicDatePickerChange() {
        this.dynamicStringUpdateArray = [];
        var slides = document.getElementsByClassName("dynamicInputValueForAll");
        for (var i = 0; i < slides.length; i++) {
            var valueInfo = slides[i];
            this.dynamicStringUpdateArray.push(valueInfo['value']);
        }

    }

    // Main Data Record Fetch Start
    termsReviewRecords(): void {

        this.loading = true;
        this.commonClausesArray = [];
        localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));

        this.commonClausesCustomArray = [];
        localStorage.setItem('commonClausesCustomArray', JSON.stringify(this.commonClausesCustomArray));

        this.commonClausesCustomClauseTermArray = [];
        localStorage.setItem('commonClausesCustomClauseTermArray', JSON.stringify(this.commonClausesCustomClauseTermArray));

        if (this.isTrading == '2') {
            var drawCondition = {};
            drawCondition["dcm.id"] = this.drawId;

            try {
                this._userService.drawRecordsServerSide(drawCondition).pipe(first()).subscribe((res) => {
                    this.drawResponse = res;
                    if (this.drawResponse.success === true) {

                        var commonClauses = this.drawResponse.data[0].common_clauses;

                        if (commonClauses != '' && commonClauses != null) {
                            this.commonClausesArray = commonClauses.split(',');
                        } else {
                            this.commonClausesArray = [];
                        }

                        localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));
                        var commonClausesArray = JSON.parse(localStorage.getItem('commonClausesArray'));

                        var custom_term_clause = this.drawResponse.data[0].custom_term_clause;

                        if (custom_term_clause != '' && custom_term_clause != null) {
                            this.commonClausesCustomArray = custom_term_clause.split(',');
                        } else {
                            this.commonClausesCustomArray = [];
                        }

                        localStorage.setItem('commonClausesCustomArray', JSON.stringify(this.commonClausesCustomArray));
                        var commonClausesCustomArray = JSON.parse(localStorage.getItem('commonClausesCustomArray'));

                        var custom_common_clause = this.drawResponse.data[0].custom_common_clause;

                        if (custom_common_clause != '' && custom_common_clause != null) {
                            this.commonClausesCustomClauseTermArray = custom_common_clause.split(',');
                        } else {
                            this.commonClausesCustomClauseTermArray = [];
                        }

                        localStorage.setItem('commonClausesCustomClauseTermArray', JSON.stringify(this.commonClausesCustomClauseTermArray));
                        var commonClausesCustomClauseTermArray = JSON.parse(localStorage.getItem('commonClausesCustomClauseTermArray'));

                        this.checkedClauseCategory = [];

                        var checked_clauses = this.drawResponse.data[0].checked_clauses;

                        if (checked_clauses != '' && checked_clauses != null) {
                            this.checkedClauseCategory = checked_clauses.split(',');
                        } else {
                            this.checkedClauseCategory = [];
                        }

                        localStorage.setItem('checkedClauseCategory', JSON.stringify(this.checkedClauseCategory));

                        var checkedCheckBoxArray = this.commonClausesArray;
                        this.checkedCheckBox = [];
                        for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++) {
                            this.checkedCheckBox.push(Number(checkedCheckBoxArray[subIndex]));
                        }

                        var customArray1 = this.commonClausesCustomArray;
                        this.checkedCheckBoxCustom = [];
                        for (let subIndex = 0; subIndex < customArray1.length; subIndex++) {
                            this.checkedCheckBoxCustom.push(Number(customArray1[subIndex]));
                        }

                        var customArray2 = this.commonClausesCustomClauseTermArray;
                        this.checkedCheckBoxCustomClauseTerms = [];
                        for (let subIndex = 0; subIndex < customArray2.length; subIndex++) {
                            this.checkedCheckBoxCustomClauseTerms.push(Number(customArray2[subIndex]));
                        }

                        var customArray3 = this.checkedClauseCategory;
                        this.checkedClauseCategory = [];
                        for (let subIndex = 0; subIndex < customArray3.length; subIndex++) {
                            this.checkedClauseCategory.push(Number(customArray3[subIndex]));
                        }

                        var customArray4 = this.checkedClauseCategory;
                        var startLength = 0;
                        var endLength = 0;
                        for (let index = 0; index < this.clauseCategoryRecordResponseData.length; index++) {
                            startLength = startLength + 1;
                            if (customArray4.indexOf(this.clauseCategoryRecordResponseData[index].id) >= 0) {
                                endLength = endLength + 1;
                            }
                        }

                        this.clauseCategoryRecordResponseDataAllChecked = 'N';
                        if (startLength == endLength) {
                            this.clauseCategoryRecordResponseDataAllChecked = 'Y';
                        }

                        this.termsReviewRecordsData = [];

                        var clauseCategoryFilterCondition = {};
                        clauseCategoryFilterCondition["cpFormId"] = this.formId;
                        clauseCategoryFilterCondition["drawId"] = this.drawId;
                        clauseCategoryFilterCondition["companyId"] = this.companyId;
                        clauseCategoryFilterCondition["commonClauses"] = commonClausesArray;
                        clauseCategoryFilterCondition["commonClausesCustomArray"] = commonClausesCustomArray;
                        clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategory;

                        this.termsReviewRecordsData = [];
                        try {
                            this._userService.mainClauseScreenDataRecords(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                                this.termsReviewRecordsResponse = res;
                                if (this.termsReviewRecordsResponse.success === true) {
                                    this.mainDynamicStringArray = [];

                                    this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;

                                    var totalCount = 0;


                                    for (let index = 0; index < this.termsReviewRecordsData.length; index++) {

                                        totalCount = totalCount + 1;
                                        for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
                                            var number = sindex + 1;
                                            var timeStamp = 'dynamicInputValueForAll' + Date.now() + number;

                                            var crossTerm = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['crossTerm'];
                                            var mainString = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecord'];

                                            if (mainString != '' && mainString != null && mainString != undefined) {
                                                mainString = mainString.replace(/<[^>]*>/g, '');

                                                var diffWord = {};
                                                diffWord['differentWordsArray'] = [];
                                                diffWord['differenceInPercentage'] = 0;
                                                if (crossTerm != '' && crossTerm != null && crossTerm != undefined) {
                                                    diffWord = this.getDifferentWordFromString(mainString, crossTerm);
                                                }
                                                this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] =
                                                    this.createStringWithDynamicDateTimeNumberPicker(mainString, timeStamp, diffWord);

                                            } else {
                                                this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] = '';
                                            }

                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainString'] = mainString;
                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['timeStamp'] = timeStamp;

                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                                        }

                                        for (let sindexCustom = 0; sindexCustom < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindexCustom++) {
                                            var number = sindexCustom + 1;
                                            var timeStamp = 'dynamicInputValueForAll' + Date.now() + number;
                                            var crossTerm = this.termsReviewRecordsData[index].clauseCategoryTerms[sindexCustom]['crossTerm'];
                                            var mainString = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustom'];

                                            if (mainString != '' && mainString != null && mainString != undefined) {
                                                mainString = mainString.replace(/<[^>]*>/g, '');
                                                var diffWord = {};
                                                diffWord['differentWordsArray'] = [];
                                                diffWord['differenceInPercentage'] = 0;
                                                if (crossTerm != '' && crossTerm != null && crossTerm != undefined) {
                                                    diffWord = this.getDifferentWordFromString(mainString, crossTerm);
                                                }
                                                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] =
                                                    this.createStringWithDynamicDateTimeNumberPicker(mainString, timeStamp, diffWord);
                                            } else {
                                                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] = '';
                                            }

                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainString'] = mainString;
                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['timeStamp'] = timeStamp;

                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['identifier'] = String.fromCharCode(97 + sindexCustom);
                                        }
                                    }



                                    this.totalTermsReviewRecords = totalCount;
                                    this.customClauseDataRecords();
                                    this.loading = false;

                                }
                            },
                                err => {
                                    this.alertService.error(err, 'Error');
                                });
                        } catch (err) { }
                    }
                });
            } catch (err) { }

        } else {
            this.loading = true;

            var drawCondition = {};
            drawCondition["id"] = this.tradingId;
            try {
                this._userService.TradingData(drawCondition).pipe(first()).subscribe((res) => {
                    this.tradingResponse = res;
                    if (this.tradingResponse.success === true) {
                        var cpDate = this.tradingResponse.data[0].cpDate;
                        var cpTime = this.tradingResponse.data[0].cpTime;
                        var cpCity = this.tradingResponse.data[0].cpCity;

                        var current_date = (cpDate != '' && cpDate != null) ? cpDate : moment(new Date()).format("YYYY-MM-DD");
                        var current_time = (cpTime != '' && cpTime != null) ? cpTime : moment(new Date()).format("HH:mm A");
                        var cityID = (cpCity != '' && cpCity != null) ? cpCity : '0';

                        this.clauseForm = this._formBuilder.group
                            (
                                {
                                    cpFormId: [this.formId, Validators.required],
                                    cpTime: [current_time, Validators.required],
                                    cityId: [cityID, Validators.required],
                                    cpDate: [current_date, Validators.required],
                                }
                            );


                        var commonClauses = this.tradingResponse.data[0].common_clauses;
                        if (commonClauses != '' && commonClauses != null) {
                            this.commonClausesArray = commonClauses.split(',');
                        } else {
                            this.commonClausesArray = [];
                        }

                        localStorage.setItem('commonClausesArray', JSON.stringify(this.commonClausesArray));
                        var commonClausesArray = JSON.parse(localStorage.getItem('commonClausesArray'));

                        var custom_term_clause = this.tradingResponse.data[0].custom_term_clause;

                        if (custom_term_clause != '' && custom_term_clause != null) {
                            this.commonClausesCustomArray = custom_term_clause.split(',');
                        } else {
                            this.commonClausesCustomArray = [];
                        }

                        localStorage.setItem('commonClausesCustomArray', JSON.stringify(this.commonClausesCustomArray));
                        var commonClausesCustomArray = JSON.parse(localStorage.getItem('commonClausesCustomArray'));

                        var custom_common_clause = this.tradingResponse.data[0].custom_common_clause;

                        if (custom_common_clause != '' && custom_common_clause != null) {
                            this.commonClausesCustomClauseTermArray = custom_common_clause.split(',');
                        } else {
                            this.commonClausesCustomClauseTermArray = [];
                        }

                        localStorage.setItem('commonClausesCustomClauseTermArray', JSON.stringify(this.commonClausesCustomClauseTermArray));
                        var commonClausesCustomClauseTermArray = JSON.parse(localStorage.getItem('commonClausesCustomClauseTermArray'));

                        var checkedCheckBoxArray = this.commonClausesArray;
                        this.checkedCheckBox = [];
                        for (let subIndex = 0; subIndex < checkedCheckBoxArray.length; subIndex++) {
                            this.checkedCheckBox.push(Number(checkedCheckBoxArray[subIndex]));
                        }

                        var commonClauseCustomArray = this.commonClausesCustomArray;
                        this.checkedCheckBoxCustom = [];
                        for (let subIndex = 0; subIndex < commonClauseCustomArray.length; subIndex++) {
                            this.checkedCheckBoxCustom.push(Number(commonClauseCustomArray[subIndex]));
                        }

                        var checkboxCustomArrayTerm = this.commonClausesCustomClauseTermArray;
                        this.checkedCheckBoxCustomClauseTerms = [];
                        for (let subIndex = 0; subIndex < checkboxCustomArrayTerm.length; subIndex++) {
                            this.checkedCheckBoxCustomClauseTerms.push(Number(checkboxCustomArrayTerm[subIndex]));
                        }

                        clauseCustomChecked = [];
                        clauseCustomTermsChecked = [];

                        var clauseChecked = this.tradingResponse.data[0].common_clauses;
                        if (clauseChecked != '' && clauseChecked != null) {
                            this.clauseChecked = clauseChecked.split(',');
                        } else {
                            this.clauseChecked = [];
                        }

                        var clauseCustomChecked = this.tradingResponse.data[0].custom_term_clause;
                        if (clauseCustomChecked != '' && clauseCustomChecked != null) {
                            this.clauseCustomChecked = clauseCustomChecked.split(',');
                        } else {
                            this.clauseCustomChecked = [];
                        }

                        var clauseCustomTermsChecked = this.tradingResponse.data[0].custom_common_clause;
                        if (clauseCustomTermsChecked != '' && clauseCustomTermsChecked != null) {
                            this.clauseCustomTermsChecked = clauseCustomTermsChecked.split(',');
                        } else {
                            this.clauseCustomTermsChecked = [];
                        }

                        // Assing Charterer Checked Clauses Start

                        var chartererCheckedClauses = this.tradingResponse.data[0].charterer_clauses;
                        if (chartererCheckedClauses != '' && chartererCheckedClauses != null) {
                            this.chartererCheckedClauses = chartererCheckedClauses.split(',');
                        } else {
                            this.chartererCheckedClauses = [];
                        }

                        var chartererCheckedCustomClauses = this.tradingResponse.data[0].charterer_custom_clauses;
                        if (chartererCheckedCustomClauses != '' && chartererCheckedCustomClauses != null) {
                            this.chartererCheckedCustomClauses = chartererCheckedCustomClauses.split(',');
                        } else {
                            this.chartererCheckedCustomClauses = [];
                        }

                        var chartererCheckedCustomTermsClauses = this.tradingResponse.data[0].charterer_custom_terms_clauses;
                        if (chartererCheckedCustomTermsClauses != '' && chartererCheckedCustomTermsClauses != null) {
                            this.chartererCheckedCustomTermsClauses = chartererCheckedCustomTermsClauses.split(',');
                        } else {
                            this.chartererCheckedCustomTermsClauses = [];
                        }

                        // Assing Charterer Checked Clauses End

                        // Assing Owner Checked Clauses Start

                        var ownerCheckedClauses = this.tradingResponse.data[0].owner_clauses;
                        if (ownerCheckedClauses != '' && ownerCheckedClauses != null) {
                            this.ownerCheckedClauses = ownerCheckedClauses.split(',');
                        } else {
                            this.ownerCheckedClauses = [];
                        }

                        var ownerCheckedCustomClauses = this.tradingResponse.data[0].owner_custom_clauses;
                        if (ownerCheckedCustomClauses != '' && ownerCheckedCustomClauses != null) {
                            this.ownerCheckedCustomClauses = ownerCheckedCustomClauses.split(',');
                        } else {
                            this.ownerCheckedCustomClauses = [];
                        }

                        var ownerCheckedCustomTermsClauses = this.tradingResponse.data[0].owner_custom_terms_clauses;
                        if (ownerCheckedCustomTermsClauses != '' && ownerCheckedCustomTermsClauses != null) {
                            this.ownerCheckedCustomTermsClauses = ownerCheckedCustomTermsClauses.split(',');
                        } else {
                            this.ownerCheckedCustomTermsClauses = [];
                        }

                        // Assing Owner Checked Clauses End

                        var mainTermCheckedClauses = this.tradingResponse.data[0].main_term_clauses;
                        if (mainTermCheckedClauses != '' && mainTermCheckedClauses != null) {
                            this.mainTermCheckedClauses = mainTermCheckedClauses.split(',');
                        } else {
                            this.mainTermCheckedClauses = [];
                        }

                        var mainTermCheckedClausesCustom = this.tradingResponse.data[0].main_term_checked_clauses_custom;
                        if (mainTermCheckedClausesCustom != '' && mainTermCheckedClausesCustom != null) {
                            this.mainTermCheckedClausesCustom = mainTermCheckedClausesCustom.split(',');
                        } else {
                            this.mainTermCheckedClausesCustom = [];
                        }

                        var mainTermCheckedClausesCustomTerms = this.tradingResponse.data[0].main_term_checked_clauses_custom_term;
                        if (mainTermCheckedClausesCustomTerms != '' && mainTermCheckedClausesCustomTerms != null) {
                            this.mainTermCheckedClausesCustomTerms = mainTermCheckedClausesCustomTerms.split(',');
                        } else {
                            this.mainTermCheckedClausesCustomTerms = [];
                        }

                        // Broker Approval Clauses Start

                        var commonClausesBroker = this.tradingResponse.data[0].common_clauses_broker;
                        var commonClausesBrokerArray = [];
                        if (commonClausesBroker != '' && commonClausesBroker != null) {
                            commonClausesBrokerArray = commonClausesBroker.split(',');
                        }

                        var checkedCheckBoxBrokerArray = commonClausesBrokerArray;
                        var commonClausesBrokerArray = [];
                        for (let subIndex = 0; subIndex < checkedCheckBoxBrokerArray.length; subIndex++) {
                            commonClausesBrokerArray.push(Number(checkedCheckBoxBrokerArray[subIndex]));
                        }

                        var commonClausesCustomBroker = this.tradingResponse.data[0].custom_term_clause_broker;
                        var commonClausesCustomBrokerArray = [];
                        if (commonClausesCustomBroker != '' && commonClausesCustomBroker != null) {
                            commonClausesCustomBrokerArray = commonClausesCustomBroker.split(',');
                        }

                        var checkedCheckBoxBrokerArray = commonClausesCustomBrokerArray;
                        var commonClausesCustomBrokerArray = [];
                        for (let subIndex = 0; subIndex < checkedCheckBoxBrokerArray.length; subIndex++) {
                            commonClausesCustomBrokerArray.push(Number(checkedCheckBoxBrokerArray[subIndex]));
                        }

                        var customClausesBroker = this.tradingResponse.data[0].custom_term_clause_broker;
                        var customClausesBrokerArray = [];
                        if (customClausesBroker != '' && customClausesBroker != null) {
                            customClausesBrokerArray = customClausesBroker.split(',');
                        }

                        
                        var checkedCheckBoxBrokerArray = customClausesBrokerArray;
                        var customClausesBrokerArray = [];
                        for (let subIndex = 0; subIndex < checkedCheckBoxBrokerArray.length; subIndex++) {
                            customClausesBrokerArray.push(Number(checkedCheckBoxBrokerArray[subIndex]));
                        }


                        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
                            commonClausesBrokerArray = [];
                            commonClausesCustomBrokerArray = [];
                            customClausesBrokerArray = [];
                        }

                        this.customClauseBrokerArray = customClausesBrokerArray;

                        // Broker Approval Clauses End


                        this.termsReviewRecordsData = [];

                        var clauseCategoryFilterCondition = {};
                        clauseCategoryFilterCondition["cpFormId"] = this.formId;
                        clauseCategoryFilterCondition["tradingId"] = this.tradingId;
                        clauseCategoryFilterCondition["companyId"] = this.companyId;
                        clauseCategoryFilterCondition["commonClauses"] = commonClausesArray;
                        clauseCategoryFilterCondition["commonClausesCustomArray"] = commonClausesCustomArray;
                        clauseCategoryFilterCondition["checked_clauses"] = this.checkedClauseCategory;
                        clauseCategoryFilterCondition["mainTermCheckedClauses"] = this.mainTermCheckedClauses;
                        clauseCategoryFilterCondition["mainTermCheckedClausesCustom"] = this.mainTermCheckedClausesCustom;
                        clauseCategoryFilterCondition["mainTermCheckedClausesCustomTerms"] = this.mainTermCheckedClausesCustomTerms;


                        clauseCategoryFilterCondition["commonClausesBrokerArray"] = commonClausesBrokerArray;
                        clauseCategoryFilterCondition["commonClausesCustomBrokerArray"] = commonClausesCustomBrokerArray;
                        clauseCategoryFilterCondition["customClausesBrokerArray"] = customClausesBrokerArray;


                        try {
                            this._userService.mainClauseScreenDataRecordsTrading(clauseCategoryFilterCondition).pipe(first()).subscribe((res) => {
                                this.termsReviewRecordsResponse = res;
                                if (this.termsReviewRecordsResponse.success === true) {
                                    this.termsReviewRecordsData = this.termsReviewRecordsResponse.data;
                                    var totalCount = 0;
                                    for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
                                        totalCount = totalCount + 1;
                                        for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
                                            var number = sindex + 1;
                                            var timeStamp = 'dynamicInputValueForAll' + Date.now() + number;
                                            var crossTerm = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['crossTerm'];
                                            var mainString = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecord'];


                                             // var mainString = mainString.split('#space').join(' #space ');
                                            // var crossTerm = crossTerm.split('#space').join(' #space ');
                                            console.log(mainString);
                                            console.log(crossTerm);

                                            if (mainString != '' && mainString != null && mainString != undefined) {
                                                mainString = mainString.replace(/<[^>]*>/g, '');
                                                var diffWord = {};
                                                diffWord['differentWordsArray'] = [];
                                                diffWord['differenceInPercentage'] = 0;
                                                if (crossTerm != '' && crossTerm != null && crossTerm != undefined) {
                                                    diffWord = this.getDifferentWordFromString(mainString, crossTerm);
                                                }
                                                this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] =
                                                    this.createStringWithDynamicDateTimeNumberPicker(mainString, timeStamp, diffWord);
                                            } else {
                                                this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainTermRecordArray'] = '';
                                            }
                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['crossTerm'] = crossTerm;
                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainString'] = mainString;
                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['timeStamp'] = timeStamp;
                                            this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                                        }
                                        for (let sindexCustom = 0; sindexCustom < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindexCustom++) {
                                            var number = sindexCustom + 1;
                                            var timeStamp = 'dynamicInputValueForAll' + Date.now() + number;
                                            var crossTerm = this.termsReviewRecordsData[index].clauseCategoryTerms[sindexCustom]['crossTerm'];
                                            var mainString = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustom'];

                                            if (mainString != '' && mainString != null && mainString != undefined) {
                                                mainString = mainString.replace(/<[^>]*>/g, '');
                                                var diffWord = {};
                                                diffWord['differentWordsArray'] = [];
                                                diffWord['differenceInPercentage'] = 0;
                                                if (crossTerm != '' && crossTerm != null && crossTerm != undefined) {
                                                    diffWord = this.getDifferentWordFromString(mainString, crossTerm);
                                                }
                                                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] =
                                                    this.createStringWithDynamicDateTimeNumberPicker(mainString, timeStamp, diffWord);
                                            } else {
                                                this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainTermRecordCustomArray'] = '';
                                            }

                                            console.log(this.termsReviewRecordsData);
                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['mainString'] = mainString;
                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['timeStamp'] = timeStamp;

                                            this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindexCustom]['identifier'] = String.fromCharCode(97 + sindexCustom);
                                        }
                                    }
                                    this.totalTermsReviewRecords = totalCount;
                                    this.customClauseDataRecords();
                                    this.loading = false;

                                }
                            },
                                err => {
                                    this.alertService.error(err, 'Error');
                                });
                        } catch (err) { }
                    }
                });
            } catch (err) { }
        }
    }

    getDifferentWordFromString(mainString, crossTerm) {
        var crossTerm = (crossTerm != '' && crossTerm != null && crossTerm != undefined) ? crossTerm : mainString;

        var mainStringArray = mainString.split(' ');
        var crossTermArray = crossTerm.split(' ');

        var mainStringLength = mainStringArray.length;
        var crossLength = crossTermArray.length;
        var mainStringPercentageValueByPart = 100 / crossLength;
        var String = new DiffMatchPatch();
        var StringDifferent = String.diff_main(mainString,crossTerm);
        var finalDifferentWordsArray = [];
        for(let index = 0; index < StringDifferent.length; index++)
        {
            var isDifferent = StringDifferent[index][0];
            var differentWord = StringDifferent[index][1];
            if(isDifferent != 0)
            {
                // finalDifferentWordsArray.push(differentWord);
                var words = differentWord.split(' ');
                for(let sindex = 0; sindex < words.length; sindex++)
                {
                    finalDifferentWordsArray.push(words[sindex]);
                }
            }
        }
        console.log(finalDifferentWordsArray);
        var finalString = '';
        for(let index = 0; index < mainStringArray.length; index++)
        {
            finalString += ' ';
            if (finalDifferentWordsArray.indexOf(mainStringArray[index].toString()) != -1 && mainStringArray[index].toString() != '#space')
            {
                finalString += '#diff~'+mainStringArray[index];
            } else {
                finalString += mainStringArray[index];
            }
        }
        
        var resultArray = [];
            resultArray['differentWordsArray'] = finalDifferentWordsArray;
            resultArray['finalString'] = finalString;
            resultArray['differenceInPercentage'] = Math.floor(mainStringPercentageValueByPart * finalDifferentWordsArray.length);
        console.log(resultArray);
        

        // var a = crossTermArray;
        // var b = mainStringArray;

        // var i = 0;
        // var j = 0;
        // var result = [];
        // var totalDiff = 0;
        // while (j < b.length) {
        //     if (a[i] != b[j] || i == a.length)
        //         result.push(b[j]);
        //     else
        //         i++;
        //     j++;
        // }

        // var resultArray = [];
        // resultArray['differentWordsArray'] = result;
        // resultArray['differenceInPercentage'] = Math.floor(mainStringPercentageValueByPart * result.length);

        return resultArray;
    }

    customClauseDataRecords(): void {

        var drawId = this.drawId;
        var tradingId = this.tradingId;

        var commonClausesCustomClauseTermArray = localStorage.getItem('commonClausesCustomClauseTermArray');

        var drawCondition = {};
        drawCondition["drawId"] = drawId;
        drawCondition["tradingId"] = tradingId;
        drawCondition["commonClauses"] = commonClausesCustomClauseTermArray;
        drawCondition["commonClausesBroker"] = this.customClauseBrokerArray;

        try {
            this._userService.customClauseRecords(drawCondition).pipe(first()).subscribe((res) => {
                this.customClauseDataResponse = res;
                if (this.customClauseDataResponse.success === true) {
                    this.customClauseDataResponseData = this.customClauseDataResponse.data;
                    var newCount = this.termsReviewRecordsData.length;
                    newCount = newCount + 1;
                    for (let index = 0; index < this.customClauseDataResponseData.length; index++) {
                        this.customClauseDataResponseData[index]['numberInfo'] = newCount;
                        newCount = newCount + 1;
                        for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; sindex++) {
                            var number = sindex + 1;
                            var timeStamp = 'dynamicInputValueForAll' + Date.now() + number;

                            var crossTerm = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['crossTerm'];
                            var mainString = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainTermRecord'];

                            if (mainString != '' && mainString != null && mainString != undefined) {
                                mainString = mainString.replace(/<[^>]*>/g, '');
                                var diffWord = {};
                                diffWord['differentWordsArray'] = [];
                                diffWord['differenceInPercentage'] = 0;
                                if (crossTerm != '' && crossTerm != null && crossTerm != undefined) {
                                    diffWord = this.getDifferentWordFromString(mainString, crossTerm);
                                }
                                this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainTermRecordCustomArray'] =
                                    this.createStringWithDynamicDateTimeNumberPicker(mainString, timeStamp, diffWord);
                            } else {
                                this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainTermRecordCustomArray'] = '';
                            }

                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainString'] = mainString;
                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['timeStamp'] = timeStamp;

                            this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                        for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom.length; sindex++) {
                            this.customClauseDataResponseData[index].clauseCategoryTermsUpdateCustom[sindex]['identifier'] = String.fromCharCode(97 + sindex);
                        }
                    }


                    this.loading = false;

                    this.checkAllFunctionChecked();

                }
            })
        } catch (err) { }
    }



    updateDynamicString(className, type) {
        var mainDataArrayOfString = this.mainDynamicStringArray;

        var valueInfo = '';
        var timeStampInfo = '';
        var mainString = '';

        for (var i = 0; i < mainDataArrayOfString.length; i++) {
            valueInfo = mainDataArrayOfString[i];
            timeStampInfo = valueInfo['timeStamp'];
            if (timeStampInfo == className) {

                mainString = valueInfo['mainString'];
                // return false;
            }
        }

        var updatedStringValuesArray = [];

        var slides = document.getElementsByClassName(className);

        var finalString = mainString

        if (slides.length > 0) {
            var mainString = finalString;
            finalString = '';

            for (var i = 0; i < slides.length; i++) {
                var valueOfUpdatedSting = slides[i];
                updatedStringValuesArray.push(valueOfUpdatedSting['value']);
            }

            var dynamicStringArray = mainString.split(' ');
            var stringNumber = 0;
            for (let index = 0; index < dynamicStringArray.length; index++) {
                var stringToAttach = dynamicStringArray[index];

                var currentData = dynamicStringArray[index];
                var currentDataInfo = currentData.split('@');

                var currentTimer = dynamicStringArray[index];
                var currentTimerInfo = currentTimer.split('||');

                var currentNumber = dynamicStringArray[index];
                var currentNumberInfo = currentNumber.split('$');

                if (currentDataInfo[1] != '' && currentDataInfo[1] != null && currentDataInfo[1] != undefined) {
                    var date = moment(updatedStringValuesArray[stringNumber]).format("YYYY-MM-DD");
                    stringToAttach = '#date@' + date;
                    stringNumber = stringNumber + 1;
                }

                if (currentTimerInfo[1] != '' && currentTimerInfo[1] != null && currentTimerInfo[1] != undefined) {
                    var time = updatedStringValuesArray[stringNumber];
                    stringToAttach = '#time||' + time;
                    stringNumber = stringNumber + 1;
                }

                if (currentNumberInfo[1] != '' && currentNumberInfo[1] != null && currentNumberInfo[1] != undefined) {
                    var number = updatedStringValuesArray[stringNumber];
                    stringToAttach = '#number$' + number;
                    stringNumber = stringNumber + 1;
                }
                finalString += ' ' + stringToAttach;
            }
        }


        if (type == 'CustomClauseTerms') {
            for (let index = 0; index < this.customClauseDataResponseData.length; index++) {
                for (let sindex = 0; sindex < this.customClauseDataResponseData[index].clauseCategoryTerms.length; sindex++) {
                    var mainTimeStamp = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['timeStamp'];
                    var mainTermString = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex]['mainString'];

                    if (mainTimeStamp == className) {
                        this.customTermsOfCustomClauseEditCustomClauseID = this.customClauseDataResponseData[index].id;
                        this.customTermsOfCustomClauseEditParentID = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex].id;
                        this.tmpeditclausetext = this.customClauseDataResponseData[index].clauseCategoryTerms[sindex].termsName;
                        this.termsName = finalString;

                        const req =
                        {
                            mainUserId: localStorage.getItem('userId'),
                            companyId: localStorage.getItem('companyId'),
                            drawId: this.drawId,
                            tradingId: this.tradingId,
                            formId: this.formId,
                            customCluaseCategoryId: this.customTermsOfCustomClauseEditCustomClauseID,
                            customClauseTermsId: this.customTermsOfCustomClauseEditParentID,
                            nos: '1',
                            termsNameOrginal: '',
                            termsName: finalString,
                            createdBy: localStorage.getItem('userId'),
                            updatedBy: localStorage.getItem('userId'),
                            isCustom: 'Y'
                        };

                        try {
                            const header = new HttpHeaders(); header.append('Content-Type', 'application/json');
                            const headerOptions = { headers: header }
                            this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe(res => { this.termsUpdateRes = res; this.editclausetext = ''; });
                        } catch (err) { }
                    }
                }
            }
        } else {
            for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
                if (type == 'Main') {
                    for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
                        var mainTimeStamp = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['timeStamp'];
                        var mainTermString = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex]['mainString'];

                        if (mainTimeStamp == className) {
                            this.editClauseTermOfMainClauseCategoryID = this.termsReviewRecordsData[index].id;
                            this.editClauseTermOfMainClauseID = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id;
                            this.tmpeditclausetext = this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].termsName;
                            this.termsName = finalString;

                            const req =
                            {
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                drawId: this.drawId,
                                tradingId: this.tradingId,
                                formId: this.formId,
                                clauseCategoryId: this.editClauseTermOfMainClauseCategoryID,
                                clauseTermsId: this.editClauseTermOfMainClauseID,

                                nos: '1',
                                termsNameOrginal: this.tmpeditclausetext,
                                termsName: finalString,
                                createdBy: localStorage.getItem('userId'),
                                updatedBy: localStorage.getItem('userId'),
                                // isCustom: 'Y'
                            };

                            try {
                                const header = new HttpHeaders(); header.append('Content-Type', 'application/json');
                                const headerOptions = { headers: header }
                                this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(res => { this.termsUpdateRes = res; this.editclausetext = ''; });
                            } catch (err) { }
                        }

                    }
                }

                if (type == 'Custom') {
                    for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom.length; sindex++) {
                        var mainTimeStamp = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex]['timeStamp'];

                        if (mainTimeStamp == className) {

                            this.editClauseTermOfMainClauseCategoryID = this.termsReviewRecordsData[index].id;
                            this.editClauseTermOfMainClauseID = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex].id;
                            this.tmpeditclausetext = this.termsReviewRecordsData[index].clauseCategoryTermsUpdateCustom[sindex].termsName;
                            this.termsName = finalString;

                            const req =
                            {
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                drawId: this.drawId,
                                tradingId: this.tradingId,
                                formId: this.formId,
                                clauseCategoryId: this.editClauseTermOfMainClauseCategoryID,
                                clauseTermsId: this.editClauseTermOfMainClauseID,
                                parentId: this.editClauseTermOfMainClauseID,
                                nos: '1',
                                termsNameOrginal: this.tmpeditclausetext,
                                termsName: finalString,
                                createdBy: localStorage.getItem('userId'),
                                updatedBy: localStorage.getItem('userId'),
                                isCustom: 'Y'
                            };

                            try {
                                const header = new HttpHeaders(); header.append('Content-Type', 'application/json');
                                const headerOptions = { headers: header }
                                this.http.post(`${config.baseUrl}/customClauseDetailsInsert`, req, headerOptions).subscribe(res => { this.termsUpdateRes = res; this.editclausetext = ''; this.editCustomClauseTermDataInput = ''; });
                            } catch (err) { }
                        }
                    }
                }
            }
        }

        var log = this.loggedInUserName + " has updated a term";
        this.tradingPlatformLogs.push(log);

        this.validateSubmitButton();
    }

    updateDynamicTerms() {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.editClauseTermOfMainClauseCategoryID;
        var clauseTermsId = this.editClauseTermOfMainClauseID;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editclausetext;

        const req =
        {

            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };


        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true) {
                        this.editclausetext = '';
                    }
                }
            );
        } catch (err) { }
    }

    createStringWithDynamicDateTimeNumberPicker(mainString, timeStamp, diffWord) {
        var differentWordsArray = diffWord.differentWordsArray;
        var differenceInPercentage = diffWord.differenceInPercentage;
        var finalString = diffWord.finalString;
        this.dynamicStringArray = (finalString != '' && finalString != null && finalString != undefined && differenceInPercentage <= 75) ? finalString.split(' ') : mainString.split(' ');
        console.log(this.dynamicStringArray);
        for (let index = 0; index < this.dynamicStringArray.length; index++)
        {
            var newNumber = this.dynamicInputNumber + 1;

            this.dynamicInputNumber = newNumber;

            var currentData = this.dynamicStringArray[index];
            currentData = currentData.split('@');

            var currentTimer = this.dynamicStringArray[index];
            currentTimer = currentTimer.split('||');

            var currentNumber = this.dynamicStringArray[index];
            currentNumber = currentNumber.split('$');

            // var stringInfo = this.dynamicStringArray[index];

            // var stringToCheck = stringInfo;

            // if (differenceInPercentage > 0 && differenceInPercentage <= 60) {
            //     if (differentWordsArray.indexOf(stringToCheck.toString()) != -1) {
            //         stringInfo = '#diff';
            //         differenceInPercentage = 60;


            //     }
            // }

            var currentDifferentString = this.dynamicStringArray[index];
            currentDifferentString = currentDifferentString.split('~');
            var stringInfo = this.dynamicStringArray[index];

            if (currentData[1] != '' && currentData[1] != null && currentData[1] != undefined) {
                stringInfo = '#date';
            }

            if (currentTimer[1] != '' && currentTimer[1] != null && currentTimer[1] != undefined) {
                stringInfo = '#time';
            }

            if (currentNumber[1] != '' && currentNumber[1] != null && currentNumber[1] != undefined) {
                stringInfo = '#number';
            }
            if (currentDifferentString[1] != '' && currentDifferentString[1] != null && currentDifferentString[1] != undefined)
            {
                stringInfo = '#diff';
            }

            var number = index + 1;

            var mainData = {};

            mainData['differenceInPercentage'] = differenceInPercentage;
            mainData['string'] = stringInfo;

            mainData['timeStamp'] = timeStamp;

            mainData['dynamicInputNumber'] = this.dynamicInputNumber;

            mainData['hasValue'] = '';
            mainData['inputIdentifier'] = '';

            mainData['hasTimeValue'] = moment().format("HH:mm A");
            mainData['inputTimeIdentifier'] = '';

            mainData['hasNumberValue'] = '';
            mainData['inputNumberIdentifier'] = '';

            mainData['hasNumberPicker'] = '';



            // if (differenceInPercentage <= 60 && differenceInPercentage > 0) {
            //     if (differentWordsArray.indexOf(stringToCheck) != -1) {
            //         mainData['hasValue'] = this.dynamicStringArray[index];
            //         mainData['inputIdentifier'] = this.dynamicStringArray[index];
            //     }
            // }


            if (currentData[1] != '' && currentData[1] != null && currentData[1] != undefined) {
                var dateInfo = moment(currentData[1]).format("YYYY-MM-DD");
                mainData['hasValue'] = dateInfo;
                mainData['inputIdentifier'] = 'dynamicDatePicker' + number;
            }

            if (currentTimer[1] != '' && currentTimer[1] != null && currentTimer[1] != undefined) {
                var time = currentTimer[1];
                time = time.replace('&#160;', '');

                mainData['hasTimeValue'] = time;
                mainData['inputTimeIdentifier'] = 'dynamicTimePicker' + number;
            }

            if (currentNumber[1] != '' && currentNumber[1] != null && currentNumber[1] != undefined) {
                mainData['hasNumberValue'] = currentNumber[1];
                mainData['inputNumberIdentifier'] = 'numberPicker' + number;

                var finalNumberPicker = [];

                for (let index = 0; index < 100; index++) {
                    var number = index + 1;
                    var mainNumberData = {};
                    mainNumberData['number'] = number;
                    mainNumberData['selected'] = (number == currentNumber[1]) ? 'selected' : '';

                    finalNumberPicker[index] = mainNumberData;
                }

                mainData['hasNumberPicker'] = finalNumberPicker;
            }

            // this.dynamicStringArray[index] = mainData;
            if (currentDifferentString[1] != '' && currentDifferentString[1] != null && currentDifferentString[1] != undefined) {
                mainData['hasValue'] = currentDifferentString[1];
                mainData['inputIdentifier'] = 'dynamicString' + number;
            }
            mainData['hasValue'] = (mainData['hasValue'] != '' && mainData['hasValue'] != null && mainData['hasValue'] != undefined) ? mainData['hasValue'] : ' ';
            mainData['string'] = (mainData['string'] == '#diff~') ? '#space' : mainData['string'];
            this.dynamicStringArray[index] = mainData;
        }
        console.log(this.dynamicStringArray);
        

        var arrayData = {};
        arrayData['timeStamp'] = timeStamp;
        arrayData['dataArray'] = this.dynamicStringArray;
        arrayData['mainString'] = mainString;

        this.mainDynamicStringArray.push(arrayData);

        return this.dynamicStringArray;
    }

    setClauseID(value): void {
        this.clauseId = value;
    }

    // Fetch Clauses And Its Terms Details Records Start

    // Clause Reviews Records Server Side Start

    // Fetch Clauses And Its Terms Details Records Start

    clauseReviewsRecordsServerSide(): void {
        this.clauseCategoryTermsReviewData = [];
        var filterCondition = {};
        filterCondition["ccam.companyId"] = this.companyId;
        filterCondition["ccam.formId"] = this.formId;
        filterCondition["ccam.parentId"] = this.parentId;
        filterCondition["ccam.clauseId"] = this.clauseId;
        try {
            this._userService.clauseTermsReviewsRecordsServerSide(filterCondition)
                .pipe(first())
                .subscribe((res) => {
                    this.clauseCategoryTermsReviewResponse = res;
                    if (this.clauseCategoryTermsReviewResponse.success === true) {
                        this.clauseCategoryTermsReviewData = this.clauseCategoryTermsReviewResponse.data;
                        this.dataSource = new MatTableDataSource(this.clauseCategoryTermsReviewData);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                },
                    err => {
                        this.alertService.error(err, 'Error');
                    });
        } catch (err) { }
    }

    // Fetch Clauses And Its Terms Details Records Start
    reviewModalShow(clausesId, parentId): void {
        this.clauseId = clausesId;
        this.parentId = parentId;
        this.clauseReviewsRecordsServerSide();
        this._fuseSidebarService.getSidebar('reviewPanel').toggleOpen();
    }

    reviewModalHide(): void {
        this.showReviewModal = !this.showReviewModal;
    }

    // Custom Clause
    customClauseToggleOpen(key): void {
        this.clauseTitle = '';
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    // custome terms add toggle
    toggleOpen(key, id): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.parentId = id;
    }

    addCustomClauseTerms(): void {
        if (this.clauseTerms != '' && this.clauseTerms != null) {
            var clauseTermsArray = this.clauseTermsArray;

            var isMatched = 1;

            for (let index = 0; index < clauseTermsArray.length; index++) {
                if (clauseTermsArray[index]['clauseTermsName'] == this.clauseTerms) {
                    isMatched = 2;
                }
            }

            if (isMatched == 1) {
                var number = this.clauseTermNumber;
                number = number + 1;

                this.clauseTermNumber = number;

                var filterCondition = {};
                filterCondition['clauseTermCustomID'] = 'clauseTermCustomID' + number;
                filterCondition['clauseTermCustomIDButton'] = 'clauseTermCustomIDButton' + number;
                filterCondition['clauseTermsName'] = this.clauseTerms;

                this.clauseTermsArray.push(filterCondition);

                this.clauseTerms = '';
            } else {
                this.alertService.error('Term Already Exist', 'Error');
            }
        } else {
            this.alertService.error('Please Enter Custom Clause Term', 'Error');
        }
    }

    removeCustomClauseTerms(clauseTermCustomID, clauseTermCustomIDButton): void {
        var clauseTermsArray = this.clauseTermsArray;
        this.clauseTermsArray = [];
        for (let index = 0; index < clauseTermsArray.length; index++) {
            if (clauseTermsArray[index]['clauseTermCustomID'] != clauseTermCustomID) {
                this.clauseTermsArray.push(clauseTermsArray[index]);
            }
        }
    }

    // Custom Clause
    addCustomClause() {
        var customClauseInsertID = '';
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        const req =
        {
            clauseTitle: this.clauseTitle,
            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/CustomClauseInsert`, req, headerOptions).subscribe(res => {
                this.customClauseTermsResponse = res;
                if (this.customClauseTermsResponse.success === true) {
                    this._fuseSidebarService.getSidebar('addCustomClausePanel').toggleOpen();
                    this.alertService.success('Custom Claused Created Successfully', 'Success');
                    this.customClauseInsertID = this.customClauseTermsResponse.data[0];
                    var clauseTermsArray = this.clauseTermsArray;
                    for (let index = 0; index < clauseTermsArray.length; index++) {
                        const req =
                        {
                            customCluaseCategoryId: this.customClauseInsertID,
                            customClauseTermsId: null,
                            mainUserId: mainUserId,
                            companyId: companyId,
                            drawId: drawId,
                            formId: this.formId,
                            tradingId: tradingId,
                            termsName: clauseTermsArray[index]['clauseTermsName'],
                            createdBy: localStorage.getItem('userId'),
                            updatedBy: localStorage.getItem('userId')
                        };
                        const header = new HttpHeaders();
                        header.append('Content-Type', 'application/json');
                        const headerOptions = { headers: header }
                        this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe(res => {

                        });
                    }
                    this.haveAddedNewCustomClauseTerms = 1;
                    this.validateSubmitButton();
                    this.termsReviewRecords();
                } else {
                    this.alertService.error('Name Already Exist', 'Error');
                }
            });
        } catch (err) {
        }
    }

    // custom terms add
    addClause() {
        this.termsReviewRecordsData = [];
        var mainUserId = localStorage.getItem('userId');
        // 

        var companyId = localStorage.getItem('companyId');
        // 

        var drawId = this.drawId;
        var tradingId = this.tradingId;
        // 

        var formId = this.formId;
        // 

        var clauseCategoryId = this.parentId;
        // 

        // var clauseTermsId = '1';
        // 

        var nos = '1';
        // 

        var termsNameOrginal = this.customClause;
        // 

        var termsName = this.customClause;
        // 
        const req =
        {
            id: '',
            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };

        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailCustomInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;

                    this.haveAddedNewCustomCluase = 1;
                    this.validateSubmitButton();

                    if (this.termsUpdateRes.success === true) {
                        // 

                        this._fuseSidebarService.getSidebar('addPanel').toggleOpen();
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }

    // edit toggle open      
    editToggle(key, id, clauseid): void {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();

        this._userService.getclusesList()
            .subscribe(res => {
                this.tempedit = res;
                for (let index = 0; index < this.tempedit.data.length; index++) {

                    if (this.tempedit.data[index].id == id) {
                        this.editclauses.push(this.tempedit.data[index]);
                        this.editid = this.tempedit.data[index].id;

                        this.editclausetext = this.tempedit.data[index].termsName;
                        this.tmpeditclausetext = this.tempedit.data[index].termsName;
                    }
                }


            });
    }

    // main terms  edit
    editterms(id) {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.parentId;
        var clauseTermsId = id;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editclausetext;
        const req =
        {

            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };
        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true) {
                        this._fuseSidebarService.getSidebar('editPanel').toggleOpen();
                        this.editclausetext = '';
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }

    // custom terms edit toggle
    customToggle(key, id, clauseid): void {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        var clauseTermsReviewFilter = {};
        if (this.isTrading == '2') {
            clauseTermsReviewFilter["tu.companyId"] = this.companyId;
            clauseTermsReviewFilter["tu.drawId"] = this.drawId;
            clauseTermsReviewFilter["tu.formId"] = this.formId;
            clauseTermsReviewFilter["tu.clauseCategoryId"] = this.parentId;
            this._userService.clauseTermsReviewsRecordsServerSideCustom(clauseTermsReviewFilter)
                .subscribe(res => {
                    this.tempedit = res;
                    for (let index = 0; index < this.tempedit.data.length; index++) {
                        if (this.tempedit.data[index].id == id) {
                            this.editclauses.push(this.tempedit.data[index]);
                            this.editid = this.tempedit.data[index].id;
                            this.editclausetext = this.tempedit.data[index].termsName;
                            this.tmpeditclausetext = this.tempedit.data[index].termsName;
                        }
                    }
                });
        } else {
            clauseTermsReviewFilter["tu.companyId"] = this.companyId;
            clauseTermsReviewFilter["tu.tradingId"] = this.tradingId;
            clauseTermsReviewFilter["tu.formId"] = this.formId;
            clauseTermsReviewFilter["tu.clauseCategoryId"] = this.parentId;
            this._userService.clauseTermsReviewsRecordsServerSideCustom(clauseTermsReviewFilter)
                .subscribe(res => {
                    this.tempedit = res;
                    for (let index = 0; index < this.tempedit.data.length; index++) {

                        if (this.tempedit.data[index].id == id) {
                            this.editclauses.push(this.tempedit.data[index]);
                            this.editid = this.tempedit.data[index].id;
                            this.editclausetext = this.tempedit.data[index].termsName;
                            this.tmpeditclausetext = this.tempedit.data[index].termsName;
                        }
                    }
                });
        }
    }

    // custome terms edit    
    customEdit(id) {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.parentId;
        var clauseTermsId = '';
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editclausetext;
        const req =
        {
            id: id,
            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };
        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailCustomInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;

                    this.haveUpdatedTermsDetails = 1;
                    this.validateSubmitButton();

                    if (this.termsUpdateRes.success === true) {
                        // 

                        this._fuseSidebarService.getSidebar('customPanel').toggleOpen();
                        this.editclausetext = '';

                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) {
        }
    }
    // main terms view

    view(key, id, clauseid) {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.viewData = [];
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            if (this.termsReviewRecordsData[index].id == this.parentId) {
                for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
                    if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid) {
                        if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0) {
                            for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++) {
                                this.viewData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex]);
                            }
                        }
                    }
                }
            }
        }
        this.dataSource = new MatTableDataSource(this.viewData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    // custome terms view
    viewCustom(key, id, clauseid) {
        let cid = id;
        this.parentId = clauseid;
        this.editclauses = [];
        this._fuseSidebarService.getSidebar(key).toggleOpen();
        this.viewData = [];
        for (let index = 0; index < this.termsReviewRecordsData.length; index++) {
            if (this.termsReviewRecordsData[index].id == this.parentId) {
                for (let sindex = 0; sindex < this.termsReviewRecordsData[index].clauseCategoryTerms.length; sindex++) {
                    if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].id == cid) {
                        if (this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length != 0) {
                            for (let thirdindex = 0; thirdindex < this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate.length; thirdindex++) {
                                this.viewCustomData.push(this.termsReviewRecordsData[index].clauseCategoryTerms[sindex].clauseCategoryTermsUpdate[thirdindex]);
                            }
                        }
                    }
                }
            }
        }

        this.dataSourcecustom = new MatTableDataSource(this.viewCustomData);
        this.dataSourcecustom.paginator = this.paginator;
        this.dataSourcecustom.sort = this.sort;
    }

    // Clause Submit
    submit() {
        // Convert All Array Values To Number Format Start
        var convertToNumberArray = this.ownerCheckedClauses;
        this.ownerCheckedClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.ownerCheckedClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.ownerCheckedCustomClauses;
        this.ownerCheckedCustomClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.ownerCheckedCustomClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.ownerCheckedCustomTermsClauses;
        this.ownerCheckedCustomTermsClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.ownerCheckedCustomTermsClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.chartererCheckedClauses;
        this.chartererCheckedClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.chartererCheckedClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.chartererCheckedCustomClauses;
        this.chartererCheckedCustomClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.chartererCheckedCustomClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.chartererCheckedCustomTermsClauses;
        this.chartererCheckedCustomTermsClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.chartererCheckedCustomTermsClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.checkedCheckBox;
        this.checkedCheckBox = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.checkedCheckBox.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.checkedCheckBoxCustom;
        this.checkedCheckBoxCustom = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.checkedCheckBoxCustom.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.checkedCheckBoxCustomClauseTerms;
        this.checkedCheckBoxCustomClauseTerms = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.checkedCheckBoxCustomClauseTerms.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.mainTermCheckedClauses;
        this.mainTermCheckedClauses = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.mainTermCheckedClauses.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.mainTermCheckedClausesCustom;
        this.mainTermCheckedClausesCustom = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.mainTermCheckedClausesCustom.push(Number(convertToNumberArray[index]));
        }

        var convertToNumberArray = this.mainTermCheckedClausesCustomTerms;
        this.mainTermCheckedClausesCustomTerms = [];
        for (let index = 0; index < convertToNumberArray.length; index++) {
            this.mainTermCheckedClausesCustomTerms.push(Number(convertToNumberArray[index]));
        }

        // Convert All Array Values To Number Format End

        if (this.tradingId != '' && this.tradingId != null && this.tradingId != undefined) {
            var mainClausesChecked = [];
            var mainClausesCustomChecked = [];
            var mainClausesCustomTermsChecked = [];

            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                var mainClausesChecked = this.ownerCheckedClauses;
                var mainClausesCustomChecked = this.ownerCheckedCustomClauses;
                var mainClausesCustomTermsChecked = this.ownerCheckedCustomTermsClauses;
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                var mainClausesChecked = this.chartererCheckedClauses;
                var mainClausesCustomChecked = this.chartererCheckedCustomClauses;
                var mainClausesCustomTermsChecked = this.chartererCheckedCustomTermsClauses;
            }

            // Main Term Clause Checked Start
            var agreedTermsArray = [];
            for (let index = 0; index < mainClausesChecked.length; index++) {
                if (this.checkedCheckBox.indexOf(mainClausesChecked[index]) >= 0) {
                    agreedTermsArray.push(Number(mainClausesChecked[index]));
                }
            }
            var finalAgreementArray = [];

            for (let index = 0; index < agreedTermsArray.length; index++) {
                if (this.mainTermCheckedClauses.indexOf(agreedTermsArray[index]) < 0) {
                    finalAgreementArray.push(Number(agreedTermsArray[index]));
                }
            }

            for (let index = 0; index < finalAgreementArray.length; index++) {
                this.mainTermCheckedClauses.push(Number(finalAgreementArray[index]));
            }

            var finalChartererClauseArray = this.checkedCheckBox;
            this.checkedCheckBox = [];
            for (let index = 0; index < finalChartererClauseArray.length; index++) {
                if (finalAgreementArray.indexOf(finalChartererClauseArray[index]) < 0) {
                    this.checkedCheckBox.push(Number(finalChartererClauseArray[index]));
                }
            }

            this.chartererCheckedClauses = [];
            this.ownerCheckedClauses = [];

            // Main Term Clause Checked End

            // Main Term Clause Custom Checked Start
            var agreedTermsArray = [];
            for (let index = 0; index < mainClausesCustomChecked.length; index++) {
                if (this.checkedCheckBoxCustom.indexOf(mainClausesCustomChecked[index]) >= 0) {
                    agreedTermsArray.push(Number(mainClausesCustomChecked[index]));
                }
            }
            var finalAgreementArray = [];
            for (let index = 0; index < agreedTermsArray.length; index++) {
                if (this.mainTermCheckedClausesCustom.indexOf(agreedTermsArray[index]) < 0) {
                    finalAgreementArray.push(Number(agreedTermsArray[index]));
                }
            }

            for (let index = 0; index < finalAgreementArray.length; index++) {
                this.mainTermCheckedClausesCustom.push(Number(finalAgreementArray[index]));
            }

            var finalChartererClauseArray = this.checkedCheckBoxCustom;
            this.checkedCheckBoxCustom = [];
            for (let index = 0; index < finalChartererClauseArray.length; index++) {
                if (finalAgreementArray.indexOf(finalChartererClauseArray[index]) < 0) {
                    this.checkedCheckBoxCustom.push(Number(finalChartererClauseArray[index]));
                }
            }

            this.chartererCheckedCustomClauses = [];
            this.ownerCheckedCustomClauses = [];
            // Main Term Clause Custom Checked End

            // Main Term Clause Custom Terms Checked Start
            var agreedTermsArray = [];
            for (let index = 0; index < mainClausesCustomTermsChecked.length; index++) {
                if (this.checkedCheckBoxCustomClauseTerms.indexOf(mainClausesCustomTermsChecked[index]) >= 0) {
                    agreedTermsArray.push(Number(mainClausesCustomTermsChecked[index]));
                }
            }
            var finalAgreementArray = [];
            for (let index = 0; index < agreedTermsArray.length; index++) {
                if (this.mainTermCheckedClausesCustomTerms.indexOf(agreedTermsArray[index]) < 0) {
                    finalAgreementArray.push(Number(agreedTermsArray[index]));
                }
            }
            for (let index = 0; index < finalAgreementArray.length; index++) {
                this.mainTermCheckedClausesCustomTerms.push(Number(finalAgreementArray[index]));
            }

            var finalChartererClauseArray = this.checkedCheckBoxCustomClauseTerms;
            this.checkedCheckBoxCustomClauseTerms = [];
            for (let index = 0; index < finalChartererClauseArray.length; index++) {
                if (finalAgreementArray.indexOf(finalChartererClauseArray[index]) < 0) {
                    this.checkedCheckBoxCustomClauseTerms.push(Number(finalChartererClauseArray[index]));
                }
            }
            this.chartererCheckedCustomTermsClauses = [];
            this.ownerCheckedCustomTermsClauses = [];
            // Main Term Clause Custom Terms Checked End

        }
        var fromUserId = localStorage.getItem('userId');
        var notification = 'New Draw C/p Available';
        var toUserId = this.chartererId;
        var checkedCheckBox = this.checkedCheckBox.join();
        var checkedCheckBoxCustom = this.checkedCheckBoxCustom.join();
        var checkedCheckBoxCustomClauseTerms = this.checkedCheckBoxCustomClauseTerms.join();

        var mainTermCheckedClauses = this.mainTermCheckedClauses.join();
        var mainTermCheckedClausesCustom = this.mainTermCheckedClausesCustom.join();
        var mainTermCheckedClausesCustomTerms = this.mainTermCheckedClausesCustomTerms.join();

        var chartererCheckedClauses = this.chartererCheckedClauses.join();
        var chartererCheckedCustomClauses = this.chartererCheckedCustomClauses.join();
        var chartererCheckedCustomTermsClauses = this.chartererCheckedCustomTermsClauses.join();

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            var chartererCheckedClauses = this.checkedCheckBox.join();
            var chartererCheckedCustomClauses = this.checkedCheckBoxCustom.join();
            var chartererCheckedCustomTermsClauses = this.checkedCheckBoxCustomClauseTerms.join();
        }

        var ownerCheckedClauses = this.ownerCheckedClauses.join();
        var ownerCheckedCustomClauses = this.ownerCheckedCustomClauses.join();
        var ownerCheckedCustomTermsClauses = this.ownerCheckedCustomTermsClauses.join();

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            var ownerCheckedClauses = this.checkedCheckBox.join();
            var ownerCheckedCustomClauses = this.checkedCheckBoxCustom.join();
            var ownerCheckedCustomTermsClauses = this.checkedCheckBoxCustomClauseTerms.join();
        }

        if (this.isTrading == '2') {
            const reqData =
            {
                drawId: this.drawId,
                chartererId: toUserId,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            }
            this._userService.DrawRequestToChartererCreate(reqData).pipe(first()).subscribe(
                data => {
                    this.submitResponse = data;
                    const req =
                    {
                        fromUserId: localStorage.getItem('userId'),
                        toUserId: toUserId,
                        notification: 'You have a draw request',
                        createdBy: localStorage.getItem('userId'),
                        updatedBy: localStorage.getItem('userId')
                    };
                    try {
                        const header = new HttpHeaders();
                        header.append('Content-Type', 'application/json');
                        const headerOptions =
                        {
                            headers: header
                        }
                        this.socket.emit('new-notification', { req });

                        this.http.post(`${config.baseUrl}/notificationCreate`, req, headerOptions).subscribe(
                            res => {
                                this.notifiactionres = res;

                                if (this.notifiactionres.success === true) {

                                }
                            }
                        );
                    } catch (err) { }
                });

            var statusInfoValue = 'Broker Updates';
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                statusInfoValue = 'Charterer Updates';
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                statusInfoValue = 'Owner Updates';
            }

            var updateData = {};
            updateData['id'] = this.drawId;
            updateData['metricTonValue'] = this.metricTonValue;
            updateData['preamble_description'] = this.preamble_description;
            updateData['heading_msg'] = this.heading_msg;
            updateData['customInput1'] = this.customInput1;
            updateData['customInput2'] = this.customInput2;
            updateData['cpTime'] = this.cpTime;
            updateData['cpTime'] = this.formId;
            updateData['cpCity'] = this.cpCity;
            updateData['cpDate'] = this.cpDate;
            updateData['updatedBy'] = localStorage.getItem('userId');
            updateData['common_clauses'] = checkedCheckBox;
            updateData['custom_term_clause'] = checkedCheckBoxCustom;
            updateData['custom_common_clause'] = checkedCheckBoxCustomClauseTerms;
            updateData['statusInfo'] = statusInfoValue;

            if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
                updateData['broker_clauses'] = checkedCheckBox;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                updateData['charterer_clauses'] = checkedCheckBox;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                updateData['owner_clauses'] = checkedCheckBox;
            }
            try {
                this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => { }, err => { });
            } catch (err) { }

            const req =
            {
                id: this.drawId,
                broker_check: 20,
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/drawProgressUpdate`, req, headerOptions).subscribe(res => {
            });

            this.drawNotificationAndMessageSend();

            this.router.navigate(['/apps/draw-management']);

        } else {
            var convertedDate = moment(this.clauseFormValues.cpDate.value).format("YYYY-MM-DD");
            var updateData = {};
            updateData['id'] = this.tradingId;

            if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
                updateData['progress'] = '30';
                updateData['progress_info'] = '3';
                this.message = 'Broker Updates';
            }

            if (this.is_owner_main_term_sign_off == '1') {
                updateData['progress'] = '40';
                updateData['progress_info'] = '4';
                this.message = this.ownerNameNotification + ' Sign Off Main Term';
            }

            if (this.is_charterer_main_term_sign_off == '1') {
                updateData['progress'] = '50';
                updateData['progress_info'] = '5';
                this.message = this.chartererNameNotification + ' Sign Off Main Term';
            }

            if (this.ownerDetailCounterNumber > '1') {
                updateData['progress'] = '60';
                updateData['progress_info'] = '6';
                this.message = this.pageTitle;
            }

            if (this.is_owner_detail_term_sign_off == '1' && this.ownerDetailCounterNumber > '1') {
                updateData['progress'] = '70';
                updateData['progress_info'] = '7';
                this.message = this.ownerNameNotification + ' Sign Off Detail Term';
            }

            if (this.is_charterer_detail_term_sign_off == '1' && this.ownerDetailCounterNumber > '1') {
                updateData['progress'] = '80';
                updateData['progress_info'] = '8';
                this.message = this.chartererNameNotification + ' Sign Off Detail Term';
            }


            updateData['cpTime'] = this.clauseFormValues.cpTime.value;
            updateData['cpCity'] = this.clauseFormValues.cityId.value;
            updateData['cpDate'] = convertedDate;

            updateData['is_owner_main_term_sign_off'] = this.is_owner_main_term_sign_off;
            updateData['is_charterer_main_term_sign_off'] = this.is_charterer_main_term_sign_off;
            updateData['is_owner_detail_term_sign_off'] = this.is_owner_detail_term_sign_off;
            updateData['is_charterer_detail_term_sign_off'] = this.is_charterer_detail_term_sign_off;

            updateData['is_broker_approval'] = '1';

            if (this.is_owner_main_term_sign_off == '1' && this.is_charterer_main_term_sign_off == '1') {
                updateData['main_term_checked_clauses'] = this.checkedClauseCategory.join();
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
                updateData['broker_clauses'] = checkedCheckBox;
                updateData['is_broker_approval'] = '2';
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                updateData['charterer_detail_counter'] = this.chartererDetailCounterNumber;
                updateData['charterer_counter'] = this.chartererCounterNumber;
                updateData['charterer_clauses'] = checkedCheckBox;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                updateData['owner_detail_counter'] = this.ownerDetailCounterNumber;
                updateData['owner_counter'] = this.ownerCounterNumber;
                updateData['owner_clauses'] = checkedCheckBox;
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
                updateData['common_clauses_broker'] = '';
                updateData['custom_term_clause_broker'] = '';
                updateData['custom_common_clause_broker'] = '';
            } else {
                updateData['common_clauses'] = checkedCheckBox;
                updateData['custom_term_clause'] = checkedCheckBoxCustom;
                updateData['custom_common_clause'] = checkedCheckBoxCustomClauseTerms;
                updateData['common_clauses_broker'] = checkedCheckBox;
                updateData['custom_term_clause_broker'] = checkedCheckBoxCustom;
                updateData['custom_common_clause_broker'] = checkedCheckBoxCustomClauseTerms;
                updateData['charterer_clauses'] = chartererCheckedClauses;
                updateData['charterer_custom_clauses'] = chartererCheckedCustomClauses;
                updateData['charterer_custom_terms_clauses'] = chartererCheckedCustomTermsClauses;

                updateData['owner_clauses'] = ownerCheckedClauses;
                updateData['owner_custom_clauses'] = ownerCheckedCustomClauses;
                updateData['owner_custom_terms_clauses'] = ownerCheckedCustomTermsClauses;

                updateData['main_term_clauses'] = mainTermCheckedClauses;
                updateData['main_term_checked_clauses_custom'] = mainTermCheckedClausesCustom;
                updateData['main_term_checked_clauses_custom_term'] = mainTermCheckedClausesCustomTerms;
            }

            updateData['is_borker_submit'] = '1';
            updateData['updatedBy'] = JSON.parse(localStorage.getItem('userId'));

            try { this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) => { }, err => { }); } catch (err) { }

            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            var tradingMessageInsertData = {};
            tradingMessageInsertData['tradingId'] = this.tradingId;
            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                tradingMessageInsertData['message'] = this.message;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
                tradingMessageInsertData['message'] = this.message;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                tradingMessageInsertData['message'] = this.message;
                // tradingMessageInsertData['message'] = 'Charterer Updates';
                if (this.ownerCounterNumber > '1') {
                    tradingMessageInsertData['message'] = this.message;
                }

                if (this.ownerDetailCounterNumber > '1') {
                    tradingMessageInsertData['message'] = this.message;
                }
            }
            tradingMessageInsertData['createdBy'] = localStorage.getItem('userId');
            tradingMessageInsertData['updatedBy'] = localStorage.getItem('userId');
            this.http.post(`${config.baseUrl}/tradingMessageInsert`, tradingMessageInsertData, headerOptions).subscribe(res => { }, err => { });

            var tradingProgressInsertData = {};
            tradingProgressInsertData['tradingId'] = this.tradingId;
            tradingProgressInsertData['ownerId'] = this.ownerId;
            tradingProgressInsertData['brokerId'] = this.brokerId;
            tradingProgressInsertData['chartererId'] = this.chartererId;
            tradingProgressInsertData['message'] = this.message;

            if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
                tradingProgressInsertData['message'] = this.message;
            }

            if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
                tradingProgressInsertData['message'] = this.message;
            }
            if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
                tradingMessageInsertData['message'] = this.message;
                // tradingProgressInsertData['message'] = 'Charterer Updates';
                if (this.ownerCounterNumber > '1') {
                    tradingProgressInsertData['message'] = this.message;
                }
                if (this.ownerDetailCounterNumber > '1') {
                    tradingProgressInsertData['message'] = this.message;
                }
            }



            tradingProgressInsertData['createdBy'] = localStorage.getItem('userId');
            tradingProgressInsertData['updatedBy'] = localStorage.getItem('userId');
            this.http.post(`${config.baseUrl}/tradingProgressInsert`, tradingProgressInsertData, headerOptions).subscribe(res => { }, err => { });


            const tradingNotificationData =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.brokerId,
                notification: this.message + ' Fixture ' + this.tradingId,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                tradingNotificationData, headerOptions).subscribe(res => { }, err => { });

            if (localStorage.getItem('userRoleId') == '4') {
                if (this.ownerId != '' && this.ownerId != null && this.ownerId != undefined) {
                    const tradingNotificationData =
                    {
                        fromUserId: localStorage.getItem('userId'),
                        toUserId: this.ownerId,
                        notification: this.message + ' Fixture ' + this.tradingId,
                        createdBy: localStorage.getItem('userId'),
                        updatedBy: localStorage.getItem('userId')
                    };
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
                        notification: this.message + ' Fixture ' + this.tradingId,
                        createdBy: localStorage.getItem('userId'),
                        updatedBy: localStorage.getItem('userId')
                    };
                    this.http.post(`${config.baseUrl}/tradingNotificationInsert`,
                        tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
                }
            }

            if (this.tradingPlatformLogs.length > 0) {
                for (let index = 0; index < this.tradingPlatformLogs.length; index++) {
                    var tradingMessageInsertData = {};
                    tradingMessageInsertData['tradingId'] = this.tradingId;
                    tradingMessageInsertData['message'] = this.tradingPlatformLogs[index];
                    tradingMessageInsertData['createdBy'] = localStorage.getItem('userId');
                    tradingMessageInsertData['updatedBy'] = localStorage.getItem('userId');
                    this.http.post(`${config.baseUrl}/tradingMessageInsert`, tradingMessageInsertData, headerOptions).subscribe(res => { }, err => { });

                    const tradingNotificationData =
                    {
                        fromUserId: localStorage.getItem('userId'),
                        toUserId: this.brokerId,
                        notification: this.tradingPlatformLogs[index] + ' Fixture ' + this.tradingId,
                        createdBy: localStorage.getItem('userId'),
                        updatedBy: localStorage.getItem('userId')
                    };
                    this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationData, headerOptions).subscribe(res => { }, err => { });

                    if (localStorage.getItem('userRoleId') == '4') {
                        const tradingNotificationData =
                        {
                            fromUserId: localStorage.getItem('userId'),
                            toUserId: this.ownerId,
                            notification: this.tradingPlatformLogs[index] + ' Fixture ' + this.tradingId,
                            createdBy: localStorage.getItem('userId'),
                            updatedBy: localStorage.getItem('userId')
                        };
                        this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
                    }

                    if (localStorage.getItem('userRoleId') == '6') {
                        const tradingNotificationData =
                        {
                            fromUserId: localStorage.getItem('userId'),
                            toUserId: this.chartererId,
                            notification: this.tradingPlatformLogs[index] + ' Fixture ' + this.tradingId,
                            createdBy: localStorage.getItem('userId'),
                            updatedBy: localStorage.getItem('userId')
                        };
                        this.http.post(`${config.baseUrl}/tradingNotificationInsert`, tradingNotificationData, headerOptions).subscribe(res => { }, err => { });
                    }
                }
            }

            this.router.navigate(['/apps/trading-platform-management']);
        }
    }

    drawNotificationAndMessageSend() {
        var notificationMessage = '';
        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            notificationMessage = this.brokerName + ' has updated Charter Party ' + this.drawId;
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            notificationMessage = this.chartererName + ' has updated Charter Party ' + this.drawId;
        }
        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            notificationMessage = this.ownerName + ' has updated Charter Party ' + this.drawId;
        }

        console.log(this.brokerId, "Broker ID");
        console.log(this.brokerName, "Broker Name");

        console.log(this.chartererId, "Charterer ID");
        console.log(this.chartererName, "Charterer Name");

        console.log(this.ownerId, "Owner ID");
        console.log(this.ownerName, "Owner Name");

        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions =
        {
            headers: header
        }
        var updateData = {};
        updateData['id'] = this.drawId;
        updateData['statusInfo'] = notificationMessage;
        try {
            this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

            }, err => { });
        } catch (err) { }

        const req =
        {
            drawId: this.drawId,
            message: notificationMessage,
            date: moment(new Date()).format("YYYY-MM-DD"),
            time: moment(new Date()).format("H:mm A"),
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        this.socket.emit('new-notification', { req });
        try { this.http.post(`${config.baseUrl}/drawMessageInsert`, req, headerOptions).subscribe(res => { }); } catch (err) { }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
            const notificationData =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.chartererId,
                message: notificationMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', { notificationData });
            try { this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationData, headerOptions).subscribe(res => { }); } catch (err) { }

            const notificationDataOwner =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.ownerId,
                message: notificationMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', { notificationDataOwner });
            try { this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationDataOwner, headerOptions).subscribe(res => { }); } catch (err) { }
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '4') {
            const notificationData =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.brokerId,
                message: notificationMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', { notificationData });
            try { this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationData, headerOptions).subscribe(res => { }); } catch (err) { }

            const notificationDataOwner =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.ownerId,
                message: notificationMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', { notificationDataOwner });
            try { this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationDataOwner, headerOptions).subscribe(res => { }); } catch (err) { }
        }

        if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
            const notificationData =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.chartererId,
                message: notificationMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', { notificationData });
            try { this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationData, headerOptions).subscribe(res => { }); } catch (err) { }

            const notificationDataOwner =
            {
                fromUserId: localStorage.getItem('userId'),
                toUserId: this.ownerId,
                message: notificationMessage,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            this.socket.emit('new-notification', { notificationDataOwner });
            try { this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationDataOwner, headerOptions).subscribe(res => { }); } catch (err) { }
        }
    }

    tradeDataUpdate() {
        var convertedDate = moment(this.clauseFormValues.cpDate.value).format("YYYY-MM-DD");

        var updateData = {};
        updateData['id'] = this.tradingId;
        updateData['formId'] = this.formId;
        updateData['cpCity'] = this.cityId;
        updateData['cpDate'] = convertedDate;
        updateData['cpTime'] = this.clauseFormValues.cpTime.value;

        try {
            this._userService.tradingDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {
            }, err => { });
        } catch (err) { }


    }

    // check box    click and add
    checkclick(id) {
        let cid = id;
        this.check.push(cid);
    }

    // Check Clasue Terms
    get selectedOptions() { // right now: ['1','3']
        return this.options
            .filter(opt => opt.checked)
            .map(opt => opt.value)
    }


    clauseTermsCheck() {

    }

    // Custom Clause
    addCustomTermsOfCustomClauseToggleOpen(key, customClauseIDInfo): void {
        this.customClauseIDInfo = customClauseIDInfo;
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    addCustomTermsOfCustomClause(): void {
        if (this.customTermsOfCustomClause != '') {
            var clauseTermsArray = this.customClauseDataResponseData;


            var mainUserId = localStorage.getItem('userId');
            var companyId = localStorage.getItem('companyId');
            var drawId = this.drawId;
            var tradingId = this.tradingId;
            const req =
            {
                customCluaseCategoryId: this.customClauseIDInfo,
                customClauseTermsId: null,
                mainUserId: mainUserId,
                companyId: companyId,
                drawId: drawId,
                formId: this.formId,
                tradingId: tradingId,
                termsName: this.customTermsOfCustomClause,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe(res => {
                this.customClauseDataResponse = res;
                if (this.customClauseDataResponse.success === true) {
                    this.alertService.success('Record Inserted Successfully', 'Success');
                    this._fuseSidebarService.getSidebar('addCustomTermsOfCustomClause').toggleOpen();
                    this.termsReviewRecords();
                    this.haveAddedNewCustomClauseTerms = 1;
                    this.validateSubmitButton();
                } else {
                    this.alertService.error('Name Already Exist', 'Error');
                }
            });
        } else {
            this.alertService.error('Please Enter Custom Clause Term', 'Error');
        }
    }

    // Edit Custom Clause Term Of Custom Clause
    EditCustomClauseTermOfCustomClause(key, id, clauseid, parentID): void {
        this.customTermsOfCustomClauseEditID = id;
        this.customTermsOfCustomClauseEditCustomClauseID = clauseid;
        this.customTermsOfCustomClauseEditParentID = parentID;


        var filterCondition = {};
        filterCondition["id"] = id;



        try {
            this._userService.getCustomTermDataOfCustomClause(filterCondition).pipe(first()).subscribe((res) => {
                this.editCustomTermsOfCustomClauseResponse = res;
                if (this.editCustomTermsOfCustomClauseResponse.success == true) {
                    this.editCustomTermsOfCustomClauseResponseData = this.editCustomTermsOfCustomClauseResponse.data[0];

                    this.customTermsOfCustomClauseEdit = this.editCustomTermsOfCustomClauseResponseData['termsName'];

                }
            });
        } catch (err) {

        }
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    editCustomTermsOfCustomClause(): void {
        if (this.customTermsOfCustomClause != '') {
            var clauseTermsArray = this.customClauseDataResponseData;

            var mainUserId = localStorage.getItem('userId');
            var companyId = localStorage.getItem('companyId');
            var drawId = this.drawId;
            var tradingId = this.tradingId;
            const req =
            {
                customCluaseCategoryId: this.customTermsOfCustomClauseEditCustomClauseID,
                customClauseTermsId: this.customTermsOfCustomClauseEditParentID,
                mainUserId: mainUserId,
                companyId: companyId,
                drawId: drawId,
                formId: this.formId,
                tradingId: tradingId,
                termsName: this.customTermsOfCustomClauseEdit,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId')
            };
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions = { headers: header }
            this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`, req, headerOptions).subscribe(res => {
                this.customClauseDataResponse = res;
                if (this.customClauseDataResponse.success === true) {
                    this.alertService.success('Record Inserted Successfully', 'Success');
                    this._fuseSidebarService.getSidebar('editCustomTermsOfCustomClause').toggleOpen();
                    this.termsReviewRecords();
                    this.haveUpdatedTermsDetails = 1;
                    this.validateSubmitButton();
                } else {
                    this.alertService.error('Name Already Exist', 'Error');
                }
            });

        } else {
            this.alertService.error('Please Enter Custom Clause Term', 'Error');
        }
    }

    // View Custom Terms Custom Updates Of Custom Clause
    ViewCustomTermsUpdatesOfCustomTermsOfCustomClause(key, parentID) {
        var filterCondition = {};
        filterCondition["customClauseTermsId"] = parentID;
        try {
            this._userService.viewCustomTermDataOfCustomClause(filterCondition).pipe(first()).subscribe((res) => {
                this.viewCustomTermsOfCustomClauseResponse = res;
                if (this.viewCustomTermsOfCustomClauseResponse.success == true) {
                    this.viewCustomTermsOfCustomClauseResponseData = this.viewCustomTermsOfCustomClauseResponse.data;

                    this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause = new MatTableDataSource(this.viewCustomTermsOfCustomClauseResponseData);
                    this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause.paginator = this.paginator;
                    this.dataSourceOfCustomTermsUpodateOfCustomTermsOfCustomClause.sort = this.sort;



                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) { }
    }

    // Edit Clause Terms
    editClauseCategoryTermsOfMainClause(key, clauseTermsID, ClauseID) {
        this.editClauseTermOfMainClauseID = clauseTermsID;
        this.editClauseTermOfMainClauseCategoryID = ClauseID;

        var filterCondition = {};
        filterCondition["clauseTermsID"] = clauseTermsID;
        filterCondition["drawId"] = this.drawId;
        filterCondition["tradingId"] = this.tradingId;
        filterCondition["formID"] = this.formId;
        filterCondition["companyId"] = this.companyId;
        filterCondition["ClauseID"] = ClauseID;
        try {
            this._userService.getClauseTermDataForUpdate(filterCondition).pipe(first()).subscribe((res) => {
                this.editClauseTermOfMainClauseResponse = res;
                if (this.editClauseTermOfMainClauseResponse.success == true) {
                    this.editClauseTermOfMainClauseResponseData = this.editClauseTermOfMainClauseResponse.data;


                    for (let index = 0; index < this.editClauseTermOfMainClauseResponseData.length; index++) {

                        this.editclausetext = this.editClauseTermOfMainClauseResponseData[index]['termsName'];
                    }
                    var updatedString = this.editclausetext;
                    this.editclausetext = updatedString.split('#space').join('<div><br></div>');

                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) { }
    }

    // Clause Term Update Of Main Clause
    updateClauseTermOfMainClause() {
          
        // var text = 'VISHAL UPADHYAY PHP DEVELOPER SOFTWARE
        // THIS IS ENTERED TEXT';
        var updatedString = this.editclausetext;
        var newText = updatedString.split('<div><br></div>').join(' #space ');
        var newText = newText.split('<div>').join(' #space ');
        var newText = newText.split('</div>').join(' #space ');
        var newText = newText.split('<br>').join(' #space ');
        this.editclausetext = newText.replace(/<[^>]*>/g, '');

        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.editClauseTermOfMainClauseCategoryID;
        var clauseTermsId = this.editClauseTermOfMainClauseID;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        // var termsName = this.editclausetext;
        var termsName = newText;

        const req =
        {

            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            tradingId: tradingId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };


        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true) {
                        this.haveUpdatedTermsDetails = 1;
                        this.validateSubmitButton();
                        this._fuseSidebarService.getSidebar('editPanel').toggleOpen();
                        this.editclausetext = '';
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) { }
    }

    // View Clause Terms Of Main Clause
    viewClauseCategoryTermsOfMainClause(key, clauseTermsID, ClauseID) {
        this.editClauseTermOfMainClauseID = clauseTermsID;
        this.editClauseTermOfMainClauseCategoryID = ClauseID;

        var filterCondition = {};
        filterCondition["clauseTermsID"] = clauseTermsID;
        filterCondition["drawId"] = this.drawId;
        filterCondition["tradingId"] = this.tradingId;
        filterCondition["formID"] = this.formId;
        filterCondition["companyId"] = this.companyId;
        filterCondition["ClauseID"] = ClauseID;
        try {
            this._userService.viewClauseTermUpdateRecordsOfMainClause(filterCondition).pipe(first()).subscribe((res) => {
                this.viewClauseTermOfMainClauseResponse = res;
                if (this.viewClauseTermOfMainClauseResponse.success == true) {
                    this.viewClauseTermOfMainClauseResponseData = this.viewClauseTermOfMainClauseResponse.data;
                    this.dataSource = new MatTableDataSource(this.viewClauseTermOfMainClauseResponseData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) { }
    }

    // Edit Custom Clause Terms
    editCustomClauseCategoryTermsOfMainClause(key, clauseTermsID, ClauseID) {
        this.editCustomClauseTermOfMainClauseID = clauseTermsID;
        this.editCustomClauseTermOfMainClauseCategoryID = ClauseID;

        var filterCondition = {};
        filterCondition["id"] = clauseTermsID;
        try {
            this._userService.getCustomClauseTermDataForUpdate(filterCondition).pipe(first()).subscribe((res) => {
                this.editCustomClauseTermOfMainClauseResponse = res;
                if (this.editCustomClauseTermOfMainClauseResponse.success == true) {
                    this.editCustomClauseTermOfMainClauseResponseData = this.editCustomClauseTermOfMainClauseResponse.data;


                    for (let index = 0; index < this.editCustomClauseTermOfMainClauseResponseData.length; index++) {

                        this.editCustomClauseTermDataInput = this.editCustomClauseTermOfMainClauseResponseData[index]['termsName'];
                    }

                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) { }
    }

    changeExpandValue(id) {
        this.step = id;
    }

    // Custom Clause Term Update Of Main Clause
    updateCustomClauseTermOfMainClause() {
        var mainUserId = localStorage.getItem('userId');
        var companyId = localStorage.getItem('companyId');
        var drawId = this.drawId;
        var tradingId = this.tradingId;
        var formId = this.formId;
        var clauseCategoryId = this.editCustomClauseTermOfMainClauseCategoryID;
        var parentId = this.editCustomClauseTermOfMainClauseID;
        var nos = '1';
        var termsNameOrginal = this.tmpeditclausetext;
        var termsName = this.editCustomClauseTermDataInput;

        const req =
        {

            mainUserId: mainUserId,
            companyId: companyId,
            drawId: drawId,
            formId: formId,
            clauseCategoryId: clauseCategoryId,
            parentId: this.editCustomClauseTermOfMainClauseID,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            isCustom: 'Y'
        };

        if (this.isTrading == '1') {
            const req =
            {
                mainUserId: mainUserId,
                companyId: companyId,
                tradingId: tradingId,
                formId: formId,
                clauseCategoryId: clauseCategoryId,
                parentId: this.editCustomClauseTermOfMainClauseID,
                nos: nos,
                termsNameOrginal: termsNameOrginal,
                termsName: termsName,
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                isCustom: 'Y'
            };
        }

        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/customClauseDetailsInsert`, req, headerOptions).subscribe(
                res => {
                    this.termsUpdateRes = res;
                    if (this.termsUpdateRes.success === true) {
                        this.haveUpdatedTermsDetails = 1;
                        this.validateSubmitButton();
                        this._fuseSidebarService.getSidebar('editCustomClauseTerm').toggleOpen();
                        this.editCustomClauseTermDataInput = '';
                        this.termsReviewRecords();
                    }
                }
            );
        } catch (err) { }
    }

    // View Custom Clause Terms Updates
    viewCustomClauseCategoryTermsUpdateOfMainClause(key, clauseTermsID, ClauseID) {
        var filterCondition = {};
        filterCondition["parentId"] = clauseTermsID;
        try {
            this._userService.viewCustomClauseTermUpdateRecordsOfMainClause(filterCondition).pipe(first()).subscribe((res) => {
                this.viewClauseTermOfMainClauseResponse = res;
                if (this.viewClauseTermOfMainClauseResponse.success == true) {
                    this.viewClauseTermOfMainClauseResponseData = this.viewClauseTermOfMainClauseResponse.data;
                    this.dataSource = new MatTableDataSource(this.viewClauseTermOfMainClauseResponseData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this._fuseSidebarService.getSidebar(key).toggleOpen();
                }
            });
        } catch (err) { }
    }
}