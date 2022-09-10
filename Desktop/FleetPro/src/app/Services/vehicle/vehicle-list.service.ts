import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlServiceService } from '../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleListService {
  vehicleData;
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



  getvehicleStateList(formData,reagionParam,districtValue) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth_key_Carot')
      })
    }
    // console.log("regionParam",reagionParam)
    // console.log("formData",formData)
    // console.log("districtValue",districtValue)

    if (reagionParam && districtValue == '') {
        // console.log("1")
        return this.http.get(`${this.url.apiV2url}vs?${reagionParam}&${this.serialize(formData)}`,httpOptions).toPromise()

    } else if (districtValue){
        // console.log("2")
        return this.http.get(`${this.url.apiV2url}vs?${this.serialize(formData)}`,httpOptions).toPromise()

    } else {
      // console.log("3")
      return this.http.get(`${this.url.apiV2url}vs?${this.serialize(formData)}`,httpOptions).toPromise()

    }

  }

  getdashboardList(formData,reagionParam) {

    return this.http.get(`${this.url.apiV2url}vs?${this.serialize(formData)}`,this.httpOptions).toPromise()



  }

  getGroupList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth_key_Carot')
      })
    }

    return this.http.get(`${this.url.apiV2url}vm/group`,httpOptions).toPromise()

  }

  getConsignmentsGroup() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth_key_Carot')
      })
    }
    return this.http.get(`${this.url.apiV2url}consignment/group`,httpOptions).toPromise()

  }

  getAllConsignors() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth_key_Carot')
      })
    }
    return this.http.get(`${this.url.apiV2url}rm/list/consignor`,httpOptions).toPromise()

  }

  getAllConsignees() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth_key_Carot')
      })
    }
    return this.http.get(`${this.url.apiV2url}rm/list/consignee`,httpOptions).toPromise()

  }

  submitRequest(formData) {

    return this.http.post(`${this.url.apiV2url}ticket`,formData,this.httpOptions).toPromise()
  }

  transerData(data) {
    this.vehicleData = data;
  }


}
