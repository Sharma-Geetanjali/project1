import { Component, OnInit } from '@angular/core';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { Router } from '@angular/router';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
declare var $: any;


@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {

  hash;
  token;
  mobile = false;
  signUp: FormGroup;
  login: FormGroup;
  statusMsg = '';

  // submitted = false;
  signupToggle = false;
  constructor(public theme: ThemeServiceService, private fb: FormBuilder, private authorization: LoginServiceService, private router: Router, public global:GlobalConfigService) { }
  imgPath=this.global.imgPath;
  ngOnInit(): void {
    this.signUpForm();
    this.loginForm();
    // if (window.screen.width === 360) { // 768px portrait
    //   this.mobile = true;
    // }
  }

  hide = true;

  loginSelect() {
    this.signupToggle = false;
  }

  signupSelect() {
    this.signupToggle = true;
  }

  signUpForm() {
    this.signUp = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(28)]],
      lastname: ['', [Validators.required, Validators.maxLength(28)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    });
  }

  loginForm() {
    this.login = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      loginPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
    })
  }

  getError(el) {
    switch (el) {
      case 'firstname':
        if (this.signUp.get('firstname').hasError('required')) {
          return 'First Name is mandatory';
        }
        else if (this.signUp.get('firstname').hasError('maxlength')) {
          return 'Max 28 characters required';
        }
        break;
      case 'lastname':
        if (this.signUp.get('lastname').hasError('required')) {
          return 'Last Name is mandatory';
        }
        if (this.signUp.get('lastname').hasError('maxlength')) {
          return 'Max 28 characters required';
        }
        break;
      case 'email':
        if (this.signUp.get('email').hasError('required')) {
          return 'Email is required';
        }
        if (this.signUp.get('email').hasError('email')) {
          return 'Enter a valid email';
        }
        if (this.signUp.get('email').hasError('maxlength')) {
          return 'Length should not exceed 100 characters.';
        }
        break;
      case 'phone':
        if (this.signUp.get('phone').hasError('required')) {
          return 'Phone number is mandatory.';
        }
        if (this.signUp.get('phone').hasError('minlength')) {
          return 'Phone number should be min of 10 digits.';
        }
        if (this.signUp.get('phone').hasError('maxlength')) {
          return 'Phone number should be max of 10 digits.';
        }
        if (this.signUp.get('phone').hasError('pattern')) {
          return 'Phone number should be a number.';
        }
        break;
      case 'password':
        if (this.signUp.get('password').hasError('required')) {
          return 'Password is mandatory.';
        }
        if (this.signUp.get('password').hasError('minlength')) {
          return 'Password should be min of 8 characters';
        }
        if (this.signUp.get('password').hasError('maxlength')) {
          return 'Password should be max of 20 characters';
        }
        break;
      case 'loginEmail':
        if (this.login.get('loginEmail').hasError('required')) {
          return 'Email is required';
        }
        if (this.login.get('loginEmail').hasError('email')) {
          return 'Enter a valid email';
        }
        if (this.login.get('loginEmail').hasError('maxlength')) {
          return 'Length should not exceed 100 characters.';
        }
        break;
      case 'loginPassword':
        if (this.login.get('loginPassword').hasError('required')) {
          return 'Password is mandatory.';
        }
        if (this.login.get('loginPassword').hasError('minlength')) {
          return 'Password should be min of 4 characters';
        }
        if (this.login.get('loginPassword').hasError('maxlength')) {
          return 'Password should be max of 20 characters';
        }
        break;

      default:
        return '';
    }
  }

  async loginSubmmit() {
    this.hash = Md5.hashStr(this.login.controls['loginPassword'].value);
    let obj = {
      grant_type: 'password',
      password: this.hash,
      username: this.login.controls['loginEmail'].value,

    }
    try {
      if (this.login.valid) {
        const res: any = await this.authorization.login(obj);

        this.token = res.aaccess_token;
        this.authorization.setJwt(res.access_token);

        this.router.navigateByUrl('/dashboard');

      }

    } catch (err) {
      this.statusMsg = '';
      this.statusMsg = err.error.error_description;
  $('#errorInput').modal('show');

      // alert(err.error.error_description)
    }

  }

  async getCurrentUser() {
    try {
      const res: any = await this.authorization.getCurrentUser();
      if (res) {
      this.authorization.setInfo(res);

      }
      alert('currrent APi')
    } catch (err) {
      console.log(err);
    }
  }


  async getResourceAccess() {
    try {
      const res: any = await this.authorization.getResourceAccess();
    } catch (err) {
      console.log(err);
    }
  }









}
