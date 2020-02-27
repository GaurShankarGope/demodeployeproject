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
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { RoleManagementComponent } from 'app/main/apps/role-management/role-management.component';
import { RoleManagementService } from 'app/main/apps/role-management/role-management.service';

const routes: Routes = [
    {
        path     : '**',
        component: RoleManagementComponent,
        resolve  : {
            contacts: RoleManagementService
        }
    }
];

@NgModule({
    declarations   : [
        RoleManagementComponent,
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        RoleManagementService
    ],
    entryComponents: [
    ]
})
export class RoleManagementModule
{
}
