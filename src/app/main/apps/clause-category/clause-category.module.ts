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

import { AddClauseCategoryComponent } from 'app/main/apps/clause-category/add-clause-category/add-clause-category.component';
import { EditClauseCategoryComponent } from 'app/main/apps/clause-category/edit-clause-category/edit-clause-category.component';
import { ClauseCategoryComponent } from 'app/main/apps/clause-category/clause-category.component';

const routes: Routes = [
  {
      path     : 'edit',
      component: EditClauseCategoryComponent,
  },
  {
      path     : 'add',
      component: AddClauseCategoryComponent,
  },
  {
      path     : '**',
      component: ClauseCategoryComponent,
  }
];

@NgModule({
  declarations: [
    AddClauseCategoryComponent,
    EditClauseCategoryComponent,
    ClauseCategoryComponent

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
export class ClauseCategoryModule { }
