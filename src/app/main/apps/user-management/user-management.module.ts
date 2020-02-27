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
// import {NgxMatIntlTelInputModule} from 'ngx-mat-intl-tel-input';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatSelectModule} from '@angular/material/select';
import { UserManagementComponent } from 'app/main/apps/user-management/user-management.component';
import { AddUserComponent } from 'app/main/apps/user-management/add-user/add-user.component';
import { EditUserComponent } from 'app/main/apps/user-management/edit-user/edit-user.component';
const routes: Routes = [
    {
        path     : 'add-user',
        component: AddUserComponent,
    },
    {
        path     : 'edit-user',
        component: EditUserComponent,
    },
    {
        path     : '**',
        component: UserManagementComponent,
    }
];
@NgModule({
    declarations   : [
        UserManagementComponent,
        AddUserComponent,
        EditUserComponent
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
        // NgxMatIntlTelInputModule,
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
export class UserManagementModule
{
}
