import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharingService {
  data: any = undefined;
  vehicleData: any = undefined;
  groupListData: any = undefined;
  consignorListData: any = undefined;
  consigneeListData: any = undefined;
  roleData: any = undefined;
  routeData: any = undefined;
  consignmentGroupListData: any = undefined
  vehicleFlag: any = undefined;
  consignmentData: any = undefined;
  consignmentFlag: any = undefined;


  public groupListDataObs = new Subject<any>();
  public consignorListDataObs = new Subject<any>();
  public consigneeListDataObs = new Subject<any>();
  public consignmentGroupListDataObs = new Subject<any>();

  groupListDataObservable$ = this.groupListDataObs.asObservable();
  consignorListDataObservable$ = this.consignorListDataObs.asObservable();
  consigneeListDataObservable$ = this.consigneeListDataObs.asObservable();
  consignmentGroupListDataObservable$ = this.consignmentGroupListDataObs.asObservable();



  constructor() { }

  setRoleData(roleID) {
    this.roleData = roleID;
  }

  getRoleData(): any {
    return this.roleData;
  }

  setData(data:any){
      this.data = data;
  }

  getData():any{
      return this.data;
  }

  setVehicleData(data: any) {

    this.vehicleData = data;
    console.log(this.vehicleData);
  }

  setVehicleFlag(data: any) {
    this.vehicleFlag = data;
    // console.log(this.vehicleData);
  }

  getVehicleData() {
    return this.vehicleData;
  }

  setConsignmentData(data: any) {

    this.consignmentData = data;
  }

  getConsignmentData() {
    return this.consignmentData;
  }

  setConsignmentFlag(data: any) {
    this.consignmentFlag = data;
  }

  setGroupListData(data: any) {
    this.groupListData = data;
    this.groupListDataObs.next(true);

  }

  getGroupListData():any{
    return this.groupListData;
}

  setConsignorListData(data: any) {
    this.consignorListData = data;
    this.consignorListDataObs.next(true);
  }

  getConsignorListData():any{
    return this.consignorListData;
}


  setConsigneeListData(data: any) {
    this.consigneeListData = data;
    this.consigneeListDataObs.next(true);

  }

  getConsigneeListData():any{
    return this.consigneeListData;
  }

  setspecificRouteData(data:any) {
    this.routeData = data;
  }

  getspecificRouteData():any {
   return this.routeData;
  }

  setConsignmentGroupListData(data: any) {
    this.consignmentGroupListData = data;
    this.consignmentGroupListDataObs.next(true);
  }

  getConsignmentGroupListData():any {
    return this.consignmentGroupListData;
   }
}
