import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// import { MatRadioModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatSelectModule} from '@angular/material/select';
import { AngularEditorModule } from '@kolkov/angular-editor';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatExpansionModule } from '@angular/material/expansion';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
// import { DrawComponent } from 'app/main/apps/draw/draw.component';

// import { ReviewComponent } from './review/review.component';

import { OwnershipComponent } from './ownership.component';

const routes: Routes =
[ 
    {
        path     : '**',
        component: OwnershipComponent,
    },
];

@NgModule(
{
    declarations:
    [
        OwnershipComponent
    ],
    
    imports:
    [
        CommonModule,
        RouterModule.forChild(routes),
        MatPaginatorModule,
        NgxMaterialTimepickerModule,
        MatButtonModule,
        MatRadioModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,
        MatRippleModule,
        MatTableModule,
        MatExpansionModule,
        MatToolbarModule,
        MatSelectModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatGridListModule,
        AngularEditorModule,

        MatProgressBarModule,
    ]
})
export class OwnershipManagementModule { }