import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// import { MatRadioModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { AngularEditorModule } from '@kolkov/angular-editor';

// import { MatButtonModule } from '@angular/material';

import {DrawFirstCounterManagementComponent} from 'app/main/apps/draw-first-counter-management/draw-first-counter-management.component';

const routes: Routes =
[  
    {
        path     : '**',
        component: DrawFirstCounterManagementComponent,
    }
];

@NgModule(
{
    declarations:
    [
        DrawFirstCounterManagementComponent
    ],
    
    imports:
    [
        CommonModule,
        RouterModule.forChild(routes),
        MatPaginatorModule,
        MatButtonModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatExpansionModule,
        NgxMaterialTimepickerModule,
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
        AngularEditorModule,
        MatProgressBarModule,
        MatButtonModule,
        MatInputModule,
        MatRippleModule,
    ],

    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
      ],
})
export class DFCManagementModule { }