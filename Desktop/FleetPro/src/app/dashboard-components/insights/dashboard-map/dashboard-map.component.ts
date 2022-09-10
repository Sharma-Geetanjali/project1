import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { Location } from '@angular/common'
import { AgmPolygon } from '@agm/core';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.css']
})
export class DashboardMapComponent implements OnInit {

  url;
  consignmentArr;
  paramObj;
  mapsdata;
  pathdraw: any = [];
  endMArker: any = [];
  endLng;
  intervalId;
  timerVar = true;

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
  consignorPath1 =[];

  locationPoints: LatLngLiteral[] = [];
  locationPoints1: any =[]
  endLocation;
  startLocation;
  vehicleData;
  orientation;
  boundbool = false;
  firstInterval = true;
  requestSubmitForm: FormGroup;
  locationObj;


  imgPath = this.global.imgPath;
  constructor(private route: ActivatedRoute,
    public consignReport: ConsignmentReportService,
    public vehicleReport: VehicleListService,
    private spinner: NgxSpinnerService,
    private location: Location,
    public theme: ThemeServiceService,
    public global: GlobalConfigService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {


   this.vehicleData = JSON.parse(localStorage.getItem("vehicleData"))
    console.log(this.vehicleData);

    this.url = this.route.snapshot.params['url']
    console.log(this.url)
    this.circleflagconsignee = false;
    this.consignorFlagCircle = false;

    this.requestSubmitForm = this.fb.group({
      vehicleName: [''],
      issueType: [''],
      issueDescription: [''],
    })

    this.getConsignmentReport();

    this.intervalId = setInterval(() => {
      console.log('10s completed')
      // this.firstInterval = false;
      this.getConsignmentReport();
    }, 10000)

  }
  ngOnDestroy() {
    clearInterval(this.intervalId)

      localStorage.removeItem("vehicleData")

  }

  back(): void {
    this.location.back()
    console.log("clicked")
  }

  get vehicleName() { return this.requestSubmitForm.get('vehicleName') }
  get issueType() { return this.requestSubmitForm.get('issueType') }
  get issueDescription() { return this.requestSubmitForm.get('issueDescription') }

  async getConsignmentReport() {


    // if (this.firstInterval == true) {
      this.locationObj = {
        startTime: this.vehicleData.vehicleTrip.startTime,
        endTime: Date.now() * 1,
        vehicleId: this.url
      }
    // } else {
    //   this.locationObj = {
    //     startTime: this.endLocation.timeStamp,
    //     endTime: Date.now() * 1,
    //     vehicleId: this.url
    //   }
    // }
    this.spinner.show();


    try {

      const res: any = await this.consignReport.getLocationDataDashboard(this.locationObj);
      // this.consignmentArr = res.consignment;
      this.pathdraw = res;
      // this.routeId = this.consignmentArr?.metas[0]?.routes[0];
      if (this.timerVar = false) {
        this.pathdraw.concat(res.path)
      }

        if (this.vehicleData.ignitionStatus) {
          this.pathdraw["icon"] = this.theme.onLoaded;
        }
        if (!this.vehicleData.ignitionStatus) {
          this.pathdraw["icon"] = this.theme.offLoaded;
        }
      this.startLocation = this.pathdraw.path[0];
      this.endLocation = this.pathdraw.path[this.pathdraw.path.length - 1];
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
  }

  toggle(el) {
    if (el.checked == true) {
      this.boundbool = true;

    } else {
      this.boundbool = false;

      // console.log('auto')
    }
  }

  patchValueSOS(val) {
    this.vehicleName.patchValue(val);
    this.vehicleName.disable();
  }


  async submitRequest() {
    let submitobj = {
      vehicleId: this.vehicleName.value,
      driverName: 'FSCDL driver',
      driverMobileNumber: 9599779344,
      title: this.issueType.value,
      description: this.issueDescription.value
    }

    try {
      const res: any = await this.vehicleReport.submitRequest(submitobj);
      alert('Service request created successfully with ticket #' + res);


    } catch (err) {
      console.log(err)
    }


  }







}

