import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { SubscriptionService } from 'src/app/Services/subscription/subscription.service';


declare var $: any;

@Component({
  selector: 'app-update-subscription',
  templateUrl: './update-subscription.component.html',
  styleUrls: ['./update-subscription.component.css']
})
export class UpdateSubscriptionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private subscription: SubscriptionService, private spinner: NgxSpinnerService, private global: GlobalConfigService, private fb: FormBuilder, public login: LoginServiceService, private cd: ChangeDetectorRef) { }

  subId;
  successMsg = '';
  statusMsg = '';
  userArr;
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  addedDate: any;
  userId: any;
  cancelPendingRequests$ = new Subject<void>()

  emailSuggestionArr: any = [];


  ngOnInit(): void {
    this.subId = this.route.snapshot.params['subId'];
    // console.log(this.subId);
    this.form = this.fb.group({
      days: ['', Validators.required],
      notify: [false]
    })

    this.form2 = this.fb.group({
      days: ['', Validators.required],
      updateOperation: ['increaseSubscriptionInDays'],
      notify: [false],
      comment: ['', Validators.required]
    })

    this.form3 = this.fb.group({
      id: ['', Validators.required],
      transferOperation: ['newDeviceid'],
      notify: [false],
      comment: ['', Validators.required]
    })
    this.getSubscription();


    this.days2.valueChanges.subscribe(() => {
      if (this.days2.value > 0) {
        if (this.updateOperation.value == 'increaseSubscriptionInDays') {
          this.addedDate = this.addDays(this.userArr.expiryDate, this.days2.value)
        }
        else {
          this.addedDate = this.substractDays(this.userArr.expiryDate, this.days2.value)
        }
        // console.log(this.addedDate)
      }
    })

    this.id.valueChanges.subscribe(() => {
      if (this.transferOperation.value == 'newUserid' && this.id.value.length <= 8) {
        this.emailSuggestionArr = [];
      }
      if (this.transferOperation.value == 'newUserid' && this.id.value.length > 8) {
        this.cancelPendingRequests();
        this.getSearchSuggestion();
      }
    })


  }

  get days() {
    return this.form.get('days');
  }

  get notify() {
    return this.form.get('notify');
  }

  get days2() {
    return this.form2.get('days');
  }

  get notify2() {
    return this.form2.get('notify');
  }

  get comment2() {
    return this.form2.get('comment');
  }

  get id() {
    return this.form3.get('id');
  }

  get notify3() {
    return this.form3.get('notify');
  }

  get comment3() {
    return this.form3.get('comment');
  }

  get updateOperation() {
    return this.form2.get('updateOperation')
  }

  get transferOperation() {
    return this.form3.get('transferOperation')
  }

  async getSubscription() {
    const res: any = await this.subscription.getSubscription(this.subId, 'subscriptionId')
    // console.log(res);
    this.userArr = res[0];
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  substractDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  closeModal() {
    $('#exampleModal').modal('hide');
    this.form.patchValue({
      days: [''],
      notify: false
    })
  }

  closeModal2() {
    $('#successModal').modal('hide');
    this.form.patchValue({
      days: [''],
      notify: false
    })

    this.form2.patchValue({
      days: [''],
      updateOperation: 'increaseSubscriptionInDays',
      notify: false,
      comment: ['']
    })

    this.form3.patchValue({
      id: [''],
      transferOperation: ['newDeviceid'],
      notify: false,
      comment: ['']
    })
    this.ngOnInit();
  }

  async create() {
    // console.log(this.notify.value)
    this.form.markAllAsTouched();
    if (this.days.value < 1 || this.days.value % 1 != 0) {
      return 0;
    }
    if (this.form.valid) {
      $('#exampleModal').modal('hide');
      try {
        this.spinner.show()
        let res: any = await this.subscription.createSubscription(this.userArr.userid, this.days.value, this.notify.value)
        // console.log(res)
        this.spinner.hide()
        this.successMsg = `Created Successfully Subscription ID: ${res.subscriptionId}`;
        $('#successModal').modal('show');
      }
      catch (err) {
        console.log(err)
        this.spinner.hide();
        // this.statusMsg = '';
        this.statusMsg = err.error.message;
        $('#errorModal').modal('show');
      }
    }

  }

  async updateSub() {
    // console.log(this.days2.value)
    // console.log(this.updateOperation.value)
    this.form2.markAllAsTouched();
    if (this.days2.value < 1 || this.days2.value % 1 != 0) {
      return 0;
    }
    if (this.comment2.value.trim() == '') {
      return 0;
    }
    if (this.form2.valid) {
      try {
        this.spinner.show();
        let paramObj = {}
        if (this.updateOperation.value == 'increaseSubscriptionInDays') {
          paramObj = {
            subscriptionId: this.subId,
            increaseSubscriptionInDays: this.days2.value,
            notify: this.notify2.value,
            comment: this.comment2.value.trim()
          }
        }
        else {
          paramObj = {
            subscriptionId: this.subId,
            reduceSubscriptionInDays: this.days2.value,
            notify: this.notify2.value,
            comment: this.comment2.value.trim()
          }
        }
        let res: any = await this.subscription.updateSubscription(paramObj)
        // console.log(res)
        this.spinner.hide()
        if (this.updateOperation.value == 'increaseSubscriptionInDays') {
          this.successMsg = `Extended Successfully`;
        }
        else {
          this.successMsg = `Reduced Successfully`;
        }
        $('#successModal').modal('show');
      }
      catch (err) {
        console.log(err)
        this.spinner.hide();
        // this.statusMsg = '';
        this.statusMsg = err.error.message;
        $('#errorModal').modal('show');
      }
    }
  }

  async transferSub() {
    // console.log(this.id.value)
    // console.log(this.transferOperation.value)
    this.form3.markAllAsTouched();
    if (this.comment3.value.trim() == '') {
      return 0;
    }
    if (this.transferOperation.value == 'newDeviceid') {
      if (!this.validateSubID(this.id.value)) {
        return 0;
      }
    }
    else {
      if (!this.validateEmail(this.id.value)) {
        return 0;
      }
    }
    if (this.form3.valid) {
      try {
        this.spinner.show();
        let paramObj = {}
        if (this.transferOperation.value == 'newDeviceid') {
          paramObj = {
            subscriptionId: this.subId,
            newDeviceSerialNo: this.id.value,
            notify: this.notify3.value,
            comment: this.comment3.value.trim()
          }
        }
        else {
          paramObj = {
            subscriptionId: this.subId,
            newUserid: this.userId,
            notify: this.notify3.value,
            comment: this.comment3.value.trim()
          }
        }
        let res: any = await this.subscription.transferSubscription(paramObj)
        // console.log(res)
        this.spinner.hide()

        this.successMsg = `Transfered Successfully`;

        $('#successModal').modal('show');
      }
      catch (err) {
        console.log(err)
        this.spinner.hide();
        // this.statusMsg = '';
        this.statusMsg = err.error.message;
        $('#errorModal').modal('show');
      }
    }
  }

  setId(val) {
    // console.log(val)
    this.userId = val;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateSubID(id) {
    const re = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
    return re.test(String(id).toLowerCase());
  }

  cancelPendingRequests() {
    this.cancelPendingRequests$.next()
  }


  async getSearchSuggestion() {
    try {
      const res: any = await this.subscription.getSearchSuggestion(this.id.value)
      this.emailSuggestionArr = res;
      // console.log(this.emailSuggestionArr);
      // this.cd.markForCheck();
      // this.cd.detectChanges();
    } catch (err) {
      console.log(err)
    }
  }
}
