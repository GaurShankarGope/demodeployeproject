import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { UserService } from '../../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService } from '../../../_services';
import { Router } from '@angular/router';

export interface UserData {
  id: string;
  Name: string;
  mobileNo: string;
  email: string;
  company: string;
}

@Component({
  selector: 'app-owner-management',
  templateUrl: './owner-management.component.html',
  styleUrls: ['./owner-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OwnerManagementComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'mobileNo', 'email',  'action'];
  dialogRef: any;
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  showModalStatus = false;
  dataSource: MatTableDataSource<UserData>;
  showModaldeleteStatus = false;
  roleListRes: any;
  roleListData: any;
  roleName: string;
  name: string;
  mobileno: string; 
  password:String;
  email: string; 
  company: string;  
  userRole: string
  confirmPassword:String;
  firstName:String;
  lastName:String;
  companyName:String;
  businessPhone:String;
  mobileNo:String;
  userListRes: any;
  userLocation:String;
  userListData:any;
  roleId: any;
  deleteRoleRes: any;
  userId:String;
  status = 'Y';
  


  filterValue: string;
  userRoleId: any;
  tempUserListData: any;
  // Private

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   * Constructor
   *
   * @param {ContactsService} _contactsService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(
      // private _contactsService: ContactsService,
      private _userService: UserService,
      private _fuseSidebarService: FuseSidebarService,
      private http: HttpClient, 
      private alertService: AlertService,
      private router: Router
  ) {
      // Set the defaults
      this.filterValue = '';
      this.userListData = [];
      this.roleListData = [];
      this.userRoleId = '';
      this.dataSource = new MatTableDataSource(this.userListData);

      let userToken = localStorage.getItem('userToken')
      if(userToken==undefined){
          this.router.navigate(['/']);
      }
  }
 
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      this.OwnerRecords();
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  showModal(): void {
      this.showModalStatus = !this.showModalStatus;
      // console.log(this.showModalStatus);
  }

  applyFilter(filterValue: string): void {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  editRole(id): void {
      console.log(id);       
      localStorage.setItem('brokerId', id);
      this.router.navigate(['/apps/owner-management/edit-owner']);
  }

  OwnerRecords(): void {
      try {
          this._userService.OwnerRecords()
          .pipe(first())
          .subscribe((res) => {
              this.userListRes = res;
              if (this.userListRes.success === true) {
                  this.tempUserListData = this.userListRes.data;
                  this.userListData = this.userListRes.data;
                  this.dataSource = new MatTableDataSource(this.userListData);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
              }
          },
          err => {
              console.log(err);
          });
          
      } catch (err) {
          console.log(err);
      }
  }
  
  // Delete Role
  deletebroker(): void {
      const req = {
          isDelete: 'Y',      
          id: this.userId,
      };
      try {
          this.http
              .post(`${config.baseUrl}/OwnerDelete`, req, {})
              .subscribe(
                  res => {
                      console.log(res);
                      this.deleteRoleRes = res;
                      if (this.deleteRoleRes.success === true) {
                          this.alertService.success('Successfully Deleted', 'Success');
                          this.OwnerRecords();
                          this.showModaldeleteStatus = false;
                      } else {
                          this.alertService.error(this.deleteRoleRes.message, 'Error');
                      }
                  },
                  err => {
                      console.log(err);
                      this.alertService.error(err.message, 'Error');
                  }
              );
      } catch (err) {
          console.log(err);
      }
  } 
  changeRole(event): void {
      console.log(event.target.value);
      this.userRoleId = event.target.value;
  }
  showDeleteModal(id): void {
      this.userId = id;
      this.showModaldeleteStatus = !this.showModaldeleteStatus;
  }
  hideDeleteModal(): void {
      this.showModaldeleteStatus = !this.showModaldeleteStatus;
  }

}
