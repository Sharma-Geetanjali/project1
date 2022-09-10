import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UrlServiceService } from '../Url/url-service.service';
import { VehicleListService } from '../vehicle/vehicle-list.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalConfigService {
  mindaPlantCoordinate: Array<any> = [];
  // userData: Array<any> = [];
  userReports: Array<any> = [];
  userAlerts: Array<any> = [];
  userActions: Array<any> = [];
  imgPath;
  MapApiKey;
  groupListDataArray: Array<any> = [];
  consignorListDataArray: Array<any> = [];
  consigneeListDataArray: Array<any> = [];


  public groupListData = new Subject<any>();
  public consignorListData = new Subject<any>();
  public consigneeListData = new Subject<any>();

  groupListDataObservable$ = this.groupListData.asObservable();
  consignorListDataObservable$ = this.consignorListData.asObservable();
  consigneeListDataObservable$ = this.consigneeListData.asObservable();


  constructor(private vehicles: VehicleListService) {
  }

  async getGroupListData() {
    try {
      const res: any = await this.vehicles.getGroupList();
      this.groupListDataArray = res;
      // console.log("from global service")
      this.groupListData.next(true);
    }
    catch (err) {
      console.log(err);
    }
  }

  async getConsignorListData() {
    try {
      const res: any = await this.vehicles.getAllConsignors();
      this.consignorListDataArray = res;
      // console.log("from global service")
      this.consignorListData.next(true);
    }
    catch (err) {
      console.log(err);
    }
  }

  async getConsigneeListData() {
    try {
      const res: any = await this.vehicles.getAllConsignees();
      this.consigneeListDataArray = res;
      // console.log("from global service")
      this.consigneeListData.next(true);
    }
    catch (err) {
      console.log(err);
    }
  }

  changeImgpath() {

    if (window.location.hostname === 'fleetproqa.carot.com') {
      this.imgPath = '/qafleet-pro/assets'                      // for deployment on qa fleet pro//
      this.MapApiKey = 'AIzaSyAb829yZgKMVzUnMQMCoJnG2Pw29yD5CkA'

    } else if (window.location.hostname === 'fleetpro.carot.com') {
      this.imgPath = '/Fleet-Pro/assets'                         // for deployment  fleet pro//
      this.MapApiKey = 'AIzaSyAb829yZgKMVzUnMQMCoJnG2Pw29yD5CkA'

    }
    else {
      this.imgPath = '/assets'                                      // for localhost//
      this.MapApiKey = 'AIzaSyBTV-MaDp2EJWZLbRt4lnaAKqsHD6-f0Bs'

    }
  }

  getUserData(data) {
    // console.log(data)
    data.forEach(element => {

      if (element.visible == true && element.resourceType == 'REPORT') {
        this.userReports.push({ 'key': element.name })
      }

      if (element.visible == true && element.resourceType == 'EVENT' && element.type == "ALARM") {
        this.userAlerts.push({ 'key': element.name })
      }

      if (element.visible == true && element.resourceType == 'ACTION') {
        this.userActions.push({ 'key': element.name })

      }


    })

    // console.log('abc')
    // console.log(this.userAlerts)
  }

  checkType(val) {
    let check = this.userAlerts.find(el => el.key == val)
    if (check) {
      return true
    } else {
      return false
    }
  }



  checkIf(val) {
    let check = this.userAlerts.find(el => el.key == val)
    if (check) {
      return true
    } else {
      return false
    }
  }

  checkReport(val) {
    let check = this.userReports.find(el => el.key == val)
    if (check) {
      return true
    } else {
      return false
    }
  }

  checkAction(val) {
    let check = this.userActions.find(el => el.key == val)
    if (check) {
      return true
    } else {
      return false
    }
  }
}
