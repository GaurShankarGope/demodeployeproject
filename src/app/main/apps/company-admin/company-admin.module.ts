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
import { CompanyAdminComponent } from 'app/main/apps/company-admin/company-admin.component';
import { EditCompanyAdminComponent } from 'app/main/apps/company-admin/editcompany-admin/editcompany-admin.component';
import { AddCompanyAdminComponent } from 'app/main/apps/company-admin/addcompany-admin/addcompany-admin.component';
const routes: Routes = [
    {
        path     : 'edit',
        component: EditCompanyAdminComponent,
    },
    {
        path     : 'addcompany-admin',
        component: AddCompanyAdminComponent,
    },
    {
        path     : '**',
        component: CompanyAdminComponent,
    }
];
@NgModule({
    declarations   : [
        CompanyAdminComponent,
        EditCompanyAdminComponent,
        AddCompanyAdminComponent,
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
export class CompanyAdminModule
{
}
