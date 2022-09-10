import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddDeviceService } from 'src/app/Services/addDevice/add-device.service';
import { ConsignorService } from 'src/app/Services/departments/consignor/consignor.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';

declare var $: any;


@Component({
  selector: 'app-consignor',
  templateUrl: './consignor.component.html',
  styleUrls: ['./consignor.component.css']
})
export class ConsignorComponent implements OnInit {

  filterForm: FormGroup;
  offset = 0;
  size: number = 100;
  paramObj = null;
  consignorArr: any = [];
  numberFilter: any = [];
  imgPath = this.global.imgPath;
  currCode;
  currName
  successMsg = 'Downloaded Successfully';
  statusMsg = '';
  sampleDownloadUrl= "assets/consignor-data-sample.xlsx";
 
  constructor(private changeDetection: ChangeDetectorRef, private fb: FormBuilder, private deviceService: AddDeviceService, private spinner: NgxSpinnerService, private global: GlobalConfigService, public login: LoginServiceService, private consignor: ConsignorService, private url: UrlServiceService) { }
  fileArr: Array<File> = [];
  dropZoneMessage = 0;
  

  ngOnInit(): void {
    console.log(window.location.hostname)

    
    
    this.filterForm = this.fb.group({
      consignorCode: [''],
    })

    this.getConsignor();

    // this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
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

  get consignorCode() { return this.filterForm.get('consignorCode'); }

  async getConsignor() {

    this.spinner.show();

    if (this.consignorCode.value) {
      this.paramObj = {
        code: this.consignorCode.value
      }
    }
    else {
      this.paramObj = {
        offset: this.offset,
        size: this.size
      }
    }

    try {
      const res: any = await this.consignor.getConsignor(this.paramObj);
      this.changeDetection.detectChanges();
      this.changeDetection.markForCheck();
      if (this.offset == 0) {
        this.consignorArr = res;
      } else {
        this.consignorArr = this.consignorArr.concat(res);
      }
      this.offset = this.offset + this.size
      this.spinner.hide();
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
  }

  search() {
    this.offset = 0;
    this.getConsignor();
  }

  getCode(code,name) {

    this.currCode = code;
    this.currName = name
  }

  async deleteConsignor() {
    try {
      const res: any = await this.consignor.deleteConsignor(this.currCode);
      $('#errorInput').modal('show');

    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }
  }

   closeModal() {
    $('#errorInput').modal('hide');
    console.log("kartik")
    window.location.reload()
    console.log("ka")
     
   }

   downloadSampleExcel(){
    
    window.open(this.sampleDownloadUrl,'_blank');
  }


  downloadReport() {

    if (this.consignorArr.length > 0) {

      let token = localStorage.getItem('auth_key_Carot');
      let access_token = token.replace('bearer ', '');

      // console.log(token)


      let apiUrl = this.url.apiV2url + `dm/download/CONSIGNOR?access_token=${access_token}`


      window.open(apiUrl, '_blank');

    }

  }

  async uploadExcel() {
    let obj = new FormData()
    obj.append('file', this.fileArr[0], this.fileArr[0].name)
    // obj.append('filename',this.fileArr[0].name)
    try {
      const res: any = await this.consignor.uploadExcel(obj)
      // console.log(res)
      // alert('successfully Uploaded')
      $('#exampleModal').modal('hide')
      $('#successModal').modal('show');

    } catch (err) {
      console.log(err.description)
      // alert(err.message);
      // this.dropZoneMessage = 0;
      // this.statusMsg = err.description;
      // $('#exampleModal').modal('hide')
      // $('#errorModal').modal('show');

      // this.fileArr = [];

    }

    // console.log(this.searchText)

  }

}
