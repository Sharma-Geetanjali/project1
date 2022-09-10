

import { Component, OnInit,ViewChild,OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUserService } from 'src/app/Services/settings/createUser/create-user.service';
import { UsernameValidator } from 'src/app/Services/custom-validator/custom-validator.service'
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
import { Router } from '@angular/router';




declare var $: any;



@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit,OnDestroy {

  tabCount = 1;
  // imgPath = this.global.imgPath;
  createUserForm: FormGroup;
  successMSG = '';
  statusMsg = '';
  allAccessRoleArr: any = [];
  AccessRoleByIdArr: any = [];
  previous;
  allComplete: Boolean = false;
  roleID;
  userDataArr;
  groupCount = 1;
  searchGroup = null;
  searchDeaprtMent = null;

  legacyArr: any = [];
  vehicleGroupArr: any = [];
  vehicleDepartmentArr: any = [];

  currDeleteGroupName;
  currDeletedepartmentName;
  specificEditData;
  editFlag = false;
  DepartlegacyArr: any = [];


  constructor(
    public fb: FormBuilder,
    private userService: CreateUserService,
    private sharingService: SharingService,
    private router: Router
    // private spaceValidator: UsernameValidator
  ) { }

  ngOnInit(): void {
    // console.log(this.sharingService.getData())
    this.specificEditData = this.sharingService.getData();

    this.createUserForm = this.fb.group({
      firstName: ['',[Validators.required,Validators.pattern(/^(?!\.)[a-zA-Z-'. ]+$/),UsernameValidator.cannotContainSpace]],
      lastName: ['',[Validators.required,Validators.pattern(/^(?!\.)[a-zA-Z-'. ]+$/),UsernameValidator.cannotContainSpace]],
      userName: ['', [Validators.required,UsernameValidator.cannotContainSpace]],
      email: ['',[Validators.required,Validators.pattern(/^\b(([a-zA-Z\-0-9_.]+(\.[a-zA-Z\-0-9_.]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\b$/)]],
      phoneNumber: ['',[Validators.required,Validators.minLength(10), Validators.maxLength(10),Validators.pattern(/^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/)]],
    })

    if (this.specificEditData != undefined) {
      this.editFlag = true;
      this.email.disable();
      this.phoneNumber.disable();
      this.userName.disable();
      this.setUserData();
    } else {
      this.router.navigate(['/dashboard/setting/Create-User'])
    }

    // this.firstName.valueChanges.subscribe(() => { console.log(this.createUserForm.valid) });


  }

  ngOnDestroy(){
    this.sharingService.data = undefined;
  }

  get firstName() { return this.createUserForm.get('firstName'); }
  get lastName() { return this.createUserForm.get('lastName'); }
  get userName() { return this.createUserForm.get('userName'); }
  get email() { return this.createUserForm.get('email'); }
  get phoneNumber() { return this.createUserForm.get('phoneNumber'); }


  noWhitespaceValidator(control) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}


  toggleSubmenu(el) {
    // this.subscription.unsubscribe();

    this.tabCount = el;
    if (this.tabCount == 2) {
      this.getAllAccessRole();
    }

  }


  toggleGroup(el) {
    this.groupCount = el;
  }

  setUserData() {
    this.firstName.patchValue(this.specificEditData.firstName);
    this.lastName.patchValue(this.specificEditData.lastName);
    this.userName.patchValue(this.specificEditData.username);
    this.email.patchValue(this.specificEditData.email);
    this.phoneNumber.patchValue(this.specificEditData.phoneNumber);


  }

  async CreateUser() {
    // console.log(this.phoneNumber.value)
    let dataObj
    if (!this.editFlag) {
       dataObj = {
        firstName: this.firstName.value.trim(),
        lastName: this.lastName.value.trim(),
        email: this.email.value.trim(),
        username : this.userName.value.trim(),
        phoneNumber : this.phoneNumber.value.trim()
      }
    } else {
      dataObj = {
        firstName: this.firstName.value.trim(),
        lastName: this.lastName.value.trim()
      }
    }

    try {
      if (!this.editFlag) {
        const res: any = await this.userService.createUser(dataObj);
      this.userDataArr = res;
      // console.log(this.userDataArr)
      this.firstName.patchValue(this.userDataArr.firstName);
      this.lastName.patchValue(this.userDataArr.lastName);
      this.userName.patchValue(this.userDataArr.userName);
      this.email.patchValue(this.userDataArr.email);
      this.phoneNumber.patchValue(this.userDataArr.phoneNumber);
      this.successMSG = '';
      this.successMSG = 'User Created Successfully';
      $('#successModal').modal('show');
      this.tabCount = 2;
      this.getAllAccessRole();
      } else {
        const res: any = await this.userService.updateUser(dataObj,this.specificEditData.id);
        console.log(res);
        this.firstName.patchValue(this.firstName.value);
      this.lastName.patchValue(this.lastName.value);
      this.successMSG = '';
      this.successMSG = 'User Updated Successfully';
      $('#successModal').modal('show');
      this.tabCount = 2;
      this.getAllAccessRole();
      }

    } catch (error) {
      console.log(error)
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  async getAllAccessRole() {
    try {
      const res: any = await this.userService.getAllAccessRole();
      this.allAccessRoleArr = res;
      this.allAccessRoleArr = this.allAccessRoleArr.map(el => {
        var o = Object.assign({}, el);
        o.chkBox = false;
        return o;
      })
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  async getAccessRoleById(id) {
    try {
      const res: any = await this.userService.getAccessRoleById(id);
      this.AccessRoleByIdArr = res.accessRoleActionMappings;
      this.AccessRoleByIdArr = this.AccessRoleByIdArr.concat(res.accessRoleEventMappings);
      this.AccessRoleByIdArr = this.AccessRoleByIdArr.concat(res.accessRoleReportMappings);
      console.log(this.AccessRoleByIdArr);
      this.AccessRoleByIdArr = this.AccessRoleByIdArr.map(el => {
        if (el.hasOwnProperty("action_type")) {
          el.name = el.action_type
        }
        if (el.hasOwnProperty("event_type_name")) {
          el.name = el.event_type_name
        }
        if (el.hasOwnProperty("report_type_name")) {
          el.name = el.report_type_name
        }
        return el

      });
      console.log(this.AccessRoleByIdArr);
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  async createRoleUserMapping() {
    if (this.roleID == null || this.roleID == undefined) {
      return
    }
    let dataObj
    // console.log(this.userDataArr)
    if (!this.editFlag) {
       dataObj = {
        role_id: this.roleID,
        user_id: this.userDataArr.id
      }
    } else {

      dataObj = {
        role_id: this.roleID,
        user_id: this.specificEditData.id
      }
    }


    try {
      const res: any = await this.userService.createRoleUserMapping(dataObj);
      this.successMSG = '';
      this.successMSG = 'Role Assigned Successfully';
      $('#successModal').modal('show');
      this.tabCount = 3;
    } catch (error) {
      console.error
      this.statusMsg = '';
      this.statusMsg = error?.error?.message;
      $('#errorInput').modal('show');
    }
  }

  getExpandEvent(id) {
    if (this.previous) {
      let previousIndex = this.allAccessRoleArr.findIndex(el => el.id == this.previous);
    this.allAccessRoleArr[previousIndex].chkBox = false;
    }
    setTimeout(() => {
      let index = this.allAccessRoleArr.findIndex(el => el.id == id)
      this.allAccessRoleArr[index].chkBox = true;
      this.roleID = id;
    this.previous = id;
    },100)

  }


  async searchGroupByName() {
    if (this.searchGroup.length < 3) {
      return
    }

    let searchObj = {
      namePhrase: this.searchGroup
    }
    try {
      const res: any = await this.userService.searchLegacyGroupName(searchObj);
      this.legacyArr = res;

    } catch (error) {
      console.log(error)
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  async searchDepartGroupName() {
    if (this.searchDeaprtMent.length < 3) {
      return
    }

    let searchObj = {
      namePhrase: this.searchDeaprtMent
    }
    try {
      const res: any = await this.userService.searchDepartGroupName(searchObj);
      this.DepartlegacyArr = res;

    } catch (error) {
      console.log(error)
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }


  formArrForGroup() {

    let indexChk = this.vehicleGroupArr.findIndex(el => el.full_name == this.searchGroup);
    if (indexChk != -1) {
      return
    }
    if (this.searchGroup) {
      let index = this.legacyArr.findIndex(el => el.full_name == this.searchGroup);
      this.vehicleGroupArr = this.vehicleGroupArr.concat(this.legacyArr[index]);
      console.log(this.vehicleGroupArr)
    }
  }

  removeGroupFromArr() {
    let index = this.vehicleGroupArr.findIndex(el => el.full_name == this.currDeleteGroupName);
    this.vehicleGroupArr.splice(index,1)
  }

  deleteGroup(name) {
    this.currDeleteGroupName = name;
    $('#deleteModal').modal('show');
  }


  formArrForDepartment() {
    let indexChk = this.vehicleDepartmentArr.findIndex(el => el.name == this.searchDeaprtMent);
    if (indexChk != -1) {
      return
    }
    if (this.searchDeaprtMent) {
      let index = this.DepartlegacyArr.findIndex(el => el.name == this.searchDeaprtMent);
      this.vehicleDepartmentArr = this.vehicleDepartmentArr.concat(this.DepartlegacyArr[index]);
      console.log(this.vehicleDepartmentArr)
    }
  }

  removeDepartmentFromArr() {
    let index = this.vehicleDepartmentArr.findIndex(el => el.name == this.currDeletedepartmentName);
    this.vehicleDepartmentArr.splice(index,1)
  }

  deleteDepartment(name) {
    this.currDeletedepartmentName = name;
    $('#deleteModal').modal('show');


  }


  async assignGroupToUser() {
    let dataArr = [];
    if (!this.editFlag) {
      for (let i = 0; i < this.vehicleGroupArr.length; i++) {
        dataArr.push({
          group_id: this.vehicleGroupArr[i].id,
          user_id: this.userDataArr.id
          // user_id: "95747"
        })
      }
    } else {
      for (let i = 0; i < this.vehicleGroupArr.length; i++) {
        dataArr.push({
          group_id: this.vehicleGroupArr[i].id,
          user_id: this.specificEditData.id
          // user_id: "95747"
        })
      }
    }


    try {
      const res: any = await this.userService.assignGroupToUser(dataArr);
      // this.tabCount == 3;
      this.successMSG = '';
      this.successMSG = 'Group Assigned Successfully';
      $('#successModal').modal('show');
    } catch (error) {
      console.error
      this.statusMsg = '';
      this.statusMsg = error?.error?.message;
      $('#errorInput').modal('show');
    }
  }


  async assigndepartmentToUser() {
    let dataArr = [];
    if (!this.editFlag) {
      for (let i = 0; i < this.vehicleDepartmentArr.length; i++) {
        dataArr.push({
          group_id: this.vehicleDepartmentArr[i].id,
          user_id: this.userDataArr.id
          // user_id: "95747"
        })
      }
    } else {
      for (let i = 0; i < this.vehicleDepartmentArr.length; i++) {
        dataArr.push({
          group_id: this.vehicleDepartmentArr[i].id,
          user_id: this.specificEditData.id
          // user_id: "95747"
        })
      }
    }


    try {
      const res: any = await this.userService.assigndepartmentToUser(dataArr);
      // this.tabCount == 3;
      this.successMSG = '';
      this.successMSG = 'Department Assigned Successfully';
      $('#successModal').modal('show');
    } catch (error) {
      console.error
      this.statusMsg = '';
      this.statusMsg = error?.error?.message;
      $('#errorInput').modal('show');
    }
  }

}
