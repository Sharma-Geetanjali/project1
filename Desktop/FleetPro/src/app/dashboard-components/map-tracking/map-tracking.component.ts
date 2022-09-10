import { Component, OnInit, OnDestroy, Renderer2, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { Location } from '@angular/common'
import { AgmPolygon, MapsAPILoader } from '@agm/core';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';


@Component({
  selector: 'app-map-tracking',
  templateUrl: './map-tracking.component.html',
  styleUrls: ['./map-tracking.component.css']
})
export class MapTrackingComponent implements OnInit, AfterViewInit, AfterViewChecked {

  url;
  consignmentArr;
  mapsdata;
  pathdraw: any = [];
  endMArker: any = [];
  endLng;
  intervalId;
  timerVar = true;
  circleflagconsignee = false;
  consignorFlagCircle = false;
  bufferflag = false;
  a = false;
  consigneeData;
  consigneeCirlceLat;
  consigneeCirlceLng;
  consigneeCirlceRadius;
  origin: any;
  destination: any;
  routeId;
  paths: LatLngLiteral[] = [];
  paths1: any = [];
  consignorPath: Array<LatLngLiteral> = [];
  consignorPath1 = [];
  locationPoints: LatLngLiteral[] = [];
  locationPoints1: any = []
  kpiForm: FormGroup;
  currentCheckedValue = null;
  paramObj: Object;
  eventArr: any = [];
  kpimarkerArr: any = [];
  kpiStartLoc: any = [];
  kpiEndLoc: any = [];
  getStartIndex: any = [];
  getEndIndex: any = [];
  kpiPathArr: any = [];
  previous;
  orientation = 90;
  boundbool = false;
  loadMarker = false;
  lineBool = true;
  imgPath = this.global.imgPath;
  private geoCoder;
  infoLat;
  infoLng;
  infoVisible;
  infoData;
  diaptchInfo;
  wayPointList: any = [];
  pointBool = false;
  waypointFlag = false;
  defaultLat = 25.799891;
  defaultLng = 77.268790;
  defaultZoom = 6;
  map: any;







  constructor(
    private route: ActivatedRoute,
    public consignReport: ConsignmentReportService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private fb: FormBuilder,
    private ren: Renderer2,
    public theme: ThemeServiceService,
    public global: GlobalConfigService,
    private mapsAPILoader: MapsAPILoader,
    private changeDetection: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.url = this.route.snapshot.params['url']
    // this.url = "DS1470820210076"
    console.log(this.url)

    this.kpiForm = this.fb.group({
      kpiValue: ['']
    })
    this.circleflagconsignee = false;
    this.consignorFlagCircle = false;
    this.getConsignmentReport();
    // this.toggle();
    // this.getDirection();
    this.kpiValue.valueChanges.subscribe(() => { this.kpiAPi() });

    this.intervalId = setInterval(() => {
      // clearInterval(this.intervalId);
      this.lineBool = false;

      console.log('10s completed')
      this.getConsignmentReport();
    }, 10000)

  }
  ngOnDestroy() {
    clearInterval(this.intervalId)
  }

  ngAfterViewInit() {
    // this.lineBool = false;
  }

  ngAfterViewChecked() {
  }


  // getters

  get kpiValue() {
    return this.kpiForm.get('kpiValue')
  }



  async kpiAPi() {

    this.eventArr = [];
    this.kpimarkerArr = [];
    this.kpiStartLoc = [];
    this.kpiEndLoc = [];
    this.getStartIndex = [];
    this.getEndIndex = [];
    this.kpiPathArr = [];
    this.paramObj = {
      consignmentCode: this.url,
      kpi: this.kpiValue.value
    }
    try {
      if (this.kpiValue.value) {
        const res: any = await this.consignReport.getEventsData(this.paramObj);
        this.eventArr = res;
        for (let i = 0; i < this.eventArr.length; i++) {
          this.kpimarkerArr[i] = this.eventArr[i];
          // console.log(this.kpimarkerArr);
          if (this.kpimarkerArr[i].kpi == 'UNLOADING_DELAY') {
            this.kpiStartLoc.push({
              'lat': this.kpimarkerArr[i].startLocation.latitude,
              'lng': this.kpimarkerArr[i].startLocation.longitude,
              'kpi': 'Unloading delay',
              'address': this.kpimarkerArr[i].startLocation.address,
              'startTime': this.kpimarkerArr[i].startTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStart

            });

            this.kpiEndLoc.push({
              'lat': this.kpimarkerArr[i].lastKnownLocation.latitude,
              'lng': this.kpimarkerArr[i].lastKnownLocation.longitude,
              'kpi': 'Unloading delay',
              'address': this.kpimarkerArr[i].startLocation.address,
              'endTime': this.kpimarkerArr[i].lastReportedTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeEnd


            });
          } else if (this.kpimarkerArr[i].kpi == 'IN_TRANSIT_DELAY') {
            this.kpiStartLoc.push({
              'lat': this.kpimarkerArr[i].startLocation.latitude,
              'lng': this.kpimarkerArr[i].startLocation.longitude,
              'kpi': 'In Transit Delay',
              'address': this.kpimarkerArr[i].startLocation.address,
              'startTime': this.kpimarkerArr[i].startTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStart


            });

            this.kpiEndLoc.push({
              'lat': this.kpimarkerArr[i].lastKnownLocation.latitude,
              'lng': this.kpimarkerArr[i].lastKnownLocation.longitude,
              'kpi': 'In Transit Delay',
              'address': this.kpimarkerArr[i].startLocation.address,
              'endTime': this.kpimarkerArr[i].lastReportedTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeEnd

            });

          } else if (this.kpimarkerArr[i].kpi == 'LOADING_DELAY') {
            this.kpiStartLoc.push({
              'lat': this.kpimarkerArr[i].startLocation.latitude,
              'lng': this.kpimarkerArr[i].startLocation.longitude,
              'kpi': 'Loading Delay',
              'address': this.kpimarkerArr[i].startLocation.address,
              'startTime': this.kpimarkerArr[i].startTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStart,



            });

            this.kpiEndLoc.push({
              'lat': this.kpimarkerArr[i].lastKnownLocation.latitude,
              'lng': this.kpimarkerArr[i].lastKnownLocation.longitude,
              'kpi': 'Loading Delay',
              'address': this.kpimarkerArr[i].startLocation.address,
              'endTime': this.kpimarkerArr[i].lastReportedTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeEnd


            });
          } else if (this.kpimarkerArr[i].kpi == 'OVER_SPEEDING') {
            this.kpiStartLoc.push({
              'lat': this.kpimarkerArr[i].startLocation.latitude,
              'lng': this.kpimarkerArr[i].startLocation.longitude,
              'kpi': 'Over Speeding',
              'address': this.kpimarkerArr[i].startLocation.address,
              'startTime': this.kpimarkerArr[i].startTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStart



            });

            this.kpiEndLoc.push({
              'lat': this.kpimarkerArr[i].lastKnownLocation.latitude,
              'lng': this.kpimarkerArr[i].lastKnownLocation.longitude,
              'kpi': 'Over Speeding',
              'address': this.kpimarkerArr[i].startLocation.address,
              'endTime': this.kpimarkerArr[i].lastReportedTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeEnd


            });
          } else if (this.kpimarkerArr[i].kpi == 'EN_ROUTE_STOPPAGE') {
            this.kpiStartLoc.push({
              'lat': this.kpimarkerArr[i].startLocation.latitude,
              'lng': this.kpimarkerArr[i].startLocation.longitude,
              'kpi': 'En Route Stoppage',
              'address': this.kpimarkerArr[i].startLocation.address,
              'startTime': this.kpimarkerArr[i].startTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStoppageStart


            });

            this.kpiEndLoc.push({
              'lat': this.kpimarkerArr[i].lastKnownLocation.latitude,
              'lng': this.kpimarkerArr[i].lastKnownLocation.longitude,
              'kpi': 'En Route Stoppage',
              'address': this.kpimarkerArr[i].startLocation.address,
              'endTime': this.kpimarkerArr[i].lastReportedTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStoppageEnd


            });
          } else if (this.kpimarkerArr[i].kpi == 'NIGHT_DRIVING') {
            this.kpiStartLoc.push({
              'lat': this.kpimarkerArr[i].startLocation.latitude,
              'lng': this.kpimarkerArr[i].startLocation.longitude,
              'kpi': 'Night Driving',
              'address': this.kpimarkerArr[i].startLocation.address,
              'startTime': this.kpimarkerArr[i].startTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStart


            });

            this.kpiEndLoc.push({
              'lat': this.kpimarkerArr[i].lastKnownLocation.latitude,
              'lng': this.kpimarkerArr[i].lastKnownLocation.longitude,
              'kpi': 'Night Driving',
              'address': this.kpimarkerArr[i].startLocation.address,
              'endTime': this.kpimarkerArr[i].lastReportedTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeEnd


            });
          } else if (this.kpimarkerArr[i].kpi == 'ROUTE_DEVIATION') {
            this.kpiStartLoc.push({
              'lat': this.kpimarkerArr[i].startLocation.latitude,
              'lng': this.kpimarkerArr[i].startLocation.longitude,
              'kpi': 'Route Deviation',
              'address': this.kpimarkerArr[i].startLocation.address,
              'startTime': this.kpimarkerArr[i].startTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeStart



            });

            this.kpiEndLoc.push({
              'lat': this.kpimarkerArr[i].lastKnownLocation.latitude,
              'lng': this.kpimarkerArr[i].lastKnownLocation.longitude,
              'kpi': 'Route Deviation',
              'address': this.kpimarkerArr[i].startLocation.address,
              'endTime': this.kpimarkerArr[i].lastReportedTime,
              'distance': this.kpimarkerArr[i].distance,
              'duration': this.timeConversion(this.kpimarkerArr[i].duration),
              'status': this.kpimarkerArr[i].eventStatus,
              'icon': this.theme.routeEnd,
              // 'icon': './assets/images/rd_start.png',



            });
          }



          this.getStartIndex.push({
            'start': this.pathdraw.findIndex(el => el.latitude === this.kpiStartLoc[i].lat)
          });

          this.getEndIndex.push({
            'end': this.pathdraw.findIndex(el => el.latitude === this.kpiEndLoc[i].lat)
          });


          this.kpiPathArr.push({
            'path': this.pathdraw.slice(this.getStartIndex[i].start, this.getEndIndex[i].end)
          });

        }

        console.log(this.kpiPathArr);


      }
    } catch (error) {

    }
  }

  checkState(event, el) {
    event.preventDefault();
    if (this.kpiValue.value && this.kpiValue.value === el.value) {
      el.checked = false;
      this.kpiValue.patchValue('');
    } else {
      this.kpiValue.patchValue(el.value);
      el.checked = true;
    }

  }

  back(): void {
    this.location.back()
  }

  async getConsignmentReport() {
    this.spinner.show();


    try {

      const res: any = await this.consignReport.getSingleConsignmentTrackingPath(this.url);
      this.consignmentArr = res.consignment;
      this.pathdraw = res.path;
      this.routeId = this.consignmentArr?.metas[0]?.routes[0];


      if (this.consignmentArr?.vehicle.ignitionStatus == true) {
        this.consignmentArr["icon"] = this.theme.onLoaded;
      }

      if (this.consignmentArr?.vehicle.ignitionStatus == false) {
        this.consignmentArr["icon"] = this.theme.offLoaded;
      }

      this.orientation = res.orientation;
      if (this.consignmentArr?.consignorGeofenceModel?.type == "CIRCLE") {
        this.consignorFlagCircle = true;
      }

      if (this.consignmentArr?.consignorGeofenceModel?.type == "POLYGON") {
        let polycords = [];
        polycords = this.consignmentArr?.consignorGeofenceModel?.polygon.split('|');
        for (let i = 0; i < polycords.length - 1; i++) {
          if (polycords[0] !== "") {
            let obj = [];
            let cords = polycords[i].split(':');
            this.consignorPath1.push({
              lat: parseFloat(cords[0]),
              lng: parseFloat(cords[1])
            })
            // this.consignorPath1.push(obj)
            this.consignorPath = this.consignorPath1;


          }

        }

        console.log(this.consignorPath)


      }



      for (const [key, value] of Object.entries(this.consignmentArr?.consigneeGeofenceModel)) {
        this.consigneeData = value;
        if (value["type"] == "POLYGON") {
          // this.a = true;
          let polygon = []
          polygon = value["polygon"].split('|')
          for (let i = 0; i < polygon.length - 1; i++) {
            if (polygon[0] !== "") {
              let cords = polygon[i].split(':');
              this.paths1.push({
                lat: parseFloat(cords[0]),
                lng: parseFloat(cords[1])
              })
            }
          }

          this.paths = this.paths1;
          console.log(this.paths)
        }
        if (value["type"] == "CIRCLE") {
          this.circleflagconsignee = true;
        }
        this.consigneeCirlceLat = value["latitude"];
        this.consigneeCirlceLng = value["longitude"];
        this.consigneeCirlceRadius = value["radius"];

      }
      if (this.routeId != '' && this.bufferflag == false) {
        this.drawBuffer(this.routeId);
        this.bufferflag = true;
      }

      if (this.consignmentArr.groupId && this.waypointFlag == false) {
        this.getWayPoints(this.consignmentArr.groupId);
      }

      if (this.timerVar == true) {
        this.recenterMap();
      }


      // console.log(this.pathdraw.length);
      this.timerVar = false
      this.spinner.hide();
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
  }

  toggle(el) {
    if (el.checked == true) {
      this.boundbool = true;
      // this.pointBool = false;

    } else {
      this.boundbool = false;
      // this.pointBool = true;


      // console.log('auto')
    }
  }

  async getWayPoints(groupID) {

    try {

        const res: any = await this.consignReport.getWayPoints(groupID);
      this.wayPointList = res;
      // console.log(this.wayPointList)
      this.waypointFlag = true;
      // console.log("waypointlist",this.waypointFlag)
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
  }

  async drawBuffer(routeId) {

    try {
      const res: any = await this.consignReport.drawBuffer(routeId);
      for (let i = 0; i < res.length; i++) {
        this.locationPoints1.push({
          lat: res[i].latitude,
          lng: res[i].longitude
        })
      }
      this.locationPoints = this.locationPoints1;
      console.log(this.locationPoints)
    } catch (err) {
      console.log(err);
    }



  }


  timeConversion(duration: number) {
    const portions: string[] = [];

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + 'h');
      duration = duration - (hours * msInHour);
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + 'm');
      duration = duration - (minutes * msInMinute);
    }

    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + 's');
    }

    return portions.join(' ');
  }


  clickedMarker(infowindow) {

    console.log(this.previous)
    if (this.previous) {
      //  this.previous.open();
      this.previous.close();

    }

      this.previous = infowindow;




    // }
  }

  clickedline(i, windowinfo) {
    console.log(windowinfo)
    var minDist = Number.MAX_VALUE;
    for (var j = 0; j < this.pathdraw.length; j++) {
      const mexicoCity = new google.maps.LatLng(i.latLng.lat(), i.latLng.lng());
      const jacksonville = new google.maps.LatLng(this.pathdraw[j].latitude, this.pathdraw[j].longitude);
      var distance = google.maps.geometry.spherical.computeDistanceBetween(mexicoCity, jacksonville);
      // console.log(distance)
      if (distance < minDist) {
        minDist = distance;
        var index = j;
        // console.log(j)
      }
    }

    this.getLocationData(this.pathdraw[index].locationId,windowinfo);

  }

  async getLocationData(id,windowinfo) {
    try {

      const res: any = await this.consignReport.getLocationData(id);
      this.infoLat = res.latitude
      this.infoLng = res.longitude
      this.infoData = res;
      this.infoVisible = false;
      windowinfo.isOpen = true;
      this.infoVisible = windowinfo.isOpen
      console.log(windowinfo.isOpen)

    }
    catch (err) {
      console.log(err)
    }
  }

  closePolyInfoWindow() {
    this.infoVisible = false;

  }



  closeInfoWindow() {
    console.log(this.previous)
    this.previous.close();

  }

  recenterMap() {
   this.map.setCenter({lat: this.consignmentArr?.lastReportedLocation?.latitude,lng: this.consignmentArr?.lastReportedLocation?.longitude })

    this.changeDetection.detectChanges();

  }



  mapReady(event) {
    this.map = event;
    console.log(event);
    // this.spinner.hide();

    // this.setCurrentPosition();
  }




}
