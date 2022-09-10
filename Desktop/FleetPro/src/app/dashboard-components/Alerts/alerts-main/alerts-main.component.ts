import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from 'src/app/Services/header/header.service';
import { DailyRunningService } from 'src/app/Services/Reports/daily-running-report/daily-running.service';
import { from, Subscription } from 'rxjs';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { EngineOnComponent } from '../engine-on/engine-on.component';
import { OverSpeedingComponent } from '../over-speeding/over-speeding.component';
import { EngineOffComponent } from '../engine-off/engine-off.component';
import { DisconnectedComponent } from '../disconnected/disconnected.component';
import { DevicePluggedInComponent } from '../device-plugged-in/device-plugged-in.component';
import { EngineIdlingComponent } from '../engine-idling/engine-idling.component';
import { HarshBreakComponent } from '../harsh-break/harsh-break.component';
import { HighAccelerationComponent } from '../high-acceleration/high-acceleration.component';
import { DTCAlertComponent } from '../dtc-alert/dtc-alert.component';
import { GeoFenceComponent } from '../geo-fence/geo-fence.component';
import { TempSensorComponent } from '../temp-sensor/temp-sensor.component';
import { CoolentTempComponent } from '../coolent-temp/coolent-temp.component';
import { AlertService } from 'src/app/Services/alerts/alert.service';


declare var $: any;

@Component({
  selector: 'app-alerts-main',
  templateUrl: './alerts-main.component.html',
  styleUrls: ['./alerts-main.component.css']
})
export class AlertsMainComponent implements OnInit, OnDestroy {
  @ViewChild(EngineOnComponent) engineOn: EngineOnComponent;
  @ViewChild(OverSpeedingComponent) overSpeeding: OverSpeedingComponent;
  @ViewChild(EngineOffComponent) engineOff: EngineOffComponent;
  @ViewChild(DisconnectedComponent) disconnected: DisconnectedComponent;
  @ViewChild(DevicePluggedInComponent) deviceOn: DevicePluggedInComponent;
  @ViewChild(EngineIdlingComponent) EngineIdle: EngineIdlingComponent;
  @ViewChild(HarshBreakComponent) harshBrake: HarshBreakComponent;
  @ViewChild(HighAccelerationComponent) highSpeed: HighAccelerationComponent;
  @ViewChild(DTCAlertComponent) dtc: DTCAlertComponent;
  @ViewChild(GeoFenceComponent) geoFence: GeoFenceComponent;
  @ViewChild(TempSensorComponent) tempSensor: TempSensorComponent;
  @ViewChild(CoolentTempComponent) coolentTemp: CoolentTempComponent;













  subCount = 'OVER_SPEEDING';
  imgPath = this.global.imgPath;
  filterForm: FormGroup;
  paramObj: any = {};
  maxDate = new Date();
  startDate = new Date();
  toDate;
  downloadDate = new Date();
  numberFilter: any = [];
  searchText = null;
  vehicleList: any = [];
  filterVehicleList: any = [];
  subscription: Subscription;
  downloadUrl: any = '';

  successMsg = 'Downloaded Successfully';
  statusMsg = '';


  constructor(public login: LoginServiceService,
    public global: GlobalConfigService,
    private fb: FormBuilder,
    public alertService: AlertService,
    public headerS: HeaderService,
    public runningService: DailyRunningService,
    public url: UrlServiceService,

  ) {
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0);
    this.subscription = this.headerS.refresh$.subscribe((val) => {
      this.ngOnInit();
      this.clearAll();
      // headerS.goFilter();
    });
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      filterVehicle: [''],
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
      this.filterValues();
      // this.headerS.goFilter();
    });



    this.paramObj = {
      startTime: +this.filterForm.value.fromDate,
      endTime: +this.filterForm.value.toDate,
    }

    this.getGroupList();
    this.filterVehicle.valueChanges.subscribe(() => { this.vehicleSearchSuggestion() })

  }

  ngOnDestroy() {

    this.subscription.unsubscribe();
  }




  get filterVehicle() {
    return this.filterForm.get('filterVehicle');
  }

  clearDate() {
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }

  toggleSubmenu(el) {
    // this.subscription.unsubscribe();

    this.subCount = el;
  }

  search() {
    this.paramObj['vehicleId'] = this.searchText;
  }

  filterValues() {
    this.paramObj['startTime'] = +this.filterForm.value.fromDate;
    this.paramObj['endTime'] = +this.filterForm.value.toDate;
    if (this.subCount === 'IGNITION_ON') {
      this.engineOn.offset = 0;
      this.engineOn.Size = 50;
      this.engineOn.getEvent();
    }
    if (this.subCount === 'OVER_SPEEDING') {
      this.overSpeeding.offset = 0;
      this.overSpeeding.Size = 50;
      this.overSpeeding.getEvent();
    }

    if (this.subCount === 'IDLE_ENGINE') {
      this.EngineIdle.offset = 0;
      this.EngineIdle.Size = 50;
      this.EngineIdle.getEvent();
    }

    if (this.subCount === 'HARD_DECELERATION') {
      this.harshBrake.offset = 0;
      this.harshBrake.Size = 50;
      this.harshBrake.getEvent();
    }

    if (this.subCount === 'HARD_ACCELERATION') {
      this.highSpeed.offset = 0;
      this.highSpeed.Size = 50;
      this.highSpeed.getEvent();
    }


    if (this.subCount === 'GEO_FENCE_BREACH') {
      this.geoFence.offset = 0;
      this.geoFence.Size = 50;
      this.geoFence.getEvent();
    }

    if (this.subCount === 'IGNITION_OFF') {
      this.engineOff.offset = 0;
      this.engineOff.Size = 50;
      this.engineOff.getEvent();
    }

    if (this.subCount === 'DTC') {
      this.dtc.offset = 0;
      this.dtc.Size = 50;
      this.dtc.getEvent();
    }

    if (this.subCount === 'POWER_ON') {
      this.deviceOn.offset = 0;
      this.deviceOn.Size = 50;
      this.deviceOn.getEvent();
    }

    if (this.subCount === 'POWER_OFF') {
      this.disconnected.offset = 0;
      this.disconnected.Size = 50;
      this.disconnected.getEvent();
    }

    if (this.subCount === 'TEMPERATURE_SENSOR') {
      this.tempSensor.offset = 0;
      this.tempSensor.Size = 50;
      this.tempSensor.getEvent();
    }

    if (this.subCount === 'HIGH_ENGINE_COLLANT_TEMPERATURE') {
      this.coolentTemp.offset = 0;
      this.coolentTemp.Size = 50;
      this.coolentTemp.getEvent();
    }





  }

  clearAll() {
    this.clearDate();
    this.paramObj['startTime'] = +this.filterForm.value.fromDate;
    this.paramObj['endTime'] = +this.filterForm.value.toDate;
    if (this.subCount === 'IGNITION_ON') {
      this.engineOn.offset = 0;
      this.engineOn.Size = 50;
      this.engineOn.getEvent();
    }
    if (this.subCount === 'OVER_SPEEDING') {
      this.overSpeeding.offset = 0;
      this.overSpeeding.Size = 50;
      this.overSpeeding.getEvent();
    }

    if (this.subCount === 'IDLE_ENGINE') {
      this.EngineIdle.offset = 0;
      this.EngineIdle.Size = 50;
      this.EngineIdle.getEvent();
    }

    if (this.subCount === 'HARD_DECELERATION') {
      this.harshBrake.offset = 0;
      this.harshBrake.Size = 50;
      this.harshBrake.getEvent();
    }

    if (this.subCount === 'HARD_ACCELERATION') {
      this.highSpeed.offset = 0;
      this.highSpeed.Size = 50;
      this.highSpeed.getEvent();
    }


    if (this.subCount === 'GEO_FENCE_BREACH') {
      this.geoFence.offset = 0;
      this.geoFence.Size = 50;
      this.geoFence.getEvent();
    }

    if (this.subCount === 'IGNITION_OFF') {
      this.engineOff.offset = 0;
      this.engineOff.Size = 50;
      this.engineOff.getEvent();
    }

    if (this.subCount === 'DTC') {
      this.dtc.offset = 0;
      this.dtc.Size = 50;
      this.dtc.getEvent();
    }

    if (this.subCount === 'POWER_ON') {
      this.deviceOn.offset = 0;
      this.deviceOn.Size = 50;
      this.deviceOn.getEvent();
    }

    if (this.subCount === 'POWER_OFF') {
      this.disconnected.offset = 0;
      this.disconnected.Size = 50;
      this.disconnected.getEvent();
    }

    if (this.subCount === 'TEMPERATURE_SENSOR') {
      this.tempSensor.offset = 0;
      this.tempSensor.Size = 50;
      this.tempSensor.getEvent();
    }

    if (this.subCount === 'HIGH_ENGINE_COLLANT_TEMPERATURE') {
      this.coolentTemp.offset = 0;
      this.coolentTemp.Size = 50;
      this.coolentTemp.getEvent();
    }

  }

  async getGroupList() {
    let res: any = await this.runningService.getGroupList();
    // console.log(res);
    res[0].groups.forEach(el => {
      el.vehicles.forEach(elx => {
        this.vehicleList.push(elx);
      });
    });
  }

  vehicleSearchSuggestion() {
    if (this.filterVehicle.value.length >= 3) {
      this.filterVehicleList = this.vehicleList.filter(el => el.name.toLowerCase().includes(this.filterVehicle.value.toLowerCase()))
    }
    else {
      this.filterVehicleList = [];
    }
    // console.log(this.filterVehicleList)

  }

  apply() {
    if (this.filterVehicle.value == '') {
      // this.headerS.goFilter();
      delete this.paramObj.vehicleId;

    }
    else {
      let index = this.filterVehicleList.findIndex(el => el.name.toLowerCase() == this.filterVehicle.value.toLowerCase())


      this.paramObj['vehicleId'] = this.filterVehicleList[index].id


    }

    if (this.subCount === 'OVER_SPEEDING') {
      this.overSpeeding.offset = 0;
      this.overSpeeding.Size = 50;
      this.overSpeeding.getEvent();
    }

    if (this.subCount === 'IDLE_ENGINE') {
      this.EngineIdle.offset = 0;
      this.EngineIdle.Size = 50;
      this.EngineIdle.getEvent();
    }

    if (this.subCount === 'HARD_DECELERATION') {
      this.harshBrake.offset = 0;
      this.harshBrake.Size = 50;
      this.harshBrake.getEvent();
    }

    if (this.subCount === 'HARD_ACCELERATION') {
      this.highSpeed.offset = 0;
      this.highSpeed.Size = 50;
      this.highSpeed.getEvent();
    }


    if (this.subCount === 'GEO_FENCE_BREACH') {
      this.geoFence.offset = 0;
      this.geoFence.Size = 50;
      this.geoFence.getEvent();
    }

    if (this.subCount === 'IGNITION_ON') {
      this.engineOn.offset = 0;
      this.engineOn.Size = 50;
      this.engineOn.getEvent();
    }

    if (this.subCount === 'IGNITION_OFF') {
      this.engineOff.offset = 0;
      this.engineOff.Size = 50;
      this.engineOff.getEvent();
    }

    if (this.subCount === 'DTC') {
      this.dtc.offset = 0;
      this.dtc.Size = 50;
      this.dtc.getEvent();
    }

    if (this.subCount === 'POWER_ON') {
      this.deviceOn.offset = 0;
      this.deviceOn.Size = 50;
      this.deviceOn.getEvent();
    }

    if (this.subCount === 'POWER_OFF') {
      this.disconnected.offset = 0;
      this.disconnected.Size = 50;
      this.disconnected.getEvent();
    }

    if (this.subCount === 'TEMPERATURE_SENSOR') {
      this.tempSensor.offset = 0;
      this.tempSensor.Size = 50;
      this.tempSensor.getEvent();
    }

    if (this.subCount === 'HIGH_ENGINE_COLLANT_TEMPERATURE') {
      this.coolentTemp.offset = 0;
      this.coolentTemp.Size = 50;
      this.coolentTemp.getEvent();
    }

  }

  async downloadReport() {
    this.downloadUrl = '';
    this.startDate = this.filterForm.value.fromDate;
    this.toDate = this.filterForm.value.toDate;

    let vehicleId, vehicleIdParam = 'vehicleId=';

    if (this.filterVehicle.value) {
      let index = this.filterVehicleList.findIndex(el => el.name.toLowerCase() == this.filterVehicle.value.toLowerCase())
      vehicleId = this.filterVehicleList[index].id
    } else {
      vehicleId = '';
      vehicleIdParam = '';
    }

    this.downloadUrl = `${this.url.apiV3url}api/vm/event/download?endTime=${+this.toDate}&eventTypes=${this.subCount}&offset=0&size=500&startTime=${+this.startDate}&${vehicleIdParam}${vehicleId}`

    let date = this.downloadDate.toLocaleDateString('en-GB')
    // console.log(date);

    $('#downloadingModal').modal('show');
    this.statusMsg = "Downloading in progress";
    try {
      let res: any = await this.alertService.getExcelReport(this.downloadUrl, date, this.subCount)
      // console.log(res)
      if (res) {
        $('#downloadingModal').modal('hide');
        $('#successModal').modal('show');
        setTimeout(function () { $('#successModal').modal('hide'); }, 1000)
      }
    } catch (err) {
      console.log(err)
      // this.statusMsg = '';
      this.statusMsg = err.error.message;
      $('#errorModal').modal('show');
    }
  }

  // closeModal() {
  //   $('#downloadingModal').modal('hide');

  // }

}
