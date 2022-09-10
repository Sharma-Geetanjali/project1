import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpiReportService {
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

  getkpiReport(formData) {

    return this.http.get(`${this.url.apiV2url}kpi/events?${this.serialize(formData)}`,this.httpOptions).toPromise()

  }

  getGroupList() {

    return this.http.get(`${this.url.apiV2url}vm/group`,this.httpOptions).toPromise()

  }

  getConsignmentsGroup() {

    return this.http.get(`${this.url.apiV2url}consignment/group`,this.httpOptions).toPromise()

  }
}
