import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Axios from 'axios';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConsigneeService {

   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    })
  }
  constructor(private http: HttpClient, private url: UrlServiceService,) { }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }



  getConsignee(formData) {

    return this.http.get(`${this.url.apiV2url}rm/list/consignee?${this.serialize(formData)}`, this.httpOptions).toPromise()

  }

  deleteConsignee(formData) {

    return this.http.delete(`${this.url.apiV2url}rm/consignee/${formData}`,this.httpOptions).toPromise()

  }

  uploadExcel(formData) {
    const httpOptions = {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      }
    }
    return Axios.post(`${this.url.apiV2url}rm/upload/consignor`, formData, httpOptions)
  }

  createConsigneeGroup(formData) {
    const httpOptions = {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      }
    }
    return Axios.post(`${this.url.apiV2url}dm/group/upload`, formData, httpOptions)
  }
}
