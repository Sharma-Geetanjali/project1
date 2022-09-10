import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommodityReportService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    })
  }
  constructor(private http: HttpClient, private url: UrlServiceService,)  { }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getcommodityReport(formData, reagionParam, districtValue) {

    if (reagionParam && districtValue == '') {
      return this.http.get(`${this.url.apiV2url}lucknow/grains?${reagionParam}&${this.serialize(formData)}`,this.httpOptions).toPromise()

      } else if (districtValue){
      return this.http.get(`${this.url.apiV2url}lucknow/grains?${this.serialize(formData)}`,this.httpOptions).toPromise()

      } else {
      return this.http.get(`${this.url.apiV2url}lucknow/grains?${this.serialize(formData)}`,this.httpOptions).toPromise()

      }


      // return this.http.get(`${this.url.apiV2url}lucknow/grains?${this.serialize(formData)}`,this.httpOptions).toPromise()

  }

  getGroupList() {

    return this.http.get(`${this.url.apiV2url}vm/group`,this.httpOptions).toPromise()

  }

  getConsignmentsGroup() {

    return this.http.get(`${this.url.apiV2url}consignment/group`,this.httpOptions).toPromise()

  }
}
