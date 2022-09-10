import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../Url/url-service.service';



@Injectable({
  providedIn: 'root'
})
export class BuzzListService {


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

  getBuzzList(formData) {
    return this.http.get(`${this.url.apiV2url}buzz?${this.serialize(formData)}`,this.httpOptions).toPromise();

  }


  updateBuzz(formData) {
   let httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      })
    }
    return this.http.post(`${this.url.apiV2url}buzz`, formData, httpOptions).toPromise();
  }
}

