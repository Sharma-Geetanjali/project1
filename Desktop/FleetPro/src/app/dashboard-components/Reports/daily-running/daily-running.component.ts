import { Location } from '@angular/common';
import {
  Component, OnInit, Input, HostListener, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy
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
import { DailyRunningService } from 'src/app/Services/Reports/daily-running-report/daily-running.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { HeaderService } from 'src/app/Services/header/header.service';
import { Subscription } from 'rxjs';



declare var $: any;

@Component({
  selector: 'app-daily-running',
  templateUrl: './daily-running.component.html',
  styleUrls: ['./daily-running.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class DailyRunningComponent implements OnInit, OnDestroy {
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
  offset1 = 0;
  limit = 10;
  offset2 = 0;
  limit2 = 10;
  subscription: Subscription;
  dailyData: any = [];
  dailyMilliData: any = [];








  constructor(private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public global: GlobalConfigService,
    public location: Location,
    public runningService: DailyRunningService,
    private url: UrlServiceService,
    public login: LoginServiceService,
    private fb: FormBuilder,
    public headerS: HeaderService,
    public datepipe: DatePipe
  ) {

    // this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);


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
      // this.global.getGroupListData();
    });




    // this.endDate.setHours(0);
    // this.startAt  = new Date(this.year, this.month, this.day);

  }





  ngOnInit(): void {

    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      registraionNo: [''],
      consignmentCode: [''],
      consignorCode: [''],
      consigneeCode: [''],
      proxStatus: [''],
      vehicle: [''],
      filterVehicle: [''],
      myvehicle: [''],
      myfilterVehicle: [''],
      filterMyconsign: [''],
      myconsign: [''],


    })

    // setTimeout(() => {
    // }, 100);
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
      this.getConsignmentReport();

    });


    // this.global.groupListDataObservable$.subscribe(()=>{
    //   this.getGroupList();
    // })


    this.getGroupList();
    this.getConsignmentsGroup();
    this.getConsignmentReport();

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


  getNextBatch() {
    const result = this.list.slice(this.offset1, this.offset1 + this.limit);
    this.options = this.options.concat(result)
    this.offset1 += this.limit;
    console.log(result)
  }

  getNextGroup() {
    const result = this.consignmentMyGroup[0].groups.slice(this.offset2, this.limit2 + this.limit2);
    this.options1 = this.options1.concat(result);
    this.offset2 += this.limit2;
    console.log(result)
  }

  onChange() {
    // this.selectedValue = null; // or false or ''
    console.log(this.filterForm.value)
  }

  mindate() {
    // console.log(this.fromDate.value, 'dvsvd')
    this.minDate = (this.fromDate.value)
  }


  get fromDate() { return this.filterForm.get('fromDate'); }
  get toDate() { return this.filterForm.get('toDate'); }
  get consignorCode() { return this.filterForm.get('consignorCode'); }
  get consigneeCode() { return this.filterForm.get('consigneeCode'); }
  get proxStatus() { return this.filterForm.get('proxStatus'); }
  get registraionNo() { return this.filterForm.get('registraionNo'); }
  get vehicle() { return this.filterForm.get('vehicle'); }
  get filterVehicle() { return this.filterForm.get('filterVehicle'); }
  get myvehicle() { return this.filterForm.get('myvehicle'); }
  get myfilterVehicle() { return this.filterForm.get('myfilterVehicle'); }
  get filterMyconsign() { return this.filterForm.get('filterMyconsign'); }
  get myconsign() { return this.filterForm.get('myconsign'); }









  clearRegisNo() {
    this.registraionNo.patchValue('')

  }
  clearproxStatus() {
    this.proxStatus.patchValue('')

  }
  clearconsigneeCode() {
    this.consigneeCode.patchValue('')

  }
  clearconsignorCode() {
    this.consignorCode.patchValue('')

  }

  vehicleValueSet() {
    let selectedValue = this.list.find(el => JSON.stringify(el.id) === JSON.stringify(this.myvehicle.value))
    if (this.myvehicle.value) {
      this.vehicle.patchValue(selectedValue.name);
    }
    console.log(selectedValue.name)
  }






  clearVehicle() {
    this.vehicle.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'vehicle';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }

  }

  clearDate() {
    // this.startDate.setHours(0, 0, 0, 0);

    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }

  clearMyvehicle() {
    this.myvehicle.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'myvehicle';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }

  }

  clearMyconsign() {
    this.myconsign.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'myconsign';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }
  }

  reomveFilter() {
    this.clearVehicle();
    this.clearMyvehicle();
    this.clearMyconsign();
  }

  clearAll() {
    this.clearVehicle();
    this.clearMyvehicle();
    this.clearMyconsign();
    this.clearRegisNo();
    this.clearproxStatus();
    this.clearconsigneeCode();
    this.clearconsignorCode();
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    })
    this.offset = 0;
    // this.numberFilter.splice(0, this.numberFilter.length)
    // console.log(this.numberFilter.length)
    this.getConsignmentReport();
  }

  filterCount() {

    if (this.vehicle.value != "") {
      const isLargeNumber = (element) => element == 'vehicle';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
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
        // this.numberFilter.splice(val, 1)
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
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('myconsign')


      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('myconsign')
      }
    }
    console.log(this.numberFilter)

  }



  fileChange(event) {
    console.log(event.target.files)
  }




  // public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    // this.files = files;


    if (files.length > 1) {
      this.dropZoneMessage = 2;
      this.fileArr = [];
    }
    else {
      for (const droppedFile of files) {

        // Is it a file?
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {

            // Here you can access the real file
            console.log(droppedFile.relativePath, file);
            console.log("sdfghfgjk")
            console.log(file)
            if (droppedFile.relativePath.split('.').pop() == "xls" || droppedFile.relativePath.split('.').pop() == "xlsx") {
              this.dropZoneMessage = 1;
              this.fileArr = [];
              this.fileArr.push(file)
            }
            else {
              this.dropZoneMessage = 2;
            }


          });
        }
        else {
          this.dropZoneMessage = 2;
          this.fileArr = [];

        }
      }
    }
  }

  async uploadExcel() {
    let obj = new FormData()
    obj.append('file', this.fileArr[0], this.fileArr[0].name)
    try {

      alert('successfully Uploaded')
      $('#exampleModal').modal('hide')
    } catch (err) {
      console.error(err)
      alert(err.error.message)
    }


  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  modalClose() {
    this.dropZoneMessage = 0;
    this.fileArr = [];
    $('#exampleModal').modal('hide')

  }


  T
  search() {
    this.offset = 0;

    this.getConsignmentReport()
    this.filterCount()
  }

  async getConsignmentReport() {

    this.spinner.show();

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
      this.paramObj['vehicleUIN'] = this.registraionNo.value;
    }
    if (this.proxStatus.value) {
      this.paramObj['proximityStatus'] = this.proxStatus.value;
    }
    if (this.consignorCode.value) {
      this.paramObj['consignorCode'] = this.consignorCode.value;
    }
    if (this.consigneeCode.value) {
      this.paramObj['consigneeCode'] = this.consigneeCode.value;
    }


    try {

      const res: any = await this.runningService.getdailyReport(this.paramObj);
      console.log(this.offset)
      this.changeDetection.detectChanges();
      this.changeDetection.markForCheck();
      if (this.offset == 0) {
        this.consignmentArr = [];
        this.consignmentArr = res.consignments;
        console.log(this.consignmentArr)
        this.dailyData = [];
        this.dailyMilliData = [];
        var input;
        for (var x = 0; x < res.headers.length; x++) {
          if (res.headers[x] >= 8) {
            input = res.headers[x].slice(0, 8);
            input = input.slice(4, 8) + '-' + input.slice(2, 4) + '-' + input.slice(0, 2);
            var myDate = new Date(input);
            var result = myDate.getTime();
            this.dailyMilliData.push(result);
          }
        }
        this.dailyMilliData = this.dailyMilliData.sort((a, b) => { return a - b; });

        for (let y = 0; y < this.dailyMilliData.length; y++) {
          this.dailyData.push(this.datepipe.transform(this.dailyMilliData[y], 'ddMMyyyy'))
          console.log(this.dailyMilliData[y])
        }

        if (this.dailyData.length > 0) {
          for (let i = 0; i < this.consignmentArr.length; i++) {
            this.consignmentArr[i].daywiseData = [];
            if (this.consignmentArr[i].dailyStats) {
              var countDaywiseData = 0;
              var createdOn = this.datepipe.transform(this.consignmentArr[i].createdOn, 'ddMMyyyy' );
              for (var j = 0; j < this.dailyData.length; j++) {
                if (this.dailyData[j] >= createdOn) {
                  countDaywiseData++;
                  var stateFound = false;
                  for (var k = 0; k < this.consignmentArr[i].dailyStats.length; k++) {

                    if (this.dailyData[j] == this.consignmentArr[i].dailyStats[k].date) {
                      this.consignmentArr[i].daywiseData.push(this.consignmentArr[i].dailyStats[k]);
                      stateFound = true;
                      break;
                    }
                  }
                  if (!stateFound) {
                    this.consignmentArr[i].daywiseData.push({ 'distance': '---' });
                  }
                }
              }
              for (var l = countDaywiseData; l < this.dailyData.length; l++) {

                this.consignmentArr[i].daywiseData.push({ 'distance': '---' });
              }

            } else {

              for (var l = 0; l < this.dailyData.length; l++) {
                this.consignmentArr[i].daywiseData.push({ 'distance': '---' });
              }
            }
          }
        }


        console.log(this.consignmentArr[0].daywiseData)

      } else {
        this.consignmentArr = this.consignmentArr.concat(res.consignments);

        if (this.dailyData.length > 0) {
          for (let i = 0; i < this.consignmentArr.length; i++) {
            this.consignmentArr[i].daywiseData = [];
            if (this.consignmentArr[i].dailyStats) {
              var countDaywiseData = 0;
              var createdOn = this.datepipe.transform(this.consignmentArr[i].createdOn, 'ddMMyyyy' );
              for (var j = 0; j < this.dailyData.length; j++) {
                if (this.dailyData[j] >= createdOn) {
                  countDaywiseData++;
                  var stateFound = false;
                  for (var k = 0; k < this.consignmentArr[i].dailyStats.length; k++) {

                    if (this.dailyData[j] == this.consignmentArr[i].dailyStats[k].date) {
                      this.consignmentArr[i].daywiseData.push(this.consignmentArr[i].dailyStats[k]);
                      stateFound = true;
                      break;
                    }
                  }
                  if (!stateFound) {
                    this.consignmentArr[i].daywiseData.push({ 'distance': '---' });
                  }
                }
              }
              for (var l = countDaywiseData; l < this.dailyData.length; l++) {

                this.consignmentArr[i].daywiseData.push({ 'distance': '---' });
              }

            } else {

              for (var l = 0; l < this.dailyData.length; l++) {
                this.consignmentArr[i].daywiseData.push({ 'distance': '---' });
              }
            }
          }
        }

      }
      this.offset = this.offset + this.Size
      this.spinner.hide();
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }

  }

  convertDate(el) {
    let temp = new Date(el);
    let currDate = temp.getDate();
    let currMonth = temp.getMonth();
    console.log(currMonth)
    let currYear = temp.getFullYear();
    let finalDate = `${JSON.stringify(currDate)}${JSON.stringify(currMonth)}${JSON.stringify(currYear)}`
    return finalDate;
  }

  async getGroupList() {
    try {
      const res: any = await this.runningService.getGroupList();
      // this.groupListArr = this.global.groupListDataArray;
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
          for (var i = 0; i < group.vehicles.length; i++) { // iterate over vehicles under each group
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
      }
      this.getNextBatch();

      console.log(this.list);

    } catch (err) {
      console.log(err);
    }



  }

  async getConsignmentsGroup() {
    try {
      const res: any = await this.runningService.getConsignmentsGroup();
      this.ConsignGroupListArr = res;
      for (let i = 0; i < this.ConsignGroupListArr.length; i++) {
        let item1 = this.ConsignGroupListArr[i];
        if (item1.entity.me == true) {
          this.consignmentMyGroup.push(item1);
          this.FilterConsignmentMyGroup.push(item1);
        }
      }

      this.getNextGroup();
      console.log(this.consignmentMyGroup)

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

  }




  filter() {
    this.menu.closeMenu();
    this.offset = 0;
    this.getConsignmentReport();
  }


  downloadReport() {
    let proximityStatus, groupId, vehicleId, uin, consignorCode, consigneeCode;
    // let consignmentCodeParam = 'consignmentCode=';
    let groupIdParam = 'groupId='
    let vehicleIdParam = 'vehicleId=';
    let uinParam = 'uin=';
    let consignorCodeParam = 'consignorCode=';
    let consigneeCodeParam = 'consigneeCode=';
    let proximityStatusParam = 'proximityStatus=';


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

    if (this.proxStatus.value) {
      proximityStatus = this.proxStatus.value;
    } else {
      proximityStatus = '';
      proximityStatusParam = '';

    }




    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;

    if (this.searchText) {

      apiUrl = this.url.apiV2url + `msil/dailyrunning/download?startTime=${+this.startDate}&endTime=${+this.endDate}&consignmentCode=${this.searchText}&${groupIdParam}${groupId}&${vehicleIdParam}${vehicleId}&${proximityStatusParam}${proximityStatus}&${uinParam}${uin}&${consignorCodeParam}${consignorCode}&${consigneeCodeParam}${consigneeCode}
      &access_token=${access_token}`

    } else {
      apiUrl = this.url.apiV2url + `msil/dailyrunning/download?startTime=${+this.startDate}&endTime=${+this.endDate}&${groupIdParam}${groupId}&${vehicleIdParam}${vehicleId}&${proximityStatusParam}${proximityStatus}&${uinParam}${uin}&${consignorCodeParam}${consignorCode}&${consigneeCodeParam}${consigneeCode}
      &access_token=${access_token}`


    }

    console.log(apiUrl)

    window.open(apiUrl, '_blank');





  }





}

