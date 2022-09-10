
import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { CreateRoleService } from 'src/app/Services/settings/CreateRole/create-role.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
import { UsernameValidator } from 'src/app/Services/custom-validator/custom-validator.service'
import { Router } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})

export class CreateRoleComponent implements OnInit, OnDestroy {
  tabCount = 1;
  statusMsg = ''
  getAccessDataArrEvent: any = [];
  getAccessDataArrReport: any = [];
  getAccessDataArrAction: any = [];
  editAccessArr: any = [];
  actionListArr: any = [];
  eventListArr: any = [];
  reportListArr: any = [];
  readFlag = false;
  writeFlag = false;
  delteFlag = false;
  createManagerForm: FormGroup;
  specificEditRoleId;
  editFlag = false;
  AccessRoleByIdArr: any = []
  accessRoleDetails;
  editAccessEventArr: any = [];
  editAccessReportArr: any = [];
  editAccessActionArr: any = [];
  successMSG = '';




  constructor(
    private roleService: CreateRoleService,
    public fb: FormBuilder,
    private sharingService: SharingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.toggleSubmenu(1);
    this.specificEditRoleId = this.sharingService.getRoleData();

    this.createManagerForm = this.fb.group({
      roleManager: ['', [Validators.required,UsernameValidator.frontSpace]],
    });
    this.getAccessDataEvent();
    this.getAccessDataReport();
    this.getAccessDataAction();
    if (this.specificEditRoleId != undefined) {
      this.editFlag = true;
      this.getAccessRoleById();
    } else {
      this.editFlag = false;
      this.router.navigate(['/dashboard/setting/Create-Role']);
    }

  }

  ngOnDestroy() {
    this.sharingService.roleData = undefined;
  }

  toggleSubmenu(el) {
    this.tabCount = el;
    setTimeout(() => {
      this.ontabChange();
    }, 10)
  }

  get roleManager() {
    return this.createManagerForm.get("roleManager")
  }

  getReadAccess(data) {
    if (this.tabCount == 1) {
      let divID = this.getAccessDataArrEvent.findIndex(el => el.resourceId == data.resourceId)
      let funEL = document.getElementById(this.getAccessDataArrEvent[divID].resourceId);
      var images = funEL.getElementsByTagName("img");
      let index = this.eventListArr.findIndex(el => el.eventTypeName == data.name);
      if (index != -1) {
        let getKey = this.eventListArr[index].hasOwnProperty("enabled");
        if (getKey) {
          if (this.eventListArr[index].enabled == true) {
            this.readFlag = true
          } else {
            this.readFlag = false
          }
          this.readFlag = !this.readFlag;
          this.eventListArr[index].enabled = this.readFlag;
          if (this.readFlag) {
            images[0].src = `assets/images/icon-eye-solid-dark.svg`;
          } else {
            images[0].src = `assets/images/icon-eye-solid 1.svg`;
          }
        } else {
          this.readFlag = false;
          this.readFlag = !this.readFlag;
          if (this.readFlag) {
            images[0].src = `assets/images/icon-eye-solid-dark.svg`;
          } else {
            images[0].src = `assets/images/icon-eye-solid 1.svg`;
          }
          this.eventListArr[index].enabled = this.readFlag;
        }
      } else {
        this.readFlag = false;
        this.readFlag = !this.readFlag;
        if (this.readFlag) {
          images[0].src = `assets/images/icon-eye-solid-dark.svg`;
        } else {
          images[0].src = `assets/images/icon-eye-solid 1.svg`;
        }
        this.eventListArr.push({
          eventTypeName: data.name,
          enabled: this.readFlag
        });
      }
      this.setEventValues(data);
    } else if (this.tabCount == 2) {
      let divID = this.getAccessDataArrReport.findIndex(el => el.resourceId == data.resourceId)
      let funEL = document.getElementById(this.getAccessDataArrReport[divID].resourceId);
      var images = funEL.getElementsByTagName("img");
      let index = this.reportListArr.findIndex(el => el.reportTypeName == data.name);
      if (index != -1) {
        let getKey = this.reportListArr[index].hasOwnProperty("enabled");
        if (getKey) {
          if (this.reportListArr[index].enabled == true) {
            this.readFlag = true
          } else {
            this.readFlag = false
          }
          this.readFlag = !this.readFlag;
          this.reportListArr[index].enabled = this.readFlag;
          if (this.readFlag) {
            images[0].src = `assets/images/icon-eye-solid-dark.svg`;
          } else {
            images[0].src = `assets/images/icon-eye-solid 1.svg`;
          }
        } else {
          this.readFlag = false;
          this.readFlag = !this.readFlag;
          if (this.readFlag) {
            images[0].src = `assets/images/icon-eye-solid-dark.svg`;
          } else {
            images[0].src = `assets/images/icon-eye-solid 1.svg`;
          }
          this.reportListArr[index].enabled = this.readFlag;
        }
      } else {
        this.readFlag = false;
        this.readFlag = !this.readFlag;
        if (this.readFlag) {
          images[0].src = `assets/images/icon-eye-solid-dark.svg`;
        } else {
          images[0].src = `assets/images/icon-eye-solid 1.svg`;
        }
        this.reportListArr.push({
          reportTypeName: data.name,
          enabled: this.readFlag
        });
      }
      // this.editFlag = false;
      console.log(this.reportListArr)
    } else if (this.tabCount == 3) {
      let divID = this.getAccessDataArrAction.findIndex(el => el.resourceId == data.resourceId)
      let funEL = document.getElementById(this.getAccessDataArrAction[divID].resourceId);
      var images = funEL.getElementsByTagName("img");
      let index = this.actionListArr.findIndex(el => el.actionType == data.name);
      if (index != -1) {
        let getKey = this.actionListArr[index].hasOwnProperty("readAccess");
        if (getKey) {
          if (this.actionListArr[index].readAccess == true) {
            this.readFlag = true
          } else {
            this.readFlag = false
          }
          this.readFlag = !this.readFlag;
          this.actionListArr[index].readAccess = this.readFlag;
          if (this.readFlag) {
            images[0].src = `assets/images/icon-eye-solid-dark.svg`;
          } else {
            images[0].src = `assets/images/icon-eye-solid 1.svg`;
          }
        } else {
          this.readFlag = false;
          this.readFlag = !this.readFlag;
          if (this.readFlag) {
            images[0].src = `assets/images/icon-eye-solid-dark.svg`;
          } else {
            images[0].src = `assets/images/icon-eye-solid 1.svg`;
          }
          this.actionListArr[index].readAccess = this.readFlag;
        }
      } else {
        this.readFlag = false;
        this.readFlag = !this.readFlag;
        if (this.readFlag) {
          images[0].src = `assets/images/icon-eye-solid-dark.svg`;
        } else {
          images[0].src = `assets/images/icon-eye-solid 1.svg`;
        }
        this.actionListArr.push({
          actionType: data.name,
          readAccess: this.readFlag
        });
      }
      console.log(this.actionListArr)
    }
  }


  getWriteAccess(data) {
    if (this.tabCount == 1) {
      let divID = this.getAccessDataArrEvent.findIndex(el => el.resourceId == data.resourceId)
      let funEL = document.getElementById(this.getAccessDataArrEvent[divID].resourceId);
      var images = funEL.getElementsByTagName("img");
      let index = this.eventListArr.findIndex(el => el.eventTypeName == data.name);
      if (index != -1) {
        let getKey = this.eventListArr[index].hasOwnProperty("editable");
        if (getKey) {
          if (this.eventListArr[index].editable == true) {
            this.writeFlag = true
          } else {
            this.writeFlag = false
          }
          this.writeFlag = !this.writeFlag;
          if (this.writeFlag) {
            images[1].src = `assets/images/ic-edit.svg`;
          } else {
            images[1].src = `assets/images/ic-edit1.svg`;
          }
          this.eventListArr[index].editable = this.writeFlag;
        } else {
          this.writeFlag = false;
          this.writeFlag = !this.writeFlag;
          if (this.writeFlag) {
            images[1].src = `assets/images/ic-edit.svg`
          } else {
            images[1].src = `assets/images/ic-edit1.svg`;
          }
          this.eventListArr[index].editable = this.writeFlag;
        }
      } else {
        this.writeFlag = false;
        this.writeFlag = !this.writeFlag;
        if (this.writeFlag) {
          images[1].src = `assets/images/ic-edit.svg`
        } else {
          images[1].src = `assets/images/ic-edit1.svg`;
        }
        this.eventListArr.push({
          eventTypeName: data.name,
          editable: this.writeFlag
        });
      }
      this.setEventValues(data)
      // console.log(this.eventListArr)
    } else if (this.tabCount == 3) {
      let divID = this.getAccessDataArrAction.findIndex(el => el.resourceId == data.resourceId)
      let funEL = document.getElementById(this.getAccessDataArrAction[divID].resourceId);
      var images = funEL.getElementsByTagName("img");
      let index = this.actionListArr.findIndex(el => el.actionType == data.name);
      if (index != -1) {
        let getKey = this.actionListArr[index].hasOwnProperty("writeAccess");
        if (getKey) {
          if (this.actionListArr[index].writeAccess == true) {
            this.writeFlag = true
          } else {
            this.writeFlag = false
          }
          this.writeFlag = !this.writeFlag;
          if (this.writeFlag) {
            images[1].src = `assets/images/ic-edit.svg`;
          } else {
            images[1].src = `assets/images/ic-edit1.svg`;
          }
          this.actionListArr[index].writeAccess = this.writeFlag;
        } else {
          this.writeFlag = false;
          this.writeFlag = !this.writeFlag;
          if (this.writeFlag) {
            images[1].src = `assets/images/ic-edit.svg`
          } else {
            images[1].src = `assets/images/ic-edit1.svg`;
          }
          this.actionListArr[index].writeAccess = this.writeFlag;
        }
      } else {
        this.writeFlag = false;
        this.writeFlag = !this.writeFlag;
        if (this.writeFlag) {
          images[1].src = `assets/images/ic-edit.svg`
        } else {
          images[1].src = `assets/images/ic-edit1.svg`;
        }
        this.actionListArr.push({
          actionType: data.name,
          writeAccess: this.writeFlag
        });
      }

      console.log(this.actionListArr)
    }



  }

  getDeleteAccess(data) {
    if (this.tabCount == 3) {
      let divID = this.getAccessDataArrAction.findIndex(el => el.resourceId == data.resourceId)
      let funEL = document.getElementById(this.getAccessDataArrAction[divID].resourceId);
      var images = funEL.getElementsByTagName("img");

      let index = this.actionListArr.findIndex(el => el.actionType == data.name);
      if (index != -1) {
        let getKey = this.actionListArr[index]?.hasOwnProperty("deleteAccess");
        if (getKey) {
          if (this.actionListArr[index].deleteAccess == true) {
            this.delteFlag = true
          } else {
            this.delteFlag = false
          }
          this.delteFlag = !this.delteFlag;
          if (this.delteFlag) {
            images[2].src = `assets/images/ic-delete.svg`;
          } else {
            images[2].src = `assets/images/ic-delete1.svg`;
          }
          this.actionListArr[index].deleteAccess = this.delteFlag;
        } else {
          this.delteFlag = false;
          this.delteFlag = !this.delteFlag;
          if (this.delteFlag) {
            images[2].src = `assets/images/ic-delete.svg`;
          } else {
            images[2].src = `assets/images/ic-delete1.svg`;
          }
          this.actionListArr[index].deleteAccess = this.delteFlag;
        }
      } else {
        this.delteFlag = false;
        this.delteFlag = !this.delteFlag;
        if (this.delteFlag) {
          images[2].src = `assets/images/ic-delete.svg`;
        } else {
          images[2].src = `assets/images/ic-delete1.svg`;
        }
        this.actionListArr.push({
          actionType: data.name,
          deleteAccess: this.delteFlag
        });
      }
      console.log(this.actionListArr)
    }

  }


  setEventValues(data) {
    let index = this.eventListArr.findIndex(el => el.eventTypeName == data.name);
    if (index != -1) {
      let getKey = this.eventListArr[index].hasOwnProperty("critical");
      if (!getKey && data.critical != null && data.critical != undefined) {
        this.eventListArr[index].critical = data.critical
      } else if (getKey && data.critical != null && data.critical != undefined) {
        this.eventListArr[index].critical = data.critical
      }

      let getvalue = this.eventListArr[index].hasOwnProperty("value");
      if (!getvalue && data.value != null && data.value != undefined) {
        this.eventListArr[index].value = data.value
      } else if (getvalue && data.value != null && data.value != undefined) {
        this.eventListArr[index].value = data.value
      }

      let getmaxValue = this.eventListArr[index].hasOwnProperty("maxValue");
      if (!getmaxValue && data.maxValue != null && data.maxValue != undefined) {
        this.eventListArr[index].maxValue = data.maxValue
      } else if (getmaxValue && data.maxValue != null && data.maxValue != undefined) {
        this.eventListArr[index].maxValue = data.maxValue
      }

    }

    console.log(this.eventListArr)
  }

  async getAccessDataEvent() {
    let dataObj;
    dataObj = "EVENT";
    try {
      const res: any = await this.roleService.getAccessData(dataObj);
      this.getAccessDataArrEvent = res;
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  async getAccessDataReport() {
    let dataObj;
    dataObj = "REPORT"
    try {
      const res: any = await this.roleService.getAccessData(dataObj);
      this.getAccessDataArrReport = res;
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }


  async getAccessDataAction() {
    let dataObj;
    dataObj = "ACTION"
    try {
      const res: any = await this.roleService.getAccessData(dataObj);
      this.getAccessDataArrAction = res;
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  async createRoles() {
    // this.getAccessDataArr = [];
    for (let i = 0; i < this.actionListArr.length; i++){
      let getKeyRead = this.actionListArr[i].hasOwnProperty("readAccess");
      let getKeyWrite = this.actionListArr[i].hasOwnProperty("writeAccess");
      let getKeyDelete = this.actionListArr[i]?.hasOwnProperty("deleteAccess");
      if (!getKeyRead) {
        this.actionListArr[i].readAccess = false;
      }
      if (!getKeyWrite) {
        this.actionListArr[i].writeAccess = false;
      }
      if (!getKeyDelete) {
        this.actionListArr[i].deleteAccess = false;
      }
    }

    for (let i = 0; i < this.eventListArr.length; i++){
      let getKeyRead = this.eventListArr[i].hasOwnProperty("enabled");
      let getKeyWrite = this.eventListArr[i].hasOwnProperty("editable");
      if (!getKeyRead) {
        this.eventListArr[i].enabled = false;
      }
      if (!getKeyWrite) {
        this.eventListArr[i].editable = false;
      }
    }

    let dataObj;

    dataObj = {
      accessRole: {
        role_name: this.roleManager.value
      },
      eventList: this.eventListArr,
      reportList: this.reportListArr,
      actionList: this.actionListArr,


    }

    try {
      if (this.editFlag == false) {
        const res: any = await this.roleService.createRoles(dataObj);
        this.successMSG = '';
      this.successMSG = 'Role created Successfully';
      $('#successModal').modal('show');

      } else {
      const res: any = await this.roleService.updateRoles(dataObj,this.specificEditRoleId);
      this.successMSG = '';
      this.successMSG = 'Role Updated Successfully';
      $('#successModal').modal('show');

      }
      // this.getAccessDataArr = res;
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }


  ontabChange() {

    if (this.tabCount == 1) {
      for (let i = 0; i < this.eventListArr.length; i++) {
        for (let j = 0; j < this.getAccessDataArrEvent.length; j++) {
          if (this.eventListArr[i].eventTypeName == this.getAccessDataArrEvent[j].name) {
            let funEL = document.getElementById(this.getAccessDataArrEvent[j].resourceId);
            var images = funEL.getElementsByTagName("img");
            if (this.eventListArr[i]?.enabled == true) {
              console.log(true)
              images[0].src = `assets/images/icon-eye-solid-dark.svg`;
            } else {
              images[0].src = `assets/images/icon-eye-solid 1.svg`;
            }
            if (this.eventListArr[i]?.editable == true) {
              images[1].src = `assets/images/ic-edit.svg`;
            } else {
              images[1].src = `assets/images/ic-edit1.svg`;
            }
          }

        }
      }
    }

    if (this.tabCount == 2) {
      for (let i = 0; i < this.reportListArr.length; i++) {
        for (let j = 0; j < this.getAccessDataArrReport.length; j++) {
          if (this.reportListArr[i].actionType == this.getAccessDataArrReport[j].name) {
            let funEL = document.getElementById(this.getAccessDataArrReport[j].resourceId);
            var images = funEL.getElementsByTagName("img");
            if (this.reportListArr[i]?.readAccess == true) {
              console.log(true)
              images[0].src = `assets/images/icon-eye-solid-dark.svg`;
            } else {
              images[0].src = `assets/images/icon-eye-solid 1.svg`;
            }
            if (this.reportListArr[i]?.writeAccess == true) {
              images[1].src = `assets/images/ic-edit.svg`;
            } else {
              images[1].src = `assets/images/ic-edit1.svg`;
            }
            if (this.reportListArr[i]?.deleteAccess == true) {
              images[2].src = `assets/images/ic-delete.svg`;
            } else {
              images[2].src = `assets/images/ic-delete1.svg`;
            }
          }

        }
      }
    }

    if (this.tabCount == 3) {
      for (let i = 0; i < this.actionListArr.length; i++) {
        for (let j = 0; j < this.getAccessDataArrAction.length; j++) {
          if (this.actionListArr[i].actionType == this.getAccessDataArrAction[j].name) {
            let funEL = document.getElementById(this.getAccessDataArrAction[j].resourceId);
            var images = funEL.getElementsByTagName("img");
            if (this.actionListArr[i]?.readAccess == true) {
              images[0].src = `assets/images/icon-eye-solid-dark.svg`;
            } else {
              images[0].src = `assets/images/icon-eye-solid 1.svg`;
            }
            if (this.actionListArr[i]?.writeAccess == true) {
              images[1].src = `assets/images/ic-edit.svg`;
            } else {
              images[1].src = `assets/images/ic-edit1.svg`;
            }
            if (this.actionListArr[i]?.deleteAccess == true) {
              images[2].src = `assets/images/ic-delete.svg`;
            } else {
              images[2].src = `assets/images/ic-delete1.svg`;
            }
          }

        }
      }
    }

  }

  async getAccessRoleById() {
    try {
      const res: any = await this.roleService.getAccessRoleById(this.specificEditRoleId);
      this.accessRoleDetails = res.accessRole;
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
      setTimeout(() => {
        this.setRoleData();

      }, 100)
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  setRoleData() {
    this.roleManager.patchValue(this.accessRoleDetails.role_name);

    for (let i = 0; i < this.AccessRoleByIdArr.length; i++) {
      for (let j = 0; j < this.getAccessDataArrEvent.length; j++) {
        if (this.AccessRoleByIdArr[i].name == this.getAccessDataArrEvent[j].name) {
          this.editAccessEventArr.push(this.AccessRoleByIdArr[i])
        }

      }

    }



    for (let i = 0; i < this.AccessRoleByIdArr.length; i++) {
      for (let j = 0; j < this.getAccessDataArrReport.length; j++) {
        if (this.AccessRoleByIdArr[i].name == this.getAccessDataArrReport[j].name) {
          this.editAccessReportArr.push(this.AccessRoleByIdArr[i])
        }

      }
    }



    for (let i = 0; i < this.AccessRoleByIdArr.length; i++) {
      for (let j = 0; j < this.getAccessDataArrAction.length; j++) {
        if (this.AccessRoleByIdArr[i].name == this.getAccessDataArrAction[j].name) {
          this.editAccessActionArr.push(this.AccessRoleByIdArr[i])

        }

      }
    }

    console.log(this.editAccessArr)
    this.checkAction();

  }


  checkAction() {
    for (let i = 0; i < this.editAccessEventArr.length; i++) {
      let eventIndex = this.eventListArr.findIndex(el => el.eventTypeName == this.editAccessEventArr[i].name);

      if (eventIndex != -1) {
        let getKeyRead = this.eventListArr[i].hasOwnProperty("enabled");
        let getKeyWrite = this.eventListArr[i].hasOwnProperty("editable");
        if (!getKeyRead) {

          this.eventListArr[eventIndex].enabled = this.editAccessEventArr[i]?.enabled;
        }
        if (!getKeyWrite) {
          this.eventListArr[eventIndex].writeAccess = this.editAccessEventArr[i]?.editable;
        }

        let getKey = this.eventListArr[eventIndex].hasOwnProperty("critical");
        if (!getKey && this.editAccessEventArr[i]?.critical != null && this.editAccessEventArr[i]?.critical != undefined) {
          this.eventListArr[eventIndex].critical = this.editAccessEventArr[i]?.critical
        } else if (getKey && this.editAccessEventArr[i]?.critical != null && this.editAccessEventArr[i]?.critical != undefined) {
          this.eventListArr[eventIndex].critical = this.editAccessEventArr[i]?.critical
        }

        let getvalue = this.eventListArr[eventIndex].hasOwnProperty("value");
        if (!getvalue && this.editAccessEventArr[i]?.value != null && this.editAccessEventArr[i]?.value != undefined) {
          this.eventListArr[eventIndex].value = this.editAccessEventArr[i]?.value
        } else
          if (getvalue && this.editAccessEventArr[i]?.value != null && this.editAccessEventArr[i]?.value != undefined) {
          this.eventListArr[eventIndex].value = this.editAccessEventArr[i]?.value
        }

        let getmaxValue = this.eventListArr[eventIndex].hasOwnProperty("maxValue");
        if (!getmaxValue && this.editAccessEventArr[i]?.maxValue != null && this.editAccessEventArr[i]?.maxValue != undefined) {
          this.eventListArr[eventIndex].maxValue = this.editAccessEventArr[i]?.maxValue
        } else if (getmaxValue && this.editAccessEventArr[i]?.maxValue != null && this.editAccessEventArr[i]?.maxValue != undefined) {
          this.eventListArr[eventIndex].maxValue = this.editAccessEventArr[i]?.maxValue
        }
      } else {
        this.eventListArr.push({
          eventTypeName: this.editAccessEventArr[i].name,
          enabled: this.editAccessEventArr[i]?.enabled,
          editable: this.editAccessEventArr[i]?.editable,
        });
      }

    }

    for (let i = 0; i < this.editAccessReportArr.length; i++) {
      let ReportIndex = this.reportListArr.findIndex(el => el.reportTypeName == this.editAccessReportArr[i].name);

      if (ReportIndex != -1) {
        let getKeyRead = this.reportListArr[i].hasOwnProperty("enabled");
        if (!getKeyRead) {

          this.reportListArr[ReportIndex].enabled = this.editAccessReportArr[i]?.enabled;
        }
      } else {
        this.reportListArr.push({
          reportTypeName: this.editAccessReportArr[i].name,
          enabled: this.editAccessReportArr[i]?.enabled,
          editable: this.editAccessReportArr[i]?.editable,
        });
      }

    }

    for (let i = 0; i < this.editAccessActionArr.length; i++){

      let index = this.actionListArr.findIndex(el => el.actionType == this.editAccessActionArr[i].name);

      if (index != -1) {
        let getKeyRead = this.actionListArr[i].hasOwnProperty("readAccess");
        let getKeyWrite = this.actionListArr[i].hasOwnProperty("writeAccess");
        let getKeyDelete = this.actionListArr[i].hasOwnProperty("deleteAccess");
        if (!getKeyRead) {

          this.actionListArr[index].readAccess = this.editAccessActionArr[i]?.read_access;
        }
        if (!getKeyWrite) {

          this.actionListArr[index].writeAccess = this.editAccessActionArr[i]?.write_access;
        }
        if (!getKeyDelete) {

          this.actionListArr[index].deleteAccess = this.editAccessActionArr[i]?.delete_access;
        }
      } else {
        this.actionListArr.push({
          actionType: this.editAccessActionArr[i].name,
          readAccess: this.editAccessActionArr[i]?.read_access,
          writeAccess: this.editAccessActionArr[i]?.write_access,
          deleteAccess: this.editAccessActionArr[i]?.delete_access
        });
      }
    }

    this.ontabChange();
  }

  setEentValues(data) {
    let index = this.eventListArr.findIndex(el => el.eventTypeName == data.name);
    if (index != -1) {
      let getKey = this.eventListArr[index].hasOwnProperty("critical");
      if (!getKey && data.critical != null && data.critical != undefined) {
        this.eventListArr[index].critical = data.critical
      } else if (getKey && data.critical != null && data.critical != undefined) {
        this.eventListArr[index].critical = data.critical
      }

      let getvalue = this.eventListArr[index].hasOwnProperty("value");
      if (!getvalue && data.value != null && data.value != undefined) {
        this.eventListArr[index].value = data.value
      } else if (getvalue && data.value != null && data.value != undefined) {
        this.eventListArr[index].value = data.value
      }

      let getmaxValue = this.eventListArr[index].hasOwnProperty("maxValue");
      if (!getmaxValue && data.maxValue != null && data.maxValue != undefined) {
        this.eventListArr[index].maxValue = data.maxValue
      } else if (getmaxValue && data.maxValue != null && data.maxValue != undefined) {
        this.eventListArr[index].maxValue = data.maxValue
      }

    }

    console.log(this.eventListArr)
  }

}


