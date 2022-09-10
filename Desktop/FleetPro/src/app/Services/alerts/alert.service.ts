import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UrlServiceService } from '../Url/url-service.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    })
  }
  constructor(private http: HttpClient, private router: Router, private url: UrlServiceService) { }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getEventsData(formData) {
    return this.http.get(`${this.url.apiV2url}event?${this.serialize(formData)}`, this.httpOptions).toPromise()
  }

  async getExcelReport(downloadUrl, date, reportName) {
    let data: any = await fetch(downloadUrl, {
      headers: {
        'Authorization': localStorage.getItem('auth_key_Carot')
      },
    }).then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, `${reportName}_${date}.xlsx`)
        return true;
      }
      ).catch((err) => {
        console.log(err);
        return err;
      });
    return data;
  }

}
