import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationEnd } from '@angular/router';
import { LoginGuard } from './Services/Guard/login.guard';
import { LogoutGuard } from './Services/Guard/logout.guard';


import { LoginSignupComponent } from './login-signup/login-signup/login-signup.component';
import { DashbordComponent } from './dashBoard/dashbord/dashbord.component';
import { EolReportComponent } from './dashboard-components/EOL/eol-report/eol-report.component';
import { EolTestingComponent } from './dashboard-components/EOL/eol-testing/eol-testing.component';
import { TKMEOLTestingComponent } from './dashboard-components/EOL/tkm-eol-testing/tkm-eol-testing.component';
import { TKMEOLReportComponent } from './dashboard-components/EOL/tkm-eol-report/tkm-eol-report.component';
import { ConsignmentReportComponent } from './dashboard-components/Reports/consignment-report/consignment-report.component';
import { VehiclesListComponent } from './dashboard-components/vehicles/vehicles-list/vehicles-list.component';
import { ConsignmentsComponent } from './dashboard-components/consignments/consignments.component';
import { MapTrackingComponent } from './dashboard-components/map-tracking/map-tracking.component';
import { DailyRunningComponent } from './dashboard-components/Reports/daily-running/daily-running.component';
import { VehiclesMapComponent } from './dashboard-components/vehicles/vehicles-map/vehicles-map.component';
import { GlobalConfigService } from './Services/Global/global-config.service';
import { AddDeviceComponent } from './dashboard-components/device-management/add-device/add-device.component';
import { MapDeviceComponent } from './dashboard-components/device-management/map-device/map-device.component';
import { CommodityReportComponent } from './dashboard-components/Reports/commodity-report/commodity-report.component';
import { TrackingReportComponent } from './dashboard-components/Reports/tracking-report/tracking-report.component';
import { KpiViolationReportComponent } from './dashboard-components/Reports/kpi-violation-report/kpi-violation-report.component';
import { HeaderService } from './Services/header/header.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ReconciliationReportComponent } from './dashboard-components/Reports/reconciliation-report/reconciliation-report.component';
import { AlertsMainComponent } from './dashboard-components/Alerts/alerts-main/alerts-main.component';
import { ActivityLogReportComponent } from './dashboard-components/Reports/activity-log-report/activity-log-report.component';
import { RoutesComponent } from './dashboard-components/departments/routes/routes.component';
import { ConsignorComponent } from './dashboard-components/departments/consignor/consignor.component';
import { ConsigneeComponent } from './dashboard-components/departments/consignee/consignee.component';
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
import { DepartmentGroupComponent } from './dashboard-components/settings/department-group/department-group.component';
import { RoleManagementComponent } from './dashboard-components/settings/role-management/role-management.component';
import { SpecificDeviceViewComponent } from './dashboard-components/device-management/specific-device-view/specific-device-view.component';
import { DealerDashboardComponent } from './dashboard-components/insights/dealer-dashboard/dealer-dashboard.component';
import { ServiceDashboardService } from './Services/insights/service-dashboard/service-dashboard.service';
import { ServiceDashboardComponent } from './dashboard-components/insights/service-dashboard/service-dashboard.component';
import { ManageDeviceComponent } from './dashboard-components/device-management/manage-device/manage-device.component';
import { AppMarketingComponent } from './dashboard-components/app-Marketing/app-marketing/app-marketing.component';
import { SearchSubscriptionComponent } from './dashboard-components/user-subscription/search-subscription/search-subscription.component';
import { UpdateSubscriptionComponent } from './dashboard-components/user-subscription/update-subscription/update-subscription.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    // canActivate: [LogoutGuard]

  },
  {
    path: 'login',
    component: LoginSignupComponent,
    canActivate: [LogoutGuard]
  },
  {
    path: 'dashboard',
    component: DashbordComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'eol',
        // component: EolReportComponent,
        // redirectTo: 'dashboard',
        canActivate: [LoginGuard],
        children: [
          {
            path: '',
            redirectTo: 'report',
            pathMatch: 'prefix'
          },
          {
            path: 'report',
            component: EolReportComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'testing',
            component: EolTestingComponent,
            canActivate: [LoginGuard],

          },
          {
            path: 'tkm',
            redirectTo: 'tkm/report',
            pathMatch: 'prefix'
          },
          {
            path: 'tkm/testing',
            component: TKMEOLTestingComponent,
            canActivate: [LoginGuard],

          },
          {
            path: 'tkm/report',
            component: TKMEOLReportComponent,
            canActivate: [LoginGuard],

          }
        ]

      },
      {
        path: '',
        // component: EolReportComponent,
        // redirectTo: 'dashboard',
        canActivate: [LoginGuard],
        children: [
          {
            path: 'Buzz-List',
            component: AppMarketingComponent,
            canActivate: [LoginGuard],
          },
        ]

      },
      {
        path: 'reports',
        canActivate: [LoginGuard],
        children: [
          {
            path: '',
            redirectTo: 'consignmentReport',
            pathMatch: 'prefix'
          },
          {
            path: 'consignmentReport',
            component: ConsignmentReportComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'dailyRunningReport',
            component: DailyRunningComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'commodityReport',
            component: CommodityReportComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'trackingReport',
            component: TrackingReportComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'kpiReport',
            component: KpiViolationReportComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'reconciliationReport',
            component: ReconciliationReportComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'activityLogReport',
            component: ActivityLogReportComponent,
            canActivate: [LoginGuard],
          }
        ]

      }
      ,
      {
        path: 'vehicles',
        canActivate: [LoginGuard],
        children: [
          {
            path: '',
            redirectTo: 'vehicleList',
            pathMatch: 'prefix'
          },
          {
            path: 'vehicleList',
            component: VehiclesListComponent,
            canActivate: [LoginGuard],
          }
        ]

      },

      {
        path: 'subscriptionManagement',
        canActivate: [LoginGuard],
        children: [
          {
            path: '',
            redirectTo: 'search',
            pathMatch: 'prefix'
          },
          {
            path: 'search',
            canActivate: [LoginGuard],
            component: SearchSubscriptionComponent,
          },
          {
            path: ':subId',
            component: UpdateSubscriptionComponent,
            canActivate: [LoginGuard],
          },
        ]

      },

      {
        path: 'departments',
        canActivate: [LoginGuard],
        children: [
          {
            path: '',
            redirectTo: 'routes',
            pathMatch: 'prefix'
          },
          {
            path: 'routes',
            component: RoutesComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'consignor',
            component: ConsignorComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'consignee',
            component: ConsigneeComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'createConsignor',
            component: CreateConsignorComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'createConsignee',
            component: CreateConsigneeComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'createRoute',
            component: CreateRouteComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'editConsignor/:code',
            component: EditConsignorComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'editConsignee/:code',
            component: EditConsigneeComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Edit-Route/:id/:routeId/:routeMasterId',
            component: CreateRouteComponent,
            canActivate: [LoginGuard],
          },

        ]

      },
      {
        path: 'settings',
        canActivate: [LoginGuard],
        children: [
          {
            path: '',
            redirectTo: 'userManagement',
            pathMatch: 'prefix'
          },
          {
            path: 'userManagement',
            component: UserManagementComponent,
            canActivate: [LoginGuard],
          }
        ]

      },
      {
        path: 'consignment',
        component: ConsignmentsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'map/:url',
        component: MapTrackingComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'vehicleMap/:url',
        component: VehiclesMapComponent,
        canActivate: [LoginGuard],
      }, {
        path: 'device',
        canActivate: [LoginGuard],
        // component: AddDeviceComponent,
        children: [
          {
            path: '',
            redirectTo: 'add-device',
            pathMatch: 'prefix'
          },
          {
            path: 'add-device',
            component: AddDeviceComponent,
            canActivate: [LoginGuard],
          }
          ,
          {
            path: 'map-device',
            component: MapDeviceComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'specific-device',
            component: SpecificDeviceViewComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Manage-device',
            component: ManageDeviceComponent,
            canActivate: [LoginGuard],
          }
        ]

      }, {
        path: 'alerts',
        canActivate: [LoginGuard],
        component: AlertsMainComponent,
      }, {
        path: '',
        canActivate: [LoginGuard],
        // component: AddDeviceComponent,
        children: [
          {
            path: 'Vehicle-Dashboard',
            component: DashboardComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Dealer-Dashboard',
            component: DealerDashboardComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Service-Dashboard',
            component: ServiceDashboardComponent,
            canActivate: [LoginGuard],
          }
        ]
      }, {
        path: 'Dashboard-Map/:url',
        component: DashboardMapComponent,
        canActivate: [LoginGuard],
      }, {
        path: 'setting',
        canActivate: [LoginGuard],
        // component: AddDeviceComponent,
        children: [
          {
            path: '',
            redirectTo: 'Group-Management',
            pathMatch: 'prefix'
          },
          {
            path: 'Group-Management',
            component: GroupManagementComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'User-Management',
            component: UserManagementComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Create-User',
            component: CreateUserComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Create-Role',
            component: CreateRoleComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Edit-User',
            component: CreateUserComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Department-Groups',
            component: DepartmentGroupComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Role-Management',
            component: RoleManagementComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'Edit-Role',
            component: CreateRoleComponent,
            canActivate: [LoginGuard],
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {



  constructor(private router: Router, private global: GlobalConfigService, public headerS: HeaderService) {
    this.router.events.subscribe((el: NavigationEnd) => {
      this.global.changeImgpath();
      this.headerS.showDateFilter = false;
      // console.log(this.headerS.showDateFilter)

      // Remove all consignor data from localStorage

      if (window.location.href.indexOf('/dashboard/consignment') >= 0 || window.location.href.indexOf('/dashboard/map/') >= 0) {
      } else {
        localStorage.removeItem("allConsignor")
        localStorage.removeItem("consignData");

      }

      // Remove all vehicle data from localStorage as well as session storage

      if (window.location.href.indexOf('/dashboard/vehicles/vehicleList') >= 0 || window.location.href.indexOf('/dashboard/vehicleMap/') >= 0) {
      } else {
        localStorage.removeItem("groupData");
        sessionStorage.removeItem("vehcileData");
      }

      if (window.location.href.indexOf('/dashboard/Vehicle-Dashboard') >= 0 || window.location.href.indexOf('/dashboard/Dashboard-Map/') >= 0) {
      } else {
        localStorage.removeItem("groupData");
        sessionStorage.removeItem("dashboardData");
      }


      // Reset localStorage and sessionStorage on reload

      if (
        el.id === 1 &&
        el.url === el.urlAfterRedirects
      ) {
        localStorage.removeItem("allConsignor")
        localStorage.removeItem("groupData");
        localStorage.removeItem("consignData");
        sessionStorage.removeItem("vehcileData");
        sessionStorage.removeItem("dashboardData");


      }

      // Condition for dateFilter to visible on different routerlink

      // Consignment Report

      if (window.location.href.indexOf('/dashboard/reports/consignmentReport') >= 0) {
        this.headerS.showDateFilter = true;
      }

      // Daily Running Report

      if (window.location.href.indexOf('/dashboard/reports/dailyRunningReport') >= 0) {
        this.headerS.showDateFilter = true;
      }

      // Tracking Report

      if (window.location.href.indexOf('/dashboard/reports/trackingReport') >= 0) {
        this.headerS.showDateFilter = true;
      }

      // Commodity Report

      if (window.location.href.indexOf('/dashboard/reports/commodityReport') >= 0) {
        this.headerS.showDateFilter = true;
      }

      // KPI Report

      if (window.location.href.indexOf('/dashboard/reports/kpiReport') >= 0) {
        this.headerS.showDateFilter = true;
      }

      if (window.location.href.indexOf('/dashboard/alerts') >= 0) {
        this.headerS.showDateFilter = true;
      }

      // KPI Report

      //  if (window.location.href.indexOf('/dashboard/reports/kpiReport') >= 0) {
      //   this.headerS.showDateFilter = true;
      // }
    })
  }
}
