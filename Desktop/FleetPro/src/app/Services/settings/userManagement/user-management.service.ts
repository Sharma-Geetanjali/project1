import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlServiceService } from '../../Url/url-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_key_Carot')
    })
  }
  constructor(private http: HttpClient, private url: UrlServiceService,) { }



  getInvitedUser() {

    return this.http.get(`${this.url.apiRestUrl}users/invitedusers`, this.httpOptions).toPromise()

  }
}
