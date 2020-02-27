import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AnalyticsDashboardComponent } from 'app/main/apps/dashboards/analytics/analytics.component';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';

import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

const routes: Routes = [
    {
        path: '**',
        component: AnalyticsDashboardComponent,
        resolve: {
            data: AnalyticsDashboardService
        }
    }
];

@NgModule({
    declarations: [
        AnalyticsDashboardComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        CommonModule,
        MatRadioModule,
        MatProgressBarModule,
        MatGridListModule,
        FuseConfirmDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatPaginatorModule,

        MatCheckboxModule,
        MatDatepickerModule,
        MatInputModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        // MatPaginator,
        // MatTableDataSource,

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        ChartsModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        AnalyticsDashboardService
    ]
})
export class AnalyticsDashboardModule {
}

