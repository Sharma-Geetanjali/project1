import { Component, OnInit } from '@angular/core';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { HeaderService } from 'src/app/Services/header/header.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {

  imgPath = this.global.imgPath;
  filterForm: FormGroup;
  startDate = new Date();
  navChipsPath: any; /////////////////////array that stores all navs strings
  fullNavPath:any;  ///////////////////////string that stores full path of particular page
  arr: Array<any> = [];
  today = new Date();


  constructor(public login: LoginServiceService,
    public global: GlobalConfigService,
    public headerS: HeaderService,
    private fb: FormBuilder,
    private router: Router) {
    this.startDate.setHours(0, 0, 0);
    this.router.events.subscribe((el: NavigationEnd) => {
      setTimeout(() => {
        this.clearDate();
      }, 400);
    })
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.arr = [];
        this.fullNavPath = val.urlAfterRedirects
        // console.log(val)
        this.navChips();
        this.updateDate();
      }
    });
  }



  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    })
    this.clearDate();

    this.headerS.startDate$.subscribe((val) => {
      this.filterForm.patchValue({
        fromDate: val
      });
    })

    this.headerS.endDate$.subscribe((val) => {
      this.filterForm.patchValue({
        toDate: val
      });
    })

  }

  navChips() {
    this.navChipsPath = this.fullNavPath.slice(10).split('/').filter((el)=>el != '');
    this.navChipsPath.forEach(el => {
      let index = this.fullNavPath.indexOf(el)
      this.arr.push({
        breadcrumbString:el.split('-').join(' '),
        path: `${this.fullNavPath.slice(0,index)}${el}`
      })
    });

    // console.log(this.arr)
  }

  logout() {
    this.login.removeJwt()
  }

  reload() {
    window.location.reload();
  }

  getchnage(val) {
    // console.log(val)
  }

  clearDate() {
    // this.startDate.setHours(0, 0, 0, 0);

    this.filterForm.patchValue({
      fromDate: this.startDate,
      toDate: new Date()
    });
  }

  updateDate() {
    this.today = new Date();
    // console.log('asdsadasdsadsadbjasdb')
  }

  expandSideNav(){
    this.login.isExpanded = !this.login.isExpanded
    console.log(this.login.isExpanded)
  }


}
