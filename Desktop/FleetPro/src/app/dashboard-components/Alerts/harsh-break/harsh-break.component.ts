
import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'src/app/Services/alerts/alert.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from 'src/app/Services/header/header.service';
import { Subscription } from 'rxjs';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';



@Component({
  selector: 'app-harsh-break',
  templateUrl: './harsh-break.component.html',
  styleUrls: ['./harsh-break.component.css']
})
export class HarshBreakComponent implements OnInit,OnDestroy {

  imgPath = this.global.imgPath;
  filterForm: FormGroup;
  @Input() paramObj = {};
  offset = 0;
  Size = 50;
  maxDate = new Date();
  startDate = new Date();
  alertArr: any = [];
  subscription: Subscription;
  toggleMap = false;
  singleVehicleData;



  constructor(public login: LoginServiceService,
    public global: GlobalConfigService,
    private spinner: NgxSpinnerService,
    public alertService: AlertService,
    public fb: FormBuilder,
    public headerS: HeaderService,
    public theme: ThemeServiceService
  ) {
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0);
      }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    })
    this.clearDate();
    this.subscription = this.headerS.filterForm$.subscribe((val) => {
      this.offset = 0;
      this.Size = 50;
      this.getEvent();

    });

    this.getEvent();

  }
  ngOnDestroy() {
    // this.headerS.endDate$._su
    // clearInterval(this.intervalId)
    this.subscription.unsubscribe();
  }

  clearDate() {
    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }

  async getEvent() {
    this.spinner.show();
    try {
      this.paramObj['offset'] = this.offset;
      this.paramObj['size'] = this.Size;
      this.paramObj['eventTypes'] = 'HARD_DECELERATION';


      const res: any = await this.alertService.getEventsData(this.paramObj);
      if (this.offset == 0) {
        this.alertArr = res;
      } else {
        this.alertArr = this.alertArr.concat(res);
      }
      this.offset = this.offset + this.Size;
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  toggleBtn(val) {
    this.toggleMap = true;
    this.singleVehicleData = val;
    console.log(this.singleVehicleData)
  }


  toggleBtn1() {
    this.toggleMap = false;
  }

}


