import { ChangeDetectorRef, Component, OnInit, ViewChild,OnDestroy,ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { CommodityReportService } from 'src/app/Services/Reports/commodityReport/commodity-report.service';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';
import { Subscription } from 'rxjs';
import { HeaderService } from 'src/app/Services/header/header.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';

@Component({
  selector: 'app-commodity-report',
  templateUrl: './commodity-report.component.html',
  styleUrls: ['./commodity-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CommodityReportComponent implements OnInit,OnDestroy {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;

  maxDate = new Date();
  startDate = new Date();
  filterForm: FormGroup;
  endDate = new Date();
  offset = 0;
  size: number = 50;
  paramObj = null;
  searchText = null;
  commodityArr: any = [];
  imgPath = this.global.imgPath;
  numberFilter: any = [];
  groupListArr: any = [];
  list: any = [];
  myOrganization: any = [];
  filterMyOrg: any = [];
  groupIdParentArr: any = [];
  filterListArr: any = [];
  UnqiueGroupID: any = [];
  UnqiueMainGroupID: any = [];
  filteredArr: any = [];
  mainFilteredArr: any = [];
  reagionParam:any;
  mainReagionParam:any;
  allCneeByGroups:any = [];
  allConsignorData:any = [];
  allCnorByGroups:any = [];
  allConsigneeData:any = [];
  filteredCnorArr:any = [];
  mainfilteredCnorArr:any = [];
  filteredCneeArr:any = [];
  mainfilteredCneeArr: any = [];
  subscription: Subscription;
  minDate;






  constructor(private url: UrlServiceService,
    public login: LoginServiceService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public global: GlobalConfigService,
    private changeDetection: ChangeDetectorRef,
    private commodityService: CommodityReportService,
    private vehicleReport: VehicleListService,
    public headerS: HeaderService,
    private sharing: SharingService
  ) {

    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);
    this.subscription = this.headerS.refresh$.subscribe((val) => {
      this.ngOnInit();
      // this.global.getGroupListData();
      this.global.getConsignorListData();
      this.global.getConsigneeListData();
    });
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      registrationNo: [''],
      // consignmentCode: [''],
      consignorCode: [''],
      consigneeCode: [''],
      region: [''],
      district: [''],
      regionGroupFilter: [''],
      consignorCodeFilter: [''],
      consigneeCodeFilter: ['']
    })

    this.clearDate();
    this.subscription = this.headerS.startDate$.subscribe((val) => {
      this.filterForm.patchValue({
        fromDate: val
        // toDate: new Date()
      });
      console.log(val);
    });

    this.subscription = this.headerS.endDate$.subscribe((val) => {
      this.filterForm.patchValue({
        toDate: val
        // toDate: new Date()
      });
      console.log(val);
    });

    this.subscription = this.headerS.apiCall$.subscribe((val) => {
      this.offset = 0;
      this.size = 50;
      this.getCommodityReport();



    });

    // this.global.groupListDataObservable$.subscribe(()=>{
    //   this.getGroupList();
    // })

    this.sharing.consignorListDataObservable$.subscribe(()=>{
      this.getAllConsignors();
    })

    this.sharing.consigneeListDataObservable$.subscribe(()=>{
      this.getAllConsignees();
    })

    this.sharing.groupListDataObservable$.subscribe(() => {
      this.getGroupList();

    })

    this.getAllConsignees();
    this.getAllConsignees();
    this.getGroupList();

    // this.getAllConsignees();
    // this.getAllConsignors();
    this.getCommodityReport();

    this.onChangeRegion('');
    this.toSelectConsignmentDeptt('');
    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
    this.regionFilter.valueChanges.subscribe(() => { this.selectDistrict() });
    this.consignorCodeFilter.valueChanges.subscribe(() => { this.selectConr() });
    this.consigneeCodeFilter.valueChanges.subscribe(() => { this.selectConee() });
  }

  ngOnDestroy() {
    // this.headerS.endDate$._su
    // clearInterval(this.intervalId)
    this.subscription.unsubscribe();
  }




  get consignorCode() { return this.filterForm.get('consignorCode'); }
  get consigneeCode() { return this.filterForm.get('consigneeCode'); }
  get registrationNo() { return this.filterForm.get('registrationNo'); }
  get region() { return this.filterForm.get('region'); }
  get regionFilter() { return this.filterForm.get('regionGroupFilter'); }
  get district() { return this.filterForm.get('district'); }
  get consignorCodeFilter() { return this.filterForm.get('consignorCodeFilter'); }
  get consigneeCodeFilter() { return this.filterForm.get('consigneeCodeFilter'); }


  search() {
    this.offset = 0;

    this.getCommodityReport()
    this.filterCount()
  }

  mindate() {
    this.minDate = this.filterForm.value.fromDate
  }

  filter() {
    this.commodityArr = []
    this.offset = 0;
    this.menu.closeMenu();
    this.changeDetection.detectChanges();

    this.changeDetection.markForCheck();

    this.getCommodityReport();
  }

  filterCount() {

    if (this.consignorCode.value != "") {
      const isLargeNumber = (element) => element == 'consignorCode';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('consignorCode')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('consignorCode')
      }
    }

    if (this.consigneeCode.value != "") {
      const isLargeNumber = (element) => element == 'consigneeCode';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('consigneeCode')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('consigneeCode')
      }
    }

    if (this.registrationNo.value != "") {
      const isLargeNumber = (element) => element == 'registrationNo';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('registrationNo')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('registrationNo')
      }
    }

    if (this.region.value != "") {
      const isLargeNumber = (element) => element == 'region';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('region')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('region')
      }
    }

    if (this.district.value != "") {
      const isLargeNumber = (element) => element == 'district';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('district')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('district')
      }
    }


    console.log(this.numberFilter)

  }


  applyRegionFilter() {
    var output = [];
    for (var i = 0; i < this.groupIdParentArr.length; i++) {
      var allVgroups = this.groupIdParentArr[i];
      // console.log($scope.selectedVehicleRegion == allVgroups['parent']);
      if (this.region.value == allVgroups['parent']) {
        output.push(allVgroups['groupId']);
      }
    }
    console.log(output)
    this.changeDetection.detectChanges()

    return output;
  }



  async getCommodityReport() {

    this.spinner.show();
    let SetendTime = this.filterForm.value.toDate;

    this.paramObj = {
      startTime: +this.filterForm.value.fromDate,
      endTime: +SetendTime,
      offset: this.offset,
      size: this.size
    }

    if (this.district.value) {
      console.log('working')
      this.mainReagionParam == null;
      this.reagionParam == null;
      let selectedVehicleDistrictId = [];
      for (var i = 0; i < this.groupIdParentArr.length; i++) {
        var allVgroups = this.groupIdParentArr[i];
        //console.log($scope.selectedVehicleDistrictName +' == '+ allVgroups['groupName']);
        if (this.district.value == allVgroups['groupName']) {
          selectedVehicleDistrictId.push(allVgroups['groupId']);
          break;
        }
      }
      if (selectedVehicleDistrictId.length == 0) {
        for (var i = 0; i < this.groupIdParentArr.length; i++) {
          var allVgroups = this.groupIdParentArr[i];
          //console.log($scope.selectedVehicleRegion == allVgroups['parent']);
          if (this.region.value == allVgroups['parent']) {
            selectedVehicleDistrictId.push(allVgroups['groupId']);
          }
        }
      }
      // this.paramObj['groupId'] = selectedVehicleDistrictId;

    } else if (this.region.value || this.district.value != '') {
      let selectedVehicleRegionId = [];
      selectedVehicleRegionId = this.applyRegionFilter()
      for (let i = 0; i < selectedVehicleRegionId.length; i++) {
        // this.reagionParam == null ;
        this.reagionParam = this.reagionParam + this.commodityService.serialize({ groupId: selectedVehicleRegionId[i] })
        if (i + 1 != selectedVehicleRegionId.length) {
          this.reagionParam = this.reagionParam + '&';
        }

      }
      // this.mainReagionParam == null;
      if (this.mainReagionParam == null) {
        this.mainReagionParam = this.reagionParam.replace('undefined', '');
        this.mainReagionParam = this.mainReagionParam.replace('null', '');

      } else {
        this.mainReagionParam = this.reagionParam.replace(this.mainReagionParam, '')
        this.mainReagionParam = this.mainReagionParam.replace('null', '');

      }

      // console.log(ret);

    }

    if (this.searchText) {
      this.paramObj['consignmentCode'] = this.searchText;
    }

    if (this.registrationNo.value) {
      this.paramObj['vehicleUIN'] = this.registrationNo.value;
    }

    if (this.consigneeCode.value) {
      this.paramObj['consigneeCode'] = this.consigneeCode.value;
    }

    if (this.consignorCode.value) {
      this.paramObj['consignorCode'] = this.consignorCode.value;
    }

    // if (this.region.value) {
    //   this.paramObj['consignmentCode'] = this.region.value;
    // }

    // if (this.district.value) {
    //   this.paramObj['groupId'] = this.district.value;
    // }


    try {

      const res: any = await this.commodityService.getcommodityReport(this.paramObj, this.mainReagionParam, this.district.value);
      this.changeDetection.detectChanges();
      this.changeDetection.markForCheck();
      if (this.offset == 0) {
        // console.log(res)
        this.commodityArr = res.commodityModel;

      } else {
        this.commodityArr = this.commodityArr.concat(res.commodityModel);
        // console.log(res)

      }
      this.offset = this.offset + this.size
      this.spinner.hide();
    this.changeDetection.detectChanges()

    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
    console.log(this.commodityArr)
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

  onChangeRegion(val) {
    if (val == '' || val == null) {
      this.filteredArr = this.groupIdParentArr;
      this.mainFilteredArr = this.groupIdParentArr;

    } else {
      this.filteredArr = this.tofilterDistrictArr(val);
      this.mainFilteredArr = this.tofilterDistrictArr(val);

    }
  }

  selectDistrict() {

    this.filteredArr = this.mainFilteredArr.filter(el => el.groupName.toLowerCase().indexOf(this.regionFilter.value.toLowerCase()) !== -1)
    this.changeDetection.detectChanges()

  }


  reomveFilter() {
    this.commodityArr = [];
    this.offset = 0;
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();


    this.clearRegistrationNo();
    this.clearconsigneeCode();
    this.clearconsignorCode();
    this.clearRegion();
    this.clearDistrict();
    this.getCommodityReport();

  }

  clearAll() {
    this.commodityArr = [];
    this.offset = 0;
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();

    // this.filterForm.reset();
    this.clearRegistrationNo();
    this.clearconsigneeCode();
    this.clearconsignorCode();
    this.clearRegion();
    this.clearDistrict();
    this.getCommodityReport();
  }

  clearDate() {
    // this.startDate.setHours(0, 0, 0, 0);

    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }


  clearRegistrationNo() {
    this.registrationNo.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'registrationNo';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  clearconsignorCode() {
    this.consignorCode.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'consignorCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  clearconsigneeCode() {
    this.consigneeCode.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'consigneeCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  clearRegion() {
    this.region.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'region';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  clearDistrict() {
    this.district.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'district';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
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
    this.changeDetection.detectChanges()


      }
    } catch (err) {
      console.log(err);
    }



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
      }

    this.changeDetection.detectChanges()



    } catch (err) {
      console.log(err);
      this.spinner.hide();

    }


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
    this.changeDetection.detectChanges()


    // console.log(this.filteredArr)

  }


  selectConee() {
    if (this.consigneeCodeFilter.value != '') {
      this.filteredCneeArr = JSON.parse(JSON.stringify(this.mainfilteredCneeArr));
      this.filteredCneeArr.forEach(el => {
        el.detail = el.detail.filter(elx => elx.name.toLowerCase().indexOf(this.consigneeCodeFilter.value.toLowerCase()) !== -1)
      })
    } else {
      this.filteredCneeArr = this.mainfilteredCneeArr;
    }

    this.changeDetection.detectChanges()

  }

  selectConr() {
    // this.filteredCnorArr = this.mainfilteredCnorArr.filter(el =>  el.name.toLowerCase().indexOf(this.receiverCodeFilter.value.toLowerCase()) > -1)
    if (this.consignorCodeFilter.value != '') {
      this.filteredCnorArr = JSON.parse(JSON.stringify(this.mainfilteredCnorArr))
      this.filteredCnorArr.forEach(el => {
        el.detail = el.detail.filter(elx => elx.name.toLowerCase().indexOf(this.consignorCodeFilter.value.toLowerCase()) !== -1)
        // console.log(el)
        // el.detail.filter(al =>
        // // console.log(al.name)

        //   al.name.toLowerCase().indexOf(this.dispatchCodeFilter.value.toLowerCase()) !== -1

        // )
      })
    } else {
      this.filteredCnorArr = this.mainfilteredCnorArr;
    }
    this.changeDetection.detectChanges()

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
    this.changeDetection.detectChanges()

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
    this.changeDetection.detectChanges()

    return output;
  }

  downloadReport() {
    console.log('working')
    let  vehicleUIN,consignorCode,consigneeCode,districtVal;
    // let consignmentCodeParam = 'consignmentCode=';

    let vehicleUINParam = 'vehicleUIN=';
    let consignorCodeParam = 'consignorCode=';
    let consigneeCodeParam = 'consigneeCode=';
    let districtValParam = 'groupId';


    if (this.filterForm.value.fromDate == null) {
      this.startDate = this.startDate
      this.endDate = this.endDate
      console.log(this.startDate)


    } else {
      this.startDate = this.filterForm.value.fromDate;
      this.endDate = this.filterForm.value.toDate;
      console.log(this.filterForm.value)
    }


    if (this.district.value) {
      this.mainReagionParam == null;
      this.reagionParam == null;
      let selectedVehicleDistrictId = [];
      for (var i = 0; i < this.groupIdParentArr.length; i++) {
        var allVgroups = this.groupIdParentArr[i];
        if (this.district.value == allVgroups['groupName']) {
          selectedVehicleDistrictId.push(allVgroups['groupId']);
          break;
        }
      }
      if (selectedVehicleDistrictId.length == 0) {
        for (var i = 0; i < this.groupIdParentArr.length; i++) {
          var allVgroups = this.groupIdParentArr[i];
          if (this.region.value == allVgroups['parent']) {
            selectedVehicleDistrictId.push(allVgroups['groupId']);
          }
        }
      }

    } else if (this.region.value || this.district.value != '') {
      let selectedVehicleRegionId = [];
      selectedVehicleRegionId = this.applyRegionFilter()
      for (let i = 0; i < selectedVehicleRegionId.length; i++) {
        this.reagionParam = this.reagionParam + this.commodityService.serialize({ groupId: selectedVehicleRegionId[i] })
        if (i + 1 != selectedVehicleRegionId.length) {
          this.reagionParam = this.reagionParam + '&';
        }

      }
      if (this.mainReagionParam == null) {
        this.mainReagionParam = this.reagionParam.replace('undefined', '');
        this.mainReagionParam = this.mainReagionParam.replace('null', '');

      } else {
        this.mainReagionParam = this.reagionParam.replace(this.mainReagionParam, '')
        this.mainReagionParam = this.mainReagionParam.replace('null', '');

      }


    }



    if (this.district.value) {
      districtVal = this.district.value;
    } else {
      districtVal = '';
      districtValParam = '';

    }

    if (this.registrationNo.value) {
      vehicleUIN = this.registrationNo.value;
    } else {
      vehicleUIN = '';
      vehicleUINParam = '';

    }

    if (this.consignorCode.value) {
      consignorCode = this.consignorCode.value;
    } else {
      consignorCode = '';
      consignorCodeParam = '';

    }

    if (this.consigneeCode.value) {
      consigneeCode = this.consigneeCode.value;
    } else {
      consigneeCode = '';
      consigneeCodeParam = '';

    }



    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;

    if (this.searchText) {
      apiUrl = this.url.apiV2url + `lucknow/grains/download?startTime=${+this.startDate}&endTime=${+this.endDate}&consignmentCode=${this.searchText}&${this.mainReagionParam}&${districtValParam}${districtVal}&${vehicleUINParam}${vehicleUIN}&${consignorCodeParam}${consignorCode}&${consigneeCodeParam}${consigneeCode}
      &access_token=${access_token}`
    } else {
      apiUrl = this.url.apiV2url + `lucknow/grains/download?startTime=${+this.startDate}&endTime=${+this.endDate}&${this.mainReagionParam}&${districtValParam}${districtVal}&${vehicleUINParam}${vehicleUIN}&${consignorCodeParam}${consignorCode}&${consigneeCodeParam}${consigneeCode}
      &access_token=${access_token}`

    }

    window.open(apiUrl, '_blank');


  }



}
