import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CreateUserService } from 'src/app/Services/settings/createUser/create-user.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
declare var $: any;


// import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
// import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
// import { UserManagementService } from 'src/app/Services/settings/userManagement/user-management.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit{

  paramObj = null;
  userArr: Array<any> = [];
  filterUserArr: Array<any> = [];
  numberFilter: any = [];
  searchText;
  allAccessRoleArr: any = [];
  currDeleteRoleName;
  successMSG = '';
  statusMsg = '';
  currDeleteRoleid;


  constructor(
    private userService: CreateUserService,
    private sharingService: SharingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllAccessRole();

  }



  async getAllAccessRole() {
    try {
      const res: any = await this.userService.getAllAccessRole();
      this.allAccessRoleArr = res;
    } catch (error) {
     console.log(error)
    }
  }

  search() {
    if (this.searchText == '' || this.searchText == null || this.searchText == undefined) {
      this.getAllAccessRole();
    } else {
      this.getAccessRoleByName();

    }
  }

  async getAccessRoleByName() {
    let dataObj;
    dataObj = {
      roleName: this.searchText
    }
    try {
      this.allAccessRoleArr = []
      const res: any = await this.userService.getAccessRoleByName(dataObj);
      if (res == null) {
        this.allAccessRoleArr = [];
      } else {
        this.allAccessRoleArr.push(res);
      }
      console.log(this.allAccessRoleArr)
    } catch (error) {
      console.log(error);
    }

  }

  editComponet(data:any) {
    this.sharingService.setRoleData(data);
    this.router.navigate(['/dashboard/setting/Edit-Role']);//redirects url to new component
  }

  deleteUserIdset(data){
    this.currDeleteRoleName = data.role_name;
    this.currDeleteRoleid = data.id;
    $('#deleteModal').modal('show');

  }

  async deleteRole() {

    try {
      const res: any = await this.userService.deleteRole(this.currDeleteRoleid);
      // this.ngOnInit();
      this.successMSG = '';
      this.successMSG = 'Role Deleted Successfully';
      $('#successModal').modal('show');
      this.getAllAccessRole()
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }

  }



}



