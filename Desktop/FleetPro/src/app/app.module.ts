import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { NgModule,APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2SearchPipeModule } from 'ng2-search-filter';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxFileDropModule } from 'ngx-file-drop';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { AgmCoreModule,LAZY_MAPS_API_CONFIG,LazyMapsAPILoaderConfigLiteral } from '@agm/core';
import { AgmOverlays } from "agm-overlays"
// import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

// Angular material

import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { MatBadgeModule } from '@angular/material/badge';
import {  MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { AgmDirectionModule } from 'agm-direction';
import {MatExpansionModule} from '@angular/material/expansion';



// component
import { LoginSignupComponent } from './login-signup/login-signup/login-signup.component';
import { SliderComponent } from './login-signup/slider/slider.component';
import { HeaderComponent } from './header-footer/header/header.component';
import { FooterComponent } from './header-footer/footer/footer.component';
import { DashbordComponent } from './dashBoard/dashbord/dashbord.component';
import { MainHeaderComponent } from './header-footer/main-header/main-header.component';
import { SideNavComponent } from './sidenav/side-nav/side-nav.component';
import { EolReportComponent } from './dashboard-components/EOL/eol-report/eol-report.component';
import { EolTestingComponent } from './dashboard-components/EOL/eol-testing/eol-testing.component';
import { TKMEOLTestingComponent } from './dashboard-components/EOL/tkm-eol-testing/tkm-eol-testing.component';
import { TKMEOLReportComponent } from './dashboard-components/EOL/tkm-eol-report/tkm-eol-report.component';
import { ConsignmentReportComponent } from './dashboard-components/Reports/consignment-report/consignment-report.component';
import { VehiclesListComponent } from './dashboard-components/vehicles/vehicles-list/vehicles-list.component';
import { VehiclesMapComponent } from './dashboard-components/vehicles/vehicles-map/vehicles-map.component';
import { NgxPrintModule } from 'ngx-print';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { BarcodeGeneratorAllModule,QRCodeGeneratorAllModule,DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { ConsignmentsComponent } from './dashboard-components/consignments/consignments.component';
import { MapTrackingComponent } from './dashboard-components/map-tracking/map-tracking.component';
import { TrackingReportComponent } from './dashboard-components/Reports/tracking-report/tracking-report.component';
import { DailyRunningComponent } from './dashboard-components/Reports/daily-running/daily-running.component';








import { AddDeviceComponent } from './dashboard-components/device-management/add-device/add-device.component';
import { MapDeviceComponent } from './dashboard-components/device-management/map-device/map-device.component';
import { CommodityReportComponent } from './dashboard-components/Reports/commodity-report/commodity-report.component';
import { KpiViolationReportComponent } from './dashboard-components/Reports/kpi-violation-report/kpi-violation-report.component';
import { ReconciliationReportComponent } from './dashboard-components/Reports/reconciliation-report/reconciliation-report.component';
import { AlertsMainComponent } from './dashboard-components/Alerts/alerts-main/alerts-main.component';
import { OverSpeedingComponent } from './dashboard-components/Alerts/over-speeding/over-speeding.component';
import { EngineIdlingComponent } from './dashboard-components/Alerts/engine-idling/engine-idling.component';
import { HarshBreakComponent } from './dashboard-components/Alerts/harsh-break/harsh-break.component';
import { HighAccelerationComponent } from './dashboard-components/Alerts/high-acceleration/high-acceleration.component';
import { GeoFenceComponent } from './dashboard-components/Alerts/geo-fence/geo-fence.component';
import { EngineOnComponent } from './dashboard-components/Alerts/engine-on/engine-on.component';
import { EngineOffComponent } from './dashboard-components/Alerts/engine-off/engine-off.component';
import { DTCAlertComponent } from './dashboard-components/Alerts/dtc-alert/dtc-alert.component';
import { DevicePluggedInComponent } from './dashboard-components/Alerts/device-plugged-in/device-plugged-in.component';
import { DisconnectedComponent } from './dashboard-components/Alerts/disconnected/disconnected.component';
import { TempSensorComponent } from './dashboard-components/Alerts/temp-sensor/temp-sensor.component';
import { CoolentTempComponent } from './dashboard-components/Alerts/coolent-temp/coolent-temp.component';
import { ActivityLogReportComponent } from './dashboard-components/Reports/activity-log-report/activity-log-report.component';
import { RoutesComponent } from './dashboard-components/departments/routes/routes.component';
import { ConsignorComponent } from './dashboard-components/departments/consignor/consignor.component';
import { ConsigneeComponent } from './dashboard-components/departments/consignee/consignee.component';
import { AlertsMapComponent } from './dashboard-components/Alerts/alerts-map/alerts-map.component';
import { Sidenav2Component } from './sidenav/sidenav2/sidenav2.component';
import { CreateConsignorComponent } from './dashboard-components/departments/create-consignor/create-consignor.component';
import { CreateConsigneeComponent } from './dashboard-components/departments/create-consignee/create-consignee.component';
import { CreateRouteComponent } from './dashboard-components/departments/create-route/create-route.component';
import { EditConsignorComponent } from './dashboard-components/departments/edit-consignor/edit-consignor.component';
import { EditConsigneeComponent } from './dashboard-components/departments/edit-consignee/edit-consignee.component';
import { UserManagementComponent } from './dashboard-components/settings/user-management/user-management.component';
import { DashboardComponent } from './dashboard-components/insights/dashboard/dashboard.component';
import { DashboardMapComponent } from './dashboard-components/insights/dashboard-map/dashboard-map.component';
import { GroupManagementComponent } from './dashboard-components/settings/group-management/group-management.component';
import { CreateUserComponent } from './dashboard-components/settings/create-user/create-user.component';
import { CreateRoleComponent } from './dashboard-components/settings/create-role/create-role.component';
import { SharingService } from './Services/sharingService/sharing.service';
import { RoleManagementComponent } from './dashboard-components/settings/role-management/role-management.component';
import { DepartmentGroupComponent } from './dashboard-components/settings/department-group/department-group.component';
import { SpecificDeviceViewComponent } from './dashboard-components/device-management/specific-device-view/specific-device-view.component';
import { DealerDashboardComponent } from './dashboard-components/insights/dealer-dashboard/dealer-dashboard.component';
import { ServiceDashboardComponent } from './dashboard-components/insights/service-dashboard/service-dashboard.component';
import { ManageDeviceComponent } from './dashboard-components/device-management/manage-device/manage-device.component';
import { AppMarketingComponent } from './dashboard-components/app-Marketing/app-marketing/app-marketing.component';
import { SearchSubscriptionComponent } from './dashboard-components/user-subscription/search-subscription/search-subscription.component';
import { UpdateSubscriptionComponent } from './dashboard-components/user-subscription/update-subscription/update-subscription.component';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { MatTooltipModule } from '@angular/material/tooltip';







@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    SliderComponent,
    HeaderComponent,
    FooterComponent,
    DashbordComponent,
    MainHeaderComponent,
    SideNavComponent,
    EolReportComponent,
    EolTestingComponent,
    TKMEOLTestingComponent,
    TKMEOLReportComponent,
    ConsignmentReportComponent,
    VehiclesListComponent,
    VehiclesMapComponent,
    ConsignmentsComponent,
    MapTrackingComponent,
    TrackingReportComponent,
    DailyRunningComponent,
    AddDeviceComponent,
    MapDeviceComponent,
    CommodityReportComponent,
    KpiViolationReportComponent,
    ReconciliationReportComponent,
    AlertsMainComponent,
    OverSpeedingComponent,
    EngineIdlingComponent,
    HarshBreakComponent,
    HighAccelerationComponent,
    GeoFenceComponent,
    EngineOnComponent,
    EngineOffComponent,
    DTCAlertComponent,
    DevicePluggedInComponent,
    DisconnectedComponent,
    TempSensorComponent,
    CoolentTempComponent,
    ActivityLogReportComponent,
    RoutesComponent,
    ConsignorComponent,
    ConsigneeComponent,
    // AlertsMapComponent,
    Sidenav2Component,
    CreateConsignorComponent,
    CreateConsigneeComponent,
    CreateRouteComponent,
    EditConsignorComponent,
    EditConsigneeComponent,
    UserManagementComponent,
    DashboardComponent,
    DashboardMapComponent,
    GroupManagementComponent,
    CreateUserComponent,
    CreateRoleComponent,
    RoleManagementComponent,
    DepartmentGroupComponent,
    SpecificDeviceViewComponent,
    DealerDashboardComponent,
    ServiceDashboardComponent,
    ManageDeviceComponent,
    AppMarketingComponent,
    SearchSubscriptionComponent,
    UpdateSubscriptionComponent,



  ],
  imports: [
    MatTooltipModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatInputModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxFileDropModule,
    Ng2SearchPipeModule,
    InfiniteScrollModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxSpinnerModule,
    MatBadgeModule,
    NgxPrintModule,
    NgxQRCodeModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSelectInfiniteScrollModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAb829yZgKMVzUnMQMCoJnG2Pw29yD5CkA',
      // apiKey: 'AIzaSyBTV-MaDp2EJWZLbRt4lnaAKqsHD6-f0Bs',
      libraries: ['places','geometry','drawing']
    }),
    AgmDirectionModule,
    ScrollingModule,
    AgmJsMarkerClustererModule,
    AgmOverlays,
    // AgmJsMarkerClustererModule
    // AgmSnazzyInfoWindowModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,
    MatAutocompleteModule,
    MatTabsModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },SharingService,GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule {

}
