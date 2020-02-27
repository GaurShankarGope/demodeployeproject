
import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AlertService, AuthenticationService } from '../../../../_services';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { UserService } from '../../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../config/config';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService } from '../../../_services';

// export interface UserData {

//   name: string;
  
// }
export interface PeriodicElement {
 
  name: string;
  
 
}


@Component({
  selector: 'app-charter-party-type',
  templateUrl: './charter-party-type.component.html',
  styleUrls: ['./charter-party-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class CharterPartyTypeComponent implements OnInit {
  displayedColumns: string[] = ['id','name','action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  // displayedColumns = ['name'];
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    showModalStatus = false;
    showUpdateModalStatus = false;
    // dataSource: MatTableDataSource<UserData>;
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isActive: string;
  isDelete: string;
  chartertypelist :any;
  chartertypeListRes: any;
  chartertypeListData: any;
  cols: any[];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */

  constructor( private _userService: UserService,
    private _fuseSidebarService: FuseSidebarService,
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router) {
      this.dataSource = new MatTableDataSource(this.chartertypeListData);
     }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.charterType();

    
  }



  charterType(): void {
    try {
        this._userService.getcharterpartytypeList()
            .pipe(first())
            .subscribe((res) => {
                this.chartertypeListRes = res;
                console.log(res);
                if (this.chartertypeListRes.success === true) {
                    this.chartertypeListData = this.chartertypeListRes.data;
                    this.dataSource = new MatTableDataSource(this.chartertypeListData);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    console.log(this.chartertypeListData);
                }
            },
                err => {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });

    } catch (err) {
        console.log(err);
    }
}

editUser(data): void {
  console.log(data);       
  localStorage.setItem('cptypeData', JSON.stringify(data));
  this.router.navigate(['/apps/charter-type-management/edit']);
}

showDeleteModal(id): void {
  this.id = id;
  this.showModalStatus = !this.showModalStatus;
}
hideDeleteModal(): void {
  this.showModalStatus = !this.showModalStatus;
}

deleteCharterPartyType(): void {
  const req = {
      id: this.id,
    
  };
  try {
      this.http
          .post(`${config.baseUrl}/charterpartytypedelete`, req, {})
          .subscribe(
              res => {
                  console.log(res);
                  this.chartertypeListRes = res;
                  if (this.chartertypeListRes.success === true) {
                      this.showModalStatus = false;
                      this.alertService.success('Successfully Deleted', 'Success');
                      this.charterType();
                  } else {
                      this.alertService.error(this.chartertypeListRes.message, 'Error');
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


}
