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
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatSelectModule} from '@angular/material/select';
import { OwnerManagementComponent } from 'app/main/apps/owner-management/owner-management.component';
import { AddOwnerComponent } from 'app/main/apps/owner-management/add-owner/add-owner.component';
import { EditOwnerComponent } from 'app/main/apps/owner-management/edit-owner/edit-owner.component';
const routes: Routes = [
    {
        path     : 'add-owner',
        component: AddOwnerComponent,
    },
    {
        path     : 'edit-owner',
        component: EditOwnerComponent,
    },
    {
        path     : '**',
        component: OwnerManagementComponent,
    }
];
@NgModule({
    declarations   : [
        OwnerManagementComponent,
        AddOwnerComponent,
        EditOwnerComponent
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
        MatGridListModule
    ],
    providers      : [
    ],
    entryComponents: [
    ]
})
export class OwnerManagementModule
{
}
