import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { BuzzListService } from 'src/app/Services/App-marketing/buzz-list.service';
import { Router } from '@angular/router';
import { Console } from 'console';

declare var $: any;



@Component({
  selector: 'app-app-marketing',
  templateUrl: './app-marketing.component.html',
  styleUrls: ['./app-marketing.component.css']
})
export class AppMarketingComponent implements OnInit {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;
  offset: number = 0;
  Size: number = 100;
  buzzListArr: any = [];
  addDeviceForm: FormGroup;
  fileArr;
  fileFlag:boolean = false;
  fileName;
  selectedMedia;
  buzzFile;
  linkFlag: Boolean = false;

  constructor(public login: LoginServiceService,
    private buzz: BuzzListService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {


    this.addDeviceForm = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      mediaType: ['', Validators.required],
      link: [''],


    });

    this.getBuzzDevice();
    this.mediaType.valueChanges.subscribe(() => {
      this.onTypeChange();
    })
  }


  get type() { return this.addDeviceForm.get('type'); }
  get title() { return this.addDeviceForm.get('title'); }
  get description() { return this.addDeviceForm.get('description'); }
  get mediaType() { return this.addDeviceForm.get('mediaType'); }
  get link() { return this.addDeviceForm.get('link'); }











  async getBuzzDevice() {
    let dataObj = {
      offset: this.offset,
      size: this.Size,
    }

    try {
      const res: any = await this.buzz.getBuzzList(dataObj);
      // this.dealerBillArr = res;
      if (this.offset == 0) {
        this.buzzListArr = res;

      } else {
        this.buzzListArr = this.buzzListArr.concat(res);

      }
      this.offset = this.offset + this.Size
      console.log(res);

    } catch (error) {
      console.log(error);
    }
  }









  async updateBuzz(data,status) {
    let fd = new FormData();
    fd.append('id', data.id);
    fd.append('status' ,status);
    try {
      const res: any = await this.buzz.updateBuzz(fd)
      this.reloadCurrentRoute();
    } catch (err) {
      console.error(err)
      alert(err.error.message)
    }

    // console.log(this.searchText)

  }


reloadCurrentRoute() {
  const currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}


  fileChange(files: any) {
  console.log('sdfdf')
  this.fileArr = files.files[0];
  this.fileFlag = true
    this.fileName = files.files[0].name;
  }

  async createBuzz() {
    let fd = new FormData();
    fd.append('type' ,this.type.value);
    fd.append('title', this.title.value);
    fd.append('description', this.description.value);
    fd.append('mediaType', this.mediaType.value);
    fd.append('status', 'UNPUBLISHED');

    if (this.link.value) {
      fd.append('mediaLink' ,this.link.value);
    }

    if (this.fileArr && this.fileFlag == true) {
      fd.append('file' ,this.fileArr);
    }
    try {
      const res: any = await this.buzz.updateBuzz(fd)
      this.reloadCurrentRoute();
    } catch (err) {
      console.error(err)
      alert(err.error.message)
    }

    // console.log(this.searchText)

  }


  onTypeChange() {
    console.log(this.mediaType.value)
    if (this.mediaType.value == 'VIDEO') {
      this.linkFlag = true;

    } else {
      this.linkFlag = false;
    }
  }





}

