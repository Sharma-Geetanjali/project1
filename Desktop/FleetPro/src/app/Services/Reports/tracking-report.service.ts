import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingReportService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    })
  }
  constructor(private http: HttpClient, private url: UrlServiceService) { }


  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


  getStreamAccess(formData) {
    return new EventSource(`${this.url.apiV2url}report/tracking/stream?${this.serialize(formData)}`)
  }

  getGeofence(formData) {

    return this.http.get(`${this.url.apiV2url}geofence?${this.serialize(formData)}`, this.httpOptions).toPromise()

  }

  getTrackingReport(formData) {

    return this.http.get(`${this.url.apiV2url}report/tracking?${this.serialize(formData)}`, this.httpOptions).toPromise()

  }

  getTrackingDistance(formData) {

    return this.http.get(`${this.url.apiV2url}vs/distance?${this.serialize(formData)}`, this.httpOptions).toPromise()

  }
}
