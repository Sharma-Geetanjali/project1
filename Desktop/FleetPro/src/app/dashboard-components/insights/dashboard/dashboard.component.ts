import { Location } from '@angular/common';
import {
  Component, OnInit, Input, HostListener, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck
} from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { EolReportService } from 'src/app/Services/eol-report/eol-report.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { endianness } from 'os';
import { MatEndDate } from '@angular/material/datepicker';
import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { query } from '@angular/animations';
import { Chart } from 'node_modules/chart.js';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSelectModule } from '@angular/material/select';
// import * as MarkerClusterer from "@google/markerclusterer"
// import MarkerClusterer from '@googlemaps/markerclustererplus';
import { GoogleMapsAPIWrapper, AgmMap } from '@agm/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';








declare var google: any;
declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [DatePipe],
})

// @Input() placeholderLabel = 'Suche';

export class DashboardComponent implements OnInit, DoCheck {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;

  // lat: number = 51.673858;
  // lng: number = 7.815982;
  @Input() max: null;

  eolAuditArr: any = [];
  vehicleListArr: any = [];
  filterData: any = [];
  pipe: DatePipe;
  maxDate = new Date();
  imgPath = this.global.imgPath;
  fileArr: Array<File> = [];
  dropZoneMessage = 0;
  searchText = null;
  startAt;
  endDate = new Date();
  startDate = new Date();
  today = new Date();
  hours = this.today.getHours();
  mint = this.today.getMinutes();
  miliS = this.today.getMilliseconds();
  paramObj = null;
  downloadObj = null;
  selectedValue: string;
  filterForm: FormGroup;
  requestSubmitForm: FormGroup;
  offset = 0;
  Size: number = 50;
  markCode = null;
  // minDate;
  numberFilter: any = [];;
  myChart: any;
  groupListArr: any = [];
  groupIdParentArr: any = [];
  UnqiueGroupID: any = [];
  UnqiueMainGroupID: any = [];
  reagionParam = null;
  mainReagionParam = null;

  filteredArr: any = [];
  mainFilteredArr: any = [];
  paginatedArray: any = [];

  vehicleList = false;
  markerIcon;
  mapsdata: any = [];
  totalVehcile;
  nonLocationVehicle = 0;

  todayDate = new Date();

  previous;
  current_page = 1;
  page_size = 10

  currentPagetable = 1;
  tableSize = 10;
  tablePaginatedArray: any = [];
  dashboardData;

  cardLoadingFlag = true;
  widthExp;

  @ViewChild('AgmMap') agmMap: AgmMap;











  constructor(
    private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public global: GlobalConfigService,
    public location: Location,
    public vehicleReport: VehicleListService,
    private url: UrlServiceService,
    public login: LoginServiceService,
    private fb: FormBuilder,
    public theme: ThemeServiceService
  ) {

    // this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);

    Chart.plugins.register({
      beforeDraw: function (chart) {
        var data = chart.data.datasets[0].data;
        var sum = data.reduce(function (a, b) {
          return Math.round((a / b) * 100);
        });
        var width = chart.chart.width,
          height = chart.chart.height,
          ctx = chart.chart.ctx;
        ctx.restore();
        var fontSize = (height / 4).toFixed(2);
        ctx.font = fontSize + "px Montserrat";
        ctx.textBaseline = "middle";
        var text = sum,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.7;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });




  }





  ngOnInit(): void {

    this.filterForm = this.fb.group({
      region: [''],
      ignitionStatus: [''],
      notInNetwork: [''],
      regionFilter: [''],
    })

    this.requestSubmitForm = this.fb.group({
      driverName: ['', Validators.required],
      driverMobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/)]],
    })
    this.getvehicleStateList();
    this.changeDetection.detectChanges();


    this.getGroupList();
    this.getDahsBoardCount();
    this.onChangeRegion('');
    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
    this.regionFilter.valueChanges.subscribe(() => { this.selectFIlter() });

  }

  ngOnChanges() {
    console.log('chnages')
    this.changeDetection.detectChanges();

  }

  ngDoCheck() {
    if (this.login.isExpanded === true) {
      this.widthExp = 76
    } else if (this.login.isExpanded === false) {
      this.widthExp = 90.5
    }
    this.changeDetection.detectChanges();

  }



  chartOnload() {

    console.log(this.dashboardData)
    this.myChart = new Chart("totalVechileChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 20], // Specify the data values array

          backgroundColor: ['#008ce8', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    });

    //   Chart 2 ///////
    this.myChart = new Chart('connectedVechChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.dashboardData?.inContact, this.dashboardData?.totalVehicles], // Specify the data values array

          backgroundColor: ['#00bcaa', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1
      }
    });
    //   Chart 3 ///////
    this.myChart = new Chart("NotInContactChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.dashboardData.notInNetwork, this.dashboardData?.totalVehicles], // Specify the data values array

          backgroundColor: ['#e03b3b', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1
      }
    });
    //   Chart 4 ///////
    this.myChart = new Chart("loadedChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 40], // Specify the data values array

          backgroundColor: ['#e8b100', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1
      }
    });
    //   Chart 5 ///////
    this.myChart = new Chart("unLoadedChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [5, 10], // Specify the data values array

          backgroundColor: ['#e03b3b', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1
        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1
      }
    });
  }

  get region() { return this.filterForm.get('region'); }
  get ignitionStatus() { return this.filterForm.get('ignitionStatus'); }
  get notInNetwork() { return this.filterForm.get('notInNetwork'); }
  get vehicleName() { return this.requestSubmitForm.get('vehicleName') }
  get issueType() { return this.requestSubmitForm.get('issueType') }
  get issueDescription() { return this.requestSubmitForm.get('issueDescription') }
  get regionFilter() { return this.filterForm.get('regionFilter') }





  clearignitionStatus() {
    this.ignitionStatus.patchValue('')
    let el = (element) => element == 'ignitionStatus';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }
  }
  clearnotInNetwork() {
    this.notInNetwork.patchValue('')
    let el = (element) => element == 'notInNetwork';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
      // this.numberFilter.push('status')


    }
  }

  reomveFilter() {
    this.changeDetection.detectChanges();
    sessionStorage.removeItem("dashboardData");
    localStorage.removeItem("groupData");
    this.clearignitionStatus();
    this.clearnotInNetwork();
    this.getvehicleStateList();

  }


  clearAll() {
    this.changeDetection.detectChanges();
    localStorage.removeItem("groupData");
    sessionStorage.removeItem("dashboardData");
    this.clearignitionStatus();
    this.clearnotInNetwork();
    this.region.patchValue('');
    this.mainReagionParam = this.mainReagionParam.replace(this.mainReagionParam, '');
    this.reagionParam = this.reagionParam.replace(this.reagionParam, '');

    this.getvehicleStateList();

  }

  search() {
    localStorage.removeItem("groupData");
    sessionStorage.removeItem("dashboardData");
    this.offset = 0;
    this.getvehicleStateList()
    this.changeDetection.detectChanges();
  }


  async getvehicleStateList() {
    this.changeDetection.detectChanges();

    this.current_page = 1;
    this.currentPagetable = 1;
    this.paginatedArray = [];
    this.tablePaginatedArray = [];


    try {
      this.spinner.show();


      this.paramObj = {};

      if (this.searchText) {
        this.paramObj['name'] = this.searchText;
      }

      if (this.region.value) {
        this.paramObj['vehicleGroupId'] = this.region.value;
      }

      if (this.ignitionStatus.value) {
        this.paramObj['ignitionStatus'] = this.ignitionStatus.value;
      }
      if (this.notInNetwork.value) {
        this.paramObj['notInContact'] = this.notInNetwork.value;
      }

      if (!sessionStorage.getItem("dashboardData")) {
        const res: any = await this.vehicleReport.getdashboardList(this.paramObj, this.mainReagionParam);
        this.vehicleListArr = res;
        this.totalVehcile = this.vehicleListArr.length;
        this.nonLocationVehicle = 0;
        this.mapsdata = [];
        var listVehicleArray = [];

        for (var i = 0; i < this.vehicleListArr.length; i++) {
          var tempItem = this.vehicleListArr[i];
          listVehicleArray.push({ 'name': tempItem.vehicleName, 'id': tempItem.vehicleId });

          for (var j = 0; j < this.vehicleListArr[i]['vehicleGroups'].length; j++) {
            if (this.vehicleListArr[i]['vehicleGroups'][j]['type'] == 'FIXED') {
              this.vehicleListArr[i].groupName = this.vehicleListArr[i]['vehicleGroups'][j]['name'];
            }
          }
        }
        for (let i = 0; i < res.length; i++) {
          if (res[i].latitude === 0 && res[i].longitude === 0) {
            this.nonLocationVehicle++;
          }
          if (res[i].ignitionStatus) {
            this.mapsdata.push({
              'lat': this.vehicleListArr[i].latitude,
              'lng': this.vehicleListArr[i].longitude,
              'name': this.vehicleListArr[i].vehicleName,
              'address': this.vehicleListArr[i].address,
              'ignition': this.vehicleListArr[i].ignitionStatus,
              'load': this.vehicleListArr[i].loaded,
              'speed': this.vehicleListArr[i].speed,
              'groupName': this.vehicleListArr[i].groupName,
              'date': this.vehicleListArr[i].date,
              'vehicleId': this.vehicleListArr[i].vehicleId,
              'icon': this.theme.onLoaded
            });


          }

          if (!res[i].ignitionStatus) {
            this.mapsdata.push({
              'lat': this.vehicleListArr[i].latitude,
              'lng': this.vehicleListArr[i].longitude,
              'name': this.vehicleListArr[i].vehicleName,
              'address': this.vehicleListArr[i].address,
              'ignition': this.vehicleListArr[i].ignitionStatus,
              'load': this.vehicleListArr[i].loaded,
              'speed': this.vehicleListArr[i].speed,
              'groupName': this.vehicleListArr[i].groupName,
              'date': this.vehicleListArr[i].date,
              'vehicleId': this.vehicleListArr[i].vehicleId,
              'icon': this.theme.offLoaded
            });
          }
          this.changeDetection.detectChanges();


        }


        var listVehicleArray = [];

        this.paginate(this.page_size, this.current_page);
        this.tablePaginate(this.tableSize, this.currentPagetable);
        this.changeDetection.detectChanges();
        this.changeDetection.detectChanges();

        this.cardLoadingFlag = false;
        setTimeout(() => { this.spinner.hide(); }, 500)


        sessionStorage.setItem("dashboardData", JSON.stringify(this.vehicleListArr))

      } else if (sessionStorage.getItem("dashboardData")) {
        this.changeDetection.detectChanges();

        this.vehicleListArr = JSON.parse(sessionStorage.getItem("dashboardData"));
        this.totalVehcile = this.vehicleListArr.length;
        this.nonLocationVehicle = 0;
        this.mapsdata = [];
        var listVehicleArray = [];

        for (var i = 0; i < this.vehicleListArr.length; i++) {
          var tempItem = this.vehicleListArr[i];
          listVehicleArray.push({ 'name': tempItem.vehicleName, 'id': tempItem.vehicleId });

          for (var j = 0; j < this.vehicleListArr[i]['vehicleGroups'].length; j++) {
            if (this.vehicleListArr[i]['vehicleGroups'][j]['type'] == 'FIXED') {
              this.vehicleListArr[i].groupName = this.vehicleListArr[i]['vehicleGroups'][j]['name'];
            }
          }
        }
        for (let i = 0; i < this.vehicleListArr.length; i++) {

          if (this.vehicleListArr[i].latitude === 0 && this.vehicleListArr[i].longitude === 0) {
            this.nonLocationVehicle++;
          }
          if (this.vehicleListArr[i].ignitionStatus && this.vehicleListArr[i].loaded) {
            this.mapsdata.push({
              'lat': this.vehicleListArr[i].latitude,
              'lng': this.vehicleListArr[i].longitude,
              'name': this.vehicleListArr[i].vehicleName,
              'address': this.vehicleListArr[i].address,
              'ignition': this.vehicleListArr[i].ignitionStatus,
              'load': this.vehicleListArr[i].loaded,
              'speed': this.vehicleListArr[i].speed,
              'groupName': this.vehicleListArr[i].groupName,
              'date': this.vehicleListArr[i].date,
              'vehicleId': this.vehicleListArr[i].vehicleId,
              'icon': this.theme.onLoaded
            });


          }
          if (this.vehicleListArr[i].ignitionStatus && !this.vehicleListArr[i].loaded) {
            this.mapsdata.push({
              'lat': this.vehicleListArr[i].latitude,
              'lng': this.vehicleListArr[i].longitude,
              'name': this.vehicleListArr[i].vehicleName,
              'address': this.vehicleListArr[i].address,
              'ignition': this.vehicleListArr[i].ignitionStatus,
              'load': this.vehicleListArr[i].loaded,
              'speed': this.vehicleListArr[i].speed,
              'groupName': this.vehicleListArr[i].groupName,
              'vehicleId': this.vehicleListArr[i].vehicleId,
              'date': this.vehicleListArr[i].date,
              'icon': this.theme.onUnLoaded
            });



          }
          if (!this.vehicleListArr[i].ignitionStatus && this.vehicleListArr[i].loaded) {
            this.mapsdata.push({
              'lat': this.vehicleListArr[i].latitude,
              'lng': this.vehicleListArr[i].longitude,
              'name': this.vehicleListArr[i].vehicleName,
              'address': this.vehicleListArr[i].address,
              'ignition': this.vehicleListArr[i].ignitionStatus,
              'load': this.vehicleListArr[i].loaded,
              'speed': this.vehicleListArr[i].speed,
              'groupName': this.vehicleListArr[i].groupName,
              'date': this.vehicleListArr[i].date,
              'vehicleId': this.vehicleListArr[i].vehicleId,
              'icon': this.theme.offLoaded
            });



          }
          if (!this.vehicleListArr[i].ignitionStatus && !this.vehicleListArr[i].loaded) {
            this.mapsdata.push({
              'lat': this.vehicleListArr[i].latitude,
              'lng': this.vehicleListArr[i].longitude,
              'name': this.vehicleListArr[i].vehicleName,
              'address': this.vehicleListArr[i].address,
              'ignition': this.vehicleListArr[i].ignitionStatus,
              'load': this.vehicleListArr[i].loaded,
              'speed': this.vehicleListArr[i].speed,
              'groupName': this.vehicleListArr[i].groupName,
              'date': this.vehicleListArr[i].date,
              'vehicleId': this.vehicleListArr[i].vehicleId,
              'icon': this.theme.offUnLoaded
            });



          }

          this.changeDetection.detectChanges();

        }
        this.paginate(this.page_size, this.current_page);
        this.tablePaginate(this.tableSize, this.currentPagetable);
        this.changeDetection.detectChanges();


        this.changeDetection.detectChanges();


        // console.log(this.mapsdata)
        this.cardLoadingFlag = false;
        setTimeout(() => { this.spinner.hide(); }, 500)
        sessionStorage.setItem("dashboardData", JSON.stringify(this.vehicleListArr))


      }

    } catch (err) {
      console.log(err);
    }




  }

  nextPage() {
    // if (this.current_page < this.numPages()) {
    this.current_page++;
    console.log('working')
    this.paginate(this.page_size, this.current_page);
    this.changeDetection.detectChanges();

    // }
  }

  numPages() {
    return Math.ceil(this.vehicleListArr.length / this.page_size);
  }

  paginate(page_size, page_number) {
    if (page_number === 1) {
      this.paginatedArray = this.vehicleListArr.slice((page_number - 1) * page_size, page_number * page_size);

    } else {
      this.paginatedArray = this.paginatedArray.concat(
        this.vehicleListArr.slice((page_number - 1) * page_size, page_number * page_size)
      )
    }
    this.changeDetection.detectChanges();

    console.log(this.paginatedArray);
  }


  tablePaginate(size, number) {
    if (number === 1) {
      this.tablePaginatedArray = this.vehicleListArr.slice((number - 1) * size, number * size);

    } else {
      this.tablePaginatedArray = this.tablePaginatedArray.concat(
        this.vehicleListArr.slice((number - 1) * size, number * size)
      )
    }


  }

  nextPageTable() {
    this.currentPagetable++;
    this.tablePaginate(this.tableSize, this.currentPagetable);
  }


  clickedMarker(infowindow) {
    this.changeDetection.detectChanges();

    console.log(infowindow)
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  closeInfoWindow() {
    this.previous.close();
  }



  filter() {
    this.menu.closeMenu();
    this.changeDetection.detectChanges();


    localStorage.removeItem("groupData");
    sessionStorage.removeItem("dashboardData");
    this.getvehicleStateList();
    this.changeDetection.markForCheck();

  }

  getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }

  markerIconUrl() {

  }

  filterCount() {


    if (this.ignitionStatus.value != "") {
      console.log(this.ignitionStatus.value)
      let el = (element) => element == 'ignitionStatus';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('ignitionStatus')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('ignitionStatus')
      }
    }

    if (this.notInNetwork.value != "") {
      console.log(this.notInNetwork.value)
      let el = (element) => element == 'notInNetwork';
      let val = this.numberFilter.findIndex(el);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('notInNetwork')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('notInNetwork')
      }
    }



  }





  async getGroupList() {
    try {
      if (!localStorage.getItem("groupData")) {
        const res: any = await this.vehicleReport.getGroupList();
        this.changeDetection.detectChanges();

        this.groupListArr = res;
        // this.chartOnload();
        console.log(this.groupListArr)
        var vehicleNames = [];
        var list = [];
        var serviceParentList = [];

        for (var i = 0; i < this.groupListArr.length; i++) {
          var item = this.groupListArr[i];
          //groups.push(item.groups); // list all groups
          for (var k = 0; k < item.groups.length; k++) { // iterate over groups
            var group = item.groups[k];
            this.groupIdParentArr.push({
              'groupId': group['groupId'],
              'groupName': group['groupName'],
              'parent': group['parent'],
              'type': group['type']
            });
            for (var i = 0; i < group.vehicles.length; i++) { // iterate over vehicles under each group
              var vehicle = group.vehicles[i];
              list.push(vehicle);
              vehicleNames[vehicle.id] = vehicle.name; // Assign name to each vehicleId
              serviceParentList.push({
                'vehicleId': vehicle.id,
                'district': group.parent
              })
            }
          }
        }

        this.groupIdParentArr.forEach(el => {
          if (this.UnqiueGroupID.indexOf(el.parent) === -1) {
            this.UnqiueGroupID.push(el);
            // console.log(this.UnqiueGroupID)

            this.UnqiueMainGroupID.push(el);
          }
        });
        this.changeDetection.detectChanges();

        this.changeDetection.markForCheck();


        localStorage.setItem("groupData", JSON.stringify(this.groupListArr))

      } else if (localStorage.getItem("groupData")) {
        this.groupListArr = JSON.parse(localStorage.getItem("groupData"));
        // this.chartOnload();
        console.log(this.groupListArr)
        var vehicleNames = [];
        var list = [];
        var serviceParentList = [];

        for (var i = 0; i < this.groupListArr.length; i++) {
          var item = this.groupListArr[i];
          //groups.push(item.groups); // list all groups
          for (var k = 0; k < item.groups.length; k++) { // iterate over groups
            var group = item.groups[k];
            this.groupIdParentArr.push({
              'groupId': group['groupId'],
              'groupName': group['groupName'],
              'parent': group['parent'],
              'type': group['type']
            });
            for (var i = 0; i < group.vehicles.length; i++) { // iterate over vehicles under each group
              var vehicle = group.vehicles[i];
              list.push(vehicle);
              vehicleNames[vehicle.id] = vehicle.name; // Assign name to each vehicleId
              serviceParentList.push({
                'vehicleId': vehicle.id,
                'district': group.parent
              })
            }
          }
        }

        this.groupIdParentArr.forEach(el => {
          if (this.UnqiueGroupID.indexOf(el.parent) === -1) {
            this.UnqiueGroupID.push(el);
            // console.log(this.UnqiueGroupID)
            this.UnqiueMainGroupID.push(el);
          }
        });
        this.changeDetection.detectChanges();

        this.changeDetection.markForCheck();

      }
    } catch (err) {
      console.log(err);
    }



  }

  selectFIlter() {
    this.UnqiueGroupID = this.UnqiueMainGroupID.filter(el => el).filter(el => el.groupName.toLowerCase().indexOf(this.regionFilter.value.toLowerCase()) !== -1)
  }




  onChangeRegion(val) {
    if (val == '' || val == null) {
      this.filteredArr = this.groupIdParentArr;
      this.mainFilteredArr = this.groupIdParentArr;
    } else {
      this.filteredArr = this.tofilterDistrictArr(val);
      this.mainFilteredArr = this.tofilterDistrictArr(val);
    }
  }

  tofilterDistrictArr(currRegion) {
    var output = [];
    for (var i = 0; i < this.groupIdParentArr.length; i++) {
      //console.log(currRegion + '==' + $scope.vehicleGroups.allgroups[i]['parent']);
      if (currRegion == this.groupIdParentArr[i]['parent']) {
        output.push(this.groupIdParentArr[i]);
      }
    }
    return output;
  }


  /* function to get vehicle group and deptt group on region filter selection  */


  applyRegionFilter() {
    var output = [];
    for (var i = 0; i < this.groupIdParentArr.length; i++) {
      var allVgroups = this.groupIdParentArr[i];
      // console.log($scope.selectedVehicleRegion == allVgroups['parent']);
      if (this.region.value == allVgroups['parent']) {
        output.push(allVgroups['groupId']);
      }
    }
    console.log(output)
    return output;
  }

  patchValueSOS(val) {
    this.vehicleName.patchValue(val);
    this.vehicleName.disable();
  }

  async submitRequest() {
    let submitobj = {
      vehicleId: this.vehicleName.value,
      driverName: 'FSCDL driver',
      driverMobileNumber: 9599779344,
      title: this.issueType.value,
      description: this.issueDescription.value
    }

    try {
      const res: any = await this.vehicleReport.submitRequest(submitobj);
      alert('Service request created successfully with ticket #' + res);


    } catch (err) {
      console.log(err)
    }


  }

  async getDahsBoardCount() {
    try {
      const res: any = await this.login.getDahsBoardCount();
      this.dashboardData = res;
      this.chartOnload();
    } catch (error) {

    }
  }


  downloadReport() {

    var notInContact = '';
    if (this.notInNetwork.value) {
      notInContact = '&notInContact=' + this.notInNetwork.value;
    } else {
      notInContact = '';
    }
    var name = '';
    if (this.searchText) {
      name = '&name=' + this.searchText;
    } else {
      name = '';
    }
    var ignitionStatus = '';
    if (this.ignitionStatus.value) {
      ignitionStatus = '&ignitionStatus=' + this.ignitionStatus.value;
    } else {
      ignitionStatus = '';
    }


    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    console.log(token)
    let apiUrl = this.url.apiV2url;
    if (this.searchText) {
      apiUrl = this.url.apiV2url + `vs/download?live=true$${notInContact}${name}${ignitionStatus}&access_token=${access_token}`
    } else {
      apiUrl = this.url.apiV2url + `vs/download?live=true${notInContact}${ignitionStatus}&access_token=${access_token}`

    }

    window.open(apiUrl, '_blank');


  }


  selectVehicleMap() {
    this.vehicleList = false;
    // this.chartOnload();
  }
  selectVehicleList() {
    this.vehicleList = true;
    this.chartOnload();

  }

  getVehicleData(id) {
    let data = this.vehicleListArr.filter(el => {
      return el.vehicleId == id
    });
    // console.log(data);
    // this.vehicleReport.transerData(data)
    localStorage.setItem("vehicleData", JSON.stringify(data[0]));



  }






}


