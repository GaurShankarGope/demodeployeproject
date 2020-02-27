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

import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';

export interface UserData
{
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
}

@Component(
{
    selector: 'app-add-cptp-management',
    templateUrl: './add-cptp-management.component.html',
    styleUrls: ['./add-cptp-management.component.scss']
})

export class AddCptpManagementComponent implements OnInit
{

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

    CPTPManagementForm: FormGroup;
    loading = false;
    submitted = false;
    createtypeRes :any;
    returnUrl: string;
    cpFormId:String;
    clauseTerms :any;
    clauseTermsRes: any;
    clauseTermsData: any;

    firstCPTYPE:any;
    cpFormModel:any;

    cpFormList: any;
    cpFormData: any;

    VesselList: any;
    VesselData: any;

    CharterPartyTypeList: any;
    CharterPartyTypeData: any;

    ChartereInfoList: any;
    ChartereInfoData=[];

    // Private
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Constructor
     *
     *  @param {ContactsService} _contactsService
     *  @param {FuseSidebarService} _fuseSidebarService
     *  @param {FormBuilder} _formBuilder
     *  @param {MatDialog} _matDialog
     */

    constructor
    (
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private _userService: UserService,
        private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService
    )
    {
        this._unsubscribeAll = new Subject();
    }
 
    ngOnInit()
    {
        this.CPTPManagementForm = this._formBuilder.group(
        {
        
            // CPTypeId: ['0', Validators.required],
            formId: ['0', Validators.required],
            vesselId: ['0', Validators.required],
            cpDate: ['', Validators.required],
            chartererId: ['0', Validators.required],
            
        
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/draw-management';

        this.cpFormModel = 1;

        this.cpFormRecords();
        this.vesselRecords();
        this.CPRecords();
        this.ChartereRecords();
    }

    get f() { return this.CPTPManagementForm.controls; }

    // CP Form Records Fetch Start
    
        cpFormRecords(): void
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
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
            }
        }

        changeCPForm(event): void
        {
            this.formId = event.target.value;
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
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
            }
        }

        changeVesselEvent(event): void
        {
            this.vesselId = event.target.value;
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
                        console.log('cp type data');
                        for (let index = 0; index < this.CharterPartyTypeData.length; index++)
                        {   
                            if(index == 0)
                            {
                                this.firstCPTYPE = this.CharterPartyTypeData[index].id;
                            }
                        }
                        console.log(this.CharterPartyTypeData);
                        console.log(this.firstCPTYPE);
                    },
                    err =>
                    {
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
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
                            console.log(this.ChartereInfoList.data);
                            this.ChartereInfoList.data.forEach(valueData  => 
                            {
                                console.log(valueData.userRoleId);
                                if(valueData.userRoleId === 4)
                                {
                                    this.ChartereInfoData.push(valueData);
                                }
                            });
                            console.log('Charterer Records');
                            console.log(this.ChartereInfoData);
                            
                        }
                    },
                    err =>
                    {
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log(err);
            }
        }

        changeChartererType(event): void
        {
            console.log('Chartere ID Info');
            console.log(event.target.value);
            this.chartererId = event.target.value;
        }

    // Charter Party Type Records Fetch End

    // Set Applicable Charter Party Type Start

        setApplicabelCharterParty(Type): void
        {
            console.log(Type);
            this.CPTypeId = Type;
        }

    // Set Applicable Charter Party Type End
 
    onSubmit(): void
    {
        console.log('On Submit Form Function For Draw Management Add');
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
 
        // stop here if form is invalid
        if (this.CPTPManagementForm.invalid)
        { 
            console.log('Validation Error For Draw Management Add');
            return;
        } else {
            console.log('Validation Success');
            const req =
            {
                CPTypeId:this.CPTypeId,
                formId:this.f.formId.value,
                vesselId: this.f.vesselId.value,
                ownerId:this.ownerId,
                cpDate: this.f.cpDate.value._i.year+"-"+this.f.cpDate.value._i.month+"-"+this.f.cpDate.value._i.date,
                chartererBrokerId: localStorage.getItem('userId'),
                chartererId: this.chartererId,
                ownerBrokerId: localStorage.getItem('userId'),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            };
            console.log('Insert Data Request As Below');
            console.log(req);

            console.log(req.cpDate);

            console.log(this.f.cpDate.value);

            // var date =  (this.f.cpDate.value, "MM-DD-YYYY").toDate();

            console.log(this.f.cpDate.value);

            this.loading = true;
            try
            {
                console.log('Add Draw Management Form Process Start');

                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/DrawFormCreate`, req, headerOptions).subscribe(
                    res =>
                    {
                        console.log('Add Draw Management Form Process API Call Successfully');
                        console.log(res);
                        this.createtypeRes = res;
                        if (this.createtypeRes.success === true)
                        {
                            console.log('Add Draw Management Form Data Inserted Successfully');
                            this.alertService.success(this.createtypeRes.message, 'Success');
                            this.CPTPManagementForm.reset(); this.router.navigate([this.returnUrl]);
                        } else {
                            console.log('Add Draw Management Form Data Got Error During Insert');
                            this.alertService.error(this.createtypeRes.message, 'Error');
                        }
                    },
                    err =>
                    {
                        this.alertService.error(err, 'Error');
                        console.log('Add Draw Management Form Data Got Error During Insert');
                        console.log(err);
                    }
                );
            } catch (err)
            {
                console.log('Add Draw Management Form Data Got Error During Insert');
                console.log(err);
            } 
        }
    }

}
