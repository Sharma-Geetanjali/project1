import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DepartmentService } from 'src/app/Services/department/department.service';

declare var $: any;
declare var LeaderLine: any;




@Component({
  selector: 'app-department-group',
  templateUrl: './department-group.component.html',
  styleUrls: ['./department-group.component.css']
})

export class DepartmentGroupComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @HostListener('window:scroll', ['$event']) // for window scroll events


  superGroupArr: any = [];
  subGroupArr: any = [];
  subGroupCounter: any = [];
  searchArr: any = [];
  subGroupArr1: any = [];
  legacyArr: any = [];
  subCount = 0;
  parentIndex;
  changeParentName;
  groupWithParent: FormGroup;
  groupWithOutParent: FormGroup;
  changeParentForm: FormGroup;
  legacyForm: FormGroup;
  groupRename: FormGroup;
  dataObj: Object;
  statusMsg = '';
  successMSG = '';
  currDeleteGroupName;
  currParentId;
  startEL;
  endEL: any = [];
  line: any = [];
  subgroupID;
  subgroupParent;
  subgroupCount;
  subStartEL;
  endSubEL;
  leagecyArr;
  vehicleGroupName;
  changeClass = false;
  chkCount;
  lineType: any = [];
  lineType1: any = [];
  validSelection = false;
  legacyBtnFlag = false;
  clicked = false;


  subject: Subject<any> = new Subject();

  rectWrapper;
  legacyFlag = false;
  changeParentFlag = false;
  clickedId;
  clickedParent;
  clickedGroupCount;
  clickedName;


  constructor(
    public multiService: DepartmentService,
    private fb: FormBuilder,
    private router: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.getTopLevelGroup();
    this.groupWithParent = this.fb.group({
      GroupNameWithParent: ['', [Validators.required]],
    });
    this.groupWithOutParent = this.fb.group({
      GroupNameWithOutParent: ['', [Validators.required]],
    });

    this.changeParentForm = this.fb.group({
      parentName: ['', [Validators.required]],
    });

    this.groupRename = this.fb.group({
      RenamedGroup: ['', [Validators.required]],
    });

    this.legacyForm = this.fb.group({
      legacyGroupName: ['', [Validators.required]],
    });
    this.parentName.valueChanges.subscribe(() => { this.searchGroupName() });
    this.legacyGroupName.valueChanges.subscribe(() => { this.searchLegacyGroupName() });

    this.subject
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.gethtmlSubGroup(this.clickedId, this.clickedGroupCount);
        this.getsubgroup(this.clickedId, this.clickedParent, this.clickedGroupCount, this.clickedName);
        // (click)="gethtmlSubGroup($event.currentTarget,obj.groupCount)"
      }
      );

  }

  ngAfterViewInit() {


  }
  ngOnChanges() {

  }
  ngOnDestroy() {

    for (let i = 0; i < this.line.length; i++) {
      this.line[i].l.remove();
    }

    this.subject.unsubscribe();
  }



  get GroupNameWithParent() { return this.groupWithParent.get('GroupNameWithParent'); }
  get GroupNameWithOutParent() { return this.groupWithOutParent.get('GroupNameWithOutParent'); }
  get parentName() { return this.changeParentForm.get('parentName'); }
  get legacyGroupName() { return this.legacyForm.get('legacyGroupName'); }
  get RenamedGroup() { return this.groupRename.get('RenamedGroup'); }




  async getTopLevelGroup() {

    try {
      const res: any = await this.multiService.getTopLevelGroup();
      this.superGroupArr = res;
      this.superGroupArr = this.superGroupArr.map(function (el) {
        var o = Object.assign({}, el);
        o.groupCount = 0;
        return o;
      })

    } catch (error) {
      console.log(error)
      this.statusMsg = '';
      this.statusMsg = error.error?.message;
      $('#errorInput').modal('show');
    }

  }

  scrollFn() {
    if (this.line.length > 0) {
      for (let i = 0; i < this.line.length; i++) {
        this.line[i].l.position();
        this.line[i].l.show();
      }

      for (let i = 0; i < this.line.length; i++) {

        if (this.rectWrapper.top > this.line[i].svg.getBoundingClientRect().top) {
          this.line[i]?.l.hide()
        }
        if ((this.rectWrapper.height - this.rectWrapper.x) < this.line[i].svg.getBoundingClientRect().height) {
          this.line[i]?.l.hide();

        }
        if ((this.rectWrapper.width) < this.line[i].svg.getBoundingClientRect().right) {
          this.line[i]?.l.hide();

        }

        if (this.rectWrapper.left > this.line[i].svg.getBoundingClientRect().left) {
          this.line[i]?.l.hide()
        }

      }


    }
  }

  leader(subCount) {
    setTimeout(() => {
      if (this.subStartEL == '' || this.subStartEL == null || this.subStartEL == undefined) {
        let item1 = document.getElementById(this.startEL);
        let startItem = item1.getBoundingClientRect();
        if (this.endEL.length > 0) {
          for (let i = 0; i < this.endEL.length; i++) {

            let item = document.getElementById(this.endEL[i].id);

            this.line.push({
              groupCount: subCount,
              l: new LeaderLine(
                item1,
                item,
                {
                  endPlugOutline: false,
                  animOptions: { duration: 1000, timing: 'linear' },
                  color: '#008ce8',
                  size: 2,
                  path: 'grid',
                  startSocket: 'right',
                  endPlug: 'behind',
                  endSocket: 'left',
                  startSocketGravity: [1, -1],
                  endSocketGravity: [-1, -1]
                }),
              svg: document.querySelector('.leader-line:last-of-type'),
              bound: document.querySelector('.leader-line:last-of-type').getBoundingClientRect(),
              startEL: startItem
            });

          }
          var elmWrapper = document.getElementById('jojo')
          this.rectWrapper = elmWrapper.getBoundingClientRect()
          console.log(this.rectWrapper,'if')
          this.scrollFn();
        }

      } else {
        console.log(this.subStartEL)
        let item1 = document.getElementById(this.subStartEL);
        let startItem
        if (item1) {
          startItem = item1.getBoundingClientRect();
        }
        for (let i = 0; i < this.endSubEL.length; i++) {
          let item = document.getElementById(this.endSubEL[i].id);
          this.line.push({
            groupCount: subCount,
            l: new LeaderLine(
              item1,
              item, {
              endPlugOutline: false,
              animOptions: { duration: 1000, timing: 'linear' },
              color: '#008ce8',
              size: 2,
              path: 'grid',
              startSocket: 'right',
              endPlug: 'behind',
              endSocket: 'left',
              startSocketGravity: [1, -1],
              endSocketGravity: [-1, -1]
            }),
            svg: document.querySelector('.leader-line:last-of-type'),
            bound: document.querySelector('.leader-line:last-of-type').getBoundingClientRect(),
            startEL: startItem
          });

        }
        console.log(this.rectWrapper,'else')

        this.scrollFn();

      }

    }, 10)

  }



  preventDoubleClick(id, parent, groupCount, name) {
    this.clickedId = id;
    this.clickedParent = parent;
    this.clickedGroupCount = groupCount;
    this.clickedName = name;
    this.subject.next();
  }


  async getsubgroup(id, parent, groupCount, name) {

    this.changeClass = false;
    setTimeout(() => {
      document.getElementById(this.startEL).classList.add('groupContentChecked');
      if (this.subStartEL) {
        document.getElementById(this.subStartEL).classList.add('groupContent');

        document.getElementById(this.subStartEL).classList.add('groupContentChecked');
      }
    }, 100)

    let index = this.subGroupCounter.findIndex(el => el.groupId == id);
    if (index != -1) {
      return
    }

    if (groupCount == 0) {
      this.subGroupCounter = []
      this.subCount = 0;
      if (this.line.length > 0) {
        for (let j = 0; j < this.line.length; j++) {
          this.line[j].l.remove();
        }
        this.line = [];
      }
      this.subStartEL = '';
    }

    if (this.line.length > 0) {
      for (let i = 0; i < this.line.length; i++) {
        let lineIndex = this.line.findIndex(el => el.groupCount > groupCount);
        if (lineIndex != -1) {
          this.line[lineIndex].l.remove();
          this.line.splice(lineIndex, 1);


        }
      }

      for (let i = 0; i < this.line.length; i++) {
        let lineIndex = this.line.findIndex(el => el.groupCount > groupCount);
        if (lineIndex != -1) {
          this.line[lineIndex].l.remove();
          this.line.splice(lineIndex, 1);


        }
      }

    }

    for (let i = 0; i < this.subGroupCounter.length; i++) {
      let groupIndex = this.subGroupCounter.findIndex(el => el.groupCount > groupCount);

      if (groupIndex != -1) {
        this.subCount = groupCount;
        this.subGroupCounter.splice(groupIndex, 1);
      }
    }

    for (let i = 0; i < this.subGroupCounter.length; i++) {
      let groupIndex = this.subGroupCounter.findIndex(el => el.groupCount > groupCount);

      if (groupIndex != -1) {
        this.subCount = groupCount;
        this.subGroupCounter.splice(groupIndex, 1);
      }
    }
    try {
      const res: any = await this.multiService.getsubgroup(id);
      this.subGroupArr = res;
      if (res.length > 0) {
        this.subCount++;

        this.subGroupCounter.push({
          'groupCount': this.subCount,
          'groupId': id,
          'subGroupData': res
        })
        if (this.subStartEL == '' || this.subStartEL == null || this.subStartEL == undefined) {
          this.endEL = res;

        } else {
          this.endSubEL = res;
        }
        this.leader(this.subCount);
        this.getleagecyGroup(id, name, groupCount, parent);

      }
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error?.message;
      console.log(error)
      $('#errorInput').modal('show');
    }
  }

  removeByAttr(arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value)) {

        arr.splice(i, 1);

      }
    }
    return arr;
  }


  async createGroupWithParent() {

    if (this.currParentId == null || this.currParentId == undefined) {
      this.dataObj = {
        full_name: this.GroupNameWithParent.value.trim(),
        org_id: localStorage.getItem("orgID"),
        // org_id: "99",

      }
    } else {
      this.dataObj = {
        full_name: this.GroupNameWithParent.value.trim(),
        org_id: localStorage.getItem("orgID"),
        // org_id: "99",

        parent: {
          id: this.currParentId
        }
      }
    }



    try {
      const res: any = await this.multiService.createGroupWithParent(this.dataObj);
      this.successMSG = '';
      this.successMSG = 'Group Created Successfully';
      $('#successModal').modal('show');
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }

  }

  async renameGroupfn() {
    let dataObj = {
      groupId: this.currParentId,
      name: this.RenamedGroup.value.trim(),
    }
    try {
      const res: any = await this.multiService.renameGroupfn(dataObj);
      this.successMSG = '';
      this.successMSG = 'Group Rename Successfully';
      $('#successModal').modal('show');
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }

  }



  async deleteGroupName() {
    let dataObj = {
      groupId: this.currParentId,
    }
    try {
      const res: any = await this.multiService.deleteGroup(dataObj);
      // this.ngOnInit();
      this.successMSG = '';
      this.successMSG = 'Group Deleted Successfully';
      $('#successModal').modal('show');
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }

  }


  async createGroupWithOutParent() {

    this.dataObj = {
      full_name: this.GroupNameWithOutParent.value.trim(),
      org_id: localStorage.getItem("orgID"),
      // org_id: "1",

    }

    try {
      const res: any = await this.multiService.createGroupWithParent(this.dataObj);
      this.ngOnInit();
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }

  }


  deleteGroup(name) {
    this.currDeleteGroupName = name;
    $('#deleteModal').modal('show');

  }

  async searchGroupName() {
    this.validSelection = false;
    if (this.parentName.value.length < 3) {
      this.changeParentFlag = false;
      return
    } else {
      this.changeParentFlag = true;
    }


    let searchObj = {
      namePhrase: this.parentName.value
    }
    try {
      const res: any = await this.multiService.searchGroupName(searchObj);
      this.searchArr = res;

    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }


  }


  getSpecificGroup(obj) {
    this.currParentId = obj.id;
    this.changeParentName = obj.full_name;
  }

  enableBtn() {
    this.validSelection = true;
  }

  async changeParentOfGroup() {
    let parentID;
    if (this.parentName.value) {
      for (let i = 0; i < this.searchArr.length; i++) {
        let index = this.searchArr.findIndex(el => el.full_name == this.parentName.value)
        parentID = this.searchArr[index].id;
      }
    }

    if (parentID == null || parentID == undefined) {
      return
    }

    let obj = {
      groupId: this.currParentId,
      parentGroupId: parentID
    }
    try {
      const res: any = await this.multiService.changeParentOfGroup(obj);
      this.successMSG = '';
      this.successMSG = 'Group Parent changed Successfully';
      $('#successModal').modal('show');
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }


  async checkChild(id) {
    try {
      const res: any = await this.multiService.getsubgroup(id);
      this.subGroupArr1 = res;
    } catch (error) {
      console.log(error);
    }
  }

  gethtml(eve: HTMLElement) {
    if (this.startEL) {
      document.getElementById(this.startEL).classList.remove('groupContentChecked');

    }
    this.startEL = eve.id

  }

  gethtmlSubGroup(id, count) {
    console.log(count)
    for (let i = 0; i < this.subGroupCounter.length; i++){
      if (this.subGroupCounter[i].groupCount == count) {
        let idArr = [];
        idArr = this.subGroupCounter[i].subGroupData
        for (let j = 0; j < idArr.length; j++){
          if (idArr[j].id) {
          document.getElementById(this.subGroupCounter[i].subGroupData[j].id).classList.remove('groupContentChecked');
          }
        }
      }
    }
    if (this.subStartEL && this.chkCount && this.chkCount == count) {
      document.getElementById(this.subStartEL).classList.remove('groupContentChecked');
    }

    this.subStartEL = id;
    console.log(this.subStartEL)

    this.chkCount = count;
  }

  reloadFN() {
    setTimeout(() => {
      window.location.reload();
    }, 500)
  }

  async getleagecyGroup(id, name, groupCount, parent) {
    this.vehicleGroupName = name;
    let clickedID;

    if (clickedID) {
      // console.log(clickedID)
      clickedID == id
      return
    } else {
      clickedID = id;
      // console.log(clickedID);

    }

    if (groupCount == 0) {
      this.leagecyArr = []
    }

    try {
      this.leagecyArr = [];
      const res: any = await this.multiService.getleagecyGroup(id);
      // if (this.leagecyArr == undefined || this.leagecyArr.length == 0) {
      this.leagecyArr = res;
      // this.clicked = false;


    } catch (error) {
      // console.log(error)
      this.statusMsg = '';
      this.statusMsg = error.error?.message;
      $('#errorInput').modal('show');
    }

  }

  async searchLegacyGroupName() {
    this.legacyBtnFlag = false;
    if (this.legacyGroupName.value.length < 3) {
      this.legacyFlag = false;
      return
    } else {
      this.legacyFlag = true;

    }

    let searchObj = {
      namePhrase: this.legacyGroupName.value
    }
    try {
      const res: any = await this.multiService.searchLegacyGroupName(searchObj);
      this.legacyArr = res;

    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }


  }

  async addLegacyGroup() {
    let legacyId;
    if (this.legacyGroupName.value) {
      for (let i = 0; i < this.legacyArr.length; i++) {
        let index = this.legacyArr.findIndex(el => el.name == this.legacyGroupName.value)
        legacyId = this.legacyArr[index].id;
      }
    }

    if (legacyId == null || legacyId == undefined) {
      return
    }

    let arr = [];
    arr.push(legacyId)
    try {
      const res: any = await this.multiService.addLegacyGroup(arr, this.currParentId);
      this.successMSG = '';
      this.successMSG = 'Legacy Group Added Successfully';
      $('#successModal').modal('show');
    } catch (error) {
      this.statusMsg = '';
      this.statusMsg = error.error.message;
      $('#errorInput').modal('show');
    }
  }

  enableLegacyBtn() {
    this.legacyBtnFlag = true;
  }

}



