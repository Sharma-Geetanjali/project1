

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { UserManagementService } from 'src/app/Services/settings/userManagement/user-management.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  paramObj = null;
  userArr: Array<any> = [];
  filterUserArr: Array<any> = [];
  numberFilter: any = [];
  searchText;

  constructor(
    private userService: UserManagementService,
    private sharingService: SharingService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.getInvitedUser();

  }


  async getInvitedUser() {

    // this.spinner.show();


    try {
      const res: any = await this.userService.getInvitedUser();

      this.userArr = res.data.invites;
      this.filterUserArr = this.userArr;
      // this.spinner.hide();
      console.log(this.userArr)
    }
    catch (err) {
      console.log(err)
      // this.spinner.hide();
    }
  }

  search() {
    console.log(this.searchText)
    if (this.searchText == "") {
      console.log("if")
      this.filterUserArr = this.userArr;
    }
    else {
      console.log("else")
      this.filterUserArr = this.userArr.filter(el => el.firstName.toLowerCase().includes(this.searchText.toLowerCase()))
      console.log(this.filterUserArr)
    }
  }

  editComponet(data:any) {
    this.sharingService.setData(data);
    this.router.navigate(['/dashboard/setting/Edit-User']);//redirects url to new component
  }

}

