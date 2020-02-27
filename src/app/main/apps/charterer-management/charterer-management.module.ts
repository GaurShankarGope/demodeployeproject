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
import { ChartererManagementComponent } from 'app/main/apps/charterer-management/charterer-management.component';
import { AddChartererComponent } from 'app/main/apps/charterer-management/add-charterer/add-charterer.component';
import { EditChartererComponent } from 'app/main/apps/charterer-management/edit-charterer/edit-charterer.component';
const routes: Routes = [
    {
         path     : 'add-charterer',
         component: AddChartererComponent,
    },
    {
         path     : 'edit-charterer',
         component: EditChartererComponent,
    },
    {
        path     : '**',
        component: ChartererManagementComponent,
    }
];
@NgModule({
    declarations   : [
        ChartererManagementComponent,
        AddChartererComponent,
        EditChartererComponent,
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
export class ChartererManagementModule
{
}
