import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { ActivityLogReportService } from 'src/app/Services/Reports/activityLogReport/activity-log-report.service';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';

@Component({
  selector: 'app-activity-log-report',
  templateUrl: './activity-log-report.component.html',
  styleUrls: ['./activity-log-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityLogReportComponent implements OnInit {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;

  filterForm: FormGroup;
  maxDate = new Date();
  startDate = new Date();
  endDate = new Date();
  searchText = null;
  paramObj = null;
  activityLogArr: any = [];
  imgPath = this.global.imgPath;
  constructor(private global: GlobalConfigService, private fb: FormBuilder, private spinner: NgxSpinnerService, private activityLogReport: ActivityLogReportService, private changeDetection: ChangeDetectorRef, public login: LoginServiceService, private url: UrlServiceService) {
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {

    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    })

    console.log(this.endDate)
    this.startDate.setHours(0, 0, 0, 0);
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    })
  }


  async getActivityLog() {
    if (this.searchText == null) {
      return 0;
    }
    else {
      this.spinner.show();
      let SetendTime = this.filterForm.value.toDate;

      this.paramObj = {
        startTime: +this.filterForm.value.fromDate,
        endTime: +SetendTime,
        username: this.searchText
      }

      try {

        const res: any = await this.activityLogReport.getActivityLogReport(this.paramObj);
        this.changeDetection.detectChanges();
        this.changeDetection.markForCheck();

        this.activityLogArr = res.userAuditModels;
        this.spinner.hide();
      }
      catch (err) {
        console.log(err)
        this.spinner.hide();
      }
      console.log(this.activityLogArr)
    }
  }

  filter() {
    if (this.searchText != '') {
      this.menu.closeMenu();
      this.changeDetection.detectChanges();

      this.changeDetection.markForCheck();

      this.getActivityLog();
    }
  }

  search() {
    this.getActivityLog();
  }

  clearAll() {
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();

    this.searchText = null;
  }

  clearDate() {
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }


  downloadReport() {

    if (this.activityLogArr.length > 0) {
      this.startDate = this.filterForm.value.fromDate;
      this.endDate = this.filterForm.value.toDate;


      let token = localStorage.getItem('auth_key_Carot');
      let access_token = token.replace('bearer ', '');

      // console.log(token)

      let apiUrl = this.url.apiV2url + `um/audit/download?username=${this.searchText}&startTime=${+this.startDate}&endTime=${+this.endDate}&access_token=${access_token}`

      window.open(apiUrl, '_blank');
    }

  }





  // https://lucknow.carot.com/v2/um/audit/download?username=rfcagra&endTime=1615985726547&startTime=1613500200000&access_token=b1c33201-aa8c-4a9d-9d25-4934ceecb01c

}
