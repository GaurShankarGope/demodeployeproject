import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {Component} from '@angular/core';
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
// import {MatDatepickerModule} from '@angular/material/datepicker';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

import {MatSelectModule} from '@angular/material/select';
import {TableModule} from 'primeng/table';
import { VesselManagementComponent } from 'app/main/apps/vessel-management/vessel-management.component';
import { AddVesselComponent } from 'app/main/apps/vessel-management/add-vessel/add-vessel.component';
import { EditVesselComponent } from 'app/main/apps/vessel-management/edit-vessel/edit-vessel.component';
import { VesselDetailComponent } from 'app/main/apps/vessel-management/vessel-detail/vessel-detail.component';
const routes: Routes = [
    {
        path     : 'add-vessel',
        component: AddVesselComponent,
    },
    {
        path     : 'edit-vessel',
        component: EditVesselComponent,
    },
    {
        path     : 'vessel-detail',
        component: VesselDetailComponent,
    },
    {
        path     : '**',
        component: VesselManagementComponent,
    }
];
@NgModule({
    declarations   : [
        VesselManagementComponent,
        AddVesselComponent,
        EditVesselComponent,
        VesselDetailComponent
    ],
    imports        : [
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
        MatGridListModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatTabsModule
    ],
    providers      : [
    ],
    entryComponents: [
    ]
})
export class VesselManagementModule
{
}
