import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EolTestingService } from 'src/app/Services/eol-testing/eol-testing.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;


@Component({
  selector: 'app-eol-testing',
  templateUrl: './eol-testing.component.html',
  styleUrls: ['./eol-testing.component.css']
})
export class EolTestingComponent implements OnInit, OnDestroy {

  toggle = false;
  submitted = false;
  distance: any;
  vehicleInsidePlantBool: Boolean;
  status;

  ////////////////light color(if 0 then grey, if 1 then green, if 2 then red)
  deviceLinkingLight = 0;
  gprsLight = 0;
  ignitionDataLight = 0;
  gpsLight = 0;
  insidePlantLight = 0;
  sosBtnLight = 0;
  systemTime = new Date()
  vehicleStateTime;
  lastIgnitionTime;
  lastSosTime;
  createdOnTime;
  timerVar = 60;
  intervalId;
  showTimer: Boolean = false;
  sosDate = new Date;
  statusMsg = '';




  eolTestingArr: any = [];

  constructor(private spinner: NgxSpinnerService, public global: GlobalConfigService, public fb: FormBuilder, public eolTesting: EolTestingService, public theme: ThemeServiceService) {
    // this.printt()
   }
  imgPath = this.global.imgPath;

  // flagNG = this.theme.flagNG;
  // flagOK = this.theme.flagOK;
  // flagBlack = this.theme.flagBlack;
  // flagRed = this.theme.flagRed;
  // flagGreen = this.theme.flagGreen;
  // flagGrey = this.theme.flagGrey;

  searchForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit(): void {
    // console.log(+this.systemTime)
    // this.printt();
  }
  ngOnDestroy() {
    clearInterval(this.intervalId)
  }
  get searchFormName() {
    return this.searchForm.get('name');
  }


  async searchEolTesting() {
    // $('#exampleModal').modal('show')

    clearInterval(this.intervalId)
    this.createdOnTime = null;
    this.vehicleStateTime = null;
    this.lastIgnitionTime = null;
    // this.systemTime = null;
    this.lastSosTime = null;

    this.searchForm.markAllAsTouched();
    this.submitted = true;
    if ((this.searchFormName.value.trim() == '')) {
      this.statusMsg = '';
      this.statusMsg = 'Please enter Vehicle/Device Id';
  $('#errorInput').modal('show');
      return;
    }

    if (!this.searchFormName.value.trim().match(/^[0-9a-zA-Z]+$/)) {
      this.statusMsg = '';
      this.statusMsg = 'Only alpha Numeric charecters are allowed';
  $('#errorInput').modal('show');
      return;
    }

    console.log(this.searchFormName.value.trim())
    try {
      clearInterval(this.intervalId)
      this.eolTestingArr = [];
      this.timerVar = 60;
      const res: any = await this.eolTesting.getEolTesting(this.searchFormName.value.trim(), this.toggle)
      this.eolTestingArr = res;
      this.showTimer = true;
      this.intervalId = setInterval(() => {
        this.timerVar--;
        if (this.timerVar == 0) {
          clearInterval(this.intervalId);
          this.deviceLinkingLight = 0;
          this.gprsLight = 0;
          this.ignitionDataLight = 0;
          this.gpsLight = 0;
          this.insidePlantLight = 0;
          this.sosBtnLight = 0;
          this.eolTestingArr = [];
          this.showTimer = false;
          this.searchFormName.patchValue('');
        }
        // console.log('timer',this.timerVar)
      }, 1000)
      console.log(this.eolTestingArr)

      ////////////////////////////device linking check
      if (this.eolTestingArr.vehicleModel.uin && this.eolTestingArr.vehicleModel.deviceSerialNumber) {
        this.createdOnTime = new Date(this.eolTestingArr.vehicleModel.createdOn);

        this.deviceLinkingLight = 1;
      }
      else {
        this.deviceLinkingLight = 2;
      }

      ////////////////////////////gps and gprs check
      if (this.eolTestingArr.vehicleState.latitude && this.eolTestingArr.vehicleState.longitude) {
        // let this.systemTime = new Date().getTime();
        let vehicleStateTime = new Date(this.eolTestingArr.vehicleState.date).getTime()
        this.vehicleStateTime = new Date(this.eolTestingArr.vehicleState.date)
        let systemTime = new Date().getTime();

        // console.log(new Date(this.eolTestingArr.vehicleState.date))
        let diff = Math.abs(systemTime - vehicleStateTime) / 3600000;
        // console.log(diff)
        if (diff > 2) {
          this.gprsLight = 2;
          this.gpsLight = 2;
        }
        else {
          this.gprsLight = 1;
          this.gpsLight = 1;
        }
      }
      else {
        this.gprsLight = 2;
        this.gpsLight = 2;
      }

      ////////////////////////////ignition data check
      if (this.eolTestingArr.lastIgnitionTimeStamp) {
        // let this.systemTime = new Date().getTime();
        let lastIgnitionTime = new Date(this.eolTestingArr.lastIgnitionTimeStamp).getTime()
        this.lastIgnitionTime = new Date(this.eolTestingArr.lastIgnitionTimeStamp)
        let systemTime = new Date().getTime();
        let diff = Math.abs(systemTime - lastIgnitionTime) / 3600000;
        // console.log(diff)
        if (diff > 2) {
          this.ignitionDataLight = 2
        }
        else {
          this.ignitionDataLight = 1
        }
      }
      else {
        let systemTime = new Date().getTime();
        this.ignitionDataLight = 2
      }


      ////////////////////////////inside plant check
      if (this.showTimer) {
        if (this.eolTestingArr.vehicleState.latitude && this.eolTestingArr.vehicleState.longitude) {
          let insidePlantBool = false
          for (let el of this.global.mindaPlantCoordinate) {
            this.distance = this.getDistanceFromLatLonInKm(el.latitude, el.longitude, this.eolTestingArr.vehicleState.latitude, this.eolTestingArr.vehicleState.longitude)
            // console.log(this.distance)
            if (this.distance * 1000 <= 500) {
              insidePlantBool = true;
              break;
            }
            else {
              insidePlantBool = false;
            }
          };
          this.vehicleStateTime = new Date(this.eolTestingArr.vehicleState.date)
          let systemTime = new Date().getTime();

          // console.log(new Date(this.eolTestingArr.vehicleState.date))
          let diff = Math.abs(systemTime - this.vehicleStateTime) / 3600000;
          if (insidePlantBool && diff < 2 ) {
            this.insidePlantLight = 1
          }
          else if (!insidePlantBool || diff > 2 ) {
            this.insidePlantLight = 2
          }

        }
        else {
          this.insidePlantLight = 2
        }
      }


      ////////////////////////////Help button data check
      if (this.eolTestingArr.vehicleState.lastSosTriggered) {
        console.log(this.eolTestingArr.vehicleState.lastSosTriggered);
        // let this.systemTime = new Date().getTime();
        let lastSosTime = new Date(this.eolTestingArr.vehicleState.lastSosTriggered).getTime()
        this.lastSosTime = new Date(this.eolTestingArr.vehicleState.lastSosTriggered)
        let systemTime = new Date().getTime();
        let diff = Math.abs(systemTime - lastSosTime) / 3600000;
        // console.log(diff)
        if (diff > 2) {
          this.sosBtnLight = 2
        }
        else {
          this.sosBtnLight = 1
        }
      }
      else {
        // let systemTime = new Date().getTime();
        this.sosBtnLight = 2
      }


      try {
        if (this.insidePlantLight == 1) {
          this.vehicleInsidePlantBool = true
        }
        else {
          this.vehicleInsidePlantBool = true
        }
        if (this.insidePlantLight == 1 && this.ignitionDataLight == 1 && this.gprsLight == 1 && this.gpsLight == 1 && this.deviceLinkingLight == 1 && this.sosBtnLight == 1) {
          this.status = "OK"
          let obj = this.fb.group({
                    deviceId: [this.eolTestingArr?.vehicleModel?.deviceSerialNumber],
                    uin: [this.eolTestingArr?.vehicleState?.uin],
                    mappingTimestamp: [this.eolTestingArr?.vehicleModel?.createdOn],
                    gprsTimestamp: [+this.systemTime],
                    ignitionTimestamp: [this.eolTestingArr?.lastIgnitionTimeStamp],
                    vehicleInsidePlant: [this.vehicleInsidePlantBool],
                    status: [this.status],
                    // lastSosTriggered: [+this.sosDate]
                    // SOS:[this.eolTestingArr?.vehicleState?.sosStatus]

                  })

                  try {
                    const res: any = await this.eolTesting.putEolAudit(obj.value)
                    if (res.status === 200 || res.status === 204) {

                      this.deviceIntegration();

                    }

                  } catch (err) {
                    console.log(err)
                  }
        }
        else {
          this.status = "NG"
        }
      } catch (err) {
        console.error(err)
        // alert(err.error.message)
      }

    } catch (err) {
      console.error(err)
      this.deviceLinkingLight = 2;
      this.gprsLight = 2;
      this.ignitionDataLight = 2;
      this.gpsLight = 2;
      this.insidePlantLight = 2;
      this.sosBtnLight = 2;
      this.showTimer = true;

      this.intervalId = setInterval(() => {
        this.timerVar--;
        if (this.timerVar == 0) {
          clearInterval(this.intervalId)
          this.deviceLinkingLight = 0;
          this.gprsLight = 0;
          this.ignitionDataLight = 0;
          this.gpsLight = 0;
          this.insidePlantLight = 0;
          this.sosBtnLight = 0;
          this.eolTestingArr = [];
          this.showTimer = false;
          this.searchFormName.patchValue('');
        }
        // console.log('timer',this.timerVar)
      }, 1000)
      // alert(err.error.message)
    }
  }







  deviceId() {
    this.toggle = false;
  }

  vechileId() {
    this.toggle = true;
  }


  //////////////////////////haversine formula
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  // printt() {
  //  document.getElementById("printButton").click();
  // }

  async deviceIntegration() {
    let obj = this.fb.group({
      deviceSerialNumber: [this.eolTestingArr?.vehicleModel?.deviceSerialNumber],
      vehicleUIN: 'GARBAGEVEHICLE',
      engineNumber: [''],


    })
    try {
      const res: any = await this.eolTesting.deviceIntegration(obj.value)
      if (res.status === 200 || res.status === 204) {
        $('#exampleModal').modal('show')

        setTimeout(() => {

          $('#exampleModal').modal('hide');



        }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  }


}
