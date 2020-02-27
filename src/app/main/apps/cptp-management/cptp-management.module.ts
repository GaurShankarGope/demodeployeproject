import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// import { MatRadioModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
// import {NgxMaterialTimepickerModule} from '@angular/';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
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

// import { CptpManagementComponent } from 'app/main/apps/draw/draw.component';
// import { ReviewComponent } from './review/review.component';

import { CptpManagementComponent } from './cptp-management.component';
import { AddCptpManagementComponent } from './add-cptp-management/add-cptp-management.component'
import { EditCptpManagementComponent } from './edit-cptp-management/edit-cptp-management.component';
import { CptpFormManagementComponent } from './cptp-form-management/cptp-form-management.component';

const routes: Routes =
[  
    {
        path     : 'add',
        component: AddCptpManagementComponent,
    },
    {
        path     : 'edit',
        component: EditCptpManagementComponent,
    },
    {
        path     : 'form',
        component: CptpFormManagementComponent,
    },
    {
        path     : '**',
        component: CptpManagementComponent,
    },
  
];

@NgModule(
{
    declarations:
    [
        CptpManagementComponent,
        AddCptpManagementComponent,
        EditCptpManagementComponent,
        CptpFormManagementComponent
    ],
    
    imports:
    [
        CommonModule,
        RouterModule.forChild(routes),
        MatPaginatorModule,
        MaterialTimePickerModule,
        MatButtonModule,
        MatRadioModule,
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
        MatGridListModule,

        MatProgressBarModule,
    ]
})
export class CPTPManagementModule { }