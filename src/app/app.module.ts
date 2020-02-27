import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import { SignaturePadModule } from 'angular2-signaturepad';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
// import { AngularSignaturePadModule } from 's';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule } from '@angular/material';
import 'hammerjs';

// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule
} from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
import { ToastrModule } from 'ngx-toastr';
import { ClauseCategoryTermsComponent } from './clause-category-terms/clause-category-terms.component';

const appRoutes: Routes = [
    {
        path: 'apps',
        loadChildren: './main/apps/apps.module#AppsModule'
    },
    {
        path: 'pages',
        loadChildren: './main/pages/pages.module#PagesModule'
    },
    {
        path: '**',
        redirectTo: 'pages/auth/login'
    }
];

@NgModule({
    declarations: [AppComponent, ClauseCategoryTermsComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SignaturePadModule,
        NgxMaterialTimepickerModule,
        RouterModule.forRoot(appRoutes , { useHash: true }),
        ToastrModule.forRoot(), // ToastrModule added

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),
        // Material moment date module
        MatMomentDateModule,
        // Material
        MatButtonModule,
        MatIconModule,
        // MatFormFieldModule,
        // MatInputModule,
        // MatTableModule,
        // MatSortModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule

    ],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap: [AppComponent]
})
export class AppModule { }
