import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddDeviceService } from 'src/app/Services/addDevice/add-device.service';


@Component({
  selector: 'app-specific-device-view',
  templateUrl: './specific-device-view.component.html',
  styleUrls: ['./specific-device-view.component.css']
})
export class SpecificDeviceViewComponent implements OnInit {

  maxDate = new Date();
  startDate = new Date();
  filterForm: FormGroup;
  endDate = new Date();
  paramObj = {};
  specificArr: any = [];

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private deviceService: AddDeviceService

  ) {     this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0);}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      filterVehicle: ['']
    })

    this.filterForm.patchValue({
      fromDate: this.startDate  ,
      toDate: new Date()
    });

  }

  back(): void {
    this.location.back()
  }

  clearAll() {
    this.clearDate();
  }

  clearDate() {
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }

  async apply() {

      let SetendTime = this.filterForm.value.toDate;
      this.paramObj = {
        startTime: +this.filterForm.value.fromDate,
        endTime: +SetendTime,
      }

    if (this.filterForm.value.filterVehicle) {
      this.paramObj['deviceId'] = this.filterForm.value.filterVehicle
    }

    console.log(this.paramObj);


    try {
      const res: any = await this.deviceService.getSpecificDevice(this.paramObj);
      this.specificArr = res;

    } catch (error) {
      console.log(error)
    }

    console.log(this.paramObj)




  }

}
