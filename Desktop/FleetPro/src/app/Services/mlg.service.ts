import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlServiceService } from '../Services/Url/url-service.service';
import Axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MLGService {


  // tempUrl = 'https://qa10.carot.com:8443/api/v3';
  tempUrl = 'https://qa8.carot.com/v3/api';
httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth_key_Carot')
        // 'Authorization': '39986918-d39e-4658-87e1-8f1c30025b2d'

      })
    }

  constructor(private http: HttpClient, private router: Router, private url: UrlServiceService) { }



  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


  getTopLevelGroup() {
    // console.log(this.httpOptions.headers)

    // let orgID = localStorage.getItem('orgID')
    return this.http.get(`${this.tempUrl}/mlh/group/groupWithoutParent`, this.httpOptions).toPromise()
  }

  getsubgroup(id) {

    return this.http.get(`${this.tempUrl}/mlh/group/childGroupForParent/${id}`, this.httpOptions).toPromise()
  }

  createGroupWithParent(formData) {

    return this.http.post(`${this.tempUrl}/mlh/group/create`,formData, this.httpOptions).toPromise()
  }

  searchGroupName(formData) {
    return this.http.get(`${this.tempUrl}/mlh/group/searchGroupByNamePhrase?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  changeParentOfGroup(formData) {

    return this.http.put(`${this.tempUrl}/mlh/group/changeParent?${this.serialize(formData)}`, '',this.httpOptions).toPromise();
  }

  renameGroupfn(formData) {

  //  const  headers = new  HttpHeaders().set("Authorization", localStorage.getItem('auth_key_Carot'));

    return this.http.put(`${this.tempUrl}/mlh/group/updateGroupName?${this.serialize(formData)}`,'',this.httpOptions).toPromise()
  }

  deleteGroup(formData) {

    return this.http.delete(`${this.tempUrl}/mlh/group/delete?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  getleagecyGroup(formData) {

    return this.http.get(`${this.tempUrl}/mlh/group/getVehicleGroupByGroupId/${formData}`, this.httpOptions).toPromise()
  }

  searchLegacyGroupName(formData) {
    // let orgID = localStorage.getItem('orgID')

    return this.http.get(`${this.tempUrl}/vm/vehicleGroup/searchVehicleGroupByNamePhrase/?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  addLegacyGroup(formData,id) {

    return this.http.post(`${this.tempUrl}/mlh/group/${id}/addGroupAccess`,formData, this.httpOptions).toPromise()
  }
}
