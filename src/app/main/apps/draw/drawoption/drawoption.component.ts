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
import { UserService } from '../../../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import {FormGroupDirective, NgForm,} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

@Component(
{
    selector: 'app-drawoption',
    templateUrl: './drawoption.component.html',
    styleUrls: ['./drawoption.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class DrawoptionComponent implements OnInit
{

    id: string;
    
    drawId : string;
    chartererId: string;

    CPTypeId: string;
    formId: string;
    vesselId: string;
    ownerId: string;
    chartererBrokerId: string;
    ownerBrokerId: string;
    cpDate: string;
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
    cols: any[];
    drawRecordsListRes: any;
    drawRecordsListData: any;

    DrawManagementSearchForm: FormGroup;

    DrawManagementForm: FormGroup;
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

    CharterPartyTypeResponse: any;
    CharterPartyTypeData = [];

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
        private http: HttpClient,
        private router: Router
    ){}

    ngOnInit()
    {
        this.charterPartyTypeRecords();
    }

    // Draw Management Route
    drawManagementView() : void
    {
        this.router.navigate(['/apps/draw-management']);
    }

    // Charter Party Type Records Fetch Start
    charterPartyTypeRecords(): void
    {
        try
        {
            this.http.get(`${config.baseUrl}/charterpartylist`).subscribe(res =>
            {
                this.CharterPartyTypeResponse = res;
                if (this.CharterPartyTypeResponse.success)
                {
                    this.CharterPartyTypeResponse.data.forEach(valueData  => 
                    {
                        if(valueData.id != 3)
                        {
                            this.CharterPartyTypeData.push(valueData);
                        }
                    });
                }
            });
        } catch (err){}
    }

    // Charter Party Type Records Fetch End
    setApplicabelCharterParty(Type): void
    {
        console.log(Type);
        if(Type == 1)
        {
            this.router.navigate(['/apps/draw-management/executed']);
        }
        if(Type == 2)
        {
            this.router.navigate(['/apps/draw-management/executed']);
        }
    }
}