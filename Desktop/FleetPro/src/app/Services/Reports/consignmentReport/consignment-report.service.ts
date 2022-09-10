import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlServiceService } from '../../Url/url-service.service';

import Axios from 'axios';



@Injectable({
  providedIn: 'root'
})
export class ConsignmentReportService {

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


  getConsignmentReport(formData) {

    return this.http.get(`${this.url.apiV2url}consignment?${this.serialize(formData)}`,this.httpOptions).toPromise()

  }

  getWayPoints(formData) {

    return this.http.get(`${this.url.apiV2url}lucknow/waypoints/${formData}`,this.httpOptions).toPromise()

  }

  getEventsData(formData) {

    return this.http.get(`${this.url.apiV2url}kpi/events?${this.serialize(formData)}`, this.httpOptions).toPromise();


  }

  getSingleConsignmentTrackingPath(formData) {

    return this.http.get(`${this.url.apiV2url}consignment/track/${formData}`,this.httpOptions).toPromise()

  }

  drawBuffer(id) {

    return this.http.get(`${this.url.apiV2url}rm/buffer/${id}`,this.httpOptions).toPromise()

  }

  uploadExcel(formData) {

    return Axios.post(`${this.url.apiV2url}vm/map/vehicle/eol`, formData, this.httpOptions)
  }

  markCritical(code) {

    return this.http.put(`${this.url.apiV2url}consignment/critical/${code}`,this.httpOptions).toPromise()


  }

   getVehicleLiveTracking(formData,data) {

    return this.http.get(`${this.url.apiV2url}v/live/${formData}?lastCheckTime=${data}`,this.httpOptions).toPromise()

  }

  getLocationData(formData) {

    return this.http.get(`${this.url.apiV2url}v/location/${formData}`,this.httpOptions).toPromise()

  }

  getLocationDataDashboard(formData) {

    return this.http.get(`${this.url.apiV2url}v/location?${this.serialize(formData)}`,this.httpOptions).toPromise()

  }

}
