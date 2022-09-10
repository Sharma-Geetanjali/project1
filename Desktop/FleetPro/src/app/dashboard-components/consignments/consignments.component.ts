import { Location } from '@angular/common';
import {
  Component, OnInit, Input, HostListener, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { EolReportService } from 'src/app/Services/eol-report/eol-report.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { endianness } from 'os';
import { MatEndDate } from '@angular/material/datepicker';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { query } from '@angular/animations';
import { NgxSpinnerService } from "ngx-spinner";
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';
import { callbackify } from 'util';
import { MatMenuTrigger } from '@angular/material/menu';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
import { of } from 'rxjs';



declare var $: any;

@Component({
  selector: 'app-consignments',
  templateUrl: './consignments.component.html',
  styleUrls: ['./consignments.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class ConsignmentsComponent implements OnInit {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;

  @Input() max: null;
  eolAuditArr: any = [];
  consignmentArr: any = [];
  filterData: any = [];
  pipe: DatePipe;
  maxDate = new Date();
  imgPath = this.global.imgPath;
  fileArr: Array<File> = [];
  dropZoneMessage = 0;
  searchText = null;
  startAt;
  endDate = new Date();
  startDate = new Date();
  today = new Date();
  hours = this.today.getHours();
  mint = this.today.getMinutes();
  miliS = this.today.getMilliseconds();
  paramObj = null;
  downloadObj = null;
  selectedValue: string;
  filterForm: FormGroup;
  offset = 0;
  Size: number = 50;
  markCode = null;
  minDate;
  numberFilter: any = [];
  groupListArr: any = [];
  groupIdParentArr: any = [];
  UnqiueGroupID: any = [];
  UnqiueMainGroupID: any = [];
  mainFilteredArr: any = [];
  filteredArr: any = [];
  allCnorByGroups: any = [];
  filteredCnorArr: any = [];
  mainfilteredCnorArr: any = [];
  allCneeByGroups: any = [];
  filteredCneeArr: any = [];
  mainfilteredCneeArr: any = [];
  consignmentFlag = false;
  mapsdata: any = [];
  previous;
  totalVehcile;
  nonLocationVehicle = 0;
  todayDate = new Date();
  current_page = 1;
  page_size = 10;
  paginatedArray: any = [];
  currentPagetable = 1;
  tableSize = 10;
  tablePaginatedArray: any = [];
  allConsigneeData: any = [];
  allConsignorData: any = [];
  cardLoadingFlag = true;
  toggleBool = false;
  previousId1= '';
  previousId2 = '';
  arrlen: any = [];
  wayPointList: any = [];
  toggleImg = null;
  el1;
  el2;
  div;
  live = true;
  defaultLat = 25.799891;
  defaultLng = 77.268790;
  defaultZoom = 6;












  constructor(
    private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public global: GlobalConfigService,
    public location: Location,
    public consignReport: ConsignmentReportService,
    private url: UrlServiceService,
    public login: LoginServiceService,
    private fb: FormBuilder,
    public vehicleReport: VehicleListService,
    public theme: ThemeServiceService,
    private sharing: SharingService
  ) {

    // this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);
    $('.accordion-toggle').click(() => {
      if ( $(this).attr('aria-expanded') == "true" ) {
          $(this).children().css('background-color', '#FFF');
      } else {
          $(this).children().css('background-color', '#DDD');
      }
  });
  }





  ngOnInit(): void {

    this.filterForm = this.fb.group({
      region: [''],
      district: [''],
      dispatchCode: [''],
      receiverCode: [''],
      flag: [''],
      kpi: [''],
      singleStage: [''],
      status: [''],
      notInNetwork: [''],
      regionFilter: [''],
      dispatchCodeFilter: [''],
      receiverCodeFilter: [''],
      regionGroupFilter: ['']
    })

    this.getConsignmentReport();
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();

    this.sharing.groupListDataObservable$.subscribe(() => {
      this.getGroupList();

    })

    this.sharing.consignorListDataObservable$.subscribe(() => {
      this.getAllConsignors();

    })

    this.sharing.consigneeListDataObservable$.subscribe(() => {
      this.getAllConsignees();


    })

    this.getGroupList();
    this.getAllConsignors();
    this.getAllConsignees();




    this.onChangeRegion('');
    this.toSelectConsignmentDeptt('');
    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
    this.regionFilter.valueChanges.subscribe(() => { this.selectDistrict() });
    this.dispatchCodeFilter.valueChanges.subscribe(() => { this.selectConr() });
    this.receiverCodeFilter.valueChanges.subscribe(() => { this.selectConee() });
  }

  ngOnChanges() {
    console.log('chnages')
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();
    $('.accordion-toggle').click(() => {
      if ( $(this).attr('aria-expanded') == "true" ) {
          $(this).children().css('background-color', '#FFF');
      } else {
          $(this).children().css('background-color', '#DDD');
      }
  });

  }

  get region() { return this.filterForm.get('region'); }
  get district() { return this.filterForm.get('district'); }
  get flag() { return this.filterForm.get('flag'); }
  get kpi() { return this.filterForm.get('kpi'); }
  get singleStage() { return this.filterForm.get('singleStage'); }
  get status() { return this.filterForm.get('status'); }
  get notInNetwork() { return this.filterForm.get('notInNetwork'); }
  get registraionNo() { return this.filterForm.get('registraionNo'); }
  get dispatchCode() { return this.filterForm.get('dispatchCode'); }
  get receiverCode() { return this.filterForm.get('receiverCode'); }
  get regionFilter() { return this.filterForm.get('regionFilter'); }
  get dispatchCodeFilter() { return this.filterForm.get('dispatchCodeFilter'); }
  get receiverCodeFilter() { return this.filterForm.get('receiverCodeFilter'); }
  get regionGroupFilter() { return this.filterForm.get('regionGroupFilter'); }









  selectVehicleMap() {
    // this.spinner.show();

    this.consignmentFlag = false;
    this.sharing.setConsignmentFlag(this.consignmentFlag);
    // this.chartOnload();
    // this.showloadingFlag();
  }
  selectVehicleList() {
    this.consignmentFlag = true;
    this.sharing.setConsignmentFlag(this.consignmentFlag);


  }





  clearFlag() {
    this.flag.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'flag';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }

  }

  clearKpi() {
    this.kpi.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'kpi';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }

  }

  clearSingleStage() {
    this.singleStage.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'singleStage';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }
  }
  clearStatus() {
    this.status.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'status';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }
  }
  clearnotInNetwork() {
    this.notInNetwork.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'notInNetwork';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')
    }
  }

  clearReceiverCode() {
    this.receiverCode.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'receiverCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')
    }
  }

  clearDispatchCode() {
    this.dispatchCode.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'dispatchCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')
    }
  }

  cleardistrict() {
    this.district.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'district';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')
    }
  }

  clearregion() {
    this.region.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'region';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')
    }
  }


  reomveFilter() {
    this.cardLoadingFlag = true;
    this.live = true;
    this.clearFlag();
    this.clearKpi();
    this.clearnotInNetwork();
    this.clearSingleStage();
    this.clearStatus();
    this.clearReceiverCode();
    this.clearDispatchCode();
    this.cleardistrict();
    this.clearregion();
    this.getConsignmentReport();


  }

  clearAll() {
    this.cardLoadingFlag = true;
    this.live = true;
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();


    // this.filterForm.reset();
    this.clearFlag();
    this.clearKpi();
    this.clearnotInNetwork();
    this.clearSingleStage();
    this.clearStatus();
    this.clearReceiverCode();
    this.clearDispatchCode();
    this.cleardistrict();
    this.clearregion();
    this.getConsignmentReport();
  }

  filterCount() {

    if (this.flag.value != "") {
      console.log(this.flag.value)
      const isLargeNumber = (element) => element == 'flag';
      let val = this.numberFilter.findIndex(isLargeNumber);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('flag')


      }
      else {
        // console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('flag')
      }
    }

    if (this.kpi.value != "") {
      console.log(this.flag.value)
      let kpi = (element) => element == 'kpi';
      let val = this.numberFilter.findIndex(kpi);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('kpi')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('kpi')
      }
    }

    if (this.singleStage.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'singleStage';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('singleStage')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('singleStage')
      }
    }

    if (this.status.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'status';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('status')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('status')
      }
    }

    if (this.notInNetwork.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'notInNetwork';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('notInNetwork')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('notInNetwork')
      }
    }


    if (this.receiverCode.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'receiverCode';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('receiverCode')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('receiverCode')
      }
    }

    if (this.dispatchCode.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'dispatchCode';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('dispatchCode')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('dispatchCode')
      }
    }

    if (this.district.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'district';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('district')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('district')
      }
    }


    console.log(this.numberFilter)

  }




  T
  search() {
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();

    localStorage.removeItem("allConsignor");
    localStorage.removeItem("consignData");
    this.offset = 0;
    this.getConsignmentReport()
    this.filterCount()
  }

  getGroupList() {
    try {
      let dataFromService = this.sharing.getConsignmentGroupListData();
      if (dataFromService != undefined) {
        this.groupListArr = dataFromService;
        for (let i = 0; i < this.groupListArr.length; i++) {
          var item1 = this.groupListArr[i];
          for (let j = 0; j < item1.groups.length; j++) {
            let item = item1.groups[j];
            this.groupIdParentArr.push({
              'groupId': item['groupId'],
              'groupName': item['groupName'],
              'parent': item['parent'],
              'type': item['type']
            })
          }

        }
        this.groupIdParentArr.forEach(el => {
          if (this.UnqiueGroupID.indexOf(el.parent) === -1 && el.parent != '' && el.parent != undefined) {
            this.UnqiueGroupID.push(el.parent);
            this.UnqiueMainGroupID.push(el.parent);
          }
        });
    this.changeDetection.detectChanges();


      }
    } catch (err) {
      console.log(err);
    }



  }


  tofilterDistrictArr(currRegion) {
    var output = [];
    for (var i = 0; i < this.groupIdParentArr.length; i++) {
      //console.log(currRegion + '==' + $scope.vehicleGroups.allgroups[i]['parent']);
      if (currRegion == this.groupIdParentArr[i]['parent']) {
        output.push(this.groupIdParentArr[i]);
      }
    }
    return output;
  }

  getAllConsignors() {
    try {
      let dataFromService = this.sharing.getConsignorListData();
      if (dataFromService != undefined) {
        this.allConsignorData = dataFromService;
        if (this.allConsignorData) {
          let tempArr = [];
          for (let i = 0; i < this.allConsignorData.length; i++) {
            let depttGroupIndex = tempArr.indexOf(this.allConsignorData[i].departmentGroup);
            if (depttGroupIndex == -1) {
              tempArr.push(this.allConsignorData[i].departmentGroup);
              this.allCnorByGroups.push({
                'departmentGroup': this.allConsignorData[i].departmentGroup,
                'detail': [{
                  'id': this.allConsignorData[i].id,
                  'code': this.allConsignorData[i].code,
                  'name': this.allConsignorData[i].name,
                  'departmentGroup': this.allConsignorData[i].departmentGroup
                }]
              })
            } else {
              for (var j = 0; j < this.allCnorByGroups.length; j++) {
                if (this.allCnorByGroups[j]['departmentGroup'] == this.allConsignorData[i].departmentGroup) {
                  this.allCnorByGroups[j]['detail'].push({
                    'id': this.allConsignorData[i].id,
                    'code': this.allConsignorData[i].code,
                    'name': this.allConsignorData[i].name,
                    'departmentGroup': this.allConsignorData[i].departmentGroup
                  });
                }
              }
            }
          }
        }
        this.changeDetection.detectChanges();
      }
    } catch (err) {
      console.log(err);
    }


  }

  getAllConsignees() {
    try {
      let dataFromService = this.sharing.getConsigneeListData();
      this.changeDetection.detectChanges();
      if (dataFromService != undefined) {
        this.allConsigneeData = dataFromService;
        let tempArr = [];
        for (let i = 0; i < this.allConsigneeData.length; i++) {
          let depttGroupIndex = tempArr.indexOf(this.allConsigneeData[i].departmentGroup);
          if (depttGroupIndex == -1) {
            tempArr.push(this.allConsigneeData[i].departmentGroup);
            this.allCneeByGroups.push({
              'departmentGroup': this.allConsigneeData[i].departmentGroup,
              'detail': [{
                'id': this.allConsigneeData[i].id,
                'code': this.allConsigneeData[i].code,
                'name': this.allConsigneeData[i].name,
                'departmentGroup': this.allConsigneeData[i].departmentGroup
              }]
            })
          } else {
            for (var j = 0; j < this.allCneeByGroups.length; j++) {
              if (this.allCneeByGroups[j]['departmentGroup'] == this.allConsigneeData[i].departmentGroup) {
                this.allCneeByGroups[j]['detail'].push({
                  'id': this.allConsigneeData[i].id,
                  'code': this.allConsigneeData[i].code,
                  'name': this.allConsigneeData[i].name,
                  'departmentGroup': this.allConsigneeData[i].departmentGroup
                });
              }
            }
          }
        }
    this.changeDetection.detectChanges();

      }


    } catch (err) {
      console.log(err);
      this.spinner.hide();

    }
  }

  onChangeRegion(val) {
    if (val == '' || val == null) {
      this.filteredArr = this.groupIdParentArr;
      this.mainFilteredArr = this.groupIdParentArr;

    } else {
      this.filteredArr = this.tofilterDistrictArr(val);
      this.mainFilteredArr = this.tofilterDistrictArr(val);

    }
    console.log(this.filteredArr)
  }

  selectDistrict() {
    this.filteredArr = this.mainFilteredArr.filter(el => el.groupName.toLowerCase().indexOf(this.regionFilter.value.toLowerCase()) !== -1)

  }

  toSelectConsignmentDeptt(name) {
    if (name == 'All' || name == '' || name == null) {
      this.filteredCnorArr = this.allCnorByGroups;
      this.mainfilteredCnorArr = this.allCneeByGroups;
      this.filteredCneeArr = this.allCneeByGroups;
      this.mainfilteredCneeArr = this.allCneeByGroups;
    } else {
      this.filteredCnorArr = this.tofilterCnorArr(name, 'deptt', null);
      this.mainfilteredCnorArr = this.tofilterCnorArr(name, 'deptt', null);
      this.filteredCneeArr = this.tofilterCneeArr(name, 'deptt', null);
      this.mainfilteredCneeArr = this.tofilterCneeArr(name, 'deptt', null);
    }

  }

  // arr[ etail[name]]

  selectConee() {
    if (this.receiverCodeFilter.value != '') {
      this.filteredCneeArr = JSON.parse(JSON.stringify(this.mainfilteredCneeArr));
      this.filteredCneeArr.forEach(el => {
        el.detail = el.detail.filter(elx => elx.name.toLowerCase().indexOf(this.receiverCodeFilter.value.toLowerCase()) !== -1)
      })
    } else {
      this.filteredCneeArr = this.mainfilteredCneeArr;
    }

  }

  selectConr() {
    if (this.dispatchCodeFilter.value != '') {
      this.filteredCnorArr = JSON.parse(JSON.stringify(this.mainfilteredCnorArr))
      this.filteredCnorArr.forEach(el => {
        el.detail = el.detail.filter(elx => elx.name.toLowerCase().indexOf(this.dispatchCodeFilter.value.toLowerCase()) !== -1)

      })
    } else {
      this.filteredCnorArr = this.mainfilteredCnorArr;
    }
  }



  tofilterCnorArr(currDeptt, filterType, depttList) {
    var output = [];
    if (filterType == 'region') {
      for (let i = 0; i < depttList.length;) {
        for (let j = 0; j < this.allCnorByGroups.length; j++) {
          if ((depttList[i].groupName).toLowerCase() == (this.allCnorByGroups[j].departmentGroup).toLowerCase()) {
            output.push(this.allCnorByGroups[j]);
          }
        }
      }

    } else if (filterType == 'deptt') {
      for (let i = 0; i < this.allCnorByGroups.length; i++) {
        if ((currDeptt).toLowerCase() == (this.allCnorByGroups[i].departmentGroup).toLowerCase()) {
          output.push(this.allCnorByGroups[i]);
        }
      }
    }
    this.changeDetection.detectChanges();

    return output;
  }

  tofilterCneeArr(currDeptt, filterType, depttList) {
    var output = [];
    if (filterType == 'region') {
      for (let i = 0; i < depttList.length;) {
        for (let j = 0; j < this.allCneeByGroups.length; j++) {
          if ((depttList[i].groupName).toLowerCase() == (this.allCneeByGroups[j].departmentGroup).toLowerCase()) {
            output.push(this.allCneeByGroups[j]);
          }
        }
      }

    } else if (filterType == 'deptt') {
      for (let i = 0; i < this.allCneeByGroups.length; i++) {
        if ((currDeptt).toLowerCase() == (this.allCneeByGroups[i].departmentGroup).toLowerCase()) {
          output.push(this.allCneeByGroups[i]);
        }
      }

    }
    this.changeDetection.detectChanges();
    return output;
  }

  clickedMarker(infowindow) {

    // console.log(infowindow)
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  closeInfoWindow() {
    this.previous.close();
  }

  async getConsignmentReport() {
    this.current_page = 1;
    this.currentPagetable = 1;
    this.paginatedArray = [];
    this.tablePaginatedArray = [];
    this.paramObj = {
      findByConsignee: true,
      live: true,
      sortByCreatedOn: true,
    }

    if (this.searchText) {
      this.paramObj['consignmentCode'] = this.searchText;

    }
    if (this.district.value) {
      this.paramObj['groupId'] = this.district.value
    }

    if (this.flag.value) {
      this.paramObj['geofenceFlag'] = this.filterForm.value.flag;
    }

    if (this.kpi.value) {
      this.paramObj['kpi'] = this.kpi.value;
    }
    if (this.singleStage.value) {
      this.paramObj['singleStage'] = this.singleStage.value;
    }
    if (this.status.value) {
      this.paramObj['eventType'] = this.status.value;
    }
    if (this.notInNetwork.value) {
      this.paramObj['notInNetwork'] = this.notInNetwork.value;
    }
    if (this.dispatchCode.value) {
      this.paramObj['consignorCode'] = this.dispatchCode.value;
    }
    if (this.receiverCode.value) {
      this.paramObj['consigneeCode'] = this.receiverCode.value;
    }
    try {
      // localStorage.getItem("consignData")
      if (this.sharing.consignmentData == undefined) {
        this.spinner.show();
        this.changeDetection.detectChanges();

        const res: any = await this.consignReport.getConsignmentReport(this.paramObj)
        this.changeDetection.detectChanges();

        this.consignmentArr = res;
        this.totalVehcile = this.consignmentArr.length;
        this.nonLocationVehicle = 0;
        console.log(this.consignmentArr)
        this.mapsdata = [];
        for (let i = 0; i < this.consignmentArr.length; i++) {
            if(this.consignmentArr[i].lastReportedLocation){
              this.nonLocationVehicle++;
            }


          if (this.consignmentArr[i].vehicle?.ignitionStatus == true) {

            this.consignmentArr[i].icon = this.theme.onLoaded



          }
          if (this.consignmentArr[i].vehicle?.ignitionStatus == false) {

            this.consignmentArr[i].icon = this.theme.offLoaded


          }

        }
        this.paginate(this.page_size, this.current_page);
        this.tablePaginate(this.tableSize, this.currentPagetable);

        this.loadVehicleForMap();
    this.cardLoadingFlag = false;

        this.changeDetection.detectChanges();




        this.sharing.setConsignmentData(this.consignmentArr);


        this.spinner.hide();
      } else if (this.sharing.consignmentData != undefined) {
        this.spinner.show();

        if (this.sharing.consignmentFlag != undefined) {
          this.consignmentFlag = this.sharing.consignmentFlag;

          }

        this.consignmentArr = this.sharing.getConsignmentData();


        // this.consignmentArr = res;
        this.totalVehcile = this.consignmentArr.length;
        this.nonLocationVehicle = 0;
        this.mapsdata = [];

        console.log(this.consignmentArr)
        for (let i = 0; i < this.consignmentArr.length; i++) {
          if (this.consignmentArr[i].latitude === 0 && this.consignmentArr[i].longitude === 0) {
            this.nonLocationVehicle++;
          }


        }

        this.paginate(this.page_size, this.current_page);
        this.tablePaginate(this.tableSize, this.currentPagetable);
        setTimeout(() => {
          this.mapsdata = of(this.consignmentArr);
          this.cardLoadingFlag = false;
          this.spinner.hide();

        }, 20)


        this.changeDetection.detectChanges();

      }
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
  }


  loadVehicleForMap() {

    this.mapsdata = of(this.consignmentArr);
    this.cardLoadingFlag = false;


    this.changeDetection.detectChanges();

  }

  timestampConvert(dataString) {
    let d, m, y, h, s, ms;
    d = dataString.slice(0, 2);
    m = dataString.slice(2, 4);
    y = dataString.slice(4, 6);
    h = dataString.slice(6, 8);
    s = dataString.slice(8, 10);
    ms = dataString.slice(10, 12);
    //console.log(Date.parse( m+'/'+d+'/20'+y+' '+h+':'+s+':'+ms));
    return Date.parse(m + '/' + d + '/20' + y + ' ' + h + ':' + s + ':' + ms)
  }

  filter() {
    this.live = false;
    this.cardLoadingFlag = true;
    this.menu.closeMenu();
    this.changeDetection.detectChanges();

    this.changeDetection.markForCheck();


    localStorage.removeItem("consignData");
    localStorage.removeItem("allConsignor");
    this.getConsignmentReport();
  }

  nextPage() {
    // if (this.current_page < this.numPages()) {
    this.current_page++;
    console.log('working')
    this.paginate(this.page_size, this.current_page);
    // }
  }


  paginate(page_size, page_number) {
    if (page_number === 1) {
      this.paginatedArray = this.consignmentArr.slice((page_number - 1) * page_size, page_number * page_size);

    } else {
      this.paginatedArray = this.paginatedArray.concat(
        this.consignmentArr.slice((page_number - 1) * page_size, page_number * page_size)
      )
    }

    console.log(this.paginatedArray);
  }


  tablePaginate(size, number) {
    if (number === 1) {
      this.tablePaginatedArray = this.consignmentArr.slice((number - 1) * size, number * size);

    } else {
      this.tablePaginatedArray = this.tablePaginatedArray.concat(
        this.consignmentArr.slice((number - 1) * size, number * size)
      )
    }


  }

  nextPageTable() {
    this.currentPagetable++;
    // console.log('working')

    this.tablePaginate(this.tableSize, this.currentPagetable);
  }




  downloadReport() {
    let flag, kpi, singleStage, status, proxStatus, regisNo, dispatchCode, receiverCode;

    let proxyParam = 'proximityStatus=';
    let vehicleUINParam = 'vehicleUIN=';
    let consigneeCodeParam = 'consigneeCode=';
    let consignorCodeParam = 'consignorCode=';
    let statusParam = 'status=';
    let kpiParam = 'kpi=';
    let singleStageParam = 'singleStage='
    let geofenceFlagParam = 'geofenceFlag=';


    if (this.filterForm.value.fromDate == null) {
      this.startDate = this.startDate
      this.endDate = this.endDate
      console.log(this.startDate)

      // this.downloadEolAudit();

    } else {
      this.startDate = this.filterForm.value.fromDate;
      this.endDate = this.filterForm.value.toDate;
      console.log(this.filterForm.value)
      // this.downloadEolAudit();
    }




    if (this.flag.value) {
      flag = this.flag.value;
    } else {
      flag = '';
      geofenceFlagParam = '';

    }

    if (this.kpi.value) {
      kpi = this.kpi.value;
    } else {
      kpi = '';
      kpiParam = '';
    }
    if (this.singleStage.value) {
      // this.paramObj['singleStage'] = this.singleStage.value;
      singleStage = this.singleStage.value
    } else {
      singleStage = '';
      singleStageParam = '';
    }
    if (this.status.value) {
      // this.paramObj['status']= this.status.value;
      status = this.status.value
    } else {
      status = '';
      statusParam = '';
    }

    if (this.registraionNo.value) {
      // this.paramObj['vehicleUIN']= this.registraionNo.value;
      regisNo = this.registraionNo.value
    } else {
      regisNo = '';
      vehicleUINParam = '';
    }
    if (this.dispatchCode.value) {
      // this.paramObj['consignorCode']= this.dispatchCode.value;
      dispatchCode = this.dispatchCode.value
    } else {
      dispatchCode = '';
      consignorCodeParam = '';
    }
    if (this.receiverCode.value) {
      // this.paramObj['consigneeCode']= this.receiverCode.value;
      receiverCode = this.receiverCode.value
    } else {
      receiverCode = '';
      consigneeCodeParam = '';
    }

    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;

    if (this.searchText) {
      apiUrl = this.url.apiV2url + `consignment/download?startTime=${+this.startDate}&endTime=${+this.endDate}&consignmentCode=${this.searchText}&geofenceFlagParam${flag}&singleStageParam${singleStage}&kpiParam${kpi}
      &statusParam${status}&proxyParam${proxStatus}&vehicleUINParam${regisNo}&consignorCodeParam${dispatchCode}&consigneeCodeParam${receiverCode}&access_token=${access_token}`
    } else {
      apiUrl = this.url.apiV2url + `consignment/download?startTime=${+this.startDate}&endTime=${+this.endDate}&geofenceFlagParam${flag}&singleStageParam${singleStage}&kpiParam${kpi}
      &statusParam${status}&proxyParam${proxStatus}&vehicleUINParam${regisNo}&consignorCodeParam${dispatchCode}&consigneeCodeParam${receiverCode}&access_token=${access_token}`

    }

    window.open(apiUrl, '_blank');


  }


  waypointsToggle(id, groupId) {
    console.log(id, groupId)
    if(this.toggleBool){
        if( "Div1_"+id == this.previousId1 && "Div2_"+id == this.previousId2){
            document.getElementById("Div1_"+id).remove();
            for(let i=this.arrlen-1; i>=0; i--){
                document.getElementById("Div2_"+id+"_"+i).remove();
            }
            this.previousId1="Div1_"+id
            this.previousId2="Div2_"+id
            // console.log($rootScope.previousId1);
            this.toggleBool = false ;
            this.toggleImg = document.getElementById('object-'+id);
            this.toggleImg.setAttribute("src", "assets/images/expand.png");
        }
        else{
             document.getElementById(this.previousId1).remove();
            //  document.getElementById($rootScope.previousId2).remove();
             for(let i= this.arrlen-1; i>=0; i--){
                document.getElementById(this.previousId2+"_"+i).remove();
             }
          this.getWayPoints(id,groupId);

        }
    }
    else {
      this.getWayPoints(id,groupId)

    }
  }

  async getWayPoints(id,groupID) {

    try {

        const res: any = await this.consignReport.getWayPoints(groupID);
      this.wayPointList = res;
      this.setWayPointInTable(id);
      console.log(this.wayPointList)
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
  }

   insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
   }

  setWayPointInTable(id) {
    if (this.wayPointList.length != 0) {
      this.el1 = document.createElement("tr");
                  this.el1.setAttribute("id", "Div1_"+id);
                  this.div = document.getElementById(id);
                  this.el1.innerHTML = `
                  <th style="width: 70px; border-right: 0px; text-align: center; font-size: 12px; ">
                    Sr. No
                  </th>
                  <th scope="col" style="width: 132px !important; font-size: 12px;" > Waypoint Code</th>
                  <th scope="col" style="width: 132px; font-size: 12px;" title="Registration Number">
                  <span>Waypoint Name</span>
                  </th>
                  <th colspan="9"scope="col"style="text-align: left !important; font-size: 12px;" > Address</th>
                  `;
                  this.insertAfter(this.div, this.el1);
                  this.arrlen=this.wayPointList.length;
                  for(let i=this.wayPointList.length-1; i>=0; i--){
                      this.el2 = document.createElement("tr");
                      this.el2.setAttribute("id", "Div2_"+id+"_"+i);
                      this.el2.innerHTML = `
                      <td class="align-middle" style="width: 70px; border-right: 1px solid #ddd; text-align: center; font-size: 12px; font-weight: 500;">
                      ${id+1+"."+[i+1]}
                      </td>
                      <td class="align-middle" style="width: 132px; font-size: 12px; font-weight: 500;">
                      ${this.wayPointList[i].code}
                      </td>
                      <td class="align-middle" style="width: 132px; font-size: 12px; font-weight: 500;">

                        ${this.wayPointList[i].name}
                      </td>
                      <td  colspan="9" style="width: 132px; font-size: 12px; font-weight: 500;" >
                      ${this.wayPointList[i].address}
                      </td>
                      `;

                      this.insertAfter(this.el1,  this.el2);
                  }


                  this.previousId1="Div1_"+id
                  this.previousId2="Div2_"+id
                  // console.log($rootScope.previousId1)
                  this.toggleBool = true ;
                  this.toggleImg = document.getElementById('object-'+id);
                  this.toggleImg.setAttribute("src", "assets/images/collaps.png");
    }
  }

  recenterMap() {
    console.log('clicked')
    this.defaultLat = Number(25.79891);
    this.defaultLng = Number(77.28790);
    this.defaultZoom = 6;
    this.changeDetection.detectChanges();

  }

  centerChange(ev) {
    console.log(ev)
  }





}

