import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements OnInit {
  dashboardData: Array<any> = [];

  constructor(
    public login: LoginServiceService,
    public auth: LoginServiceService,
    private global: GlobalConfigService,
    
  ) {}

  ngOnInit(): void {
  }

  logout() {
    this.auth.removeJwt();
  }
}
