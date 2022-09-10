import { Component, OnInit,DoCheck, ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { Chart } from 'node_modules/chart.js';
import { DealerDashboardService } from 'src/app/Services/insights/dealer-dashboard/dealer-dashboard.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';


@Component({
  selector: 'app-dealer-dashboard',
  templateUrl: './dealer-dashboard.component.html',
  styleUrls: ['./dealer-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DealerDashboardComponent implements OnInit,DoCheck {

  searchText: any;
  myChart: any;
  vehicleStock: any;
  vehicleInTransit: any;
  vehicleDelay: any;
  todayDate = new Date();
  dealerBillArr: any = [];
  filterDealerArr: any = [];
  widthExp;


  constructor(
    private url: UrlServiceService,
    private dealerService: DealerDashboardService,
    public login: LoginServiceService,
    private changeDetection: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getVehicleStockCount();
    this.getVehicleInTransitCount();
    this.getVehicleIndelayCount();
    this.getDealerServiceBills();
  }

  ngDoCheck() {
    if (this.login.isExpanded === true) {
      this.widthExp = 76
    } else if (this.login.isExpanded === false) {
      this.widthExp = 90.5
    }
    this.changeDetection.detectChanges();

  }

  // search filter for chassis number

  search() {
    if (this.searchText == "") {
      this.filterDealerArr = this.dealerBillArr;
    }
    else {
      this.filterDealerArr = this.dealerBillArr.filter(el => el.chassisNumber.toLowerCase().includes(this.searchText.toLowerCase()))

      console.log(this.filterDealerArr)
    }
  }

  chartOnload() {

    this.myChart = new Chart('connectedVechChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 40], // Specify the data values array

          backgroundColor: ['#00bcaa', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1
      }
    });
    //   Chart 3 ///////
    this.myChart = new Chart("NotInContactChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 40], // Specify the data values array

          backgroundColor: ['#e03b3b', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1
      }
    });
    //   Chart 4 ///////
    this.myChart = new Chart("loadedChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 40], // Specify the data values array

          backgroundColor: ['#e8b100', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1
      }
    });

  }

  async getDealerServiceBills() {

    try {
      const res: any = await this.dealerService.getDealerServiceBills();
      this.dealerBillArr = res;
      this.filterDealerArr = res;
      console.log(res);
      this.chartOnload();
    } catch (error) {

    }
  }

  async getVehicleStockCount() {
    let obj = {
      sold: false
    }
    try {
      const res: any = await this.dealerService.getVehicleStockCount(obj);
      this.vehicleStock = res;
      console.log(res);
      this.chartOnload();
    } catch (error) {

    }
  }

  async getVehicleIndelayCount() {
    let obj = {
      endTime: +this.todayDate,
      kpi: "IN_TRANSIT_DELAY",
      status: ['CREATED', 'RUNNING'],

    }
    try {
      const res: any = await this.dealerService.getVehicleIndelayCount(obj);
      this.vehicleDelay = res;
      console.log(res);
    } catch (error) {

    }
  }

  async getVehicleInTransitCount() {

    let obj = {
      endTime: +this.todayDate,
      live: true
    }
    try {
      const res: any = await this.dealerService.getVehicleInTransitCount(obj);
      this.vehicleInTransit = res;
      console.log(res);
    } catch (error) {

    }
  }



  // Excel ownload

  downloadReport() {

    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;

      apiUrl = this.url.apiV2url + `report/vehiclebilling/download?access_token=${access_token}`

    window.open(apiUrl, '_blank');


  }

}
