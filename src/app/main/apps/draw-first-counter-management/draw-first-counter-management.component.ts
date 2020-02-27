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
import { AngularEditorConfig } from '@kolkov/angular-editor';

import * as moment from 'moment';

export interface PeriodicElement
{
    userName : string;
    termsName: string;
    updatedAt : string;
    updatedDateInfo : string;
    
}

export interface UserData
{
    userName : string;
    updatedAt : string;
    termsName:string;
    updatedDateInfo : string;
}
@Component({
  selector: 'app-draw-first-counter-management',
  templateUrl: './draw-first-counter-management.component.html',
  styleUrls: ['./draw-first-counter-management.component.scss']
})
export class DrawFirstCounterManagementComponent implements OnInit {
    customClause: String;
    editclause: String;
    editorConfig: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '50%',
      minHeight: '50%',
      maxHeight: '50%',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Please Enter New Clause.',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadUrl: 'v1/image',
      sanitize: true,
      toolbarPosition: 'top',
    };
  
    showModalStatus = false;
    clauses = [];
    clauseCategory =[];
    dataSource: any;
    drawcluases = [];
    clusename: String;
    firstClase: any;
    tempData: any;
    drawManagementRes: any;
    clusesId = [];
    add = [];
    newClause = [];
    previusClause: any;
    nextClause: any;
    customCl = false;
    tempid = 1;
    tempedit: any;
    editclauses = [];
    editclausetext: String;
    tmpeditclausetext: String;
    editid: String;
    ceditid: String;
    tmpceditclausetext: String;
    parentId: String;
    nextStatus = false;
    tempnos = 1;
  
  
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(private _userService: UserService,
      private _fuseSidebarService: FuseSidebarService,
      private http: HttpClient,
      private alertService: AlertService,
      private router: Router) {
      this.dataSource = new MatTableDataSource(this.drawcluases);
    }
  
    ngOnInit() {
        this.drawManagementRecords();
      this.clausesDetail();
      this.display();
    }
    
    addModal() {
      this.showModalStatus = true;
    }
  
    addClauseamendments() {
      let tempnos = 1;
      // let temp = {
      //   companyId: localStorage.getItem('companyId'),
      //   formId: localStorage.getItem('cpFormId'),
      //   drawchaterId: localStorage.getItem('drawId'),
      //   nos: this.tempid,
      //   status: true,
      //   parentId: this.parentId,
      //   termsName: this.customClause,
      //   createdBy: localStorage.getItem('userId')
      // }
      // this._fuseSidebarService.getSidebar('addPanel').toggleOpen();
      this._userService.getclusesList()
        .subscribe(res => {
          console.log(res);
          this.tempData = res;
  
          for (let index = 0; index < this.tempData.data.length; index++) {
  
            if (this.tempData.data[index].parentId == this.clauseCategory[0].id) {
              this.clauses.push(this.tempData.data[index]);
              let temp = {
                companyId: localStorage.getItem('companyId'),
                formId: localStorage.getItem('cpFormId'),
                drawchaterId: localStorage.getItem('drawId'),
                nos: tempnos,
                status: true,
                parentId: this.tempData.data[index].parentId,
                termsName: this.tempData.data[index].termsName,
                createdBy: localStorage.getItem('userId')
              }
              this._userService.customeClauseadd(temp)
                .subscribe(res => {
                  console.log(res);
                  this.display();
                });
            }
          }
          tempnos = tempnos + 1;
  
          console.log(this.tempData.data);
          console.log(this.clauses);
  
        });
  
  
    }
    drawManagementRecords(): void
    {
        this.drawcluases = [];
        let cpFormid = 1;
      
        try
        {
            this._userService.clausesCategoryRecords()
                .pipe(first())
                .subscribe((res) =>
                {
                    this.drawManagementRes = res;
                    console.log('Main Draw Management Records');
                    console.log(cpFormid);
                    if (this.drawManagementRes.success === true)
                    {
                      // console.log(this.drawManagementRes.data);
                      for (let index = 0; index < this.drawManagementRes.data.length; index++) {
  
  
                        if (this.drawManagementRes.data[index].cpFormId == cpFormid) {
  
                            this.clauseCategory.push(this.drawManagementRes.data[index]);
                                               
                        }
  
                      }
                      this.dataSource = new MatTableDataSource(this.clauseCategory);
                      this.dataSource.paginator = this.paginator;
                      this.dataSource.sort = this.sort;
                      console.log("Final Records");
                    //   console.log(this.clauseCategory/);
                      console.log(this.clauseCategory);                        
                      this.clusename = this.clauseCategory[0].name;
                      this.parentId = this.clauseCategory[0].id;
                   
                    }
                },
                err =>
                {
                    this.alertService.error(err, 'Error');
                    console.log(err);
                });
            } catch (err)
            {
                console.log(err);
        }
    }
    clausesDetail() {
      this.clauses = [];
    //   this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
      this.firstClase = this.clauseCategory[0];
      let clusename: String;
      console.log(this.clauseCategory);
      
      
      // this._userService.clausesCategoryRecords().
      // subscribe(res => {
      // this.drawManagementRes = res;
      // for (let index = 0; index < this.clauseCategory.length; index++) {
      // if (this.clauseCategory[index].id == this.firstClase.id) {
      let pindex = 0;
      let nindex = 1;
  
      this.previusClause = this.clauseCategory[pindex].id;
      this.nextClause = this.clauseCategory[nindex].id;
      // }
      // }
  
      console.log('data', this.clusename);
      console.log('previus', this.previusClause);
      console.log('next', this.nextClause);
      // });
  
      this._userService.getclusesList()
        .subscribe(res => {
          console.log(res);
          this.tempData = res;
  
          for (let index = 0; index < this.tempData.data.length; index++) {
  
            if (this.tempData.data[index].parentId == this.clauseCategory[0].id) {
              this.clauses.push(this.tempData.data[index]);
            }
          }
  
          console.log(this.tempData.data);
          console.log(this.clauses);
  
        });
    }
  
    Previous(pid) {
      this.clauses = [];
      let pc = this.previusClause;
      this.clusename = '';
      this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
  
      // this.firstClase = this.clauseCategory[0];
      // let clusename: String;
      // console.log(this.clauseCategory);
      // this._userService.clausesCategoryRecords().
      // subscribe(res => {
      // this.drawManagementRes = res;
      // });
  
      this._userService.getclusesList()
        .subscribe(res => {
          console.log(res);
          this.tempData = res;
  
          for (let index = 0; index < this.tempData.data.length; index++) {
            if (this.tempData.data[index].parentId == pid) {
              this.clauses.push(this.tempData.data[index]);
              this.parentId = this.clauseCategory[index].id;
  
            }
          }
          console.log(this.tempData.data);
          console.log(this.clauses);
        });
  
  
      for (let index = 0; index < this.clauseCategory.length; index++) {
        if (this.clauseCategory[index].id == pid) {
          this.clusename = this.clauseCategory[index].name;
          this.parentId = this.clauseCategory[index].id;
  
          let nindex = index + 1;
          let pindex = index - 1;
          if (this.clauseCategory[index] == 0) {
            this.router.navigate(['/apps/drawCp-Clauses-management']);
          }
          else {
            this.previusClause = this.clauseCategory[pindex].id;
  
          }
  
          this.nextStatus = false;
          this.nextClause = this.clauseCategory[nindex].id;
        }
      }
      this.display();
  
      // console.log('data', this.clusename);
      // console.log('previus', this.previusClause);
      // console.log('next', this.nextClause);
  
    }
  
    next(nextClause) {
      this.clauses = [];
      this.clusename = '';
      let nc = this.nextClause;
      // this.clauseCategory = JSON.parse(localStorage.getItem('clausesId'));
      // this.firstClase = this.clauseCategory[0];
      // let clusename: String;
      // console.log(this.clauseCategory);
      // this._userService.clausesCategoryRecords().
      // subscribe(res => {
      // this.previusClause = null;
      // this.nextClause = null;
      // this.drawManagementRes = res;
      // });
      this._userService.getclusesList()
        .subscribe(res => {
          console.log(res);
          this.tempData = res;
          for (let index = 0; index < this.tempData.data.length; index++) {
            if (this.tempData.data[index].parentId == nc) {
              this.clauses.push(this.tempData.data[index]);
            }
          }
          console.log(this.tempData.data);
          console.log(this.clauses);
        });
  
      for (let index = 0; index < this.clauseCategory.length; index++) {
        if (this.clauseCategory[index].id === nextClause) {
          this.clusename = this.clauseCategory[index].name;
          this.parentId = this.clauseCategory[index].id;
          let pindex = index - 1;
          if (nc == this.clauseCategory[this.clauseCategory.length - 1].id) {
            this.nextStatus = true;
          }
          else {
            let nindex = index + 1;
            this.nextClause = this.clauseCategory[nindex].id;
            this.nextStatus = false;
          }
          this.previusClause = this.clauseCategory[pindex].id;
        }
      }

      this.display();
  
      // this.display();
      // console.log('data', this.clauseCategory);
      // console.log('data', this.clusename);
      // console.log('previus', this.previusClause);
      // console.log('next', this.nextClause);
    }
  
    /**
   * Toggle sidebar open
   *
   * @param key
   */
    toggleOpen(key): void {
      this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
    editToggle(key, cid): void {
      let id = cid;
      this.editclauses = [];
      this._fuseSidebarService.getSidebar(key).toggleOpen();
  
      this._userService.getclusesList()
        .subscribe(res => {
          this.tempedit = res;
          for (let index = 0; index < this.tempedit.data.length; index++) {
  
            if (this.tempedit.data[index].id == id) {
              this.editclauses.push(this.tempedit.data[index]);
              this.editid = this.tempedit.data[index].id;
  
              this.editclausetext = this.tempedit.data[index].termsName;
              this.tmpeditclausetext = this.tempedit.data[index].termsName;
            }
          }
          console.log(this.editclausetext);
          console.log(this.editclause);
        });
    }
  
    editterms(id) {
      let tempupdate = {
        id: id,
        termsName: "<strike>" + this.tmpeditclausetext + "</strike>" + " " + this.editclausetext
      }
  
  
      this._userService.customeClauseuUpdate(tempupdate)
        .subscribe(res => {
          this._fuseSidebarService.getSidebar('editPanel').toggleOpen();
        });
      // for (let index = 0; index < this.clauses.length; index++) {
      //   if (this.clauses[index].id == eid) {
      //     this.clauses[index].termsName = "<strike>" + this.tmpeditclausetext + "</strike>" + " " + this.editclausetext;
      //   }
      // }
      this.editclausetext = '';
      // this.clausesDetail();
    }
  
  
    customToggle(key, cid): void {
      let id = cid;
      this._fuseSidebarService.getSidebar(key).toggleOpen();
      for (let index = 0; index < this.newClause.length; index++) {
        if (this.newClause[index].id == id) {
          //  this.editclauses.push(this.newClause[index]);
          this.ceditid = this.newClause[index].id;
          this.editclausetext = this.newClause[index].termsName;
          this.tmpceditclausetext = this.newClause[index].termsName;
        }
      }
      console.log(this.editclausetext);
      console.log(this.ceditid);
    }
  
  
    customEdit(id) {
      let ceid = id;
      let tempedit = {
        id: this.ceditid,
        termsName: "<strike>" + this.tmpceditclausetext + "</strike>" + " " + this.editclausetext,
        updatedBy: localStorage.getItem('userId')
      }
      console.log(tempedit);
      
      this._userService.customeClauseuUpdate(tempedit)
        .subscribe(res => {
          console.log(res);
        });
  
      this.display();
      // for (let index = 0; index < this.newClause.length; index++) {
      //   if (this.newClause[index].id == id) {
      //     this.newClause[index].termsName = "<strike>" + this.tmpceditclausetext + "</strike>" + " " + this.editclausetext;
      //     // this.newClause[index].termsName = this.editclausetext;
      //   }
      // }
      this._fuseSidebarService.getSidebar('customPanel').toggleOpen();
  
      this.editclausetext = '';
      // this.display();
      console.log(this.newClause);
  
    }
  
  
    display() {
      let tempres: any;
      this.newClause = [];
      this._userService.customeClauseList()
        .subscribe(res => {
          console.log(res);
          tempres = res;
          if (tempres.success == true) {
            for (let index = 0; index < tempres.data.length; index++) {
              if (tempres.data[index].parentId == this.parentId) {
                this.newClause.push(tempres.data[index]);
              }
            }
          }
          this.customCl = true;
          console.log(tempres.data);
          console.log(this.newClause);
        });
  
      // let tempCaluse = JSON.parse(localStorage.getItem('newClause'));
      // // if (this.newClause.length) {
      // for (let index = 0; index < tempCaluse.length; index++) {
  
      //   if (tempCaluse[index].parentId == this.parentId) {
      //     this.newClause.push(tempCaluse[index]);
      //   }
      // }  
      // }
    }
  
  
    addClause() {
      // let add = new Array; 
  
      // let companyId = localStorage.getItem('companyId');
      // let formId = localStorage.getItem('formId');
      // l et drawchaterId = localStorage.getItem('drawcharterId');
  
      let temp = {
        mainUserId:localStorage.getItem('userId'),
        companyId: localStorage.getItem('companyId'),
        formId: localStorage.getItem('cpFormId'),
        drawId: localStorage.getItem('drawId'),
        clauseCategoryId: this.parentId,
        nos: 1,
        status: true,
        termsName: this.customClause,
        createdBy: localStorage.getItem('userId')
      }

      console.log(temp);
      this._fuseSidebarService.getSidebar('addPanel').toggleOpen();
      this._userService.clauseCustomeTermsUpdate(temp)
        .subscribe(res => {
        console.log(res);
        this.display()
        });
      // this._fuseSidebarService.getSidebar('addpanel').toggleClose();
      // this.add.push(temp);
      // localStorage.setItem('newClause', JSON.stringify(this.add));
      // console.log(localStorage.getItem('newClause'));
      this.tempid = this.tempid + 1;

    }
}
