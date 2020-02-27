import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
// import {Router} from '@angular/router';
import { AlertService, AuthenticationService } from '../../../_services';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import * as io from 'socket.io-client';
import { navigation } from 'app/navigation/navigation';
// import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UserService } from '../../../_services/user.service';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
// import { AlertService, AuthenticationService } from '../../../_services';
import { getNumberOfCurrencyDigits } from '@angular/common';
import {FormGroupDirective, NgForm,} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import * as moment from 'moment';

import { id } from '@swimlane/ngx-charts/release/utils';
// import * as io from 'socket.io-client';
@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {

    socket:any;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    isLoggedIn = false;
    userInfo: any;
    email: string;
    msg =  [];
    notification =[];
    counter:number  =0;
    tempNotfitytrading:any ;
    tempNotfitycharterer:any ;
    tempNotfityowner:any ;
    toUserId:String;
    notificationInfoRes:any;
    // Private
    private _unsubscribeAll: Subject<any>;

    // /**
    //  * Constructor
    //  *
    //  * @param {FuseConfigService} _fuseConfigService
    //  * @param {FuseSidebarService} _fuseSidebarService
    //  * @param {TranslateService} _translateService
    //  */
    constructor(
        private _userService: UserService,
       
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
       
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private http: HttpClient, private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    )
    {
          this.socket = io('http://18.216.106.180:3001');
          this.socket.on('message', (result) => {
            this.msg.push(result.data);
          console.log(result);
          console.log(this.msg);
          this.counter = this.counter +1;
          });
          this.socket.on('notification', (result) => {
              console.log(result);
            //   console.log(result.data.tradingNotificationData.toUserId);
            //   console.log(result.data.tradingNotificationData.toUserId);
              
            //   this.tempNotfitytrading =result.data;
            //   this.tempNotfitycharterer =result.data;
              this.tempNotfityowner =result.data;
              console.log(this.tempNotfitytrading);
              console.log(this.tempNotfitycharterer);
              console.log(this.tempNotfityowner);
              
            //   
            console.log(this.tempNotfityowner.toUserId);
            console.log("local json",JSON.stringify(localStorage.getItem('userId')));
            console.log("log local",localStorage.getItem('userId'));
            
            if(localStorage.getItem('userId') == this.tempNotfityowner.toUserId ){


                let temp = this.tempNotfityowner.notification;
                console.log(temp);
                
                this.notification.push(temp);
                this.counter = this.counter +1;


            }

        //      else if(this.tempNotfitycharterer != null && JSON.stringify(localStorage.getItem('userId')) == this.tempNotfitycharterer.toUserId){

        //         let temp = this.tempNotfitycharterer.notification;
        //         this.notification.push(temp);
        //         this.counter = this.counter +1;


        //     }
            
        //    else if(this.tempNotfitytrading != null && JSON.stringify(localStorage.getItem('userId')) == this.tempNotfitytrading.toUserId){


        //         let temp = this.tempNotfitytrading.notification;
        //         this.notification.push(temp);
        //         this.counter = this.counter +1;
        //         console.log(this.notification);

                


        //     }
          console.log(result);
          console.log(this.notification);
        //   this.counter = this.counter +1;
          });

        this.userInfo = '';
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon : 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },

            {
                title: 'Away',
                icon : 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon : 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'tr',
                title: 'Turkish',
                flag : 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
       
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });
            if(JSON.parse(localStorage.getItem('userData'))) {
                this.userInfo = JSON.parse(localStorage.getItem('userData'));
            }
        
        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
        this.notificationRecords();
    }

    notificationRecords(): void
    {
        this.notification = [];
        this.counter =0;
        this.toUserId =  localStorage.getItem('userId');
        var arrfilterInfo = {};

        arrfilterInfo["toUserId"] = this.toUserId;
        
        try
        {
            this._userService.notificationRecords(arrfilterInfo)
                .pipe(first())
                .subscribe((res) =>
                {
                    this.notificationInfoRes = res;
                    
                    if (this.notificationInfoRes.success === true)
                    {  
                        this.counter = this.notificationInfoRes.data.length;

                        for (let index = 0; index < 5; index++) {
                            
                          this.notification.push(this.notificationInfoRes.data[index].notification);
                        
                        }
                      
                        // this.notificationInfoData = this.notificationInfoRes.data;
                        // this.dataSource = new MatTableDataSource(this.notificationInfoRes.data);
                        // this.dataSource.paginator = this.paginator;
                        // this.dataSource.sort = this.sort;
                    }
                    console.log(this.notification);
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                });
            } catch (err)
            {
            }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    logout() {
        console.log('log');
        this.authenticationService.logout();
        localStorage.clear();
        this.router.navigate(['/pages/auth/login']);
      }

    //   changepwd() {
    //     this.authenticationService.changepassword(id);
    //     this.router.navigate(['/pages/auth/change-password']);
    //   }
}
