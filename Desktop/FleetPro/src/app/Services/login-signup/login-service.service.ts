import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UrlServiceService } from '../Url/url-service.service';
import jwt_decode from 'jwt-decode';
import { GlobalConfigService } from '../Global/global-config.service';
import { hostname } from 'os';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  isExpanded: boolean = false;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  ReportSubmenu: boolean = false;
  KpiSubmenu: boolean = false;
  settingSubmenu: boolean = false;
  alertSubmenu: boolean = false;
  EolSubmenu: boolean = false;
  subCount = 0;
  DeviceSubmenu: boolean = false;

  // sidenavWidth = 4;
  constructor(
    private http: HttpClient,
    private router: Router,
    private url: UrlServiceService,
    private global: GlobalConfigService
  ) {}
  // token = localStorage.getItem('auth_key_Carot');
  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(p + '=' + obj[p]);
      }
    return str.join('&');
  }

  toggleSubmenu(el) {
    // this.global.changeImgpath();
    if (el === this.subCount) {
      this.subCount = 0;
    } else {
      this.subCount = el;
    }
    console.log(this.isExpanded);

    // console.log(el)
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  setJwt(token) {
    localStorage.setItem('auth_key_Carot', `bearer ${token}`);
    localStorage.setItem('logged', 'true');
    localStorage.setItem('leftsider', '0');
  }

  setInfo(res) {
    localStorage.setItem('admin_Carot', res.data.user.admin);
    localStorage.setItem('emailId', res.data.user.email);
    localStorage.setItem('name_Carot', res.data.user.firstName);
    localStorage.setItem('orgID', res.data.user.organizationId);
  }

  getJwt() {
    let token = localStorage.getItem('auth_key_Carot');
    return token;
  }

  removeJwt() {
    // localStorage.removeItem('auth_key_Carot');
    // localStorage.removeItem('logged');
    // localStorage.removeItem('leftsider');
    // localStorage.removeItem('admin_Carot');
    // localStorage.removeItem('emailId');
    // localStorage.removeItem('name_Carot');
    // localStorage.removeItem('orgID');
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  login(formData) {
    if (location.hostname.includes('smlsaarthi')) {
      var auth =
        'Basic d2ViX2NsaWVudF9pc3V6dTokNWEkNzgkaXVqb2l1alhpSVNVWndyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk=';
    } else if (location.hostname.includes('fcsdl')) {
      var auth =
        'Basic d2ViX2NsaWVudDokNGEkNTQkaXVqb2l1alhpSE9ORHdyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk=';
    } else if (location.hostname.includes('adminportal')) {
      var auth =
        'Basic d2ViX2NsaWVudDokNGEkNTQkaXVqb2l1alhpSE9ORHdyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk=';
    } else if (location.hostname.includes('fleetproqa')) {
      var auth =
        'Basic d2ViX2NsaWVudDokNGEkNTQkaXVqb2l1alhpSE9ORHdyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk='; // fcsdl
      // var auth = "Basic d2ViX2NsaWVudF9pc3V6dTokNWEkNzgkaXVqb2l1alhpSVNVWndyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk="; // smlsarthi
    } else if (location.hostname.includes('okinawa')) {
      var auth = "Basic aWNvbm5lY3RfYW5kcm9pZDokMmEkMTEkZ3hwbmV6bVlmTkpSWW53L0VwSUs1T2UwOFRsd1pEbWNtVWVLa3JHY1NHR0hYdldheFV3UTI=";  // okinawa
    } else {
      var auth ='Basic d2ViX2NsaWVudDokNGEkNTQkaXVqb2l1alhpSE9ORHdyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk='; // fcsdl
      // var auth = "Basic d2ViX2NsaWVudF9pc3V6dTokNWEkNzgkaXVqb2l1alhpSVNVWndyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk="; // smlsarthi
      // var auth = "Basic aWNvbm5lY3RfYW5kcm9pZDokMmEkMTEkZ3hwbmV6bVlmTkpSWW53L0VwSUs1T2UwOFRsd1pEbWNtVWVLa3JHY1NHR0hYdldheFV3UTI=";  // okinawa
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization':"Basic d2ViX2NsaWVudF9pc3V6dTokNWEkNzgkaXVqb2l1alhpSVNVWndyL0tpSVU5MGUzM1Rpb0lLaW9pSXJJbXJPeFRIVkdXdVNzd0d1Vzk="
        Authorization: auth,
      }),
    };
    return this.http
      .post(
        `${this.url.apiRestUrl}oauth/token?${this.serialize(formData)}`,
        {},
        httpOptions
      )
      .toPromise();
  }

  getCurrentUser() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('auth_key_Carot'),
      }),
    };
    return this.http
      .get(`${this.url.apiRestUrl}users/currentuserv2`, httpOptions)
      .toPromise();
  }

  getResourceAccess() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('auth_key_Carot'),
      }),
    };
    return this.http
      .get(
        `${this.url.apiV2url}ra/resourceaccess?type=EVENT,REPORT,ACTION`,
        httpOptions
      )
      .toPromise();
  }

  getDahsBoardCount() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('auth_key_Carot'),
      }),
    };
    return this.http
      .get(`${this.url.apiV2url}vs/dashboard-count`, httpOptions)
      .toPromise();
  }
}
