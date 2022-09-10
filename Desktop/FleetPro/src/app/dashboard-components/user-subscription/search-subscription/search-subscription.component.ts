import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { SubscriptionService } from 'src/app/Services/subscription/subscription.service';


declare var $: any;


@Component({
  selector: 'app-search-subscription',
  templateUrl: './search-subscription.component.html',
  styleUrls: ['./search-subscription.component.css']
})
export class SearchSubscriptionComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private global: GlobalConfigService, private fb: FormBuilder, public login: LoginServiceService, private subscription: SubscriptionService) { }


  successMsg = 'Deleted Successfully';
  statusMsg = '';
  filterForm: FormGroup;
  subscriptionArr: any = [];
  imgPath = this.global.imgPath;
  emailFlag: Boolean = true;
  deviceSerialFlag: Boolean = true;
  subIdFlag: Boolean = true;
  selectedIndex: any;

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchInput: ['', Validators.required],
      searchBy: ['email']
    })


    this.searchInput.valueChanges.subscribe(() => {
      if (this.searchInput.value.trim() == '') {
        this.emailFlag = true;
        this.deviceSerialFlag = true;
        this.subIdFlag = true;
      }
      // console.log(this.emailFlag, "sub")
    })
  }

  get searchInput() {
    return this.filterForm.get('searchInput');
  }

  get searchBy() {
    return this.filterForm.get('searchBy');
  }






  async search() {

    if (this.searchInput.value.trim() == '') {
      return 0;
    }

    if (this.searchBy.value == 'email') {
      this.emailFlag = this.validateEmail(this.searchInput.value.trim())
      // console.log(this.emailFlag)
      if (!this.emailFlag) {
        return 0
      }
    }

    if (this.searchBy.value == 'deviceSerialNo') {
      this.deviceSerialFlag = this.validateSubID(this.searchInput.value.trim())
      // console.log(this.emailFlag)
      if (!this.deviceSerialFlag) {
        return 0
      }
    }

    if (this.searchBy.value == 'subscriptionId') {
      this.subIdFlag = this.validateSubID(this.searchInput.value.trim())
      // console.log(this.emailFlag)
      if (!this.subIdFlag) {
        return 0
      }
    }
    // console.log(this.searchInput.value.trim());
    // console.log(this.searchBy.value)


    try {
      this.spinner.show();
      const res: any = await this.subscription.getSubscription(this.searchInput.value.trim(), this.searchBy.value)
      this.subscriptionArr = res;
      console.log(this.subscriptionArr)
      this.spinner.hide();
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
      // this.statusMsg = '';
      this.statusMsg = err.error.message;
      $('#errorModal').modal('show');
      this.subscriptionArr = [];
    }

  }


  async deleteSub(subId) {
    $('#exampleModal').modal('hide');
    try {
      this.spinner.show()
      let res: any = await this.subscription.deleteSubscription(subId);
      // console.log(res)
      this.spinner.hide();
      $('#successModal').modal('show');
      // this.ngOnInit();
      this.subscriptionArr.splice(this.selectedIndex, 1)
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
      // this.statusMsg = '';
      this.statusMsg = err.error.message;
      $('#errorModal').modal('show');
    }
    // console.log(subId)
  }



  selectedSub(i) {
    this.selectedIndex = i;
  }


  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateSubID(id) {
    const re = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
    return re.test(String(id).toLowerCase());
  }

}
