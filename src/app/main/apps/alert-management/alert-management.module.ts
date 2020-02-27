import { NgModule } from '@angular/core';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatSelectModule } from '@angular/material/select';
import { AlertManagementComponent } from 'app/main/apps/alert-management/alert-management.component';
import { AddAlertComponent } from 'app/main/apps/alert-management/add-alert/add-alert.component';
import { EditAlertComponent } from 'app/main/apps/alert-management/edit-alert/edit-alert.component';
import { SubListComponent } from 'app/main/apps/alert-management/sub-list/sub-list.component';
const routes: Routes = [
    {
        path: 'add-alert',
        component: AddAlertComponent,
    },
    {
        path: 'edit-alert',
        component: EditAlertComponent,
    },
    {
        path: 'sub-list',
        component: SubListComponent,
    },
    {
        path: '**',
        component: AlertManagementComponent,
    }
];
@NgModule({
    declarations: [
        AlertManagementComponent,
        AddAlertComponent,
        EditAlertComponent,
        SubListComponent
    ],
    imports: [
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
    ],
    providers: [
    ],
    entryComponents: [
    ]
})
export class AlertManagementModule {
}
