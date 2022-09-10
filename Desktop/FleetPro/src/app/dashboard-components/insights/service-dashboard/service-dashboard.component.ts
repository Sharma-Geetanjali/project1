import { ChangeDetectorRef, Component, DoCheck, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { ServiceDashboardService } from 'src/app/Services/insights/service-dashboard/service-dashboard.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';

@Component({
  selector: 'app-service-dashboard',
  templateUrl: './service-dashboard.component.html',
  styleUrls: ['./service-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceDashboardComponent implements OnInit,DoCheck {

  widthExp;
  filterServiceArr: any = [];
  searchText: any;
  offset:number = 0;
  Size: number = 100;
  statusValues = ['OPEN', 'IN_PROGRESS', 'CANCELED', 'RESOLVED', 'DUPLICATE', 'INVALID', 'REOPEN'];
  selectText = "";

  constructor(
    public login: LoginServiceService,
    private changeDetection: ChangeDetectorRef,
    private service: ServiceDashboardService,
    private url: UrlServiceService
  ) { }

  ngOnInit(): void {
    this.getServiceDashboardData();
    console.log(this.selectText)
  }

  ngDoCheck() {
    if (this.login.isExpanded === true) {
      this.widthExp = 76
    } else if (this.login.isExpanded === false) {
      this.widthExp = 90.5
    }
    this.changeDetection.detectChanges();

  }

  search(){}

  async getServiceDashboardData() {
    let dataObj={
      offset: this.offset,
      size: this.Size
    }

    try {
      const res: any = await this.service.getServiceDashboardData(dataObj);
      // this.dealerBillArr = res;
      if (this.offset == 0) {
        this.filterServiceArr = res;

      } else {
        this.filterServiceArr = this.filterServiceArr.concat(res);

      }
      this.offset = this.offset + this.Size
      console.log(res);

    } catch (error) {

    }
  }


  downloadReport() {

    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;

      apiUrl = this.url.apiV2url + `ticket/servicetickets/download?access_token=${access_token}`

    window.open(apiUrl, '_blank');


  }

}
