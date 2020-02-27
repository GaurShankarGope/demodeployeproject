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
    fromUserId: string;
    toUserId: string;
    companyId: String;
    createdBy: String;
    createdAt: String;
    updatedBy: String;
    updatedAt: String;
    isActive: String;
    isDelete: String;
    transferedTo: String;
    date: String;
    time: String;
    tradingId:string;
    progress:string;
}


@Component({
  selector: 'app-share-trade',
  templateUrl: './share-trade.component.html',
  styleUrls: ['./share-trade.component.scss']
})
export class ShareTradeComponent implements OnInit {

  current_date = moment(new Date()).format("YYYY-MM-DD");
  displayedColumns: string[] = ['tradingId', 'transferedTo', 'date', 'time','progress'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dialogRef: any;
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  showModalStatus = false;
  showUpdateModalStatus = false;
  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ownerShipListResponse: any;

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
      this.dataSource = new MatTableDataSource(this.ownerShipListResponse);
  }

  ngOnInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.ownerShipRecordsServerSide();
  }

  // Invited User List Records Server Side Start
  ownerShipRecordsServerSide(): void {
      var filter = {};
      filter['co.companyId'] = JSON.parse(localStorage.getItem('companyId'));
      filter['co.fromUserId'] = JSON.parse(localStorage.getItem('userId'));
      this._userService.shareTradeRecordsServerSide(filter).pipe(first())
      .subscribe(res => {
          this.ownerShipListResponse = res;
          if (this.ownerShipListResponse.success === true) {
              this.ownerShipListResponse = this.ownerShipListResponse.data;
              this.dataSource = new MatTableDataSource(this.ownerShipListResponse);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;

              console.log(this.dataSource);
          }
      });
  }

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
  // Invited User List Records Server Side End
}
