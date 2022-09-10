import { Location } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { EolReportService } from 'src/app/Services/eol-report/eol-report.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { FormControl, FormGroup } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { endianness } from 'os';
import { MatEndDate } from '@angular/material/datepicker';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { NgxSpinnerService } from "ngx-spinner";

declare var $: any;

@Component({
  selector: 'app-eol-report',
  templateUrl: './eol-report.component.html',
  styleUrls: ['./eol-report.component.css'],
  providers: [DatePipe]
})
export class EolReportComponent implements OnInit {
  @Input() max: null;
  eolAuditArr: any = [];
  tempEolAuditArr: any = [];
  filterData: any = [];
  pipe: DatePipe;
  // minDate: Date;
  maxDate = new Date();

  imgPath = this.global.imgPath;




  fileArr: Array<File> = [];

  dropZoneMessage = 0;
  // filterData;
  searchText = null;
  startAt;
  endDate = new Date;
  startDate = new Date;
   today = new Date();

 day = this.today.getDay();
 month = this.today.getMonth() + 1;
 year = this.today.getUTCFullYear();




    constructor(private spinner:NgxSpinnerService,  public global: GlobalConfigService, public location: Location, public eolReport: EolReportService , private url: UrlServiceService,public login: LoginServiceService) {

    // this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate.setDate(this.maxDate.getDate() );
    this.startDate.setHours(0, 0, 0, 0);
    // this.endDate.setHours(23, 59, 59, 59);
    this.startAt  = new Date(this.year, this.month, this.day);


  }





  ngOnInit(): void {
    this.getEolAudit();
    console.log(this.endDate);
    console.log('sdsadasd', this.startDate);
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: this.endDate
    })
  }


  fileChange(event) {

    console.log(event.target.files)
  }

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  get fromDate() { return this.filterForm.get('fromDate'); }
  get toDate() { return this.filterForm.get('toDate'); }

  // search() {
  //   console.log(this.filterForm.value)
  // }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;


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
    // obj.append('filename',this.fileArr[0].name)
    try {
      const res: any = await this.eolReport.uploadExcel(obj)
      console.log(res)
      alert('successfully Uploaded')
      $('#exampleModal').modal('hide')
    } catch (err) {
      console.error(err)
      alert(err.error.message)
    }

    // console.log(this.searchText)

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
  async getEolAudit() {
    // this.spinner.show();


    const res: any = await this.eolReport.getEolAudit(+this.startDate,+this.endDate,this.searchText);
    this.tempEolAuditArr = res
    console.log(this.eolAuditArr);
    this.tempEolAuditArr.forEach(el => {
      // el.mappingTimestamp = new Date(el?.mappingTimestamp);
      // el.gprsTimestamp = new Date(el?.gprsTimestamp);
      // el.createdOn = new Date(el?.createdOn);
      // el.ignitionTimestamp = new Date(el?.ignitionTimestamp);
    });
    // console.log(this.tempEolAuditArr)
    this.eolAuditArr = this.tempEolAuditArr;
    console.log(this.eolAuditArr)
    this.spinner.hide();


  }



  search() {
    if (this.filterForm.value.fromDate == null) {
      this.startDate = this.startDate
      this.endDate = this.endDate
      console.log( this.startDate)

      this.getEolAudit();

    } else {
      this.startDate = this.filterForm.value.fromDate;

      this.endDate = this.filterForm.value.toDate;
    this.endDate.setHours(23, 59, 59, 59);

      console.log(this.filterForm.value)

      this.getEolAudit();
    }
  }

  async downloadEolAudit() {
    const res: any = await this.eolReport.downloadEolAudit(+this.startDate,+this.endDate,this.searchText);
  }

  downloadEOL() {
    if (this.filterForm.value.fromDate == null) {
      this.startDate = this.startDate
      this.endDate = this.endDate
      console.log( this.startDate)

      // this.downloadEolAudit();

    } else {
      this.startDate = this.filterForm.value.fromDate;
      this.endDate = this.filterForm.value.toDate;
      console.log(this.filterForm.value)
      // this.downloadEolAudit();
    }

    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;

    if (this.searchText) {
         apiUrl = this.url.apiV2url+`vs/eol/audit/download?startTime=${+this.startDate}&endTime=${+this.endDate}&deviceSerialNumber=${this.searchText}&access_token=${access_token}`
    } else {
      apiUrl = this.url.apiV2url+`vs/eol/audit/download?startTime=${+this.startDate}&endTime=${+this.endDate}&access_token=${access_token}`

    }

    window.open(apiUrl, '_blank');


  }





}
