import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {
  tempUrl = 'https://qa10.carot.com:8443';

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

  createUser(formData) {

    return this.http.post(`${this.url.apiV3url}api/um/user/inviteUser`,formData, this.httpOptions).toPromise()
  }

  getAllAccessRole() {
    return this.http.get(`${this.url.apiV3url}api/mlh/accessRole/getAllAccessRoles`, this.httpOptions).toPromise()
  }

  getAccessRoleById(id) {
    return this.http.get(`${this.url.apiV3url}api/mlh/accessRole/getAccessRoleDetailById/${id}`, this.httpOptions).toPromise()
  }

  createRoleUserMapping(formData) {
    return this.http.post(`${this.url.apiV3url}api/mlh/accessRole/createRoleUserMapping`,formData, this.httpOptions).toPromise()
  }

  searchLegacyGroupName(formData) {

    return this.http.get(`${this.url.apiV3url}api/mlh/group/searchGroupByNamePhrase?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  assignGroupToUser(formData) {
    return this.http.post(`${this.url.apiV3url}api/mlh/groupUser/create`,formData, this.httpOptions).toPromise()
  }

  getAccessRoleByName(formData) {
    return this.http.get(`${this.url.apiV3url}api/mlh/accessRole/getAccessRoleByName?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  deleteRole(formData) {
    return this.http.delete(`${this.url.apiV3url}api/mlh/accessRole/delete/${formData}`, this.httpOptions).toPromise()
  }

  updateUser(formData,userid) {

    return this.http.post(`${this.url.apiRestUrl}users/update/${userid}`,formData, this.httpOptions).toPromise()
  }

  searchDepartGroupName(formData) {
    // let orgID = localStorage.getItem('orgId')
    return this.http.get(`${this.url.apiV3url}api/um/departmentGroup/searchDepartmentGroupByNamePhrase/?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  assigndepartmentToUser(formData) {
    return this.http.post(`${this.url.apiV3url}api/mlh/departmentGroupUser/create`,formData, this.httpOptions).toPromise()
  }




}
