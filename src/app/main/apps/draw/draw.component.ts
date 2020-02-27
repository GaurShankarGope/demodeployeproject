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
    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
    brokerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpDateInfo : string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    companyId: string;
    identifier : string;
    newAction : string;
    drawStatusInfoCharterer : string;
    drawStatusInfoOwner : string;
}

export interface PeriodicElement
{
    
    id:String;
    identifier : string;
    CPTypeId:String;
    formId: string;
    vesselId: string;
    ownerId: string;
    brokerId: string;
    chartererId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpDateInfo : string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    companyId: string;

    CharterPartyFormName:String;
    charterPartyTypeName: string;
    chartererName: string;
    ownerName: string;
    vesselName: string;
    charterBrokerName: string;
    ownerBrokerName: string;

    newAction : string;
    drawStatusInfoCharterer : string;
    drawStatusInfoOwner : string;
}

@Component(
{
    selector: 'app-draw',
    templateUrl: './draw.component.html',
    styleUrls: ['./draw.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class DrawComponent implements OnInit
{

    current_date = moment(new Date()).format("YYYY-MM-DD");
    
    displayedColumns: string[] = ['identifier','cpDateInfo','companyName','ownerName','brokerName',
                                'chartererName','vesselName', 'progress','statusInfo'
                                ,'newAction'];

    dataSource = new MatTableDataSource<PeriodicElement>();
    dataSourceFilter = new MatTableDataSource<PeriodicElement>();

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    applyFilter(filterValue: string)
    {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterExecuted(filterValue: string)
    {
        this.dataSourceFilter.filter = filterValue.trim().toLowerCase();
    }


    id: string;
    identifier : string;
    
    drawId : string;
    chartererId: string;

    drawStatusInfoCharterer : string;
    drawStatusInfoOwner : string;

    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
    brokerId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
    cpDateInfo : string;
    cpTime: string;
    cpCity: string;
    cpSubject: string;
    cpLiftDate: string;
    cpLiftTime: string;
    cpLiftCity: string;
    companyId: string;

    alertMessage : string;

    CPTypeIdSearch: string;
    formIdSearch: string;
    vesselIdSearch: string;
    ownerIdSearch: string;
    chartererIdSearch: string;
    cpDateSearch: string;
    drawCPIDSearch: string;

    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    drawManagement: any;
    drawManagementRes: any;
    drawManagementData= [];


    drawManagementResFilter: any;
    drawManagementFilterData= [];

    cols: any[];
    drawRecordsListRes: any;
    drawRecordsListData: any;

    DrawManagementSearchForm: FormGroup;
    DrawManagementSearchFormDocument: FormGroup;

    DrawManagementForm: FormGroup;
    DrawManagementFormForDocumentUser: FormGroup;

    loading = false;
    submitted = false;
    createtypeRes :any;
    returnUrl: string;
    cpFormId:String;
    clauseTerms :any;
    clauseTermsRes: any;
    clauseTermsData: any;

    drawCPDataList: any;
    drawCPDataData: any;

    cpFormList: any;
    cpFormData: any;

    VesselList: any;
    VesselData: any;


    CharterPartyTypeList: any;
    CharterPartyTypeData: any;

    ChartereInfoList: any;
    ChartereInfoData=[];

    termsUpdateRes : any;

    termsReviewRecordsResponse : any;
    termsReviewRecordsData = [];

    clauseCategoryTermsResponse : any;
    clauseCategoryTermsData = [];

    companyRecordResponse : any;
    companyRecordData = [];

    clauseCategoryTermsReviewResponse : any;
    clauseCategoryTermsReviewData = [];

    ownerRecordResponse : any;
    ownerRecordData = [];

    brokerRecordResponse : any;
    brokerRecordData = [];

    chartererRecordResponse : any;
    chartererRecordData = [];

    CharterPartyTypeArray = [];

    charterPartyTypeID : string;

    formIdValueForDrawRecords;
    vesselIdValueForDrawRecords;
    cpDateValueForDrawRecords;
    chartererIdValueForDrawRecords;
    ownerIdValueForDrawRecords;
    drawCPIDForDrawRecords;

    show = false;

    brokerDivShow = true;

    chartererDivShow : any;

    existingDrawCP = true;
    existingDrawCPButton = false;

    mainDrawCPDiv = false;

    drawRecordsFilterShow = true;
    drawRecordsFilterForDocumentShow = true;
    drawRecordsTableShow = false;
    drawRecordsTableShowButton = false;

    standardOffersFormDivShow = false;
    standardOffersFormTableShow = false;

    clauseViewButtonShow = false;

    drawFormDivShow = false;
    drawFormDivShowForDocumentUser = false;

    drawCharteAcceptRejectResponse : any;
    drawCharteAcceptRejectResponseData = [];

    activeModalStatus = false;
    inActiveModalStatus = false;

    dataID : string;
    statusAction : string;

    updateDataReqeust : any;

    buttonInfo : any;

    isViewable = false;

    isEditView = false;
    isRecapView = false;
    isPdfView = false;

    isCompanyTableView = false;
    isBrokerTableView = false;

    acceptRejectTitle : any;    
    chartererUpdateID : any;

    isBrokerLogin : any;
    isChartererLogin : any;
    isOwnerLogin : any;


    isCompleteCP : any;

    brokerName : any;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    
    // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    // @ViewChild(MatSort, { static: true }) sort: MatSort;

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
        this.dataSource = new MatTableDataSource(this.drawManagementData);
        this.dataSourceFilter = new MatTableDataSource(this.drawManagementData);
    }

    ngOnInit()
    {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSourceFilter.paginator = this.paginator;
        this.dataSourceFilter.sort = this.sort;

        this.brokerName = localStorage.getItem('userName');

        this.brokerName = (this.brokerName != '' && this.brokerName != null && this.brokerName != undefined)
                ? this.brokerName : 'Broker';

        this.DrawManagementForm = this._formBuilder.group(
        {
            formId: ['', Validators.required],
            vesselId: ['', Validators.required],
            cpDate: ['', Validators.required],
            chartererId: ['', Validators.required],
        
        });

        this.DrawManagementFormForDocumentUser = this._formBuilder.group(
        {
            companyIdDocForm: ['', Validators.required],
            ownerIdDocForm: ['', Validators.required],
            brokerIdDocForm: ['', Validators.required],
            chartererIdDocForm: ['', Validators.required],
            formIdDocForm: ['', Validators.required],
            vesselIdDocForm: ['', Validators.required],
            cpDateDocForm: ['', Validators.required],
        });

        this.DrawManagementSearchForm = this._formBuilder.group(
            {
                formIdSearch: ['', ''],
                vesselIdSearch: ['', ''],
                cpDateSearch: ['', ''],
                drawCPIDSearch: ['', ''],
                chartererIdSearch :['', ''],
                ownerIdSearch :['', ''],
            });

        this.DrawManagementSearchFormDocument = this._formBuilder.group(
        {
            companyIdDocSearch: ['', ''],
            ownerIdDocSearch: ['', ''],
            brokerIdDocSearch: ['', ''],
            chartererIdDocSearch: ['', ''],
            formIdDocSearch: ['', ''],
            vesselIdDocSearch: ['', ''],
            cpDateDocSearch: ['', ''],
            drawCPIDDocSearch: ['', ''],
        });

        this.isBrokerLogin = 'N';
        this.isChartererLogin = 'N';
        this.isOwnerLogin = 'N';

        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            this.isBrokerLogin = 'Y';
            this.isEditView = true;    
            this.isRecapView = true;
            this.isPdfView = true;
            this.fetchChartererData();
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            this.isChartererLogin = 'Y';
            this.acceptRejectTitle = 'Bid Accept / Reject';
            this.isRecapView = true;
            this.isPdfView = true;
            this.fetchChartererData();
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            this.isOwnerLogin = 'Y';
            this.isEditView = false;
            this.acceptRejectTitle = 'Offer Accept / Reject';
            this.isRecapView = true;
            this.fetchChartererData();
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '7')
        {
            this.isEditView = true;    
            this.isRecapView = true;

            this.isCompanyTableView = true;
            this.isBrokerTableView = true;
        }

        this.isCompanyTableView = false;
        this.isBrokerTableView = true;

        this.CPTypeId = '1';

        this.chartererDivShow = 'N';
        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            this.chartererDivShow = 'Y';
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSourceFilter.paginator = this.paginator;
            this.dataSourceFilter.sort = this.sort;

            this.drawManagementRecordsCharterer();
            
        } else {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSourceFilter.paginator = this.paginator;
            this.dataSourceFilter.sort = this.sort;

            this.drawManagementRecords();
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            this.buttonInfo = 'View / Update Clause';
        } else {
            this.buttonInfo = 'View Recap';
        }

        console.log(this.chartererDivShow);

        this.cpFormsRecords();
        this.vesselRecords();
        this.CPRecords();
        this.ChartereRecords();
        this.companyRecordsServerSide();
        
        this.charterPartyTypeID = '2';

        if(localStorage.getItem('userRoleId') != '3')
        {
            this.brokerDivShow = false;
        }

        if(localStorage.getItem('userRoleId') == '7')
        {
            this.brokerDivShow = true;
        }

        this.drawRecordsFilterShow = false;
        this.drawRecordsFilterForDocumentShow = false;

        this.drawCPRecords();
        this.fetchOwnerData();

    }


    resetexecutedForm(){
        // this.dataSourceFilter = null;
        this.drawRecordsTableShow = false;
        this.DrawManagementSearchForm.reset();
        this.DrawManagementSearchFormDocument.reset();
    }
     // Update Charterer If He/She Reject Broker Request
     updateChartererAndSendRequest(event,drawId): void
     {
         this.chartererUpdateID = event.value;
 
         var updateData = {};
             updateData['chartererId'] = this.chartererUpdateID;
             updateData['drawId'] = drawId;
             updateData['createdBy'] = localStorage.getItem('userId');
             updateData['updatedBy'] = localStorage.getItem('userId');
             updateData['email'] = '';
 
         for(let index = 0; index < this.ChartereInfoData.length; index++)
         {
             if(this.chartererUpdateID == this.ChartereInfoData[index].id)
             {
                 updateData['email'] = this.ChartereInfoData[index].email;
             }
         }
         console.log(updateData);
         try
         {
             this._userService.updateChartererToDraw(updateData).pipe(first()).subscribe((res) =>
             {
                 this.drawManagementRecords();
             }, err => { console.log(err); });
         } catch (err)
         { console.log(err); }
     }

    // Company Records Server Side
    companyRecordsServerSide(): void
    {
        var filter = {};
        this._userService.companyRecordsServerSide(filter).pipe(first())
        .subscribe(res =>
        {
            this.companyRecordResponse = res;
            if (this.companyRecordResponse.success === true)
            {
                this.companyRecordData = this.companyRecordResponse.data;
            }   
        }); 
    }

    // Company On Change
    onChangeCompany(event)
    {
        this.companyId = event.value;
        this.fetchOwnerData();
        this.fetchBrokerData();
        this.fetchChartererData();
        // this.fetchOwnerData();
    }

    // Fetch Owner Data
    fetchOwnerData()
    {
        var filter = {};
            filter['companyId'] = this.companyId;
            filter['userRoleId'] = '6';
        try
        {
            this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) =>
            {
                this.ownerRecordResponse = res;
                if (this.ownerRecordResponse.success === true)
                {
                    this.ownerRecordData = this.ownerRecordResponse.data;
                }
            }, err => { console.log(err); });
        } catch (err)
        { console.log(err); }
    }

    // Owner On Change
    onChangeOwner(event)
    {
        this.ownerId = event.value;
        // this.fetchBrokerData();
    }

    // Fetch Broker Data
    fetchBrokerData()
    {
        var filter = {};
            filter['companyId'] = this.companyId;
            filter['userRoleId'] = '3';
        try
        {
            this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) =>
            {
                this.brokerRecordResponse = res;
                if (this.brokerRecordResponse.success === true)
                {
                    this.brokerRecordData = this.brokerRecordResponse.data;
                }
            }, err => { console.log(err); });
        } catch (err)
        { console.log(err); }
    }

    // Broker On Change
    onChangeBroker(event)
    {
        this.brokerId = event.value;
        // this.fetchChartererData();
    }

    // Fetch Charterer Data
    fetchChartererData()
    {
        if(JSON.parse(localStorage.getItem('userRoleId')) != '7')
        {
            this.companyId = JSON.parse(localStorage.getItem('companyId'));
        }
        var filter = {};
            filter['companyId'] = this.companyId;
            filter['userRoleId'] = '4';
        try
        {
            this._userService.userRecordsServerSide(filter).pipe(first()).subscribe((res) =>
            {
                this.chartererRecordResponse = res;
                if (this.chartererRecordResponse.success === true)
                {
                    this.chartererRecordData = this.chartererRecordResponse.data;
                }
            }, err => { console.log(err); });
        } catch (err)
        { console.log(err); }
    }

    // Existing Draw Records Server Side
    drawManagementRecords(): void
    {
        this.drawManagementData = [];
        var arrfilterInfo = {};
       
        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            arrfilterInfo["dcm.brokerId"] = localStorage.getItem('userId');
            // arrfilterInfo["dcm.is_submitted"] = '1';
            
            // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');
        }
         if(JSON.parse(localStorage.getItem('userRoleId')) == '5')
        {
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            // arrfilterInfo["dcm.is_submitted"] = '1';
            
            // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
            // arrfilterInfo["dcm.is_submitted"] = '1';
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
            // arrfilterInfo["dcm.is_submitted"] = '1';
        }
        try
        {
            console.log(arrfilterInfo);
            this._userService.drawRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
                this.drawManagementRes = res;
                if (this.drawManagementRes.success === true)
                {
                    this.isRecapView =true;
                    this.drawManagementData = this.drawManagementRes.data;
                    this.dataSource = new MatTableDataSource(this.drawManagementRes.data);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err){}
    }

    recapView(drawId,formId,chartererId)
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            drawId: drawId,
            formId : formId,
            chartererId : chartererId,
            isTrading : '2',
        };
        console.log(reqData,"Recap View");
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        this.router.navigate(['/apps/recap-management']);
    }

    clauseCategoryDummyData() : void
    {
        for (let index = 1; index < 200; index++)
        {
            const req = {
    
                name: 'Clause Category '+index,
                cpFormId:'3',
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                
            };
    
            this.loading = true;
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions = {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/clusesCategorycreate`, req, headerOptions).subscribe(
                    res => {
                        console.log(res);
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true) {
                            this.alertService.success(this.createtypeRes.message, 'Success');
                        } else {
                            this.alertService.error(this.createtypeRes.message, 'Error');
                        }
                    },
                    err => {
                        this.alertService.error(err, 'Error');
                        console.log(err);
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }
        
    }

    setDrawID(drawID,formId,chartererId) : void
    {
        this.drawId = drawID;
        this.formId = formId;
        this.chartererId = chartererId;
        localStorage.setItem('charter_id',chartererId);
        this.existingDrawCPButton = true;
    }

    setDrawIDExecuted(drawID,formId,chartererId) : void
    {
        this.drawId = drawID;
        this.formId = formId;
        this.chartererId = chartererId;
        console.log(this.chartererId);
        this.drawRecordsTableShowButton = true;
    }

    editView(drawId,formId,chartererId) : void
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            drawId: drawId,
            formId : formId,
            chartererId : chartererId,
            isTrading : '2',
        };
        console.log(reqData);
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        this.router.navigate(['/apps/drawCp-Clauses-management']);
    }

    getTermsReviewData() : void
    {
        const reqData =
        {
            mainUserId: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
            drawId: this.drawId,
            formId : this.formId,
            chartererId : this.chartererId,
            isTrading : '2',
        };
        console.log(reqData);
        localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
        // this.router.navigate(['/apps/drawCp-Clauses-management']);
        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            this.router.navigate(['/apps/drawCp-Clauses-management']);
        } else {
            this.router.navigate(['/apps/recap-management']);
        }
        
    }
    
    claueseDetailInsertUpdate() : void
    {   
       // console.log("HERE IN TERMS INSERT UPDATE");
        
        var mainUserId = localStorage.getItem('userId');
       // console.log(mainUserId +" Main User ID");

        var companyId = localStorage.getItem('companyId');
       // console.log(companyId + " Company ID");

        var drawId = '48';
       // console.log(drawId + " Draw ID");

        var formId = '1';
       // console.log(formId + " CP Form ID");

        var clauseCategoryId = '1';
       // console.log(clauseCategoryId + " Clause Category ID");

        var clauseTermsId = '1';
       // console.log(clauseTermsId + " Clause Terms ID");

        var nos = '1';
       // console.log(nos + " Nos");

        var termsNameOrginal = 'Clause Terms 1';
       // console.log(termsNameOrginal + " Terms Orginal Name");

        var termsName = 'Clause Terms 1 2 Custom';
       // console.log(termsName + " Terms Name");

        const req =
        {
            mainUserId:mainUserId,
            companyId:companyId,
            drawId: drawId,
            formId:formId,
            clauseCategoryId: clauseCategoryId,
            clauseTermsId: clauseTermsId,
            nos: nos,
            termsNameOrginal: termsNameOrginal,
            termsName: termsName,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
        };
        
        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }

            // Post URL For Insert Update Without Custom = claueseDetailInsertUpdate
            // Post URL For Insert Update With Custom = claueseDetailCustomInsertUpdate

            this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`, req, headerOptions).subscribe(
                res =>
                {
                    this.termsUpdateRes = res;
                   console.log("HERE OUT RESPONSE");
                   console.log(this.termsUpdateRes);
                    if (this.termsUpdateRes.success === true)
                    {
                       // console.log("HERE IN RESPONSE");
                       // console.log(this.termsUpdateRes);
                    }
                }
            );
        } catch (err)
        {
        } 
    }



    drawCPFormView() : void
    {
        this.brokerDivShow = false;
        this.existingDrawCP = false;
        this.existingDrawCPButton = false;
        this.mainDrawCPDiv = true;
    }

    existingDrawCPView() : void
    {
        this.brokerDivShow = true;
        this.existingDrawCP = true;
        this.mainDrawCPDiv = false;
        this.mainDrawCPDiv = false;
        this.drawRecordsFilterShow = false;
        this.drawRecordsFilterForDocumentShow = false;
        this.drawRecordsTableShow = false;
        this.drawRecordsTableShowButton = false;
        this.standardOffersFormDivShow = false;
        this.standardOffersFormTableShow = false;
        this.drawFormDivShow = false;
        this.drawFormDivShowForDocumentUser = false;

        this.drawManagementRecords();
    }

    


    drawIdServerSide() : void
    {
        this.drawManagementData = [];

        var arrfilterInfo = {};

        var isCondition = 0;

        if(this.formIdValueForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.formId"] = this.formIdValueForDrawRecords;
        }
        if(this.vesselIdValueForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.vesselId"] = this.vesselIdValueForDrawRecords;
        }
        if(this.cpDateValueForDrawRecords != '')
        {
            isCondition = 1;
            arrfilterInfo["dcm.cpDate"] = this.cpDateValueForDrawRecords;
        }
        if(this.drawCPIDForDrawRecords > 0)
        {
            isCondition = 1;
            arrfilterInfo["dcm.chartererBrokerId"] = this.chartererIdValueForDrawRecords;
        }

        arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');

        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            arrfilterInfo["dcm.brokerId"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            // arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
        }

        
        try
        {
            this._userService.drawRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
                this.drawManagementResFilter = res;
                this.drawFormDivShow = false;
                this.drawFormDivShowForDocumentUser = false;
                this.drawRecordsTableShow = true;
                this.drawManagementData = this.drawManagementResFilter.data;
                this.dataSourceFilter = new MatTableDataSource(this.drawManagementResFilter.data);
                this.dataSourceFilter.paginator = this.paginator;
                this.dataSourceFilter.sort = this.sort;
                if (this.drawManagementResFilter.success === true)
                {
                   
                    localStorage.setItem('drawId',this.drawManagementResFilter.data[0].id);
                }
                this.show = true;
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err)
        {
        }
    }


    drawRecordsServerSide() : void
    {
        this.drawManagementData = [];

        var arrfilterInfo = {};

        if(this.formIdValueForDrawRecords > 0)
        {
            arrfilterInfo["dcm.formId"] = this.formIdValueForDrawRecords;
        }
        if(this.vesselIdValueForDrawRecords > 0)
        {
            arrfilterInfo["dcm.vesselId"] = this.vesselIdValueForDrawRecords;
        }
        if(this.cpDateValueForDrawRecords != '')
        {
            arrfilterInfo["dcm.cpDate"] = this.cpDateValueForDrawRecords;
        }
        if(this.drawCPIDForDrawRecords > 0)
        {
            arrfilterInfo["dcm.id"] = this.drawCPIDForDrawRecords;
        }

        if(this.chartererIdValueForDrawRecords > 0)
        {
            arrfilterInfo["dcm.chartererId"] = this.chartererIdValueForDrawRecords;
        }

        if(this.ownerIdValueForDrawRecords > 0)
        {
            arrfilterInfo["dcm.ownerId"] = this.ownerIdValueForDrawRecords;
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
        {
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            arrfilterInfo["dcm.brokerId"] = localStorage.getItem('userId');
        }
        if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
        {
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
        {
            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
        }

        if(JSON.parse(localStorage.getItem('userRoleId')) == '7')
        {
            if(this.companyId != '' && this.companyId != null)
            {
                arrfilterInfo["dcm.companyId"] = (this.companyId != '' && this.companyId != null) ? this.companyId : null;
            }
            if(this.ownerId != '' && this.ownerId != null)
            {
                arrfilterInfo["dcm.ownerId"] = (this.ownerId != '' && this.ownerId != null) ? this.ownerId : null;
            }
            if(this.brokerId != '' && this.brokerId != null)
            {
                arrfilterInfo["dcm.brokerId"] = (this.brokerId != '' && this.brokerId != null) ? this.brokerId : null;
            }
            if(this.chartererId != '' && this.chartererId != null)
            {
                arrfilterInfo["dcm.chartererId"] = (this.chartererId != '' && this.chartererId != null) ? this.chartererId : null;
            }
            
            // arrfilterInfo["dcm.ownerId"] = (this.ownerId != '' && this.ownerId != null) ? this.ownerId : null;
            // arrfilterInfo["dcm.brokerId"] = (this.brokerId != '' && this.brokerId != null) ? this.brokerId : null;
            // arrfilterInfo["dcm.chartererId"] = (this.chartererId != '' && this.chartererId != null) ? this.chartererId : null;
        }

        arrfilterInfo["dcm.progress"] = 100;

        // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');

        console.log(arrfilterInfo);
        
        try
        {
            this._userService.drawRecordsServerSide(arrfilterInfo).pipe(first()).subscribe((res) =>
            {
            
                this.drawManagementResFilter = res;
                this.drawFormDivShow = false;
                this.drawFormDivShowForDocumentUser = false;
                this.drawRecordsTableShow = true;
                this.drawManagementData = this.drawManagementResFilter.data;

                setTimeout(() => {
                    this.updateFilterPaginator();
                }, 100);

                if (this.drawManagementResFilter.success === true)
                {
                   
                }
                this.show = true;
            },
            err =>
            {
                this.alertService.error(err, 'Error');
            });
        } catch (err)
        {
        }
    }


    createNew(data){
    
    

        const req ={
            // drawStatusInfoCharterer: data.drawStatusInfoCharterer,
            // drawStatusInfoOwner:data.drawStatusInfoOwner,
            // isChartererAccepted: data.isChartererAccepted,
            // CPTypeId:data.CPTypeId,
            // progress: 10,
            // status: 0,
            // formId:data.formId,
            // vesselId: data.vesselId,
            // ownerId: data.ownerId,
            // brokerId:localStorage.getItem('userId') ,
            // chartererId: data.chartererId,
            // chartererBrokerId: data.chartererBrokerId,
            // ownerBrokerId: data.ownerBrokerId,
            // cpDate: data.cpDate,
            // cpTime: data.cpTime,
            // cpCity:data.cpCity,
            // cpSubject: data.cpSubject,
            // cpLiftDate: data.cpLiftDate,
            // cpLiftTime: data.cpLiftTime,
            // cpLiftCity: data.cpLiftCity,
            // companyId: data.companyId,
            // cpDateInfo: data.cpDateInfo,
            // isAccepted: data.isAccepted,
            // createdBy: localStorage.getItem('userId'),
            // updatedBy: localStorage.getItem('userId'),
            // broker_clauses:data.broker_clauses,
            // owner_clauses: data.owner_clauses,
            // charterer_clauses: data.charterer_clauses,
            // common_clauses:data.common_clauses,
            // custom_common_clause: data.custom_common_clause,
            // custom_term_clause:data.custom_term_clause,
            // checked_clauses:data.checked_clauses

    CPTypeId:data.CPTypeId,
    progress: 10,
    status:data.status,
    statusInfo: data.statusInfo,

    formId:data.formId,
    vesselId: data.vesselId,
    ownerId: data.ownerId,
    chartererId: data.chartererId,
    chartererBrokerId:data.chartererBrokerId,
    ownerBrokerId: data.ownerBrokerId,
    cpDate:data.cpDate,
    cpTime: data.cpTime,
    brokerId:localStorage.getItem('userId'),
    cpCity: data.cpCity,
    cpSubject:data.cpSubject,
    cpLiftDate: data.cpLiftDate,
    cpLiftTime:data.cpLiftTime,
    cpLiftCity:data.cpLiftCity,
    companyId:data.companyId,
    isAccepted:data.isAccepted,
    createdBy:data.createdBy,
    updatedBy: data.updatedBy,
    broker_clauses: data.broker_clauses,
    owner_clauses:data.owner_clauses,
    charterer_clauses:data.charterer_clauses,
    common_clauses:data.common_clauses,
    custom_common_clause:data.custom_common_clause,
    custom_term_clause:data.custom_term_clause,
    checked_clauses:data.checked_clauses
        }
        console.log(data,"data");
        console.log(req,"req");

        try
        {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.http.post(`${config.baseUrl}/DrawFormCopyCreate`, req, headerOptions).subscribe(
                res =>
                {
                    this.createtypeRes = res;
                    if (this.createtypeRes.success === true)
                    {
                     this.drawManagementRecords();
                      
                       this.mainDrawCPDiv =false;
                     
                       this.drawRecordsTableShow =false;
                     this.brokerDivShow =true;
                     this.drawRecordsFilterShow =false
                     this.existingDrawCP =true;
                        this.alertService.success(this.createtypeRes.message, 'Success');
                        this.DrawManagementForm.reset();
                       
                        
                        
                       
                        this.router.navigate(['/apps/draw-management']);

                        // this.drawRecordsServerSide();
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


    updateFilterPaginator()
    {
        this.dataSourceFilter = new MatTableDataSource(this.drawManagementResFilter.data);
        this.dataSourceFilter.paginator = this.paginator;
        this.dataSourceFilter.sort = this.sort;

    }

    editdrawManagementData(data): void
    {
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
                        this.alertService.error(err.message, 'Error');
                    }
                );
        } catch (err)
        {
        }
    }

    selected = new FormControl('valid', [
        Validators.required,
        Validators.pattern('valid'),
      ]);
    
      selectFormControl = new FormControl('valid', [
        Validators.required,
        Validators.pattern('valid'),
      ]);
    
      nativeSelectFormControl = new FormControl('valid', [
        Validators.required,
        Validators.pattern('valid'),
      ]);
    
    //   matcher = new MyErrorStateMatcher();

    get f() { return this.DrawManagementForm.controls; }
    get fDoc() { return this.DrawManagementFormForDocumentUser.controls; }
    get fSearch() { return this.DrawManagementSearchForm.controls; }

    // Draw CP Form Records Fetch Start
    
        drawCPRecords(): void
        {
            var arrfilterInfo = {};

            arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
            if(JSON.parse(localStorage.getItem('userRoleId')) == '3')
            {
                arrfilterInfo["dcm.brokerId"] = localStorage.getItem('userId');
            }
            if(JSON.parse(localStorage.getItem('userRoleId')) == '4')
            {
                arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
            }
            if(JSON.parse(localStorage.getItem('userRoleId')) == '6')
            {
                // arrfilterInfo["dcm.ownerId"] = localStorage.getItem('userId');
            }
            // arrfilterInfo["dcm.createdBy"] = localStorage.getItem('userId');
            try
            {
                this._userService.drawRecordsServerSide(arrfilterInfo)
                    .pipe(first())
                    .subscribe((res) =>
                    {
                        this.drawManagementRes = res;
                        if (this.drawManagementRes.success === true)
                        {
                            this.drawCPDataData = this.drawManagementRes.data;
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

        changeDrawCP(event): void
        {
            this.formId = event.value;
        }

    // Draw CP Form Records Fetch End

    // CP Records Fetch Start
    
    cpFormsRecords(): void
    {
        try
        {
            this.http.get(`${config.baseUrl}/cpFromlist`).subscribe(
                res =>
                {
                    this.cpFormList = res;
                    if (this.cpFormList.success)
                    {
                        this.cpFormData = this.cpFormList.data;
                    }
                },
                err =>
                {
                }
            );
        } catch (err)
        {
        }
    }

    changeCPForm(event): void
    {
        this.formId = event.value;
    }

    changeCompnayId(event): void
    {
        this.companyId = event.value;
    }
    changeCPFormSearch(event): void
    {
        this.formId = event.value;
    }

// CP Form Records Fetch End

    // Vessel Records Fetch Start

        vesselRecords(): void
        {
            try
            {
                this.http.get(`${config.baseUrl}/vessellist`).subscribe(
                    res =>
                    {
                        this.VesselList = res;
                        if (this.VesselList.success)
                        {
                            this.VesselData = this.VesselList.data;
                        }
                    },
                    err => {
                    }
                );
            } catch (err)
            {
            }
        }

        changeVesselEvent(event): void
        {
            this.vesselId = event.value;
            for (let index = 0; index < this.VesselData.length; index++)
            {   
                if (this.VesselData[index].id == this.vesselId)
                {
                    this.ownerId = this.VesselData[index].id_owner;
                }
            }
        }

    // Vessel Records Fetch End

    // Charter Party Type Records Fetch Start

        CPRecords(): void
        {
            try
            {
                this.http.get(`${config.baseUrl}/charterpartylist`).subscribe(
                    res =>
                    {
                        this.CharterPartyTypeList = res;
                        if (this.CharterPartyTypeList.success)
                        {
                            this.CharterPartyTypeData = this.CharterPartyTypeList.data;
                        }

                        this.CharterPartyTypeList = res;
                        if (this.CharterPartyTypeList.success)
                        {
                            this.CharterPartyTypeList.data.forEach(valueData  => 
                            {
                                if(valueData.id != 3)
                                {
                                    this.CharterPartyTypeArray.push(valueData);
                                }
                            });
                            
                        }

                        setTimeout(() => { this.CharterPartyTypeArray = this.CharterPartyTypeArray }, 1000);

                    },
                    err =>
                    {
                    }
                );
            } catch (err)
            {
            }
        }

        changeCharterPartyType(event): void
        {
            this.chartererId = event.target.value;
        }

    // Charter Party Type Records Fetch End

    // Charter Party Type Records Fetch Start

        ChartereRecords(): void
        {
            try
            {
                this.http.get(`${config.baseUrl}/userList`).subscribe(
                    res =>
                    {
                        this.ChartereInfoList = res;
                        if (this.ChartereInfoList.success)
                        {
                            this.ChartereInfoList.data.forEach(valueData  => 
                            {
                                if(valueData.userRoleId === 4)
                                {
                                    this.ChartereInfoData.push(valueData);
                                }
                            });
                            
                        }
                    },
                    err =>
                    {
                    }
                );
            } catch (err)
            {
            }
        }

        changeChartererType(event): void
        {
            this.chartererId = event.value;
        }

    // Charter Party Type Records Fetch End

    // Set Applicable Charter Party Type Start

        setApplicabelCharterParty(Type): void
        {
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
                chartererIdSearch :['', ''],
                ownerIdSearch :['', ''],
            });

            // this.DrawManagementSearchForm.reset(); 
            // this.DrawManagementForm.reset(); 

            this.drawRecordsFilterShow = false;
            this.drawRecordsFilterForDocumentShow= false;
            this.drawRecordsTableShow = false;
            this.drawRecordsTableShowButton = false;
            this.drawFormDivShow = false;
            this.drawFormDivShowForDocumentUser = false;
            this.CPTypeId = Type;
            if(Type == 1)
            {
                if(JSON.parse(localStorage.getItem('userRoleId')) == '7')
                {
                    this.drawRecordsFilterForDocumentShow = true;
                } else {
                    this.drawRecordsFilterShow = true;
                }
                
            }
            if(Type == 2)
            {
                if(JSON.parse(localStorage.getItem('userRoleId')) == '7')
                {
                    this.drawFormDivShowForDocumentUser = true;
                } else {
                    this.drawFormDivShow = true;
                }
            }
        }

    // Set Applicable Charter Party Type End
 
    onSubmit(): void
    {
        console.log(localStorage.getItem('companyId'));
        this.submitted = true;
        this.alertService.clear();
        if (this.DrawManagementForm.invalid)
        { 
            console.log("invalid form");
            
            return;
        } else {

            var convertedDate = moment(this.f.cpDate.value).format("YYYY-MM-DD");
            this.formIdValueForDrawRecords      =       this.f.formId.value;
            this.vesselIdValueForDrawRecords    =       this.f.vesselId.value,
            this.cpDateValueForDrawRecords      =       convertedDate,
            this.chartererIdValueForDrawRecords =       this.f.chartererId.value;

            const req =
            {
                brokerId:localStorage.getItem('userId'),
                CPTypeId:this.CPTypeId,
                formId:this.formIdValueForDrawRecords,
                vesselId: this.vesselIdValueForDrawRecords,
                ownerId:this.ownerId,
                cpDate: this.cpDateValueForDrawRecords,
                chartererBrokerId: localStorage.getItem('userId'),
                chartererId: this.chartererIdValueForDrawRecords,
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };
            
            localStorage.setItem('cpFormId',req.formId);
            
            this.loading = true;
            try
            {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/DrawFormCreate`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true)
                        {
                            this.drawId = this.createtypeRes.data[0];
                            console.log(this.drawId);

                            this.alertService.success(this.createtypeRes.message, 'Success');
                            // this.DrawManagementForm.reset();
                            this.drawIdServerSide();
                            
                            
                            const reqData =
                            {
                                mainUserId: localStorage.getItem('userId'),
                                companyId: localStorage.getItem('companyId'),
                                drawId: this.drawId,
                                formId : req.formId,
                                chartererId : this.chartererIdValueForDrawRecords,
                                isTrading : '2',
                            };
                            console.log(reqData);
                            localStorage.setItem('clauseFilterData', JSON.stringify(reqData));

                            this.drawNotificationAndMessageSend();

                            this.router.navigate(['/apps/drawCp-Clauses-management']);

                            // this.drawRecordsServerSide();
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

    drawNotificationAndMessageSend()
    {
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions =
        {
            headers: header
        }
        var updateData = {};
        updateData['id'] = this.drawId;
        updateData['statusInfo'] = this.brokerName+' has created Charter Party '+ this.drawId;
        try {
            this._userService.drawDataUpdateCommon(updateData).pipe(first()).subscribe((res) => {

            }, err => { });
        } catch (err) { }
        const req =
        {
            drawId: this.drawId,
            message: this.brokerName+' has created Charter Party '+ this.drawId,
            date:  moment(new Date()).format("YYYY-MM-DD"),
            time:  moment(new Date()).format("H:mm A"),
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        try {this.http.post(`${config.baseUrl}/drawMessageInsert`, req, headerOptions).subscribe(res => {});} catch (err) { }

        const notificationData =
        {
            fromUserId: localStorage.getItem('userId'),
            toUserId: this.chartererIdValueForDrawRecords,
            message: this.brokerName+' has created Charter Party '+ this.drawId,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        try {this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationData, headerOptions).subscribe(res => {});} catch (err) { }

        const notificationDataOwner =
        {
            fromUserId: localStorage.getItem('userId'),
            toUserId: this.ownerId,
            message: this.brokerName+' has created Charter Party '+ this.drawId,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        try {this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationDataOwner, headerOptions).subscribe(res => {});} catch (err) { }
    }

    onSubmitDoc(): void
    {
        this.submitted = true;
        this.alertService.clear();
        if (this.DrawManagementFormForDocumentUser.invalid)
        { 
            return;
        } else {

            var convertedDate = moment(this.fDoc.cpDateDocForm.value).format("YYYY-MM-DD");
            this.formIdValueForDrawRecords      =       this.fDoc.formIdDocForm.value;
            this.vesselIdValueForDrawRecords    =       this.fDoc.vesselIdDocForm.value,
            this.cpDateValueForDrawRecords      =       convertedDate,
            this.chartererIdValueForDrawRecords =       this.fDoc.chartererIdDocForm.value;

            const req =
            {
                companyId:this.companyId,
                ownerId:this.ownerId,
                brokerId:this.brokerId,
                chartererId:this.chartererIdValueForDrawRecords,

                CPTypeId:this.CPTypeId,
                formId:this.formIdValueForDrawRecords,
                vesselId: this.vesselIdValueForDrawRecords,
                cpDate: this.cpDateValueForDrawRecords,
                chartererBrokerId: localStorage.getItem('userId'),
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            };
            
            localStorage.setItem('cpFormId',req.formId);
            
            this.loading = true;
            try
            {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/DrawFormCreate`, req, headerOptions).subscribe(
                    res =>
                    {
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true)
                        {
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
                                formId : req.formId,
                                chartererId : this.chartererIdValueForDrawRecords,
                                isTrading : '2',
                            };
                            console.log(reqData);
                            localStorage.setItem('clauseFilterData', JSON.stringify(reqData));
                            this.drawNotificationAndMessageSend();
                            this.router.navigate(['/apps/drawCp-Clauses-management']);

                            // this.drawRecordsServerSide();
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
    

    fetchDrawRecords(): void
    {
        this.alertService.clear();
        
        var isValid = 1;

        if(isValid == 0)
        {
            return;
        }  else {

            var convertedDate = moment(this.fSearch.cpDateSearch.value).format("YYYY-MM-DD");

            if(this.fSearch.formIdSearch.value)
            {
                this.formIdValueForDrawRecords      =       this.fSearch.formIdSearch.value;
            }
            if(this.fSearch.vesselIdSearch.value)
            {
                this.vesselIdValueForDrawRecords      =       this.fSearch.vesselIdSearch.value;
            }
            if(this.fSearch.cpDateSearch.value)
            {
                this.cpDateValueForDrawRecords      =       convertedDate;
            }
            if(this.fSearch.drawCPIDSearch.value)
            {
                this.drawCPIDForDrawRecords      =       this.fSearch.drawCPIDSearch.value;
            }
            if(this.fSearch.chartererIdSearch.value)
            {
                this.chartererIdValueForDrawRecords      =       this.fSearch.chartererIdSearch.value;
            }
            if(this.fSearch.ownerIdSearch.value)
            {
                this.ownerIdValueForDrawRecords      =       this.fSearch.ownerIdSearch.value;
            }
            this.drawRecordsServerSide();
        }
    }

    fetchDrawRecordsDocument(): void
    {
        this.alertService.clear();
        
        var isValid = 1;

        if(isValid == 0)
        {
            return;
        }  else {

            var convertedDate = moment(this.fSearch.cpDateSearch.value).format("YYYY-MM-DD");

            if(this.fSearch.formIdDocSearch.value)
            {
                this.formIdValueForDrawRecords      =       this.fSearch.formIdDocSearch.value;
            }
            if(this.fSearch.vesselIdDocSearch.value)
            {
                this.vesselIdValueForDrawRecords      =       this.fSearch.vesselIdDocSearch.value;
            }
            if(this.fSearch.cpDateDocSearch.value)
            {
                this.cpDateValueForDrawRecords      =       convertedDate;
            }
            if(this.fSearch.drawCPIDDocSearch.value)
            {
                this.drawCPIDForDrawRecords      =       this.fSearch.drawCPIDDocSearch.value;
            }
            if(this.fSearch.chartererIdDocSearch.value)
            {
                this.chartererIdValueForDrawRecords      =       this.fSearch.chartererIdDocSearch.value;
            }
            this.drawRecordsServerSide();
        }
    }

    drawManagementRecordsCharterer(): void
    {
        this.drawManagementData = [];
        var arrfilterInfo = {};
        arrfilterInfo["dcm.companyId"] = localStorage.getItem('companyId');
        arrfilterInfo["dcm.chartererId"] = localStorage.getItem('userId');
        // arrfilterInfo["dcm.is_submitted"] = '1';
        // arrfilterInfo["ds.chartererId"] = localStorage.getItem('userId');
        try
        {
            this._userService.drawRecordsServerSide(arrfilterInfo)
                .pipe(first())
                .subscribe((res) =>
                {
                    this.drawManagementRes = res;
                    if (this.drawManagementRes.success === true)
                    {
                        this.drawManagementData = this.drawManagementRes.data;
                        this.dataSource = new MatTableDataSource(this.drawManagementData);
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
            }
    }

    updateDataStatus(): void
    {
        const req =
        {
            id: this.dataID,
            isAccepted: this.statusAction,
            updatedBy: localStorage.getItem('userId'),
        };
        this._userService.charterPartyRequestStatusUpdate(req)
        .pipe(first())
        .subscribe(
        data =>
        {
            this.updateDataReqeust = data;
            if (this.updateDataReqeust.success === true)
            {
                this.alertService.success(this.updateDataReqeust.message, 'Success');
                if(req.isAccepted == 'Y')
                {
                    this.activeModalStatus = !this.activeModalStatus;
                } else {
                    this.inActiveModalStatus = !this.inActiveModalStatus;
                }
                this.drawManagementRecordsCharterer();
            } else {
                this.alertService.error(this.updateDataReqeust.message, 'Error');
            }
        },
        error =>
        {
            this.alertService.error(error.message, 'Error');
        });

        var chartererAccept = (req.isAccepted == 'Y') ? 20 : 0;

        const newReq =
        {
            id: this.drawId,
            charterer_accept_check: chartererAccept,
            charterer_view_check: 0,
            updatedBy: localStorage.getItem('userId')
        };
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions = { headers: header }
        this.http.post(`${config.baseUrl}/drawProgressUpdate`, newReq, headerOptions).subscribe( res =>
        {
        });
    }

    showActiveModal(status,id,drawID): void
    {
        this.drawId = drawID;
        console.log(this.drawId);
        this.dataID = id;
        this.statusAction = status;
        this.activeModalStatus = !this.activeModalStatus;
    }

    hideActiveModal(): void
    {
        this.activeModalStatus = !this.activeModalStatus;
    }

    showInActiveModal(status,id,drawID): void
    {
        console.log(status);
        console.log(id);
        this.drawId = drawID;
        console.log(this.drawId);
        this.dataID = id;
        this.statusAction = status;
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }

    hideInActiveModal(): void
    {
        this.inActiveModalStatus = !this.inActiveModalStatus;
    }
}