import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UrlServiceService } from '../Url/url-service.service';


@Injectable({
  providedIn: 'root'
})
export class EolTestingService {


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot'),
    }),
    observe: "response" as 'body'

  }
  constructor(private http: HttpClient, private router: Router, private url: UrlServiceService) { }

  // 'Authorization': 'bearer 9cdabcf6-f947-404c-9c06-4618fe24448c'


  getEolTesting(searchQuerry, toggle) {
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('auth_key_Carot')
      })
    }
    if (!toggle) {
      let search = searchQuerry.search('/')
      let newstr;
      if (search == -1) {
        newstr = searchQuerry;
      return this.http.get(`${this.url.apiV2url}vs/eol?deivceSerialNumber=${newstr}`, httpOptions).toPromise()


      } else {
        newstr = searchQuerry.split('/')
      return this.http.get(`${this.url.apiV2url}vs/eol?deivceSerialNumber=${newstr[newstr.length - 1]}`, httpOptions).toPromise()


      }

    }
    else if (toggle) {
      return this.http.get(`${this.url.apiV2url}vs/eol?chasisNumber=${searchQuerry}`, httpOptions).toPromise()
    }
  }

  putEolAudit(formData) {

    return this.http.put(`${this.url.apiV2url}vs/eol/audit/dump`, formData, this.httpOptions).toPromise()
  }

  deviceIntegration(formData) {

    return this.http.post(`${this.url.apiV2url}vm/device/integration`, formData, this.httpOptions).toPromise()
  }
}


