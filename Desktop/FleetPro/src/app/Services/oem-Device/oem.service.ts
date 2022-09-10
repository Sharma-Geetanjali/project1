import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../Url/url-service.service';
import Axios from 'axios';



@Injectable({
  providedIn: 'root'
})
export class OemService {


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': localStorage.getItem('auth_key_Carot')
      'Authorization': 'bearer 91b50009-822e-43e4-9c33-2981a8bcb736'
    })
  }

  tempUrl= "https://qa8.carot.com/v2/"

  constructor(private url: UrlServiceService, private http: HttpClient) { }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getOemList(formData) {
    return this.http.get(`${this.tempUrl}vin/oem?${this.serialize(formData)}`,this.httpOptions).toPromise();

  }

  uploadExcel(formData) {
    const httpOptions = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      }
    }
    return Axios.post(`${this.tempUrl}smlidms/upload/vehicle`, formData, httpOptions)
  }

  addDevice(formData) {

    return this.http.post(`${this.tempUrl}smlidms/vehicle`, formData, this.httpOptions).toPromise();
  }
}
