import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {


 // tempUrl = 'https://qa10.carot.com:8443';
 tempUrl = 'https://qa8.carot.com/v3/api';
  // token: any;
  // token =  '39986918-d39e-4658-87e1-8f1c30025b2d';


  httpOptions: any;

  constructor(private http: HttpClient, private router: ActivatedRoute) {
    // this.router.queryParams.subscribe(val => this.token = val.token)
   }



  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


  getTopLevelGroup() {

this.httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('auth_key_Carot')
    // 'Authorization': 'bearer a8d301da-b51a-4ef7-8e20-9319e5833615'

  })
}
    // let orgID = localStorage.getItem('orgId')
    return this.http.get(`${this.tempUrl}/mlh/departmentGroup/groupWithoutParent`, this.httpOptions).toPromise()
  }

  getsubgroup(id) {

    return this.http.get(`${this.tempUrl}/mlh/departmentGroup/childGroupForParent/${id}`, this.httpOptions).toPromise()
  }

  createGroupWithParent(formData) {

    return this.http.post(`${this.tempUrl}/mlh/departmentGroup/create`,formData, this.httpOptions).toPromise()
  }

  searchGroupName(formData) {
    return this.http.get(`${this.tempUrl}/mlh/departmentGroup/searchGroupByNamePhrase?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  changeParentOfGroup(formData) {

    return this.http.put(`${this.tempUrl}/mlh/departmentGroup/changeParent?${this.serialize(formData)}`,'', this.httpOptions).toPromise()
  }

  renameGroupfn(formData) {
    return this.http.put(`${this.tempUrl}/mlh/departmentGroup/updateGroupName?${this.serialize(formData)}`,'', this.httpOptions).toPromise()
  }

  deleteGroup(formData) {

    return this.http.delete(`${this.tempUrl}/mlh/departmentGroup/delete?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  getleagecyGroup(formData) {

    return this.http.get(`${this.tempUrl}/mlh/departmentGroup/getDepartmentGroupByGroupId/${formData}`, this.httpOptions).toPromise()
  }

  searchLegacyGroupName(formData) {
    // let orgID = localStorage.getItem('orgId')
    return this.http.get(`${this.tempUrl}/um/departmentGroup/searchDepartmentGroupByNamePhrase/?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  addLegacyGroup(formData,id) {

    return this.http.post(`${this.tempUrl}/mlh/departmentGroup/${id}/addGroupAccess`,formData, this.httpOptions).toPromise()
  }
}


