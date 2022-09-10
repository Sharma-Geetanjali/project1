import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';

@Component({
  selector: 'app-sidenav2',
  templateUrl: './sidenav2.component.html',
  styleUrls: ['./sidenav2.component.css']
})
export class Sidenav2Component implements OnInit {


  // sideBarIsOpen: boolean = false;
  userData: Array<any> = [];
  groupData: Array<any> = [];
  dashboardData: Array<any> = [];
  groupListDataArray: Array<any> = [];
  consignorListDataArray: Array<any> = [];
  consigneeListDataArray: Array<any> = [];
  consignmentGroupListDataArray: Array<any> = [];





  constructor(
    public login: LoginServiceService,
    public global: GlobalConfigService,
    private theme: ThemeServiceService,
    private vehicles: VehicleListService,
    private sharing: SharingService,private router: Router
  ) { }
  imgPath = this.global.imgPath;
  ngOnInit(): void {
    this.getCurrentUser();
    this.getResourceAccess();
    
    
    // console.log(document.getElementById('mainDiv').children[0].attributes.getNamedItem('routerlink').nodeValue);
    // console.log(document.getElementById('mainDiv').childNodes);
    this.getGroupListData();
    this.getConsignorListData();
    this.getConsigneeListData();
    this.getConsignmentGroupListData();
    // console.log(this.global.userActions)
      // console.log(this.global.checkAction('DASHBOARD')) 

    setTimeout(()=>{
      // console.log(this.global.checkAction('DASHBOARD')) 
      if (this.global.checkAction('INSIGHT')) {
        // console.log("gg")
        this.router.navigateByUrl('/dashboard/Vehicle-Dashboard');
      }else if(this.global.checkAction('DASHBOARD')){
        this.router.navigateByUrl('/dashboard/vehicles/vehicleList');
      }else if(this.global.checkAction('DEALER_BILLINGS')){
        this.router.navigateByUrl('/dashboard/consignment');
      }else if(this.global.checkAction('MANAGE_ROUTE_MASTERS')){
        this.router.navigateByUrl('/dashboard/departments/routes');
      }else if(this.global.checkAction('MANAGE_CONSIGNORS')){
        this.router.navigateByUrl('/dashboard/departments/consignor');
      }else if(this.global.checkAction('MANAGE_CONSIGNEES')){
        this.router.navigateByUrl('/dashboard/departments/consignee');
      }else if(this.global.checkIf('OVER_SPEEDING')){
        this.router.navigateByUrl('/dashboard/alerts');
      }else if(this.global.checkReport('TRIP_DAILY') ||this.global.checkReport('TRIP_SUMMARY') ||this.global.checkReport('DAYWISE_DISTANCE') ||this.global.checkReport('STOPPAGE_REPORT') ||this.global.checkReport('CONSIGNMENT_DETAIL') ||this.global.checkReport('DUTY_REPORTS') ||this.global.checkReport('CONSIGNMENT_SUMMARY') ||this.global.checkReport('DTC_REPORT') ||this.global.checkReport('DTC_MODEL_WISE') ||this.global.checkReport('CONTAINER_TRACKING') ||this.global.checkReport('DAILY_PAYMENT_REPORT') ||this.global.checkReport('VEHICLE_FITNESS_REPORT') ||this.global.checkReport('DAILY_RUNNING') ||this.global.checkReport('VEHICLE_TRACKING') ||this.global.checkReport('CONSIGNMENT_RECONCILIATION') ||this.global.checkReport('COMMODITY_REPORT') ||this.global.checkReport('KPI_VIOLATION_REPORT') ||this.global.checkReport('USER_ACTIVITY')){
        this.router.navigateByUrl('/dashboard/reports');
      }else if(this.global.checkAction('EOL')){
        this.router.navigateByUrl('/dashboard/eol');
      }else if(this.global.checkAction('MANAGE_DEVICE')){
        this.router.navigateByUrl('/dashboard/device');
      }else if(this.global.checkAction('MARKETING_PORTAL')){
        this.router.navigateByUrl('/dashboard/Buzz-List');
      }else if(this.global.checkAction('ADMIN_SUBSCRIPTION_MANAGEMENT')){
        this.router.navigateByUrl('/dashboard/subscriptionManagement/search');
      }
    },500)
  }
  


  async getResourceAccess() {
    try {
      const res: any = await this.login.getResourceAccess();
      this.userData = res;
      this.global.getUserData(this.userData);
    } catch (err) {
      console.log(err);
    }
  }


  async getCurrentUser() {
    try {
      const res: any = await this.login.getCurrentUser();
      if (res) {
      this.login.setInfo(res);

      }
    } catch (err) {
      console.log(err);
    }
  }

  async getGroupListData() {
    try {
      const res: any = await this.vehicles.getGroupList();
      // console.log(res)

      if(res){

        this.groupListDataArray = res;
        // console.log(res)
        this.sharing.setGroupListData(this.groupListDataArray);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async getConsignmentGroupListData() {
    try {
      const res: any = await this.vehicles.getConsignmentsGroup();
      this.consignmentGroupListDataArray = res;
      this.sharing.setConsignmentGroupListData(this.consignmentGroupListDataArray);
    }
    catch (err) {
      console.log(err);
    }
  }

  async getConsignorListData() {
    try {
      const res: any = await this.vehicles.getAllConsignors();
      this.consignorListDataArray = res;
      this.sharing.setConsignorListData(this.consignorListDataArray);
    }
    catch (err) {
      console.log(err);
    }
  }

  async getConsigneeListData() {
    try {
      const res: any = await this.vehicles.getAllConsignees();
      this.consigneeListDataArray = res;
      this.sharing.setConsigneeListData(this.consigneeListDataArray);


    }
    catch (err) {
      console.log(err);
    }
  }



}
