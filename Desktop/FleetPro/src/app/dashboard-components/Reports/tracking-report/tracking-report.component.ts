import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { DailyRunningService } from 'src/app/Services/Reports/daily-running-report/daily-running.service';
import { TrackingReportService } from 'src/app/Services/Reports/tracking-report.service';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';
import { HeaderService } from 'src/app/Services/header/header.service';
import { Subscription } from 'rxjs';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { Chart } from 'node_modules/chart.js';


@Component({
  selector: 'app-tracking-report',
  templateUrl: './tracking-report.component.html',
  styleUrls: ['./tracking-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingReportComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private global: GlobalConfigService,
    private spinner: NgxSpinnerService,
    private trackingService: TrackingReportService,
    private runningService: DailyRunningService,
    public login: LoginServiceService,
    public headerS: HeaderService,
    public changeDetection: ChangeDetectorRef,
    public theme: ThemeServiceService
  ) {
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0);
  }

  maxDate = new Date();
  startDate = new Date();
  filterForm: FormGroup;
  endDate = new Date();
  offset = 0;
  size: number = 100;
  imgPath = this.global.imgPath;
  paramObj = null;
  paramObj2 = null;
  paramObj3 = null;
  paramObj4 = null;
  selectedAll: any;
  vehicleListToggle = false;
  endLocation;
  startLocation;
  vehicleList: any = [];
  filterVehicleList: any = [];
  trackingReportData: any = [];
  trackingReportDistance = 0;

  pathdraw: any[] = [];
  pathdraw1: any = [];
  filterPathdraw: any = [];
  pathdrawPlayRoute: any = [];
  intervalId;
  subscription: Subscription;

  duration = 20;
  currentDuration = null;
  noOfDisplayChunks;
  currentChunkVal = 1;
  currentlyDrawing = false;
  intervalgg;

  seekBarVal = 1;

  cardLoadingFlag = true;
  currentPlaying: boolean = false;
  map: any;
  previous: any;
  intervalIterationIndex = 0;
  endIterationIndex;
  currentZoom: any;
  myChart: any;
  chartDataArr: any;
  chartLabelArr: any;
  durationTime:any;
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      filterVehicle: [''],
      interval: [1],
    });

    this.getGroupList();
    this.clearDate();
    // this.subscription = this.headerS.startDate$.subscribe((val) => {
    //   this.filterForm.patchValue({
    //     fromDate: val
    //     // toDate: new Date()
    //   });
    //   console.log(val);
    // });

    // this.subscription = this.headerS.endDate$.subscribe((val) => {
    //   this.filterForm.patchValue({
    //     toDate: val
    //     // toDate: new Date()
    //   });
    //   console.log(val);
    // });

    // this.subscription = this.headerS.apiCall$.subscribe((val) => {
    //   // console.log(val);
    //   this.getKpiReport();

    // });

    this.filterVehicle.valueChanges.subscribe(() => {
      this.vehicleSearchSuggestion();
    });

    this.changeDetection.detectChanges();
    this.changeDetection.markForCheck();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  get filterVehicle() {
    return this.filterForm.get('filterVehicle');
  }

  get interval() {
    return this.filterForm.get('interval');
  }

  chartOnload() {
    console.log('asdasfg');
    this.myChart = new Chart('abc', {
      type: 'line',
      data: {
        labels: this.chartLabelArr,
        datasets: [
          {
            label: 'Speed',
            data: this.chartDataArr,
            fill: true,
            backgroundColor: 'rgb(75, 192, 192)',
            pointRadius: 0,
            tension: 0.5
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: true,
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              major: {
                enabled: true
              },
            }
          },
          y: {
            beginAtZero: true,
          },

        },
      },
    });

    // const totalDuration = 1000000;
    // const delayBetweenPoints = totalDuration / this.chartDataArr.length;
    // const previousY = (ctx) =>
    //   ctx.index === 0
    //     ? ctx.chart.scales.y.getPixelForValue(100)
    //     : ctx.chart
    //         .getDatasetMeta(ctx.datasetIndex)
    //         .data[ctx.index - 1].getProps(['y'], true).y;
    // const animation = {
    //   x: {
    //     type: 'number',
    //     easing: 'linear',
    //     duration: delayBetweenPoints,
    //     from: NaN, // the point is initially skipped
    //     delay(ctx) {
    //       if (ctx.type !== 'data' || ctx.xStarted) {
    //         return 0;
    //       }
    //       ctx.xStarted = true;
    //       return ctx.index * delayBetweenPoints;
    //     },
    //   },
    //   y: {
    //     type: 'number',
    //     easing: 'linear',
    //     duration: delayBetweenPoints,
    //     from: previousY,
    //     delay(ctx) {
    //       if (ctx.type !== 'data' || ctx.yStarted) {
    //         return 0;
    //       }
    //       ctx.yStarted = true;
    //       return ctx.index * delayBetweenPoints;
    //     },
    //   },
    // };

    // this.myChart = new Chart('abc', {
    //   type: 'line',
    //   data: {
    //     labels: this.chartLabelArr,
    //     datasets: [
    //       {
    //         label: 'Speed',
    //         data: this.chartDataArr,
    //         borderColor: "rgb(75, 192, 192)",
    //         borderWidth: 1,
    //         radius: 0,
    //       },
    //     ],
    //   },
    //   options: {
    //     animation,
    //     interaction: {
    //       intersect: false,
    //     },
    //     plugins: {
    //       legend: false,
    //     },
    //     scales: {
    //       x: {
    //         display: true,
    //         ticks: {
    //           autoSkip: false,
    //           maxRotation: 0,
    //           major: {
    //             enabled: true,
    //           },
    //         },
    //       },
    //       y: {
    //         beginAtZero: true,
    //       },
    //     },
    //   },
    // });
  }

  async getGroupList() {
    let res: any = await this.runningService.getGroupList();
    // console.log(res);
    res[0].groups.forEach((el) => {
      el.vehicles.forEach((elx) => {
        this.vehicleList.push(elx);
      });
    });
    // console.log(this.vehicleList);
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay ;
    }

  async apply() {
    if (this.filterVehicle.value == '') {
      return 0;
    } else {
      console.log(this.filterVehicle.value);
      let index = this.filterVehicleList.findIndex(
        (el) => el.name.toLowerCase() == this.filterVehicle.value.toLowerCase()
      );
      // console.log(index)
      this.spinner.show();
      let SetendTime = this.filterForm.value.toDate;

      this.durationTime = (+this.filterForm.value.toDate - +this.filterForm.value.fromDate)/1000
        // console.log(this.durationTime)


      ////////////////////////////////////for tracking report
      this.paramObj = {
        startTime: +this.filterForm.value.fromDate,
        endTime: +SetendTime,
        offset: this.offset,
        size: this.size,
        interval: this.interval.value,
        vehicleId: this.filterVehicleList[index].id,
      };

      ////////////////////////////////////for stream access
      this.paramObj3 = {
        startTime: +this.filterForm.value.fromDate,
        endTime: +SetendTime,
        vehicleId: this.filterVehicleList[index].id,
        access_token: localStorage
          .getItem('auth_key_Carot')
          .replace('bearer ', ''),
        chunkSize: 500,
        delay: 500,
        page: 0,
      };

      ////////////////////////////////////for tracking distance
      this.paramObj2 = {
        startTime: +this.filterForm.value.fromDate,
        endTime: +SetendTime,
        vehicleId: this.filterVehicleList[index].id,
      };

      ////////////////////////////////////for geofence
      this.paramObj4 = {
        vehicleId: this.filterVehicleList[index].id,
      };
      this.trackingReportData = [];
      this.getTrackingDistance(this.paramObj2);
      this.getTrackingReport();
    }
  }

  vehicleSearchSuggestion() {
    if (this.filterVehicle.value.length >= 3) {
      this.filterVehicleList = this.vehicleList.filter((el) =>
        el.name.toLowerCase().includes(this.filterVehicle.value.toLowerCase())
      );
    } else {
      this.filterVehicleList = [];
    }
  }

  async getTrackingReport() {
    try {
      const res: any = await this.trackingService.getTrackingReport(
        this.paramObj
      );
      // console.log(res);
      if (this.offset == 0) {
        this.trackingReportData = [];
        this.trackingReportData = res.trackingReportData;
      } else {
        this.trackingReportData = this.trackingReportData.concat(
          res.trackingReportData
        );
      }
      this.trackingReportData.forEach((element) => {
        if (!element.selected) element.selected = false;
      });
      // console.log(this.trackingReportData)

      this.offset = this.offset + this.size;
      this.spinner.hide();
      // console.log(this.offset)
    } catch (err) {
      console.log(err);
      this.spinner.hide();
    }
  }

  async getTrackingDistance(paramObj) {
    try {
      const res: any = await this.trackingService.getTrackingDistance(paramObj);
      // console.log(res);
      this.trackingReportDistance = res;
      // this.spinner.hide();
    } catch (err) {
      console.log(err);
      this.spinner.hide();
    }
  }

  clearAll() {
    this.interval.patchValue(1);
    this.clearDate();
  }

  clearDate() {
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date(),
    });
  }

  async selectVehicleMap() {
    try {
      this.vehicleListToggle = true;
      // console.log(this.trackingReportData)

      this.spinner.show();

      if (this.trackingReportData.every((el) => el.selected)) {
        this.trackingService.getGeofence(this.paramObj4);
        let res2 = this.trackingService.getStreamAccess(this.paramObj3);
        res2.addEventListener('path', (event: any) => {
          // console.log(event.data)
          if (event.data == 'END') {
            res2.close();
            this.pathdraw = this.pathdraw1.map((el) => ({
              lat: el.latitude,
              lng: el.longitude,
              vehicleName: el.vehicleName,
              distance: el.distanceRun,
              speed: el.speed,
              location: el.address,
              timeStamp: el.timeStamp,
            }));

            // console.log(this.pathdraw1);
            // console.log(this.pathdraw);
            // this.drawPath();
            this.pathdrawPlayRoute = this.pathdraw;
            this.chartDataArr = this.pathdraw.map(function (el) {
              return Number(el.speed);
            });
            this.chartLabelArr = this.pathdraw.map(function (el) {
              return '';
            });
            this.chartLabelArr.splice(0, 1, 'Trip Start');
            this.chartLabelArr.splice(
              this.chartLabelArr.length - 1,
              1,
              'Trip End'
            );
            console.log(this.pathdrawPlayRoute);
            console.log('data recieved');
            console.log(this.chartDataArr);
            this.startLocation = this.pathdraw[0];
            this.endLocation = this.pathdraw[this.pathdraw.length - 1];
            this.cardLoadingFlag = false;
            this.spinner.hide();
            console.log(this.startLocation);
            console.log(this.endLocation);
            this.chartOnload();
          } else {
            this.pathdraw1.push(...JSON.parse(event.data));
            this.pathdraw = this.pathdraw1.map((el) => ({
              lat: el.latitude,
              lng: el.longitude,
              vehicleName: el.vehicleName,
              distance: el.distanceRun,
              speed: el.speed,
              location: el.address,
              timeStamp: el.timeStamp,
            }));
          }
        });
        res2.onerror = (err) => {
          console.log(err);
        };
      } else {
        this.pathdraw1 = this.trackingReportData.filter((el) => el.selected);
        this.pathdraw = this.pathdraw1.map((el) => ({
          lat: el.latitude,
          lng: el.longitude,
          vehicleName: el.vehicleName,
          distance: el.distanceRun,
          speed: el.speed,
          location: el.address,
          timeStamp: el.timeStamp,
        }));

        // console.log(this.pathdraw1);
        // console.log(this.pathdraw);
        // this.drawPath();
        this.spinner.hide();
      }
    } catch (error) {
      this.spinner.hide();
    }
  }
  back() {
    this.vehicleListToggle = false;
    this.seekBarVal = 1;
    this.stopInterval();
    this.filterPathdraw = [];
    this.pathdraw = [];
    this.pathdrawPlayRoute = [];
    this.pathdraw1 = [];
    this.spinner.hide();
  }

  clickedMarker(infowindow) {
    console.log(infowindow);
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  closeInfoWindow() {
    this.previous.close();
  }

  drawPath() {
    console.log('drawing');
    this.currentPlaying = true;
    this.noOfDisplayChunks = JSON.stringify(this.pathdrawPlayRoute.length);
    this.noOfDisplayChunks = parseInt(this.noOfDisplayChunks);
    if (this.noOfDisplayChunks <= 10) {
      this.noOfDisplayChunks = 10;
    }

    this.intervalgg = setInterval(() => {
      if (
        this.seekBarVal *
          (this.pathdrawPlayRoute.length / this.noOfDisplayChunks) >=
        this.pathdrawPlayRoute.length
      ) {
        this.currentPlaying = false;
        this.changeDetection.markForCheck();
        this.stopInterval();
      } else {
        this.filterPathdraw.push(
          ...this.pathdrawPlayRoute.filter((el, i) => {
            if (i < this.filterPathdraw.length) {
              return false;
            } else if (
              i <
              this.seekBarVal *
                (this.pathdrawPlayRoute.length / this.noOfDisplayChunks)
            ) {
              this.recenterMap(this.pathdrawPlayRoute[i]);
              // this.chartDataArr.push(this.pathdrawPlayRoute[i].speed);
              // console.log("element pushed")
              // this.myChart.update();
              return true;
            } else {
              return false;
            }
          })
        );

        this.seekBarVal++;

        this.changeDetection.markForCheck();
      }
    }, 70);
  }

  replay() {
    this.intervalIterationIndex = 0;
    this.stopInterval();
    this.seekBarVal = 1;
    this.filterPathdraw = [this.pathdrawPlayRoute[0]];
    // this.chartDataArr = [];
    this.drawPath();
  }

  stopInterval() {
    // this.intervalIterationIndex = 0;

    this.currentPlaying = false;
    if (this.intervalgg) clearInterval(this.intervalgg);

    console.log('stopping');
  }

  seek(event: any) {
    // console.log(event.value)
    this.seekBarVal = event.value;
    this.stopInterval();
    this.filterPathdraw = this.pathdrawPlayRoute.filter((el, i) => {
      if (
        i <
        this.seekBarVal *
          (this.pathdrawPlayRoute.length / this.noOfDisplayChunks)
      ) {
        return true;
      } else return false;
    });

    this.recenterMap(this.filterPathdraw[this.filterPathdraw.length - 1]);
  }

  returnMilliSecondsPerChunk() {
    this.noOfDisplayChunks = this.pathdrawPlayRoute.length;
    // console.log(this.noOfDisplayChunks)

    // console.log(((this.duration / this.noOfDisplayChunks) * 1000))
    return Math.floor(this.noOfDisplayChunks * 1000);
  }

  returnEndFocusOrientation() {
    if (this.filterPathdraw.length > 0) {
      // console.log(this.filterPathdraw[this.filterPathdraw.length - 1])
      return this.filterPathdraw[this.filterPathdraw.length - 1];
    }
    // else if (this.pathdrawPlayRoute.length > 0) {
    //   return this.pathdrawPlayRoute[0].lng;
    // }
    // else {
    //   console.log("gg")
    //   return 78.9;

    // }
  }

  returnEndFocusLatitude() {
    if (this.filterPathdraw.length > 0) {
      return this.filterPathdraw[this.filterPathdraw.length - 1].lat;
    } else if (this.pathdrawPlayRoute.length > 0) {
      return this.pathdrawPlayRoute[this.pathdrawPlayRoute.length - 1].lat;
    }
    // else {
    //   return 20.5937;
    // }
  }

  returnEndFocusLongitude() {
    if (this.filterPathdraw.length > 0) {
      return this.filterPathdraw[this.filterPathdraw.length - 1].lng;
    } else if (this.pathdrawPlayRoute.length > 0) {
      return this.pathdrawPlayRoute[this.pathdrawPlayRoute.length - 1].lng;
    }
    // else {
    //   return 78.9629;
    // }
  }

  returnStartFocusLatitude() {
    if (this.pathdrawPlayRoute.length > 0) {
      return this.pathdrawPlayRoute[0].lat;
    } else {
      return 20.5937;
    }
  }

  returnStartFocusLongitude() {
    if (this.pathdrawPlayRoute.length > 0) {
      return this.pathdrawPlayRoute[0].lng;
    } else {
      return 78.9629;
    }
  }

  selectAll() {
    for (let i = 0; i < this.trackingReportData.length; i++) {
      this.trackingReportData[i].selected = this.selectedAll;
    }
    // console.log(this.trackingReportData)
  }

  checkIfAllSelected() {
    this.selectedAll = this.trackingReportData.every(function (item: any) {
      return item.Selected == true;
    });
    // console.log("sad")
    // console.log(this.trackingReportData)
  }

  recenterMap(obj) {
    this.map.panTo({ lat: obj.lat, lng: obj.lng });

    this.changeDetection.detectChanges();
  }

  getMapZoom(val: any) {
    console.log(val, 'current');
    this.currentZoom = val;

    console.log(this.currentZoom, 'myvar');
  }

  mapReady(event) {
    console.log(this.endLocation.lat);

    this.map = event;

    let Item_1 = new google.maps.LatLng(
      this.endLocation.lat,
      this.endLocation.lng
    );

    let Item_2 = new google.maps.LatLng(
      this.startLocation.lat,
      this.startLocation.lng
    );

    var bounds = new google.maps.LatLngBounds();
    bounds.extend(Item_2);
    bounds.extend(Item_1);
    console.log(Item_2);
    console.log(Item_1);
    this.map.fitBounds(bounds);
    this.map.panTo(Item_1);

    //  console.log(event);
    // this.spinner.hide();

    // this.setCurrentPosition();
  }
}
