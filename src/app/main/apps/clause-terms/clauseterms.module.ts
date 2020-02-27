import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatSelectModule} from '@angular/material/select';

import { ClauseTermsComponent } from './clause-terms.component';
import { AddClauseTermsComponent } from './add-clause-terms/add-clause-terms.component';
import { EditClauseTermsComponent } from './edit-clause-terms/edit-clause-terms.component';
const routes: Routes = [
  {
    path: 'edit',
    component: EditClauseTermsComponent,
  },
  {
    path: 'add',
    component: AddClauseTermsComponent,
  }, 
  {
    path: '**',
    component: ClauseTermsComponent,
  }
];

@NgModule({
  declarations: [
    ClauseTermsComponent,
    AddClauseTermsComponent,
    EditClauseTermsComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    MatGridListModule
   
  ]
})
export class clusesTermsModule { }
