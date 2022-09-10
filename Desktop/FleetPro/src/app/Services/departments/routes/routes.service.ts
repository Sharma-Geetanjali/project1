import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
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



  getRoutes(formData) {

    return this.http.get(`${this.url.apiV2url}rm?${this.serialize(formData)}`, this.httpOptions).toPromise()

  }

  routeDetailByRouteId(routeid) {
    return this.http.get(`${this.url.apiV2url}rm/route/${routeid}`, this.httpOptions).toPromise();
  }

  getBufferById(id) {
    return this.http.get(`${this.url.apiV2url}rm/buffer/${id}`, this.httpOptions).toPromise();

  }

  deleteRoute(routeMasterId,routeId) {

    return this.http.delete(`${this.url.apiV2url}rm/route?routeId=${routeId}&routeMasterId=${routeMasterId}`,this.httpOptions).toPromise()

  }
}
