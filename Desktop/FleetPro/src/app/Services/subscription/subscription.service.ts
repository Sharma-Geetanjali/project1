import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

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

  createSubscription(userId, days, notify) {
    return this.http.post(`${this.url.apiV3url}api/um/subscription/create?userid=${userId}&subscriptionInDays=${days}&notify=${notify}`, {}, this.httpOptions).toPromise()
  }

  getSubscription(searchInput, searchBy) {

    return this.http.get(`${this.url.apiV3url}api/um/subscription/get?${searchBy}=${searchInput}`, this.httpOptions).toPromise()

  }

  updateSubscription(paramObj) {
    return this.http.put(`${this.url.apiV3url}api/um/subscription/update?${this.serialize(paramObj)}`, {}, this.httpOptions).toPromise()
  }

  transferSubscription(paramObj) {
    return this.http.put(`${this.url.apiV3url}api/um/subscription/transfer?${this.serialize(paramObj)}`, {}, this.httpOptions).toPromise()
  }

  deleteSubscription(subscriptionID) {
    console.log(localStorage.getItem('auth_key_Carot'))
    return this.http.put(`${this.url.apiV3url}api/um/subscription/delete/${subscriptionID}`, {}, this.httpOptions).toPromise()
  }

  getSearchSuggestion(val) {
    return this.http.get(`${this.url.apiV3url}api/um/subscription/listUserByEmailPhrase?namePhrase=${val}`, this.httpOptions).toPromise()
  }

  // ${subscriptionID}
}
