import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UrlServiceService } from '../Url/url-service.service';
import Axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class EolReportService {

   httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    }
  }
  constructor(private http: HttpClient, private router: Router, private url: UrlServiceService) { }


  uploadExcel(formData) {
    const httpOptions = {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      }
    }
    return Axios.post(`${this.url.apiV2url}vm/map/vehicle/eol`, formData, httpOptions)
  }


  getEolAudit(startDate, endDate,deviceId = null){

    if (deviceId) {
    return this.http.get(`${this.url.apiV2url}vs/eol/audit/?startTime=${startDate}&endTime=${endDate}&deviceSerialNumber=${deviceId}`,this.httpOptions).toPromise()

    } else {
    return this.http.get(`${this.url.apiV2url}vs/eol/audit/?startTime=${startDate}&endTime=${endDate}`,this.httpOptions).toPromise()

    }
  }

  downloadEolAudit(startDate, endDate,deviceId = null){

    if (deviceId) {

      return this.http.get(`${this.url.apiV2url}vs/eol/audit/download?startTime=${startDate}&endTime=${endDate}&deviceSerialNumber=${deviceId}`,this.httpOptions).toPromise()
    }
    else {
      return this.http.get(`${this.url.apiV2url}vs/eol/audit/download?startTime=${startDate}&endTime=${endDate}`,this.httpOptions).toPromise()

    }
  }
}


// 'Authorization': 'bearer 9cdabcf6-f947-404c-9c06-4618fe24448c'
