

import { Component, OnInit,ViewChild } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { utf8Encode } from '@angular/compiler/src/util';
import { AddDeviceService } from 'src/app/Services/addDevice/add-device.service';
import { MatInput } from '@angular/material/input';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';



declare var $: any;


@Component({
  selector: 'app-map-device',
  templateUrl: './map-device.component.html',
  styleUrls: ['./map-device.component.css']
})
export class MapDeviceComponent implements OnInit {

  constructor(private fb: FormBuilder, private deviceService: AddDeviceService,private spinner: NgxSpinnerService,public Global: GlobalConfigService) {

   }

  fileArr: Array<File> = [];
  addFormGroup;
  addScanData;
  dropZoneMessage = 0;
  scanImei = null;
  @ViewChild('imeiNo') nameInput: MatInput;
  imgPath = this.Global.imgPath

  ngOnInit(): void {
    this.addFormGroup = this.fb.group({
      serialNumber: ['', [Validators.required]],
      simNumber: ['', [Validators.required]],
      phnoneNumber: ['', [Validators.required]],
      networkOperator: ['', [Validators.required]],

    });


    setTimeout(() => {
    this.nameInput.focus();
    }, 1);


  }



  // getters

  get serialNumber() { return this.addFormGroup.get('serialNumber') };
  get simStatus() { return this.addFormGroup.get('simStatus') };
  get simNumber() { return this.addFormGroup.get('simNumber') };
  get phnoneNumber() { return this.addFormGroup.get('phnoneNumber') };
  get networkOperator() { return this.addFormGroup.get('networkOperator') };
  get serialNumberQr() { return this.addScanData.get('serialNumber') };
  get simNumberQr() { return this.addScanData.get('simNumber') };
  get phnoneNumberQr() { return this.addScanData.get('phnoneNumber') };
  get networkOperatorQr() { return this.addScanData.get('networkOperator') };




  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
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

            /**
            // You could upload it like this:
            const formData = new FormData()
            formData.append('logo', file, relativePath)

            // Headers
            const headers = new HttpHeaders({
              'security-token': 'mytoken'
            })

            this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
            .subscribe(data => {
              // Sanitized logo returned from backend
            })
            **/

          });
        }
        else {
          this.dropZoneMessage = 2;
          this.fileArr = [];
          // It was a directory (empty directories are added, otherwise only files)
          // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
          // console.log(droppedFile.relativePath, fileEntry);
        }
      }
    }
  }

  onTabChanged(event) {
    this.addFormGroup.reset();

    if (event.index == 0) {
      setTimeout(() => {
        this.nameInput.focus();
        }, 1);
}
  }

  async uploadExcel() {
    let obj = new FormData();
    obj.append('file', this.fileArr[0], this.fileArr[0].name)
    // obj.append('filename',this.fileArr[0].name)
    try {
      const res: any = await this.deviceService.UploadAssociateSim(obj)
      // console.log(res)
      alert('successfully Uploaded')
      // $('#exampleModal').modal('hide')
    } catch (err) {
      console.error(err)
      alert(err.message);
      this.dropZoneMessage = 0;

      // this.fileArr = [];

    }

    // console.log(this.searchText)

  }

  getValueFromImei() {
    if (this.scanImei) {
      let values = this.scanImei.split('/')
      this.serialNumberQr.patchValue(values[0]);
      this.simNumberQr.patchValue(values[1]);
      this.phnoneNumberQr.patchValue(values[2]);
      this.networkOperatorQr.setValue(values[3]);
    }
  }

  resetAddForm() {
    this.addFormGroup.reset();
    this.addScanData.reset();
    this.nameInput.focus();

  }

  async addManuallySubmit() {

    let obj = {
      serialNumber: this.serialNumber.value,
      simNumber: this.simNumber.value,
      simPhoneNumber: this.phnoneNumber.value,
      networkOperator: this.networkOperator.value,


    }
    try {
      this.spinner.show();
      if (this.addFormGroup.valid) {
        console.log(obj)

        const res: any = await this.deviceService.addAssciateSim(obj);
        this.spinner.hide();
      if (res.status == true) {
        alert('Device successfully added')

        this.addFormGroup.reset();
     }

      }

    } catch (err) {
      this.spinner.hide();
      console.log(err)
      // console.log(res.status)
    }
  }

  async addScanQrCode() {

    let obj = {

      serialNumber: this.serialNumberQr.value,

      simNumber: this.simNumberQr.value,
      simPhoneNumber: this.phnoneNumberQr.value,

      networkOperator: this.networkOperatorQr.value,


    }
    try {
      this.spinner.show();
      const res: any = await this.deviceService.addAssciateSim(obj);
      this.spinner.hide();
        if (res.status == true) {
          alert('Device successfully added')
          this.addScanData.reset();
       }
    } catch (err) {
      this.spinner.hide();
      console.log(err)
    }
  }

}

