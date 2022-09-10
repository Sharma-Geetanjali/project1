
import { Location } from '@angular/common';
import {
  Component, OnInit, Input, HostListener,ViewChild,ChangeDetectionStrategy,ChangeDetectorRef,OnDestroy
} from '@angular/core';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatMenuTrigger } from '@angular/material/menu';
import { KpiReportService } from 'src/app/Services/Reports/kpiReport/kpi-report.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HeaderService } from 'src/app/Services/header/header.service';





declare var $: any;

@Component({
  selector: 'app-kpi-violation-report',
  templateUrl: './kpi-violation-report.component.html',
  styleUrls: ['./kpi-violation-report.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class KpiViolationReportComponent implements OnInit,OnDestroy {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;
  @Input() max: null;
  kpiArr: any = [];
  pipe: DatePipe;
  maxDate = new Date();
  imgPath = this.global.imgPath;
  searchText = null;
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
  offset1 = 0;
  limit = 10;
  offset2 = 0;
  limit2 = 10;
  Size: number = 50;
  minDate;
  numberFilter: any = [];
  groupListArr: any = [];
  ConsignGroupListArr: any = [];
  consignmentMyGroup: any = [];
  FilterConsignmentMyGroup: any = [];
  groupIdParentArr: any = [];
  list: any = [];
  filterListArr: any = [];
  myOrganization: any = [];
  filterMyOrg: any = [];
  options = [];

  options$: Observable<string[]>;
  options1 = [];

  options1$: Observable<string[]>;
  subscription: Subscription;





  constructor(private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public global: GlobalConfigService,
    public location: Location,
    public kpiService: KpiReportService,
    private url: UrlServiceService,
    public login: LoginServiceService,
    private fb: FormBuilder,
    public headerS: HeaderService) {

    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);
    // this.changeDetection.detectChanges();

    // this.options$ = this.options.asObservable().pipe(
    //   scan((acc, curr) => {
    //       return [...acc, ...curr];
    //   }, [])
    // );

    // this.options1$ = this.options1.asObservable().pipe(
    //   scan((acc, curr) => {
    //       return [...acc, ...curr];
    //   }, [])
    // );

    this.subscription = this.headerS.refresh$.subscribe((val) => {
      this.ngOnInit();
    });
    this.changeDetection.markForCheck();


  }





  ngOnInit(): void {

    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      registraionNo: [''],
      consignmentCode: [''],
      consignorCode: [''],
      consigneeCode: [''],
      kpi: [''],
      vehicle: [''],
      filterVehicle: [''],
      myvehicle: [''],
      myfilterVehicle:[''],
      filterMyconsign: [''],
      myconsign:[''],


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
      // console.log(val);
      this.offset = 0;
      this.Size = 50;
      this.getKpiReport();

    });



    this.getConsignmentsGroup();
    this.getGroupList();
    this.getKpiReport();

    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
    this.filterVehicle.valueChanges.subscribe(() => { this.vehicleFilter() });
    this.myfilterVehicle.valueChanges.subscribe(() => { this.vehicleGroupFilter() });
    this.filterMyconsign.valueChanges.subscribe(() => { this.consignGroupFilter() });
    this.myvehicle.valueChanges.subscribe(() => { this.vehicleValueSet() });




  }

  ngOnDestroy() {
    // this.headerS.endDate$._su
    // clearInterval(this.intervalId)
    this.subscription.unsubscribe();
  }

  call() {
    this.ngOnInit();
  }

  getNextBatch() {
    const result = this.list.slice(this.offset1, this.offset1 + this.limit);
    this.options = this.options.concat(result)
    this.offset1 += this.limit;
    console.log(result);
    console.log(this.options)
  }

  getNextGroup() {
    const result = this.consignmentMyGroup[0].groups.slice(this.offset2, this.limit2 + this.limit2);
    this.options1 = this.options1.concat(result);
    this.offset2 += this.limit2;
    console.log(result)
  }

  mindate() {
    this.minDate = (this.fromDate.value)
  }


  get fromDate() { return this.filterForm.get('fromDate'); }
  get toDate() { return this.filterForm.get('toDate'); }
  get consignorCode() { return this.filterForm.get('consignorCode'); }
  get consigneeCode() { return this.filterForm.get('consigneeCode'); }
  get kpi() { return this.filterForm.get('kpi'); }
  get registraionNo() { return this.filterForm.get('registraionNo'); }
  get vehicle() { return this.filterForm.get('vehicle'); }
  get filterVehicle() { return this.filterForm.get('filterVehicle'); }
  get myvehicle() { return this.filterForm.get('myvehicle'); }
  get myfilterVehicle() { return this.filterForm.get('myfilterVehicle'); }
  get filterMyconsign() { return this.filterForm.get('filterMyconsign'); }
  get myconsign() { return this.filterForm.get('myconsign'); }









  clearRegisNo() {
    this.registraionNo.patchValue('')
    let el = (element) => element == 'registraionNo';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)


    }

  }

  clearKpi() {
    this.kpi.patchValue('')
    let el = (element) => element == 'kpi';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)


    }

  }
  clearconsigneeCode() {
    this.consigneeCode.patchValue('')
    let el = (element) => element == 'consigneeCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)


    }

  }
  clearconsignorCode() {
    this.consignorCode.patchValue('')
    let el = (element) => element == 'consignorCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)


    }

  }

  vehicleValueSet() {
    let selectedValue = this.list.find(el => JSON.stringify(el.id) === JSON.stringify(this.myvehicle.value))
    if (this.myvehicle.value) {
      this.vehicle.patchValue(selectedValue?.name);
    }
    console.log(selectedValue?.name)
  }






  clearVehicle() {
    this.vehicle.patchValue('')
    let el = (element) => element == 'vehicle';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val != -1) {
        this.numberFilter.splice(val, 1)


      }

  }

  clearDate() {
    console.log('ngonit')
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }

  clearMyvehicle() {
    this.myvehicle.patchValue('')

    let el = (element) => element == 'myvehicle';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val != -1) {
        this.numberFilter.splice(val, 1)


      }

  }

  clearMyconsign() {
    this.myconsign.patchValue('')

    let el = (element) => element == 'myconsign';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val != -1) {
        this.numberFilter.splice(val, 1)


      }
  }

  reomveFilter() {
    this.clearVehicle();
    this.clearMyvehicle();
    this.clearMyconsign();
    this.offset = 0;
    this.getGroupList();
  }

  clearAll() {
    this.clearVehicle();
    this.clearMyvehicle();
    this.clearMyconsign();
    this.clearRegisNo();
    this.clearKpi();
    this.clearconsigneeCode();
    this.clearconsignorCode();
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    })
    this.offset = 0;

    this.getKpiReport();
  }

  filterCount() {

    if (this.vehicle.value != "") {
      const isLargeNumber = (element) => element == 'vehicle';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        this.numberFilter.push('vehicle')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('vehicle')
      }
    }

    if (this.myvehicle.value != "") {
      let kpi = (element) => element == 'myvehicle';
      let val = this.numberFilter.findIndex(kpi);
      if (val == -1) {
        this.numberFilter.push('myvehicle')


      }
      else {
      console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('myvehicle')
      }
    }

    if (this.myconsign.value != "") {
      let el = (element) => element == 'myconsign';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        this.numberFilter.push('myconsign')


      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('myconsign')
      }
    }

    if (this.kpi.value != "") {
      let el = (element) => element == 'kpi';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        this.numberFilter.push('kpi')


      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('kpi')
      }
    }

    if (this.consigneeCode.value != "") {
      let el = (element) => element == 'consigneeCode';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        this.numberFilter.push('consigneeCode')


      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('consigneeCode')
      }
    }

    if (this.consignorCode.value != "") {
      let el = (element) => element == 'consignorCode';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        this.numberFilter.push('consignorCode')


      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('consignorCode')
      }
    }

    if (this.registraionNo.value != "") {
      let el = (element) => element == 'registraionNo';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        this.numberFilter.push('registraionNo')


      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('registraionNo')
      }
    }
    console.log(this.numberFilter);

  }



  search() {
    this.offset = 0;

    this.getKpiReport()
    this.filterCount()
  }

  async getKpiReport() {
    this.spinner.show();
    // let SetendTime = this.filterForm.value.toDate

      this.paramObj = {
        startTime: +this.filterForm.value.fromDate,
        endTime: +this.filterForm.value.toDate,
        offset: this.offset,
        size: this.Size
    }


    if (this.searchText) {
      this.paramObj['consignmentCode'] = this.searchText;

    }

    if (this.myconsign.value) {
      this.paramObj['groupId'] = this.filterForm.value.myconsign;
    }

    if (this.vehicle.value && this.myvehicle.value == '') {

      this.paramObj['vehicleId'] = this.vehicle.value;
        console.log('all vehicle');

    }
    if (this.myvehicle.value) {
      this.paramObj['vehicleId'] = this.myvehicle.value;


    }
    if (this.registraionNo.value) {
      this.paramObj['uin'] = this.registraionNo.value;
    }
    if (this.kpi.value) {
      this.paramObj['kpi'] = this.kpi.value;
    }
    if (this.consignorCode.value) {
      this.paramObj['consignorCode'] = this.consignorCode.value;
    }
    if (this.consigneeCode.value) {
      this.paramObj['consigneeCode'] = this.consigneeCode.value;
    }


    try {

      const res: any = await this.kpiService.getkpiReport(this.paramObj);
      this.changeDetection.detectChanges();
      this.changeDetection.markForCheck();
      console.log(res);
      if (this.offset == 0) {
        this.kpiArr = res;

      } else {
        this.kpiArr = this.kpiArr.concat(res);

      }
      this.offset = this.offset + this.Size
      this.spinner.hide();
    }
    catch (err){
      console.log(err)
      this.spinner.hide();
    }

  }

  async getGroupList() {
    try {

      const res: any = await this.kpiService.getGroupList();
      this.groupListArr = res;
      console.log(this.groupListArr)
      let vehicleNames = [];
      this.list = [];
      let serviceParentList = [];

      for (var i = 0; i < this.groupListArr.length; i++) {
        var item = this.groupListArr[i];
        //groups.push(item.groups); // list all groups
        if (item.entity.me == true) {
          this.myOrganization.push(item);
          this.filterMyOrg.push(item);
        }
        for (var k = 0; k < item.groups.length; k++) { // iterate over groups
          var group = item.groups[k];
          this.groupIdParentArr.push({
            'groupId': group['groupId'],
            'groupName': group['groupName'],
            'parent': group['parent'],
            'type': group['type']
          });
          for (var i = 0; i < group.vehicles.length; i++) {
             // iterate over vehicles under each group
            var vehicle = group.vehicles[i];
            this.list.push(vehicle);
            this.filterListArr.push(vehicle);
            vehicleNames[vehicle.id] = vehicle.name; // Assign name to each vehicleId
            serviceParentList.push({
              'vehicleId': vehicle.id,
              'district': group.parent
            })
          }
        }

        this.changeDetection.detectChanges();
      this.changeDetection.markForCheck();
      }

      this.getNextBatch();


      console.log(this.list);

    } catch (err) {
      console.log(err);
    }



  }

  async getConsignmentsGroup() {
    try {
      const res: any = await this.kpiService.getConsignmentsGroup();
      this.ConsignGroupListArr = res;
      for (let i = 0; i < this.ConsignGroupListArr.length; i++) {
        let item1 = this.ConsignGroupListArr[i];
        if (item1.entity.me == true) {
          this.consignmentMyGroup.push(item1);
          this.FilterConsignmentMyGroup.push(item1);
        }
        this.changeDetection.detectChanges();
        this.changeDetection.markForCheck();
      }
      this.getNextGroup();
      console.log(this.consignmentMyGroup[0].groups)

    } catch (err) {
      console.log(err);
    }



  }

  vehicleFilter() {
     this.list = this.filterListArr.filter(el =>
      el.name.toLowerCase().indexOf(this.filterVehicle.value.toLowerCase()) !== -1
     )
     this.options = []
     this.offset1 = 0;
     this.getNextBatch();

  }


  vehicleGroupFilter() {
    this.changeDetection.detectChanges();
    this.changeDetection.markForCheck();
    if (this.myfilterVehicle.value != '') {
      this.myOrganization = JSON.parse(JSON.stringify(this.filterMyOrg));
      this.myOrganization.forEach(el => {
        el.groups = el.groups.filter(elx => elx.groupName.toLowerCase().indexOf(this.myfilterVehicle.value.toLowerCase()) !== -1)
      })

    } else {
      this.myOrganization = this.filterMyOrg;

    }

  }

  consignGroupFilter() {
    this.changeDetection.detectChanges();
    this.changeDetection.markForCheck();
    if (this.filterMyconsign.value != '') {
      this.consignmentMyGroup = JSON.parse(JSON.stringify(this.FilterConsignmentMyGroup));
      this.consignmentMyGroup.forEach(el => {
        el.groups = el.groups.filter(elx => elx.groupName.toLowerCase().indexOf(this.filterMyconsign.value.toLowerCase()) !== -1)
      })

    } else {
      this.consignmentMyGroup = this.FilterConsignmentMyGroup;

    }

    this.options1 = []
    this.offset2 = 0;
    this.getNextGroup();

    // this.getNextGroup();

  }




  filter() {
    this.menu.closeMenu();
    this.offset = 0;
    this.getKpiReport();

  }


  downloadReport() {
    let  kpi, groupId, vehicleId,uin,consignorCode,consigneeCode;
    // let consignmentCodeParam = 'consignmentCode=';
    let groupIdParam = 'groupId='
    let vehicleIdParam = 'vehicleId=';
    let uinParam = 'uin=';
    let consignorCodeParam = 'consignorCode=';
    let consigneeCodeParam = 'consigneeCode=';
    let kpiParam = 'kpi=';


    if (this.filterForm.value.fromDate == null) {
      this.startDate = this.startDate
      this.endDate = this.endDate
      console.log(this.startDate)


    } else {
      this.startDate = this.filterForm.value.fromDate;
      this.endDate = this.filterForm.value.toDate;
      console.log(this.filterForm.value)
    }

    if (this.myconsign.value) {
      groupId = this.myconsign.value;
    } else {
      groupId = '';
      groupIdParam = '';

    }

    if (this.vehicle.value && this.myvehicle.value == '') {
      vehicleId = this.vehicle.value;
    } else {
      vehicleId = '';
      vehicleIdParam = '';

    }

    if (this.myvehicle.value) {
      vehicleId = this.myvehicle.value;
    } else {
      vehicleId = '';
      vehicleIdParam = '';

    }

    if (this.registraionNo.value) {
      uin = this.registraionNo.value;
    } else {
      uin = '';
      uinParam = '';

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

    if (this.kpi.value) {
      kpi = this.kpi.value;
    } else {
      kpi = '';
      kpiParam = '';

    }




    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;

    if (this.searchText) {
      apiUrl = this.url.apiV2url + `kpi/events/download?startTime=${+this.startDate}&endTime=${+this.endDate}&consignmentCode=${this.searchText}&${groupIdParam}${groupId}&${vehicleIdParam}${vehicleId}&${kpiParam}${kpi}&${uinParam}${uin}&${consignorCodeParam}${consignorCode}&${consigneeCodeParam}${consigneeCode}
      &access_token=${access_token}`
    } else {
      apiUrl = this.url.apiV2url + `kpi/events/download?startTime=${+this.startDate}&endTime=${+this.endDate}&${groupIdParam}${groupId}&${vehicleIdParam}${vehicleId}&${kpiParam}${kpi}&${uinParam}${uin}&${consignorCodeParam}${consignorCode}&${consigneeCodeParam}${consigneeCode}
      &access_token=${access_token}`

    }
    console.log(apiUrl)

    window.open(apiUrl, '_blank');


  }





}

