import { Component, OnInit } from '@angular/core';
import { sign } from 'crypto';
import { element } from 'protractor';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {



  userData: Array<any> = [];



  constructor(public login: LoginServiceService, public global: GlobalConfigService , private theme: ThemeServiceService) { }
  imgPath=this.global.imgPath;
  ngOnInit(): void {
    // console.log(this.login.isShowing);
    this.getResourceAccess();
    // console.log(this.global.userAlerts);
    // console.log(this.login.isExpanded)
  }


  async getResourceAccess() {
    try {
      const res: any = await this.login.getResourceAccess();
      this.userData = res;
      // console.log(this.userData);
      this.global.getUserData(this.userData);
    } catch (err) {
      console.log(err);
    }
  }












}

