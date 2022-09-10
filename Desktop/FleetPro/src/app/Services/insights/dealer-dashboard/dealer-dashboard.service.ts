import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class DealerDashboardService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    })
  }

  constructor(private url: UrlServiceService, private http: HttpClient) { }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getDealerServiceBills() {
    return this.http.get(`${this.url.apiV2url}report/vehiclebilling`,this.httpOptions).toPromise();

  }

  getVehicleStockCount(formData) {
    return this.http.get(`${this.url.apiV2url}report/vehiclebilling/count?${this.serialize(formData)}`,this.httpOptions).toPromise();
  }

  getVehicleInTransitCount(formData) {
    return this.http.get(`${this.url.apiV2url}report/vehiclebilling/count?${this.serialize(formData)}`,this.httpOptions).toPromise();

  }

  getVehicleIndelayCount(formData) {
    return this.http.get(`${this.url.apiV2url}report/vehiclebilling/count?${this.serialize(formData)}`,this.httpOptions).toPromise();
  }
}
