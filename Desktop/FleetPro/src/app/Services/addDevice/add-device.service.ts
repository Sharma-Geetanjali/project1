import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlServiceService } from '../Url/url-service.service';
import Axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AddDeviceService {

   httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    }
   }

  qaUrl = "https://qa8.carot.com/v3/";
  constructor(private http: HttpClient, private router: Router, private url: UrlServiceService) { }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


  addManuallySubmit(formData) {

    return this.http.post(`${this.url.apiV2url}d/device`,formData,this.httpOptions).toPromise()

  }

  uploadExcel(formData) {
    const httpOptions = {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      }
    }
    return Axios.post(`${this.url.apiV2url}d/devices`, formData, httpOptions)
  }

  addAssciateSim(formData) {

    return this.http.post(`${this.url.apiV2url}d/connect/device`,formData,this.httpOptions).toPromise()

  }

  UploadAssociateSim(formData) {
    const httpOptions = {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      }
    }
    return Axios.post(`${this.url.apiV2url}d/connect/devices`, formData, httpOptions)
  }

  getSpecificDevice(formData) {

    return this.http.get(`${this.qaUrl}api/dm/health/getHealthByDevice?${this.serialize(formData)}`,this.httpOptions).toPromise()
  }


}
