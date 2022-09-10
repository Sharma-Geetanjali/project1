
import { Location } from '@angular/common';
import {
  Component, OnInit, Input, HostListener,ViewChild,ChangeDetectionStrategy,ChangeDetectorRef,OnDestroy
} from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { EolReportService } from 'src/app/Services/eol-report/eol-report.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { query } from '@angular/animations';
import { NgxSpinnerService } from "ngx-spinner";
import { MatMenuTrigger } from '@angular/material/menu';
import { HeaderService } from 'src/app/Services/header/header.service';
import { Subscription } from 'rxjs';
import { threadId } from 'worker_threads';
declare var $: any;

@Component({
  selector: 'app-consignment-report',
  templateUrl: './consignment-report.component.html',
  styleUrls: ['./consignment-report.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class ConsignmentReportComponent implements OnInit,OnDestroy {
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
  subscription: Subscription;
  toggleBool = false;
  previousId1= '';
  previousId2 = '';
  arrlen: any = [];
  wayPointList: any = [];
  toggleImg = null;
  el1;
  el2;
  div






  constructor(private changeDetection: ChangeDetectorRef, private spinner: NgxSpinnerService, public global: GlobalConfigService, public location: Location, public consignReport: ConsignmentReportService, private url: UrlServiceService, public login: LoginServiceService, private fb: FormBuilder
          ,public headerS: HeaderService) {
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0);
    this.subscription = this.headerS.refresh$.subscribe((val) => {
      this.ngOnInit();
    });
    // this.endDate.setHours(this.today.getHours(),this.today.getMinutes(),this.today.getSeconds())

  }





  ngOnInit(): void {

    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      registraionNo: [''],
      dispatchCode: [''],
      receiverCode: [''],
      flag: [''],
      kpi: [''],
      singleStage: [''],
      status: [''],
      proxStatus: [''],
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
      this.getConsignmentReport();


    });



    this.getConsignmentReport();
    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });

  }

  ngOnDestroy() {
    // this.headerS.endDate$._su
    // clearInterval(this.intervalId)
    this.subscription.unsubscribe();
  }

  mindate() {
    // console.log(this.fromDate.value, 'dvsvd')
    this.minDate = (this.fromDate.value)
  }


  get fromDate() { return this.filterForm.get('fromDate'); }
  get toDate() { return this.filterForm.get('toDate'); }
  get flag() { return this.filterForm.get('flag'); }
  get kpi() { return this.filterForm.get('kpi'); }
  get singleStage() { return this.filterForm.get('singleStage'); }
  get status() { return this.filterForm.get('status'); }
  get proxStatus() { return this.filterForm.get('proxStatus'); }
  get registraionNo() { return this.filterForm.get('registraionNo'); }
  get dispatchCode() { return this.filterForm.get('dispatchCode'); }
  get receiverCode() { return this.filterForm.get('receiverCode'); }









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
  clearDate() {
    // this.startDate.setHours(0, 0, 0, 0);

    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
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
  clearProxStatus() {
    this.proxStatus.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'proxStatus';
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

  clearRegisNo() {
    this.registraionNo.patchValue('')
    // this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'regisNo';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val != -1) {
        this.numberFilter.splice(val, 1)
        // this.numberFilter.push('status')
      }
  }

  reomveFilter() {
    this.clearFlag();
    this.clearKpi();
    this.clearProxStatus();
    this.clearSingleStage();
    this.clearStatus();
    this.clearReceiverCode();
    this.clearDispatchCode();
    this.clearRegisNo();
  }

  clearAll() {
    // this.filterForm.reset();
    this.clearFlag();
    this.clearKpi();
    this.clearProxStatus();
    this.clearSingleStage();
    this.clearStatus();
    this.clearReceiverCode();
    this.clearDispatchCode();
    this.clearRegisNo();
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: this.endDate
    })
    this.offset = 0;
    // this.numberFilter.splice(0, this.numberFilter.length)
    // console.log(this.numberFilter.length)
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

    if (this.proxStatus.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'proxStatus';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('proxStatus')


      }
      else {
      console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('proxStatus')
      }
    }


    if (this.registraionNo.value != "") {
      console.log(this.flag.value)
      let el = (element) => element == 'regisNo';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('regisNo')


      }
      else {
      console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('regisNo')
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

            /**
            // You could upload it like this:
            const formData = new FormData()
            formData.append('logo', file, relativePath)

            // Headers
            const headers = new HttpHeaders({
              'security-token': 'mytoken'
            })

            this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
            .subscribe(data => {
              // Sanitized logo returned from backend
            })
            **/

          });
        }
        else {
          this.dropZoneMessage = 2;
          this.fileArr = [];
          // It was a directory (empty directories are added, otherwise only files)
          // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
          // console.log(droppedFile.relativePath, fileEntry);
        }
      }
    }
  }

  async uploadExcel() {
    let obj = new FormData()
    obj.append('file', this.fileArr[0], this.fileArr[0].name)
    try {
      const res: any = await this.consignReport.uploadExcel(obj)
      console.log(res)
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
      this.paramObj['status'] = this.status.value;
    }
    if (this.proxStatus.value) {
      this.paramObj['proximityStatus'] = this.proxStatus.value;
    }
    if (this.registraionNo.value) {
      this.paramObj['vehicleUIN'] = this.registraionNo.value;
    }
    if (this.dispatchCode.value) {
      this.paramObj['consignorCode'] = this.dispatchCode.value;
    }
    if (this.receiverCode.value) {
      this.paramObj['consigneeCode'] = this.receiverCode.value;
    }
    try {

      const res: any = await this.consignReport.getConsignmentReport(this.paramObj);
    this.changeDetection.detectChanges();
    this.changeDetection.markForCheck();

      if (this.offset == 0) {
        this.consignmentArr = res;

      } else {
        this.consignmentArr = this.consignmentArr.concat(res);

      }
      let dateTimestamp, dateTimestamp2, dateTimestamp3, dateTimestamp4;
      for (var i = 0; i < this.consignmentArr.length; i++) {
        // this.consignmentArr[i].tableToggle=false;
        if (this.consignmentArr[i].extraFields.challanDate) {
          var dataString = this.consignmentArr[i].extraFields.challanDate;
          dateTimestamp = this.timestampConvert(dataString)
          this.consignmentArr[i].extraFields.challanDateTime = dateTimestamp;
        } else {
          this.consignmentArr[i].extraFields.challanDateTime = {};
        }
        if (this.consignmentArr[i].extraFields.memoDate) {
          var dataString2 = this.consignmentArr[i].extraFields.memoDate;
          dateTimestamp2 = this.timestampConvert(dataString2);
          this.consignmentArr[i].extraFields.memoDateTime = dateTimestamp2;
        } else {
          this.consignmentArr[i].extraFields.memoDateTime = {};
        }
        if (this.consignmentArr[i].extraFields.gatepassDate) {
          var dataString3 = this.consignmentArr[i].extraFields.gatepassDate;
          dateTimestamp3 = this.timestampConvert(dataString3);
          this.consignmentArr[i].extraFields.gatepassDateTime = dateTimestamp3;
        } else {
          this.consignmentArr[i].extraFields.gatepassDateTime = {};
        }
        if (this.consignmentArr[i].extraFields.dispatchMonth) {
          var dataString4 = this.consignmentArr[i].extraFields.dispatchMonth;
          dateTimestamp4 = this.timestampConvert(dataString4);
          this.consignmentArr[i].extraFields.dispatchMonthDateTime = dateTimestamp4;
        } else {
          this.consignmentArr[i].extraFields.dispatchMonthDateTime = {};
        }

      }

      this.offset = this.offset + this.Size
      this.spinner.hide();
    }
    catch (err){
      console.log(err)
      this.spinner.hide();
    }

    // console.log(this.consignmentArr);

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
    this.menu.closeMenu();
    this.offset = 0;
    this.consignmentArr = [];
    this.getConsignmentReport();
  }



  markCritical(code) {
    code = this.markCode;
  }

  async critical() {

    const res: any = await this.consignReport.markCritical(this.markCode);
    location.reload();
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



      this.startDate = this.filterForm.value.fromDate;
      this.endDate = this.filterForm.value.toDate;




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
    if (this.proxStatus.value) {
      // this.paramObj['proximityStatus']= this.proxStatus.value;
      proxStatus = this.proxStatus.value
    } else {
      proxStatus = '';
      proxyParam = '';
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
      apiUrl = this.url.apiV2url + `consignment/download?startTime=${+this.startDate}&endTime=${+this.endDate}&consignmentCode=${this.searchText}&${geofenceFlagParam}${flag}&${singleStageParam}${singleStage}&${kpiParam}${kpi}
      &${statusParam}${status}&${proxyParam}${proxStatus}&${vehicleUINParam}${regisNo}&${consignorCodeParam}${dispatchCode}&${consigneeCodeParam}${receiverCode}&access_token=${access_token}`
    } else {
      apiUrl = this.url.apiV2url + `consignment/download?startTime=${+this.startDate}&endTime=${+this.endDate}&${geofenceFlagParam}${flag}&${singleStageParam}${singleStage}&${kpiParam}${kpi}
      &${statusParam}${status}&${proxyParam}${proxStatus}&${vehicleUINParam}${regisNo}&${consignorCodeParam}${dispatchCode}&${consigneeCodeParam}${receiverCode}&access_token=${access_token}`

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





}
