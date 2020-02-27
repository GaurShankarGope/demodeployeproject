import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, UserService } from '../../../../_services';
// import { FuseConfigService } from '@fuse/services/config.service';
// import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../../config/config'; 
import * as moment from 'moment';

@Component(
{
    selector: 'app-edit-draw',
    templateUrl: './edit-draw.component.html',
    styleUrls: ['./edit-draw.component.scss']
})
export class EditDrawComponent implements OnInit
{
    DrawManagementForm: FormGroup;
    typeData: any;
    loading = false;
    submitted = false;

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
    
    returnUrl: String;
    showLoaderImg = false;
    
    // Private
    submitRes: any;
    drawFormIDId:String;
    drawFormIDListRes:any;
    drawFormIDData:any;
    drawFormID:String;
    cpId:String;

    cpFormList: any;
    cpFormData: any;

    VesselList: any;
    VesselData: any;

    CharterPartyTypeList: any;
    CharterPartyTypeData: any;

    ChartereInfoList: any;
    ChartereInfoData=[];
    
    /* * @param {FuseSidebarService} _fuseSidebarService*/
    constructor
    (
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _userService: UserService,
        // private _fuseSidebarService: FuseSidebarService,
        private http: HttpClient,
        private alertService: AlertService
    )
    {
        this.showLoaderImg = false;
    }

    ngOnInit()
    {
        this.typeData = JSON.parse(localStorage.getItem('drawManagementData'));
        console.log(this.typeData);

        
        
        this.DrawManagementForm = this._formBuilder.group(
        {
            formId: [this.typeData.formId, Validators.required],
            vesselId: [this.typeData.vesselId, Validators.required],
            cpDate: [this.typeData.cpDate, Validators.required],
            chartererId: [this.typeData.chartererId, Validators.required]
        });

        this.ownerId = this.typeData.ownerId;
        this.chartererId = this.typeData.chartererId;
        this.CPTypeId = this.typeData.CPTypeId;

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/apps/draw-management';

        // this.charterPartyTypeGroup = 
        
        this.cpFormRecords();
        this.vesselRecords();
        this.CPRecords();
        this.ChartereRecords();
    }
    
    get f() { return this.DrawManagementForm.controls; }

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
                            this.CharterPartyTypeData[index].isChecked = '';
                            console.log(this.CharterPartyTypeData[index]);
                            if (this.CharterPartyTypeData[index].id == this.typeData.CPTypeId)
                            {
                                this.CharterPartyTypeData[index].isChecked = 'checked';
                            }
                        }
                        console.log(this.CharterPartyTypeData);
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

    onSubmit()
    {
        console.log("Here On Submit");
        this.showLoaderImg = true;
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();
        // stop here if form is invalid
        if (this.DrawManagementForm.invalid)
        {
            return;
        } else {

            console.log(this.f.cpDate.value);

            var dateInfo = moment(this.f.cpDate.value).format('YYYY-MM-DD');
            console.log(dateInfo);

            const reqData =
            {
                id: this.typeData.id,
                CPTypeId:this.CPTypeId,
                formId:this.f.formId.value,
                vesselId: this.f.vesselId.value,
                ownerId:this.ownerId,
                cpDate: dateInfo,
                chartererBrokerId: localStorage.getItem('userId'),
                chartererId: this.chartererId,
                ownerBrokerId: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
            }
            console.log(reqData);
            this.loading = true;
            this._userService.drawFormUpdate(reqData)
            .pipe(first())
            .subscribe(
                data =>
                {
                    this.showLoaderImg = false;
                    this.submitRes = data;
                    if (this.submitRes.success === true)
                    {
                        this.alertService.success(this.submitRes.message, 'Success');
                        this.router.navigate([this.returnUrl]);
                    } else {
                        this.alertService.error(this.submitRes.message, 'Error');
                    }
                    console.log(data);
                },
                error =>
                {
                    console.log(error.message);
                    this.alertService.error(error.message, 'Error');
                    this.loading = false;
                });
        }
    }
}
