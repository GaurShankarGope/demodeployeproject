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
import * as moment from 'moment';

export interface PeriodicElement {

    id: String;
    email_id: string;
    companyId: String;
    createdBy: String;
    createdAt: String;
    updatedBy: String;
    updatedAt : String;
    isActive: String;
    isDelete : String;
    invitedBy : String;
    date : String;
    time : String;
}

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InviteComponent implements OnInit
{
    current_date = moment(new Date()).format("YYYY-MM-DD");
    displayedColumns: string[] = ['id', 'email_id', 'invitedBy', 'date', 'time'];
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
    
    inviteTableView = true;
    inviteFormView = false;

    inviteForm : FormGroup;
    get inviteFormValues() { return this.inviteForm.controls; }

    invitedUserListResponse: any;
    invitedUserListResponseData = [];

    inviteFormSubmitResponse: any;
    inviteFormSubmitResponseData = [];

    userId : any;
    userData : any;
    emailID : any;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
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
        this.dataSource = new MatTableDataSource(this.invitedUserListResponseData);
    }

    ngOnInit()
    {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.inviteForm = this._formBuilder.group(
        {
            email_id: ['',
            [
                Validators.required,
                Validators.pattern(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)
            ]]
        });
        this.invitedUserListRecordsServerSide();

        if (JSON.parse(localStorage.getItem('userRoleId')) != '7')
        {
            this.userId = localStorage.getItem('userId');
            this.emailID = localStorage.getItem('emailId');
            if (JSON.parse(localStorage.getItem('userRoleId')) != '5')
            {
                this.userId = localStorage.getItem('userParentId');
                this.usersData();
            }
        } else {
            this.emailID = localStorage.getItem('emailId');
        }
    }

    // Invited User List Records Server Side Start
    invitedUserListRecordsServerSide(): void {
        var filter = {};
            filter['it.companyId'] = JSON.parse(localStorage.getItem('companyId'));
            filter['it.createdBy'] = JSON.parse(localStorage.getItem('userId'));
        this._userService.invitedUserRecordsServerSide(filter).pipe(first())
        .subscribe(res =>{
            this.invitedUserListResponse = res;
            if (this.invitedUserListResponse.success === true) {
                this.invitedUserListResponseData = this.invitedUserListResponse.data;
                this.dataSource = new MatTableDataSource(this.invitedUserListResponse.data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }
    // Invited User List Records Server Side End

    // Invite Form And Table View Start
    inviteFormAndTableView(type)
    {   
        this.inviteTableView = false;
        this.inviteFormView = false;
        if(type == '1')
        {
            this.inviteTableView = true;
        }
        if(type == '2')
        {
            this.inviteFormView = true;
        }
    }
    // Invite Form And Table View End
    
    // Invite User Form Submit Start
    inviteUser(): void
    {
        this.alertService.clear();
        if (this.inviteForm.invalid) {
            return;
        } else {
            const req =
            {
                email_id : this.inviteFormValues.email_id.value,
                date: moment(new Date()).format("YYYY-MM-DD"),
                time: moment().format("H:mm A"),
                message: 'You are invited to use CP System. Please have a look on http://shipping-frontend.herokuapp.com/',
                companyId: localStorage.getItem('companyId'),
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
                this.http.post(`${config.baseUrl}/invitationEmailSend`, req, headerOptions).subscribe(
                    res => {
                        this.inviteFormSubmitResponse = res;
                        if (this.inviteFormSubmitResponse.success === true)
                        {
                            this.alertService.success('User invited successfully', 'Success');
                            this.invitedUserListRecordsServerSide();
                            this.inviteFormAndTableView(1);
                            this.invitationAndNotificationSend();
                        } else {
                            this.alertService.error('Something went wrong please try after some time', 'Error');
                        }
                    },
                    err =>
                    {
                        this.alertService.error(err, 'Error');
                    }
                );
            } catch (err) {
            }
        }
    }
    // Invite User Form Submit End

    // Invitation And Notification Send Start
    invitationAndNotificationSend()
    {
        var notificationMessage = 'User '+this.inviteFormValues.email_id.value+' has been invited for use cp system. http://shipping-frontend.herokuapp.com/';
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');
        const headerOptions =
        {
            headers: header
        }

        const notificationData =
        {
            fromUserId: localStorage.getItem('userId'),
            toUserId: this.userId,
            notification: notificationMessage,
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId')
        };
        try {this.http.post(`${config.baseUrl}/drawNotificationInsert`, notificationData, headerOptions).subscribe(res => {});} catch (err) { }

        var emailData = {};
            emailData['email_id'] = this.emailID;
            emailData['message'] = notificationMessage;
        try {
            this._userService.invitationEmailSendCompanyAdmin(emailData).pipe(first()).subscribe((res) =>
            {
            }, err => { });
        } catch (err) { }
        
    }
    // Invitation And Notification Send End

    // Users Info Start
    usersData()
    {
        var conditionData = {};
        conditionData['id'] = this.userId;
        try {
            this._userService.userRecordsServerSide(conditionData).pipe(first()).subscribe((res) =>
            {
                this.userData = res;
                if (this.userData.success === true) {
                    this.userData = this.userData.data;
                    if(this.userData[0] != '' && this.userData[0] != null && this.userData[0] != undefined)
                    {
                        this.emailID = this.userData[0]['email'];
                    }
                }
            }, err => { });
        } catch (err) { }
    }
    // Users Info End
}