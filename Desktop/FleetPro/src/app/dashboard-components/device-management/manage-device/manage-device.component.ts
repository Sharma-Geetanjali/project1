import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { OemService } from 'src/app/Services/oem-Device/oem.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;



@Component({
  selector: 'app-manage-device',
  templateUrl: './manage-device.component.html',
  styleUrls: ['./manage-device.component.css']
})
export class ManageDeviceComponent implements OnInit {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;
  offset: number = 0;
  Size: number = 100;
  oemListArr: any = [];
  filterForm: FormGroup;
  addDeviceForm: FormGroup
  numberFilter: any = [];
  fileArr: Array<File> = [];
  dropZoneMessage = 0;
  constructor(public login: LoginServiceService, private oem: OemService, private fb: FormBuilder, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      serialNmmber: [''],
      chassisNumber: [''],

    });

    this.addDeviceForm = this.fb.group({
      deviceNumber: ['',Validators.required],
      engineNumber: ['',Validators.required],
      chassisNo: ['',Validators.required],
    })
    this.getOEMDevice();
    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
  }

  get serialNmmber() { return this.filterForm.get('serialNmmber'); }
  get chassisNumber() { return this.filterForm.get('chassisNumber'); }

  get deviceNumber() { return this.addDeviceForm.get('deviceNumber'); }
  get engineNumber() { return this.addDeviceForm.get('engineNumber'); }
  get chassisNo() { return this.addDeviceForm.get('chassisNo'); }


  filterCount() {

    if (this.serialNmmber.value != "") {
      const isLargeNumber = (element) => element == 'serialNmmber';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('serialNmmber')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('serialNmmber')
      }
    }

    if (this.chassisNumber.value != "") {
      const isLargeNumber = (element) => element == 'chassisNumber';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('chassisNumber')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('chassisNumber')
      }
    }
  }

  reomveFilter() {
    this.clearchassisNumber();
    this.clearserialNmmber();
    this.offset = 0;
    this.getOEMDevice();
  }

  filter() {
    this.menu.closeMenu();

    this.offset = 0;
    this.getOEMDevice();
  }

  clearserialNmmber() {
    this.serialNmmber.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'serialNmmber';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  clearchassisNumber() {
    this.chassisNumber.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'chassisNumber';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  async getOEMDevice() {
    let dataObj = {
      offset: this.offset,
      size: this.Size,
    }

    if (this.chassisNumber.value) {
      dataObj['chassisNumbers'] = this.chassisNumber.value;
    }

    if (this.serialNmmber.value) {
      dataObj['serialNumber'] = this.serialNmmber.value;
    }

    try {
      this.spinner.show();
      const res: any = await this.oem.getOemList(dataObj);
      // this.dealerBillArr = res;
      this.spinner.hide()
      if (this.offset == 0) {
        this.oemListArr = res;

      } else {
        this.oemListArr = this.oemListArr.concat(res);

      }
      this.offset = this.offset + this.Size
      console.log(res);

    } catch (error) {
      this.spinner.hide()
      console.log(error);
    }
  }


  downloadSampleExcel() {
console.log('click')
    let url = ('assets/images/deviceIntegration.xlsx')
    window.open(url, '_blank');

  }


  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;


    if (files.length > 1) {
      this.dropZoneMessage = 2;
      this.fileArr = [];
    }
    else {
      for (const droppedFile of files) {

        // Is it a file?
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {

            // Here you can access the real file
            console.log(droppedFile.relativePath, file);
            console.log("sdfghfgjk")
            console.log(file)
            if (droppedFile.relativePath.split('.').pop() == "xls" || droppedFile.relativePath.split('.').pop() == "xlsx") {
              this.dropZoneMessage = 1;
              this.fileArr = [];
              this.fileArr.push(file)
            }
            else {
              this.dropZoneMessage = 2;
            }


          });
        }
        else {
          this.dropZoneMessage = 2;
          this.fileArr = [];

        }
      }
    }
  }


  modalClose() {
    this.dropZoneMessage = 0;
    this.fileArr = [];
    $('#exampleModal').modal('hide')
  }

  async uploadExcel() {
    console.log('uploaded')
    let obj = new FormData()
    obj.append('file', this.fileArr[0], this.fileArr[0].name)
    // obj.append('filename',this.fileArr[0].name)
    try {
      this.spinner.show();
      const res: any = await this.oem.uploadExcel(obj)
      console.log(res)
      this.spinner.hide();
      alert('successfully Uploaded')
      $('#exampleModal').modal('hide')
    } catch (err) {
      this.spinner.hide();
      console.error(err)
      alert(err.error.message)
    }

    // console.log(this.searchText)

  }


  async addDevice() {
    let obj = {
      deviceSerialNumber: this.deviceNumber.value,
      engineNumber: this.engineNumber.value,
      vehicleUIN: this.chassisNo.value
   }
    try {
      this.spinner.show()
      const res: any = await this.oem.addDevice(obj)
      console.log(res);
      this.spinner.hide()
      $('#addDeviceModal').modal('hide')
    } catch (err) {
      this.spinner.hide()
      console.error(err)
      alert(err.error.message)
    }

    // console.log(this.searchText)

  }

}
