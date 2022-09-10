import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class CreateRoleService {

tempUrl = 'https://qa10.carot.com:8443';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
      // 'Authorization': '39986918-d39e-4658-87e1-8f1c30025b2d'

    })
  }


  constructor(private http: HttpClient, private router: Router, private url: UrlServiceService) { }

  getAccessData(formData) {

    return this.http.get(`${this.url.apiV2url}ra/resourceaccess/user/284234?type=${formData}`, this.httpOptions).toPromise()
  }



  createRoles(formData) {

    return this.http.post(`${this.tempUrl}/api/v3/mlh/accessRole/create`, formData,this.httpOptions).toPromise()
  }
  updateRoles(formData,id) {

    return this.http.post(`${this.tempUrl}/api/v3/mlh/accessRole/update/${id}`, formData,this.httpOptions).toPromise()
  }


  deleteRole(formData) {
    return this.http.delete(`${this.tempUrl}/api/v3/mlh/accessRole/delete/${formData}`, this.httpOptions).toPromise()
  }

  getAccessRoleById(id) {
    return this.http.get(`${this.tempUrl}/api/v3/mlh/accessRole/getAccessRoleDetailById/${id}`, this.httpOptions).toPromise()
  }
}
