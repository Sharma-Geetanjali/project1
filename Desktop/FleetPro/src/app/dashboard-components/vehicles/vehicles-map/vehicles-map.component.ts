import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { Location } from '@angular/common';
import { AgmPolygon, LatLngBounds } from '@agm/core';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsernameValidator } from 'src/app/Services/custom-validator/custom-validator.service';
import { Subscription } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-vehicles-map',
  templateUrl: './vehicles-map.component.html',
  styleUrls: ['./vehicles-map.component.css'],
})
export class VehiclesMapComponent implements OnInit, AfterViewInit {
  url;
  consignmentArr;
  paramObj;
  mapsdata;
  pathdraw: any = [];
  endMArker: any = [];
  endLng;
  intervalId;

  circleflagconsignee = false;
  consignorFlagCircle = false;
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
  locationPoints1: any = [];
  endLocation;
  startLocation;
  vehicleData;
  orientation;
  boundbool = true;
  cardLoadingFlag = true;
  requestSubmitForm: FormGroup;
  map: any;
  currentZoom: any;

  lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4,
  };

  flagIcon = 'assets/images/flag.svg';

  pathdrawPlayRoute: Array<LatLngLiteral> = [];
  pathdraw1: any = [];
  filterPathdraw: Array<LatLngLiteral> = [];
  // intervalId2;
  subscription: Subscription;

  duration = 20;
  currentDuration = null;
  noOfDisplayChunks;
  currentChunkVal = 1;
  currentlyDrawing = false;
  intervalgg;

  seekBarVal = 1;

  currentPlaying: boolean = false;
  playMap: boolean = false;
  // map: any;
  previous: any;
  intervalIterationIndex = 0;
  endIterationIndex;

  imgPath = this.global.imgPath;

  constructor(
    private route: ActivatedRoute,
    public consignReport: ConsignmentReportService,
    public vehicleReport: VehicleListService,
    private spinner: NgxSpinnerService,
    private location: Location,
    public theme: ThemeServiceService,
    public global: GlobalConfigService,
    private fb: FormBuilder,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.vehicleData = JSON.parse(localStorage.getItem('vehicleData'));
    // console.log(this.vehicleData)
    this.url = this.route.snapshot.params['url'];
    // console.log(this.url)
    this.circleflagconsignee = false;
    this.consignorFlagCircle = false;

    this.requestSubmitForm = this.fb.group({
      vehicleName: [''],
      issueType: ['', Validators.required],
      issueDescription: [
        '',
        [Validators.required, UsernameValidator.frontSpace],
      ],
    });

    this.getConsignmentReport();
    this.intervalId = setInterval(() => {
      if(!this.playMap){
        this.getConsignmentReport();
      }
    }, 10000);
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
    // clearInterval(this.intervalId2)

    localStorage.removeItem('vehicleData');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.boundbool = false;
    }, 1000);
  }

  // back(): void {
  //   this.location.back()
  //   // console.log("clicked")
  // }

  get vehicleName() {
    return this.requestSubmitForm.get('vehicleName');
  }
  get issueType() {
    return this.requestSubmitForm.get('issueType');
  }
  get issueDescription() {
    return this.requestSubmitForm.get('issueDescription');
  }

  async getConsignmentReport() {
    let now = Date.now();
    let lastTwoHrs = now - 2 * 3600 * 1000;

    this.spinner.show();

    try {
      const res: any = await this.consignReport.getVehicleLiveTracking(
        this.vehicleData.vehicleId,
        lastTwoHrs
      );
      // this.consignmentArr = res.consignment;
      this.pathdraw = res;
      this.pathdraw1 = this.pathdraw.path;
      // this.pathdrawPlayRoute = this.pathdraw1

      this.pathdrawPlayRoute = this.pathdraw1.map((el) => ({
        lat: el.latitude,
        lng: el.longitude,
        // vehicleName: el.vehicleName,
        // distance: el.distanceRun,
        speed: el.speed,
        location: el.address,
        orientation: el.orientation,
        timeStamp: el.timeStamp,
      }));
      // this.routeId = this.consignmentArr?.metas[0]?.routes[0];

      if (this.vehicleData.ignitionStatus && this.vehicleData.loaded) {
        this.pathdraw['icon'] = this.theme.onLoaded;
      }

      if (this.vehicleData.ignitionStatus && !this.vehicleData.loaded) {
        this.pathdraw['icon'] = this.theme.onUnLoaded;
      }
      if (!this.vehicleData.ignitionStatus && this.vehicleData.loaded) {
        this.pathdraw['icon'] = this.theme.offLoaded;
      }
      if (!this.vehicleData.ignitionStatus && !this.vehicleData.loaded) {
        this.pathdraw['icon'] = this.theme.offUnLoaded;
      }
      console.log(this.pathdraw);
      console.log( "path draw1", this.pathdraw1)
      console.log( "pathdrawPlayRoute", this.pathdrawPlayRoute)
      this.startLocation = this.pathdraw.path[0];
      this.endLocation = this.pathdraw.path[this.pathdraw.path.length - 1];
      if (!this.boundbool) {
        this.recenterMap();
      }

      this.cardLoadingFlag = false;

      this.changeDetection.detectChanges();
    } catch (err) {
      console.log(err);
      this.spinner.hide();
    }
  }

  toggle(el) {
    if (el == true) {
      this.boundbool = true;
    } else {
      this.boundbool = false;
    }
    // console.log(this.boundbool);
    // console.log(this.currentZoom);
    // console.log(this.pathdraw.path[this.pathdraw.path.length - 1]);
  }

  patchValueSOS(val) {
    this.vehicleName.patchValue(val);
    this.vehicleName.disable();
  }

  async submitRequest() {
    this.requestSubmitForm.markAllAsTouched();
    if (this.requestSubmitForm.status == 'INVALID') {
      return;
    }
    let submitobj = {
      vehicleId: this.vehicleName.value,
      driverName: 'FSCDL driver',
      driverMobileNumber: 9599779344,
      title: this.issueType.value,
      description: this.issueDescription.value,
    };

    try {
      this.closeReportModal();
      const res: any = await this.vehicleReport.submitRequest(submitobj);
      alert('Service request created successfully with ticket #' + res);
    } catch (err) {
      console.log(err);
    }
  }

  closeReportModal() {
    $('#exampleModal').modal('hide');
    this.requestSubmitForm.patchValue({
      vehicleName: '',
      issueType: '',
      issueDescription: '',
    });
    this.requestSubmitForm.markAsUntouched();
  }

  recenterMap() {
    // console.log('called');
    this.map.panTo({
      lat: this.endLocation.latitude,
      lng: this.endLocation?.longitude,
    });

    this.changeDetection.detectChanges();
  }

  back() {
    // this.vehicleListToggle = false;
    this.seekBarVal = 1;
    this.stopInterval();
    this.filterPathdraw = [];
    this.pathdrawPlayRoute = [];
    this.pathdraw1 = [];
    this.spinner.hide();
    this.location.back();
  }

  clickedMarker(infowindow) {
    console.log(infowindow);
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
    // console.log(this.previous);
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
              this.recenterMap2(this.pathdrawPlayRoute[i]);
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
    this.drawPath();
  }

  stopInterval() {
    // this.intervalIterationIndex = 0;

    this.currentPlaying = false;
    if (this.intervalgg) clearInterval(this.intervalgg);

    // console.log('stopping');
  }

  seek(event:any) {
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

    this.recenterMap2(this.filterPathdraw[this.filterPathdraw.length -1]);
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
      return this.pathdrawPlayRoute[0].lat;
    }
    // else {
    //   return 20.5937;
    // }
  }

  returnEndFocusLongitude() {
    if (this.filterPathdraw.length > 0) {
      return this.filterPathdraw[this.filterPathdraw.length - 1].lng;
    } else if (this.pathdrawPlayRoute.length > 0) {
      return this.pathdrawPlayRoute[0].lng;
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

  recenterMap2(obj) {
    this.map.panTo({ lat: obj.lat, lng: obj.lng });

    this.changeDetection.detectChanges();
  }

  playback(val: boolean) {
    this.playMap = val;
  }

  mapReady(event) {
    this.map = event;
    console.log('mapready');
    console.log(this.endLocation)
    console.log(this.startLocation)
    if (!this.playMap) {
      let Item_1 = new google.maps.LatLng(
        this.endLocation?.latitude,
        this.endLocation?.longitude
      );

      let Item_2 = new google.maps.LatLng(
        this.startLocation?.latitude,
        this.startLocation?.longitude
      );

      var bounds = new google.maps.LatLngBounds();
      bounds.extend(Item_2);
      bounds.extend(Item_1);
      // console.log(Item_2)
      // console.log(Item_1)
      // console.log(bounds)
      this.map.fitBounds(bounds);
      this.map.panTo(Item_1)
    }
  }

  mapReady2(event) {
    this.map = event;
    this.map.panTo({
      lat: this.pathdraw.path[this.pathdraw.path.length - 1].latitude,
      lng: this.pathdraw.path[this.pathdraw.path.length - 1].longitude,
    });
  }

  getMapZoom(val: any) {
    console.log(val, 'current');
    this.currentZoom = val;

    console.log(this.currentZoom, 'myvar');
  }
}
