import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { ReconciliationReportService } from 'src/app/Services/Reports/reconciliationReport/reconciliation-report.service';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';

@Component({
  selector: 'app-reconciliation-report',
  templateUrl: './reconciliation-report.component.html',
  styleUrls: ['./reconciliation-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReconciliationReportComponent implements OnInit {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;

  filterForm: FormGroup;
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  offset = 0;
  size: number = 50;
  searchText = null;
  paramObj = null;
  reconciliationArr: any = [];
  numberFilter: any = [];
  imgPath = this.global.imgPath;


  constructor(private changeDetection: ChangeDetectorRef, private fb: FormBuilder, private spinner: NgxSpinnerService, private reconciliationService: ReconciliationReportService, private global: GlobalConfigService, public login: LoginServiceService, private vehicleReport: VehicleListService, private url: UrlServiceService) {
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);
  }



  ngOnInit(): void {

    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      registrationNo: [''],
      consignorCode: [''],
      consigneeCode: [''],

    })


    console.log(this.endDate)
    this.startDate.setHours(0, 0, 0, 0);
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    })

    this.getReconciliationReport();

    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
  }


  get consignorCode() { return this.filterForm.get('consignorCode'); }
  get consigneeCode() { return this.filterForm.get('consigneeCode'); }
  get registrationNo() { return this.filterForm.get('registrationNo'); }



  async getReconciliationReport() {

    this.spinner.show();
    let SetendTime = this.filterForm.value.toDate;

    this.paramObj = {
      startTime: +this.filterForm.value.fromDate,
      endTime: +SetendTime,
      offset: this.offset,
      size: this.size
    }


    if (this.searchText) {
      this.paramObj['consignmentCode'] = this.searchText;
    }

    if (this.registrationNo.value) {
      this.paramObj['uin'] = this.registrationNo.value;
    }

    if (this.consigneeCode.value) {
      this.paramObj['consigneeCode'] = this.consigneeCode.value;
    }

    if (this.consignorCode.value) {
      this.paramObj['consignorCode'] = this.consignorCode.value;
    }


    try {

      const res: any = await this.reconciliationService.getReconciliationReport(this.paramObj);
      this.changeDetection.detectChanges();
      this.changeDetection.markForCheck();
      if (this.offset == 0) {
        // console.log(res)
        this.reconciliationArr = res;

      } else {
        this.reconciliationArr = this.reconciliationArr.concat(res);
        // console.log(res)

      }
      this.offset = this.offset + this.size
      this.spinner.hide();
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
    console.log(this.reconciliationArr)
  }


  search() {
    this.offset = 0;
    this.getReconciliationReport()
    this.filterCount()
  }

  filter() {
    this.offset = 0;
    this.reconciliationArr = [];
    this.menu.closeMenu();
    this.changeDetection.detectChanges();

    this.changeDetection.markForCheck();

    this.getReconciliationReport();
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
  }

  reomveFilter() {
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();
    this.clearDate()

    this.clearRegistrationNo();
    this.clearconsigneeCode();
    this.clearconsignorCode();
    this.reconciliationArr = [];
    this.offset = 0;
    this.getReconciliationReport();

  }

  clearAll() {

    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();
    this.clearDate();
    this.clearRegistrationNo();
    this.clearconsigneeCode();
    this.clearconsignorCode();
    this.reconciliationArr = [];

    this.offset = 0;
    this.getReconciliationReport();
  }

  clearDate() {
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





  downloadReport() {

    if (this.reconciliationArr.length > 0) {

      let regisNo, dispatchCode, receiverCode;

      let vehicleUINParam = 'uin=';
      let consigneeCodeParam = 'consigneeCode=';
      let consignorCodeParam = 'consignorCode=';

      this.startDate = this.filterForm.value.fromDate;
      this.endDate = this.filterForm.value.toDate;

      if (this.registrationNo.value) {
        regisNo = this.registrationNo.value
      } else {
        regisNo = '';
        vehicleUINParam = '';
      }
      if (this.consignorCode.value) {
        dispatchCode = this.consignorCode.value
      } else {
        dispatchCode = '';
        consignorCodeParam = '';
      }
      if (this.consigneeCode.value) {
        receiverCode = this.consigneeCode.value
      } else {
        receiverCode = '';
        consigneeCodeParam = '';
      }

      let token = localStorage.getItem('auth_key_Carot');
      let access_token = token.replace('bearer ', '');

      // console.log(token)
      let apiUrl = this.url.apiV2url;

      if (this.searchText) {
        apiUrl = this.url.apiV2url + `consignment/reconciliation/download?startTime=${+this.startDate}&endTime=${+this.endDate}&consignmentCode=${this.searchText}&${vehicleUINParam}${regisNo}&${consignorCodeParam}${dispatchCode}&${consigneeCodeParam}${receiverCode}&access_token=${access_token}`
      } else {
        apiUrl = this.url.apiV2url + `consignment/reconciliation/download?startTime=${+this.startDate}&endTime=${+this.endDate}&${vehicleUINParam}${regisNo}&${consignorCodeParam}${dispatchCode}&${consigneeCodeParam}${receiverCode}&access_token=${access_token}`
      }

      window.open(apiUrl, '_blank');

    }

  }


  // https://lucknow.carot.com/v2/consignment/reconciliation/download?endTime=1615978712491&startTime=1615919400000&uin=ldkcsdl&consignmentCode=kdsljsd&consigneeCode=alkkd;eak&consignorCode=lakdlkaem&access_token=b1c33201-aa8c-4a9d-9d25-4934ceecb01c
}
