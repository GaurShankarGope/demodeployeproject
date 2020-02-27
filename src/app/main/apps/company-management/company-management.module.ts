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
import { CompanyManagementComponent } from 'app/main/apps/company-management/company-management.component';
import { AddCompanyComponent } from 'app/main/apps/company-management/add-company/add-company.component';
import { EditCompanyComponent } from 'app/main/apps/company-management/edit-company/edit-company.component';

const routes: Routes = [
    {
        path     : 'add-company',
        component: AddCompanyComponent,
    },
    {
        path     : 'edit-company',
        component: EditCompanyComponent,
    },
    {
        path     : '**',
        component: CompanyManagementComponent,
    }
   
];
@NgModule({
    declarations   : [
        CompanyManagementComponent,
        AddCompanyComponent,
        EditCompanyComponent
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
export class CompanyManagementModule
{
}
