import { Component, OnDestroy, AfterViewChecked, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
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
export interface UserData {

    id: string;
    tradingId: string;
    message: string;
    broker_id: string;
    charterer_id: string;
    owner_id: string;
    is_broker_read: string;
    is_charterer_read: string;
    is_owner_read: string;
    total_read: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    action: string;

    createdDateInfo: string;
    createdTimeInfo: string;
    createdByName: string;
}

export interface PeriodicElement {
    id: string;
    tradingId: string;
    message: string;
    broker_id: string;
    charterer_id: string;
    owner_id: string;
    is_broker_read: string;
    is_charterer_read: string;
    is_owner_read: string;
    total_read: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    action: string;

    createdDateInfo: string;
    createdTimeInfo: string;
    createdByName: string;
}

export interface NotificationRecords {
    id: String;
    fromUserId: string;
    toUserId: string;
    notification: string;
    is_read: string;
    fromUserName: string;
    toUserName: string;
    createdAt: string;
}

@Component(
    {
        selector: 'app-chat-management',
        templateUrl: './chat-management.component.html',
        styleUrls: ['./chat-management.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations
    })

export class ChatManagementComponent implements OnInit {
    // @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    socket: any;

    // Table Codes Start
    displayedColumns: string[] = ['id', 'tradingId', 'createdDateInfo', 'createdTimeInfo', 'createdByName', 'message', 'action'];
    displayedColumnsNotificaiton: string[] = ['id', 'notification', 'createdAt'];
    messageCenterRecords = new MatTableDataSource<PeriodicElement>();
    notificationRecords = new MatTableDataSource<NotificationRecords>();
    applyFilter(filterValue: string) {
        this.messageCenterRecords.filter = filterValue.trim().toLowerCase();
        this.notificationRecords.filter = filterValue.trim().toLowerCase();
    }
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Table Codes End

    // Main Data Variables Start
    id: string;
    tradingId: string;
    brokerId: string;
    chartererId: string;
    ownerId: string;
    is_broker_read: string;
    is_charterer_read: string;
    is_owner_read: string;
    total_read: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    isActive: string;
    isDelete: string;
    action: string;

    userType: string;
    userId: string;
    message: string;
    currentUserId: string;
    toUserName: string;
    newMessageTitle: string;
    chatMessage: string;
    user2: string;
    isDetailPageOpen: string;

    // Main Data Variables End

    // Show Hide Variables Start
    chatTableDiv = true;
    chatFormDiv = false;
    chatDetailsDiv = false;
    // Show Hide Variables End

    // General Variable Start
    loading = false;
    submitted = false;
    chatManagementForm: FormGroup;
    get chatManagementFormValues() { return this.chatManagementForm.controls; }
    // General Variable Emd

    // Assign API Data Response And Array Variables Start
    brokerRecordsResponse: any;
    brokerRecordsResponseArray = [];

    chartererRecordsResponse: any;
    chartererRecordsResponseArray = [];

    ownerRecordsResponse: any;
    ownerRecordsResponseArray = [];

    commonUserOptionArray = [];

    chatManagementResponse: any;
    chatManagementResponseArray = [];

    chatManagementDetailsResponse: any;
    chatManagementDetailsResponseArray = [];

    tradingRecordsResponse: any;
    tradingRecordsResponseArray = [];
    msg = [];

    notificationRecordsResponse: any;
    notificationRecordsResponseArray = [];
    // Assign API Data Response And Array Variables End

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
        this.socket.on('message', (result) => {
            console.log(result);
            this.msg.push(result.data);

        });

        this.messageCenterRecords = new MatTableDataSource(this.chatManagementResponseArray);
        this.notificationRecords = new MatTableDataSource(this.notificationRecordsResponseArray);
    }

    ngOnInit() {
        this.isDetailPageOpen = 'N';
        this.currentUserId = localStorage.getItem('userId');

        // Assign Paginator Values Start
        this.messageCenterRecords.paginator = this.paginator;
        this.messageCenterRecords.sort = this.sort;

        this.notificationRecords.paginator = this.paginator;
        this.notificationRecords.sort = this.sort;
        // Assign Paginator Values End

        // Assign Form Values Start
        this.chatManagementForm = this._formBuilder.group(
            {
                userType: ['', Validators.required],
                userId: ['', Validators.required],
                message: ['', Validators.required]
            });
        // Assign Form Values End

        this.brokerRecords();
        this.charterersRecords();
        this.ownerRecords();

        this.chatManagementRecordsServerSide();



        // this.socket.on('new-event', (result) => {     
        //     this.msg.push(result.data.message);

        //     console.log(result,"data");

        //     var container = document.getElementById("msgContainer");    
        //     container.scrollTop = container.scrollHeight; 

        //   });
        // this.socket.on('new-message', (result) => {
        //     // this.display = true;

        //   console.log(this.msg,"hello ");

        //   });
        // setInterval(() =>
        // {
        this.realTimeChatFetch();
        this.fetchRealTimeChatData();
        // }, 5000);
    }
    // scrollToBottom(): void {
    //     try {
    //         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    //     } catch(err) { }                 
    // }
    // Fetch Brokers
    brokerRecords(): void {
        var filter = {};
        filter['companyId'] = localStorage.getItem('companyId');
        filter['userRoleId'] = '3';
        try {
            this._userService.userRecordsServerSide(filter)
                .pipe(first())
                .subscribe((res) => {
                    this.brokerRecordsResponse = res;
                    if (this.brokerRecordsResponse.success === true) {
                        this.brokerRecordsResponseArray = this.brokerRecordsResponse.data;
                        console.log(this.brokerRecordsResponseArray);

                    }
                }, err => { });
        } catch (err) { }
    }

    // Fetch Charterers
    charterersRecords(): void {
        var filter = {};
        filter['companyId'] = localStorage.getItem('companyId');
        filter['userRoleId'] = '4';
        try {
            this._userService.userRecordsServerSide(filter)
                .pipe(first())
                .subscribe((res) => {
                    this.chartererRecordsResponse = res;
                    if (this.chartererRecordsResponse.success === true) {
                        this.chartererRecordsResponseArray = this.chartererRecordsResponse.data;

                        console.log(this.chartererRecordsResponseArray);

                    }
                }, err => { });
        } catch (err) { }
    }

    // Fetch Owners
    ownerRecords(): void {
        var filter = {};
        filter['companyId'] = localStorage.getItem('companyId');
        filter['userRoleId'] = '6';
        try {
            this._userService.userRecordsServerSide(filter)
                .pipe(first())
                .subscribe((res) => {
                    this.ownerRecordsResponse = res;
                    if (this.ownerRecordsResponse.success === true) {
                        this.ownerRecordsResponseArray = this.ownerRecordsResponse.data;
                        console.log(this.ownerRecordsResponseArray);

                    }
                }, err => { });
        } catch (err) { }
    }

    // View User By User Type Vise
    viewUserByUserTypeVise(event) {
        this.userType = this.chatManagementFormValues.userType.value;
        this.userId = this.chatManagementFormValues.userId.value;
        this.message = this.chatManagementFormValues.message.value;
        // Assign Form Values Start
        this.chatManagementForm = this._formBuilder.group(
            {
                userType: [this.userType, Validators.required],
                userId: ['', Validators.required],
                message: [this.message, Validators.required]
            });
        // Assign Form Values End
        this.commonUserOptionArray = [];
        if (event.value == '1') {
            this.commonUserOptionArray = this.brokerRecordsResponseArray;
        }
        if (event.value == '2') {
            this.commonUserOptionArray = this.chartererRecordsResponseArray;
        }
        if (event.value == '3') {
            this.commonUserOptionArray = this.ownerRecordsResponseArray;
        }
    }

    // Show Hide Div
    showHideModules(type) {
        this.isDetailPageOpen = 'N';
        this.alertService.clear();
        this.chatManagementForm.reset();

        this.chatTableDiv = false;
        this.chatFormDiv = false;
        this.chatDetailsDiv = false;

        if (type == '1') {
            this.chatTableDiv = true;
            this.chatManagementRecordsServerSide();
        }

        if (type == '2') {
            this.chatFormDiv = true;
        }

        if (type == '3') {
            this.chatDetailsDiv = true;
            this.isDetailPageOpen = 'Y';
        }
    }

    // Chat Message Records Server Side
    chatManagementRecordsServerSide(): void {
        var filter = {};
        filter['cb.user1'] = localStorage.getItem('userId');
        this._userService.chatRecordsServerSide(filter).pipe(first())
            .subscribe(res => {
                this.chatManagementResponse = res;
                if (this.chatManagementResponse.success === true) {
                    this.chatManagementResponseArray = this.chatManagementResponse.data;
                    if (this.chatManagementResponse.newMessages == 1) {
                        this.newMessageTitle = '1 New Message';
                    }
                    if (this.chatManagementResponse.newMessages > 1) {
                        this.newMessageTitle = this.chatManagementResponse.newMessages + ' New Messages';
                    }
                    console.log(this.newMessageTitle);
                }
            });
    }

    // User Chat Details
    fetchChatDetails(user2, toUserName) {
        this.user2 = user2;
        this.toUserName = toUserName;
        var filter = {};
        filter['user1'] = localStorage.getItem('userId');
        filter['user2'] = user2;
        this._userService.fetchChatDetails(filter).pipe(first())
            .subscribe(res => {
                this.chatManagementDetailsResponse = res;
                if (this.chatManagementDetailsResponse.success === true) {
                    this.chatManagementDetailsResponseArray = this.chatManagementDetailsResponse.data;
                    this.showHideModules(3);
                }
            });
    }

    // Real TIme Chat Fetch
    realTimeChatFetch() {
        if (this.isDetailPageOpen == 'N') {
            var filter = {};
            filter['user1'] = localStorage.getItem('userId');
            this._userService.realTimeChatRecordsServerSide(filter).pipe(first())
                .subscribe(res => {
                    this.chatManagementResponse = res;
                    if (this.chatManagementResponse.success === true) {
                        // this.scrollToBottom();
                        this.chatManagementResponseArray = this.chatManagementResponse.data;
                        this.newMessageTitle = '';
                        if (this.chatManagementResponse.newMessages > 0) {

                            if (this.chatManagementResponse.newMessages == 1) {

                                this.newMessageTitle = '1 New Message';
                            }
                            if (this.chatManagementResponse.newMessages > 1) {
                                this.newMessageTitle = this.chatManagementResponse.newMessages + ' New Messages';
                            }
                        }
                    }
                });
        }
    }

    // Chat Form Submit
    chatManagementFormSubmit(): void {
        this.submitted = true;
        this.alertService.clear();
        if (this.chatManagementForm.invalid) {
            return;
        } else {

            const req =
            {
                senderId: localStorage.getItem('userId'),
                userId: this.chatManagementFormValues.userId.value,
                message: this.chatManagementFormValues.message.value,
                date: moment(new Date()).format("YYYY-MM-DD"),
                time: moment(new Date()).format("HH:mm A"),
                createdBy: localStorage.getItem('userId'),
                updatedBy: localStorage.getItem('userId'),
                companyId: localStorage.getItem('companyId'),
            };

            this.loading = true;
            try {
                const header = new HttpHeaders();
                header.append('Content-Type', 'application/json');
                const headerOptions =
                {
                    headers: header
                }
                this.http.post(`${config.baseUrl}/chatCreate`, req, headerOptions).subscribe(
                    res => {

                        this.socket.emit('new-event', {req});

                        this.alertService.success('Message Created And Send Successfully', 'Success');
                        this.showHideModules(1);
                        this.chatManagementRecordsServerSide();
                    },
                    err => {
                        this.alertService.error(err, 'Error');
                    }
                );
            } catch (err) {
            }
        }
    }

    // Send Message
    sendMessage() {
        console.log(this.chatMessage);
        const req =
        {
            senderId: localStorage.getItem('userId'),
            userId: this.user2,
            message: this.chatMessage,
            date: moment(new Date()).format("YYYY-MM-DD"),
            time: moment(new Date()).format("HH:mm A"),
            createdBy: localStorage.getItem('userId'),
            updatedBy: localStorage.getItem('userId'),
            companyId: localStorage.getItem('companyId'),
        };

        this.loading = true;
        try {
            const header = new HttpHeaders();
            header.append('Content-Type', 'application/json');
            const headerOptions =
            {
                headers: header
            }
            this.socket.emit('new-event', this.chatMessage);

            this.http.post(`${config.baseUrl}/chatCreate`, req, headerOptions).subscribe(
                res => {
                    this.chatMessage = '';
                },
                err => {
                    this.alertService.error(err, 'Error');
                }
            );
        } catch (err) {
        }
    }

    // Fetch Real Time Chat Data
    fetchRealTimeChatData() {
        if (this.user2 != '' && this.user2 != null && this.user2 != undefined && this.isDetailPageOpen == 'Y') {
            var filter = {};
            filter['user1'] = localStorage.getItem('userId');
            filter['user2'] = this.user2;

            this._userService.fetchRealTimeChatData(filter).pipe(first())
                .subscribe(res => {
                    this.chatManagementDetailsResponse = res;
                    if (this.chatManagementDetailsResponse.success === true) {
                        var container = document.getElementById("msgContainer");
                        container.scrollTop = container.scrollHeight;

                        this.chatManagementDetailsResponseArray = this.chatManagementDetailsResponse.data;

                    }
                });
        }
    }
}