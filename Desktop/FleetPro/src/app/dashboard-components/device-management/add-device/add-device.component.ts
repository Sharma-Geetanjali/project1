import { Component, OnInit,ViewChild,Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { utf8Encode } from '@angular/compiler/src/util';
import { AddDeviceService } from 'src/app/Services/addDevice/add-device.service';
import { MatInput } from '@angular/material/input';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';



declare var $: any;


@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar,private fb: FormBuilder, private deviceService: AddDeviceService,private spinner: NgxSpinnerService,public Global: GlobalConfigService) {

   }

  fileArr: Array<File> = [];
  addFormGroup;
  addScanData;
  imeiForm;
  dropZoneMessage = 0;
  scanImei = null;
  @ViewChild('imeiNo') nameInput: MatInput;
  @ViewChild('qrCode') qrInput: MatInput;

  imgPath = this.Global.imgPath
  imeiFlag = false;
  qrFlag = false;
  @Input() disabled = true;

  ngOnInit(): void {
    this.addFormGroup = this.fb.group({
      deviceType: ['', [Validators.required]],
      modelCode: ['', [Validators.required]],
      firmWare: ['', [Validators.required]],
      customerCode: ['', [Validators.required]],
      serialNumber: ['', [Validators.required]],
      deviceMode: ['', [Validators.required]],
      isDummy: ['', [Validators.required]],
      simStatus: ['', [Validators.required]],
      simNumber: ['', [Validators.required]],
      phnoneNumber: ['', [Validators.required]],
      dealerCode: ['', [Validators.required]],
      imei: ['', [Validators.required]],
      protocol: ['', [Validators.required]],
      networkOperator: ['', [Validators.required]],
      deviceCurrentState: ['', [Validators.required]],
      deviceMarketingBundle: ['', [Validators.required]],
    });

    this.addScanData = this.fb.group({
      QrField: [''],
      deviceType: ['', [Validators.required]],
      modelCode: ['', [Validators.required]],
      firmWare: ['', [Validators.required]],
      customerCode: ['', [Validators.required]],
      serialNumber: ['', [Validators.required]],
      deviceMode: ['', [Validators.required]],
      isDummy: ['', [Validators.required]],
      simStatus: ['', [Validators.required]],
      simNumber: ['', [Validators.required]],
      phnoneNumber: ['', [Validators.required]],
      dealerCode: ['', [Validators.required]],
      protocol: ['', [Validators.required]],
      networkOperator: ['', [Validators.required]],
      deviceCurrentState: ['', [Validators.required]],
      deviceMarketingBundle: ['', [Validators.required]],
    });

    this.imeiForm = this.fb.group({
      imeiField: ['',[Validators.required]]
    })

    setTimeout(() => {
    this.nameInput.focus();
    }, 1);

    this.imeiField.valueChanges.subscribe(() => { this.countInput() })
    this.QrField.valueChanges.subscribe(() => { this.getValueFromImei() });
    this.disableScanForm();

  }



  // getters

  get deviceType() { return this.addFormGroup.get('deviceType') };
  get modelCode() { return this.addFormGroup.get('modelCode') };
  get firmWare() { return this.addFormGroup.get('firmWare') };
  get customerCode() { return this.addFormGroup.get('customerCode') };
  get serialNumber() { return this.addFormGroup.get('serialNumber') };
  get deviceMode() { return this.addFormGroup.get('deviceMode') };
  get isDummy() { return this.addFormGroup.get('isDummy') };
  get simStatus() { return this.addFormGroup.get('simStatus') };
  get simNumber() { return this.addFormGroup.get('simNumber') };
  get phnoneNumber() { return this.addFormGroup.get('phnoneNumber') };
  get dealerCode() { return this.addFormGroup.get('dealerCode') };
  get imei() { return this.addFormGroup.get('imei') };
  get protocol() { return this.addFormGroup.get('protocol') };
  get networkOperator() { return this.addFormGroup.get('networkOperator') };
  get deviceCurrentState() { return this.addFormGroup.get('deviceCurrentState') };
  get deviceMarketingBundle() { return this.addFormGroup.get('deviceMarketingBundle') };

  get deviceTypeQr() { return this.addScanData.get('deviceType') };
  get modelCodeQr() { return this.addScanData.get('modelCode') };
  get firmWareQr() { return this.addScanData.get('firmWare') };
  get customerCodeQr() { return this.addScanData.get('customerCode') };
  get serialNumberQr() { return this.addScanData.get('serialNumber') };
  get deviceModeQr() { return this.addScanData.get('deviceMode') };
  get isDummyQr() { return this.addScanData.get('isDummy') };
  get simStatusQr() { return this.addScanData.get('simStatus') };
  get simNumberQr() { return this.addScanData.get('simNumber') };
  get phnoneNumberQr() { return this.addScanData.get('phnoneNumber') };
  get dealerCodeQr() { return this.addScanData.get('dealerCode') };
  // get imei() { return this.addFormGroup.get('imei') };
  get protocolQr() { return this.addScanData.get('protocol') };
  get networkOperatorQr() { return this.addScanData.get('networkOperator') };
  get deviceCurrentStateQr() { return this.addScanData.get('deviceCurrentState') };
  get deviceMarketingBundleQr() { return this.addScanData.get('deviceMarketingBundle') };
  get QrField() { return this.addScanData.get('QrField') };

  get imeiField() { return this.imeiForm.get('imeiField') };




  tabLoadTimes: Date[] = [];

  countInput() {
    // console.log(this.imeiField.value.length)
    if (this.imeiField.value.length >= 15) {
      this.imeiFlag = true;
      // this.qrFlag = false
      setTimeout(() => {
        this.qrInput.focus();
      }, 1);
      this.enableScanForm();
    }
    else {
      this.imeiFlag = false;
      // this.qrFlag = true;
      setTimeout(() => {
        this.nameInput.focus();
        }, 1);
    }

  }


  checkString() {
    if(this.imeiFlag = false) {
      this.QrField.disable()
    }
    // we need to check that questionForm is not undefined (it will be on first check when component is initialized)
    else if (this.imeiFlag = true) {
      this.QrField.enable()
    }
  }

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }


  disableScanForm() {
    this.deviceTypeQr.disable();
    this.modelCodeQr.disable();
  this.firmWareQr.disable();
  this.customerCodeQr.disable();
  this.serialNumberQr.disable();
  this.deviceModeQr.disable();
  this.isDummyQr.disable();
  this.simStatusQr.disable();
  this.simNumberQr.disable();
  this.phnoneNumberQr.disable();
  this.dealerCodeQr.disable();
  // get imei() { return this.addFormGroup.get('imei') };
  this.protocolQr.disable();
  this.networkOperatorQr.disable();
  this.deviceCurrentStateQr.disable();
  this.deviceMarketingBundleQr.disable();
  }

  enableScanForm() {
    this.deviceTypeQr.enable();
    this.modelCodeQr.enable();
  this.firmWareQr.enable();
  this.customerCodeQr.enable();
  this.serialNumberQr.enable();
  this.deviceModeQr.enable();
  this.isDummyQr.enable();
  this.simStatusQr.enable();
  this.simNumberQr.enable();
  this.phnoneNumberQr.enable();
  this.dealerCodeQr.enable();
  // get imei() { return this.addFormGroup.get('imei') };
  this.protocolQr.enable();
  this.networkOperatorQr.enable();
  this.deviceCurrentStateQr.enable();
  this.deviceMarketingBundleQr.enable();
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
    if (event.index == 0) {
      setTimeout(() => {
        this.nameInput.focus();
        }, 1);
}
  }

  async uploadExcel() {
    let obj = new FormData()
    obj.append('file', this.fileArr[0], this.fileArr[0].name)
    // obj.append('filename',this.fileArr[0].name)
    try {
      const res: any = await this.deviceService.uploadExcel(obj)
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
    // console.log(this.QrField.value)

    if (this.QrField.value) {
      // this.qrFlag = true;
      let values = this.QrField.value.split('/')
      if (values.length == 15) {
        this.qrFlag = true;
        this.disableScanForm();

      } else {
      this.qrFlag = false;

      }
      this.deviceTypeQr.setValue(values[0]);
      this.deviceTypeQr.enable();
      this.modelCodeQr.patchValue(values[1]);
      this.firmWareQr.patchValue(values[2]);
      this.customerCodeQr.patchValue(values[3]);
      this.serialNumberQr.patchValue(values[4]);
      this.deviceModeQr.patchValue(values[5]);
      this.isDummyQr.setValue(values[6]);
      this.simStatusQr.patchValue(values[7]);
      this.simNumberQr.patchValue(values[8]);
      this.phnoneNumberQr.patchValue(values[9]);
      this.dealerCodeQr.patchValue(values[10]);
      this.protocolQr.setValue(values[11]);
      this.networkOperatorQr.setValue(values[12]);
      this.deviceCurrentStateQr.patchValue(values[13]);
      this.deviceMarketingBundleQr.setValue(values[14]);
    } else {
      this.qrFlag = false;
    }
  }

  resetAddForm() {
    this.addFormGroup.reset();
    this.addScanData.reset();
    this.nameInput.focus();

  }

  async addManuallySubmit() {

    let obj = {
      deviceType: this.deviceType.value,
      model_code: this.modelCode.value,
      firmware_version: this.firmWare.value,
      customer_code: this.customerCode.value,
      serialNumber: this.serialNumber.value,
      deviceMode: this.deviceMode.value,
      vendorIMEINumber:this.imei.value,
      is_dummy: this.isDummy.value,
      sim_status: this.simStatus.value,
      simNumber: this.simNumber.value,
      simPhoneNumber: this.phnoneNumber.value,
      dealerCode: this.dealerCode.value,
      protocol: this.protocol.value,
      networkOperator: this.networkOperator.value,
      device_current_state: this.deviceCurrentState.value,
      device_marketing_bundle: this.deviceMarketingBundle.value,
      enabled:0

    }
    try {
      this.spinner.show();
      if (this.addFormGroup.valid) {
        console.log(obj)

        const res: any = await this.deviceService.addManuallySubmit(obj);
        this.spinner.hide();
      if (res.status == true) {
        alert('Device successfully added')

        this.addFormGroup.reset();
     }

      }

    } catch (err) {

      this.spinner.hide();
      // this._snackBar.open(err.error.message, 'close', {
      //   duration: 9000,
      //   horizontalPosition: this.horizontalPosition,
      //   verticalPosition: this.verticalPosition,
      //   panelClass: ['my-snack-bar']
      // });
      console.log(err)
      // console.log(res.status)
    }
  }

  async addScanQrCode() {

    let obj = {
      deviceType: this.deviceTypeQr.value,
      model_code: this.modelCodeQr.value,
      firmware_version: this.firmWareQr.value,
      customer_code: this.customerCodeQr.value,
      serialNumber: this.serialNumberQr.value,
      deviceMode: this.deviceModeQr.value,
      is_dummy: this.isDummyQr.value,
      sim_status: this.simStatusQr.value,
      simNumber: this.simNumberQr.value,
      simPhoneNumber: this.phnoneNumberQr.value,
      dealerCode: this.dealerCodeQr.value,
      protocol: this.protocolQr.value,
      networkOperator: this.networkOperatorQr.value,
      device_current_state: this.deviceCurrentStateQr.value,
      device_marketing_bundle: this.deviceMarketingBundleQr.value

    }
    try {
      if (this.addScanData.valid) {
      this.spinner.show();
      const res: any = await this.deviceService.addManuallySubmit(obj);
      this.spinner.hide();
        if (res.status == true) {
          alert('Device successfully added')
          this.addScanData.reset();
          this.disableScanForm();
          setTimeout(() => {
            this.nameInput.focus();
            }, 1);

        }
      }

    } catch (err) {
      this.spinner.hide();
      console.log(err)
    }
  }

}
