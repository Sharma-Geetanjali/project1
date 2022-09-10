import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoutesService } from 'src/app/Services/departments/routes/routes.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';

declare var $: any;
@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;

  filterForm: FormGroup;
  offset = 0;
  size: number = 100;
  paramObj = null;
  routesArr: any = [];
  numberFilter: any = [];
  imgPath = this.global.imgPath;
  routeId: any;
  routeMasterId: any;
  successMsg = 'Downloaded Successfully';
  statusMsg = '';

  constructor(private changeDetection: ChangeDetectorRef,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private global: GlobalConfigService,
    public login: LoginServiceService,
    private routes: RoutesService,
    private url: UrlServiceService,
    private router: Router,
    private sharing: SharingService
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      consignorCode: [''],
      consigneeCode: [''],

    })

    this.getRoutes();

    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
  }

  get consignorCode() { return this.filterForm.get('consignorCode'); }
  get consigneeCode() { return this.filterForm.get('consigneeCode'); }


  async getRoutes() {

    this.spinner.show();
    this.paramObj = {
      offset: this.offset,
      size: this.size
    }

    if (this.consigneeCode.value) {
      this.paramObj['consigneeCode'] = this.consigneeCode.value;
    }

    if (this.consignorCode.value) {
      this.paramObj['consignorCode'] = this.consignorCode.value;
    }

    try {
      const res: any = await this.routes.getRoutes(this.paramObj);
      this.changeDetection.detectChanges();
      this.changeDetection.markForCheck();
      if (this.offset == 0) {
        this.routesArr = res;
      } else {
        this.routesArr = this.routesArr.concat(res);
      }
      // console.log(this.routesArr)
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
    this.getRoutes()
    this.filterCount()
  }

  filter() {
    this.menu.closeMenu();
    this.changeDetection.detectChanges();

    this.changeDetection.markForCheck();
    this.offset = 0;
    this.getRoutes();
  }


  filterCount() {

    if (this.consignorCode.value != "") {
      const isLargeNumber = (element) => element == 'consignorCode';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('consignorCode')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('consignorCode')
      }
    }

    if (this.consigneeCode.value != "") {
      const isLargeNumber = (element) => element == 'consigneeCode';
      let val = this.numberFilter.findIndex(isLargeNumber);
      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('consigneeCode')
      }
      else {
        this.numberFilter.splice(val, 1)
        this.numberFilter.push('consigneeCode')
      }
    }
  }

  reomveFilter() {
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();

    this.clearconsigneeCode();
    this.clearconsignorCode();

    this.offset = 0;
    this.getRoutes()
  }

  clearAll() {
    this.changeDetection.markForCheck();
    this.changeDetection.detectChanges();

    this.clearconsigneeCode();
    this.clearconsignorCode();
  }


  clearconsignorCode() {
    this.consignorCode.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'consignorCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  clearconsigneeCode() {
    this.consigneeCode.patchValue('')
    this.offset = 0;
    // this.getConsignmentReport();
    let el = (element) => element == 'consigneeCode';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }


  downloadReport() {

    if (this.routesArr.length > 0) {

      let dispatchCode, receiverCode;

      let consigneeCodeParam = 'consigneeCode=';
      let consignorCodeParam = 'consignorCode=';


      if (this.consignorCode.value) {
        dispatchCode = this.consignorCode.value
      } else {
        dispatchCode = '';
        consignorCodeParam = '';
      }
      if (this.consigneeCode.value) {
        receiverCode = this.consigneeCode.value
      } else {
        receiverCode = '';
        consigneeCodeParam = '';
      }

      let token = localStorage.getItem('auth_key_Carot');
      let access_token = token.replace('bearer ', '');

      // console.log(token)

      let apiUrl = this.url.apiV2url + `rm/download?${consignorCodeParam}${dispatchCode}&${consigneeCodeParam}${receiverCode}&access_token=${access_token}`


      window.open(apiUrl, '_blank');

    }

  }

  editRoute(data) {
    let editData = data;
    this.sharing.setspecificRouteData(data);
    if (editData.routeMappingModel[0].routeId == '') {
      this.router.navigate([`/dashboard/departments/Edit-Route/${editData.routeMappingModel[0].id}/null/${editData.routeMappingModel[0].routeMasterId}`])
    } else {
      this.router.navigate([`/dashboard/departments/Edit-Route/${editData.routeMappingModel[0].id}/${editData.routeMappingModel[0].routeId}/${editData.routeMappingModel[0].routeMasterId}`])
  }
  }

  getCode(routeMasterId,routeId) {
    // console.log(routeMasterId,routeId)
    this.routeMasterId = routeMasterId;
    this.routeId = routeId

  }

  async deleteRoute() {
    try {
      const res: any = await this.routes.deleteRoute(this.routeMasterId,this.routeId);
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

}
