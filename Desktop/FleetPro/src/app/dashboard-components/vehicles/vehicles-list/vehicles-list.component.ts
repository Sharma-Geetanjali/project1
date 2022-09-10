import { Location } from '@angular/common';
import {
  Component, OnInit, Input, HostListener, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck
} from '@angular/core';

import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { UrlServiceService } from 'src/app/Services/Url/url-service.service';
import { LoginServiceService } from 'src/app/Services/login-signup/login-service.service';

import { Chart } from 'node_modules/chart.js';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';
import { NgxSpinnerService } from "ngx-spinner";

import { GoogleMapsAPIWrapper, AgmMap,LatLngBounds } from '@agm/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
import { observable, Observable } from "rxjs";
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { UsernameValidator } from 'src/app/Services/custom-validator/custom-validator.service';
// import { MarkersService } from './markers.service';









declare var google: any;
declare var $: any;


@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [DatePipe],
})


export class VehiclesListComponent implements OnInit {
  @ViewChild('filterMenuTrigger') menu: MatMenuTrigger;
  @ViewChild('AgmMap') agmMap: AgmMap;


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
  dashboardData;

  currentPagetable = 1;
  tableSize = 10;
  tablePaginatedArray: any = [];


  cardLoadingFlag = true;
  mapLoad = false;
  me:any;

  mapsdata$: Observable<any>

  // @ViewChild('AgmMap') agmMap: AgmMap;
  defaultLat = Number(25.799891);
  defaultLng = Number(77.268790);
  defaultZoom:number = 5;











  constructor(
    private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public global: GlobalConfigService,
    public location: Location,
    public vehicleReport: VehicleListService,
    private url: UrlServiceService,
    public login: LoginServiceService,
    private fb: FormBuilder,
    public theme: ThemeServiceService,
    private sharing: SharingService,
    private router: Router,
    public mapsApiWrapper: GoogleMapsAPIWrapper,
    // private markersService: MarkersService
  ) {

    // this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate.setDate(this.maxDate.getDate());
    this.startDate.setHours(0, 0, 0, 0);

    Chart.plugins.register({
      beforeDraw: function (chart) {
        var data = chart.data.datasets[0].data;
        var sum = data.reduce(function (a, b) {
          return Math.round((a / (a + b)) * 100);
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
          textY = height / 1.9;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });




  }
  // ngAfterViewInit() {
  //   // console.log(this.agmMap);
  //   this.agmMap.mapReady.subscribe(map => {
  //     const bounds: LatLngBounds = new google.maps.LatLngBounds();
  //     for (const mm of this.mapsdata) {
  //       bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
  //     }
  //     map.fitBounds(bounds);
  //   });
  // }




  ngOnInit(): void {

    this.filterForm = this.fb.group({
      region: [''],
      district: [''],
      VehicleStatus: [''],
      LoadState: [''],
      ignitionStatus: [''],
      notInNetwork: [''],
      regionFilter: [''],
      districtFilter: ['']
    })

    this.requestSubmitForm = this.fb.group({
      vehicleName: [''],
      issueType: ['', Validators.required],
      issueDescription: ['', [Validators.required, UsernameValidator.frontSpace]],
    })
    this.getvehicleStateList();
    this.changeDetection.detectChanges();

    this.sharing.groupListDataObservable$.subscribe(() => {
      this.getGroupList();

    });
    this.getGroupList();

    this.getDahsBoardCount();
    this.onChangeRegion('');
    this.filterForm.valueChanges.subscribe(() => { this.filterCount() });
    this.regionFilter.valueChanges.subscribe(() => { this.selectFIlter() });
    this.districtFilter.valueChanges.subscribe(() => { this.selectDistrict() });

  }

  ngOnChanges() {
    console.log('chnages')

    this.changeDetection.detectChanges();

  }

 
  

  mapReady(event) {
    console.log(event);
    // this.spinner.hide();

    // this.setCurrentPosition();
  }




  chartOnload() {


    //   Chart 2 ///////
    this.myChart = new Chart("connectedVechChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.dashboardData?.inContact, (this.dashboardData?.totalVehicles - this.dashboardData?.inContact)], // Specify the data values array

          backgroundColor: ['#00bcaa', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1,

        }],

      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1,
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false
        },
      },

    });
    //   Chart 3 ///////
    this.myChart = new Chart("NotInContactChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.dashboardData?.notInNetwork, (this.dashboardData?.totalVehicles - this.dashboardData?.notInNetwork)], // Specify the data values array
          backgroundColor: ['#e03b3b', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1,

        }],

      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1,
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false
        },

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
          weight: 0.1,


        }]
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        },
      }
    });
    //   Chart 5 ///////
    this.myChart = new Chart("unLoadedChart", {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [10, 10], // Specify the data values array

          backgroundColor: ['#e03b3b', '#aeaeae'], // Add custom color background (Points and Fill)
          borderWidth: 0, // Specify bar border width
          weight: 0.1,

        }],
        //   labels: [
        //     'UnLoaded',
        //     'UnLoaded',
        // ],
      },
      options: {
        responsive: false, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        cutoutPercentage: 90,
        aspectRatio: 1,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        },
      }
    });

    this.changeDetection.detectChanges();
  }

  // getters for form

  get region() { return this.filterForm.get('region'); }
  get district() { return this.filterForm.get('district'); }
  get VehicleStatus() { return this.filterForm.get('VehicleStatus'); }
  get LoadState() { return this.filterForm.get('LoadState'); }
  get ignitionStatus() { return this.filterForm.get('ignitionStatus'); }
  get notInNetwork() { return this.filterForm.get('notInNetwork'); }
  get vehicleName() { return this.requestSubmitForm.get('vehicleName') }
  get issueType() { return this.requestSubmitForm.get('issueType') }
  get issueDescription() { return this.requestSubmitForm.get('issueDescription') }
  get regionFilter() { return this.filterForm.get('regionFilter') }
  get districtFilter() { return this.filterForm.get('districtFilter') }





  clearVehicleStatus() {
    this.VehicleStatus.patchValue('')

    let el = (element) => element == 'VehicleStatus';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)

    }
  }



  clearLoadState() {
    this.LoadState.patchValue('')
    let el = (element) => element == 'LoadState';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)
    }
  }

  clearignitionStatus() {
    this.ignitionStatus.patchValue('')
    let el = (element) => element == 'ignitionStatus';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)

    }
  }
  clearnotInNetwork() {
    this.notInNetwork.patchValue('')
    let el = (element) => element == 'notInNetwork';
    let val = this.numberFilter.findIndex(el);
    console.log(val)

    if (val != -1) {
      this.numberFilter.splice(val, 1)

    }
  }

  reomveFilter() {
    this.cardLoadingFlag = true;
    this.sharing.vehicleData = undefined;
    localStorage.removeItem("groupData");
    this.clearVehicleStatus();
    this.clearLoadState();
    this.clearignitionStatus();
    this.clearnotInNetwork();
    this.getvehicleStateList();
    this.changeDetection.detectChanges();

  }


  clearGroup() {
    
    this.district.patchValue('');
    this.region.patchValue('');
    this.onChangeRegion('');
    // this.mainReagionParam = this.mainReagionParam.replace(this.mainReagionParam, '');
    // this.reagionParam = this.reagionParam.replace(this.reagionParam, '');
    // console.log(this.reagionParam);
    // console.log(this.mainReagionParam);
  }

  clearAll() {
    this.cardLoadingFlag = true;
    this.changeDetection.detectChanges();
    localStorage.removeItem("groupData");
    this.sharing.vehicleData = undefined;
    this.clearVehicleStatus();
    this.clearLoadState();
    this.clearignitionStatus();
    this.clearnotInNetwork();
    this.district.patchValue('');
    this.region.patchValue('');
    // console.log(this.reagionParam);
    // console.log(this.mainReagionParam);
    if(this.reagionParam != null){
      this.reagionParam = this.reagionParam.replace(this.reagionParam, '');
    }
    if(this.mainReagionParam != null){
      this.mainReagionParam = this.mainReagionParam.replace(this.mainReagionParam, '');
    }
    // console.log(this.reagionParam);
    // console.log(this.mainReagionParam);

    this.getvehicleStateList();

  }

  search() {
    this.filterVehicleName()
    this.changeDetection.detectChanges();

  }

  filterVehicleName() {
    this.tablePaginatedArray = [];
    if (this.searchText == "") {
      this.vehicleListArr = this.sharing.vehicleData;
    }
    else {
      this.vehicleListArr = this.vehicleListArr.filter(el => el.vehicleName.toLowerCase().includes(this.searchText.toLowerCase()))

      console.log(this.vehicleListArr)
    }
    this.paginate(this.page_size, this.current_page);
    this.tablePaginate(this.tableSize, this.currentPagetable);
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

      if (this.district.value) {
        this.mainReagionParam == null;
        this.reagionParam == null;
        let selectedVehicleDistrictId = [];
        console.log(this.groupIdParentArr);
        for (var i = 0; i < this.groupIdParentArr.length; i++) {
          var allVgroups = this.groupIdParentArr[i];
          if (this.district.value == allVgroups['groupName']) {
            console.log(this.district.value)
            selectedVehicleDistrictId.push(allVgroups['groupId']);
            break;
          }
        }
        if (selectedVehicleDistrictId.length == 0) {
          for (var i = 0; i < this.groupIdParentArr.length; i++) {
            var allVgroups = this.groupIdParentArr[i];
            if (this.region.value == allVgroups['parent']) {
              selectedVehicleDistrictId.push(allVgroups['groupId']);
            }
          }
        }
        this.paramObj['vehicleGroupId'] = selectedVehicleDistrictId;
        console.log(selectedVehicleDistrictId)

      } else if (this.region.value || this.district.value != '') {
        let selectedVehicleRegionId = [];
        selectedVehicleRegionId = this.applyRegionFilter()
        this.reagionParam = null
        for (let i = 0; i < selectedVehicleRegionId.length; i++) {
          this.reagionParam = this.reagionParam + this.vehicleReport.serialize({ vehicleGroupId: selectedVehicleRegionId[i] })
          if (i + 1 != selectedVehicleRegionId.length) {
            this.reagionParam = this.reagionParam + '&';
          }

        }
        // console.log(this.mainReagionParam)
        // console.log(this.reagionParam)
        if (this.mainReagionParam == null) {
          this.mainReagionParam = this.reagionParam.replace('undefined', '');
          this.mainReagionParam = this.mainReagionParam.replace('null', '');

        } else {
          this.mainReagionParam = this.reagionParam.replace(this.mainReagionParam, '')
          this.mainReagionParam = this.mainReagionParam.replace('null', '');

        }

      }



      if (this.VehicleStatus.value) {
        this.paramObj['eventType'] = this.VehicleStatus.value;
      }

      if (this.LoadState.value) {
        this.paramObj['consignmentActive'] = this.LoadState.value;
      }
      if (this.ignitionStatus.value) {
        this.paramObj['ignitionStatus'] = this.ignitionStatus.value;
      }
      if (this.notInNetwork.value) {
        this.paramObj['notInContact'] = this.notInNetwork.value;
      }

      if (this.sharing.vehicleData === undefined) {
        this.spinner.show();
        // console.log(this.sharing.vehicleData, "inside undefined")

        // console.log(this.paramObj)
        // console.log(this.mainReagionParam)
        // console.log(this.district.value)
        const res: any = await this.vehicleReport.getvehicleStateList(this.paramObj, this.mainReagionParam, this.district.value);
        // console.log(this.sharing.vehicleData, "inside undefined")
        this.vehicleListArr = res;
        // console.log(res, "res")
        this.totalVehcile = this.vehicleListArr.length;
        this.nonLocationVehicle = 0;
        this.mapsdata = [];
        this.recenterMap();
        var listVehicleArray = [];
        if (this.vehicleListArr.length >= 0) {
          for (var i = 0; i < this.vehicleListArr.length; i++) {
            var tempItem = this.vehicleListArr[i];
            listVehicleArray.push({ 'name': tempItem.vehicleName, 'id': tempItem.vehicleId });

            for (var j = 0; j < this.vehicleListArr[i]['vehicleGroups'].length; j++) {
              if (this.vehicleListArr[i]['vehicleGroups'][j]['type'] == 'FIXED') {
                this.vehicleListArr[i].groupName = this.vehicleListArr[i]['vehicleGroups'][j]['name'];
              }
            }


            if (this.vehicleListArr[i].latitude === 0 && this.vehicleListArr[i].longitude === 0) {
              this.nonLocationVehicle++;
            }
            if (this.vehicleListArr[i].ignitionStatus && this.vehicleListArr[i].loaded) {
              this.vehicleListArr[i].icon = this.theme.onLoaded
            }
            if (this.vehicleListArr[i].ignitionStatus && !this.vehicleListArr[i].loaded) {
              this.vehicleListArr[i].icon = this.theme.onUnLoaded

            }
            if (!this.vehicleListArr[i].ignitionStatus && this.vehicleListArr[i].loaded) {
              this.vehicleListArr[i].icon = this.theme.offLoaded
            }
            if (!this.vehicleListArr[i].ignitionStatus && !this.vehicleListArr[i].loaded) {
              this.vehicleListArr[i].icon = this.theme.offUnLoaded
            }
          }

          var listVehicleArray = [];
          this.tablePaginate(this.tableSize, this.currentPagetable);
          this.paginate(this.page_size, this.current_page);


          setTimeout(() => {
            this.loadVehicleForMap();
            console.log(this.vehicleListArr.length)
            if (this.vehicleListArr.length >= 0) {
            this.cardLoadingFlag = false;
            this.spinner.hide();

            }

          }, 10)
          this.changeDetection.detectChanges();

          this.sharing.setVehicleData(this.vehicleListArr);
        }



      } else if (this.sharing.vehicleData != undefined) {
        this.spinner.show();
        // console.log(this.sharing.vehicleData, "inside data")
        if (this.sharing.vehicleFlag != undefined) {
        this.vehicleList = this.sharing.vehicleFlag;

        }
        this.vehicleListArr = await this.sharing.getVehicleData();
        this.totalVehcile = this.vehicleListArr.length;
        this.nonLocationVehicle = 0;
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
            this.vehicleListArr[i].icon = this.theme.onLoaded
          }
          if (this.vehicleListArr[i].ignitionStatus && !this.vehicleListArr[i].loaded) {
            this.vehicleListArr[i].icon = this.theme.onUnLoaded

          }
          if (!this.vehicleListArr[i].ignitionStatus && this.vehicleListArr[i].loaded) {
            this.vehicleListArr[i].icon = this.theme.offLoaded
          }
          if (!this.vehicleListArr[i].ignitionStatus && !this.vehicleListArr[i].loaded) {
            this.vehicleListArr[i].icon = this.theme.offUnLoaded

          }
        }
        this.paginate(this.page_size, this.current_page);
        this.tablePaginate(this.tableSize, this.currentPagetable);
        this.changeDetection.detectChanges();

        setTimeout(() => {
          this.mapsdata = of(this.sharing.getVehicleData());
          this.cardLoadingFlag = false;
          this.spinner.hide();

        }, 10)


      }

    } catch (err) {
      console.log(err);
    }

  }


  loadVehicleForMap() {

    this.mapsdata = of(this.vehicleListArr);
    // console.log(this.mapsdata)
    this.changeDetection.detectChanges();

  }

  nextPage() {
    this.current_page++;
    this.paginate(this.page_size, this.current_page);
    this.changeDetection.detectChanges();

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
    this.cardLoadingFlag = true;
    this.menu.closeMenu();
    this.changeDetection.detectChanges();


    localStorage.removeItem("groupData");
    this.sharing.vehicleData = undefined;
    this.getvehicleStateList();

  }

  getDataUrl(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }

  markerIconUrl() {

  }

  filterCount() {

    if (this.VehicleStatus.value != "") {
      console.log(this.VehicleStatus.value)
      const isLargeNumber = (element) => element == 'VehicleStatus';
      let val = this.numberFilter.findIndex(isLargeNumber);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('VehicleStatus')


      }
      else {
        // console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('VehicleStatus')
      }
    }

    if (this.LoadState.value != "") {
      console.log(this.LoadState.value)
      let kpi = (element) => element == 'LoadState';
      let val = this.numberFilter.findIndex(kpi);
      console.log(val)

      if (val == -1) {
        // this.numberFilter.splice(val, 1)
        this.numberFilter.push('LoadState')


      }
      else {
        console.log(this.numberFilter)
        this.numberFilter.splice(val, 1)

        this.numberFilter.push('LoadState')
      }
    }

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


    console.log(this.numberFilter)

  }





  getGroupList() {
    try {
      let dataFromService = this.sharing.getGroupListData();
      if (dataFromService != undefined) {
        this.groupListArr = dataFromService;
        for (let i = 0; i < this.groupListArr.length; i++) {
          var item1 = this.groupListArr[i];
          for (let j = 0; j < item1.groups.length; j++) {
            let item = item1.groups[j];
            // console.log(item['groupId'])
            this.groupIdParentArr.push({
              'groupId': item['groupId'],
              'groupName': item['groupName'],
              'parent': item['parent'],
              'type': item['type']
            })
          }

        }

        // console.lo
        this.groupIdParentArr.forEach(el => {
          if (this.UnqiueGroupID.indexOf(el.parent) === -1 && el.parent != '' && el.parent != undefined) {
            this.UnqiueGroupID.push(el.parent);
            this.UnqiueMainGroupID.push(el.parent);
          }
        });

      }
    } catch (err) {
      console.log(err);
    }
  }

  selectFIlter() {
    this.UnqiueGroupID = this.UnqiueMainGroupID.filter(el => el).filter(el => el.toLowerCase().indexOf(this.regionFilter.value.toLowerCase()) !== -1)
  }

  selectDistrict() {
    this.filteredArr = this.mainFilteredArr.filter(el => el).filter(el => el.groupName.toLowerCase().indexOf(this.districtFilter.value.toLowerCase()) !== -1)
    // console.log(this.filteredArr)
  }



  onChangeRegion(val) {
    this.district.patchValue('');
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
      if (this.region.value == allVgroups['parent']) {
        console.log(this.region.value, allVgroups['parent'])
        console.log(allVgroups.groupId)
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
    this.requestSubmitForm.markAllAsTouched()
    if(this.requestSubmitForm.status == 'INVALID' ){
      return;
    }
    let submitobj = {
      vehicleId: this.vehicleName.value,
      driverName: 'FSCDL driver',
      driverMobileNumber: 9599779344,
      title: this.issueType.value,
      description: this.issueDescription.value
    }

    try {
      this.closeReportModal();
      const res: any = await this.vehicleReport.submitRequest(submitobj);
      alert('Service request created successfully with ticket #' + res);


    } catch (err) {
      console.log(err)
    }


  }

  closeReportModal(){
    $('#exampleModal').modal('hide')
    this.requestSubmitForm.patchValue({
      vehicleName: '',
      issueType: '',
      issueDescription: '',
    })
    this.requestSubmitForm.markAsUntouched();
  }

  async getDahsBoardCount() {
    try {
      const res: any = await this.login.getDahsBoardCount();
      this.dashboardData = res;
      this.chartOnload();
      this.changeDetection.detectChanges();
    } catch (error) {

    }
  }


  downloadReport() {
    // var eventTypeArrStr = '';
    // if (this.VehicleStatus.value) {
    //   eventTypeArrStr += "&eventType=" + this.VehicleStatus.value;
    // }
    // var notInContact = '';
    // if (this.notInNetwork.value) {
    //   notInContact = '&notInContact=' + this.notInNetwork.value;
    // } else {
    //   notInContact = '';
    // }
    var name = '';
    if (this.searchText) {
      name = '&name=' + this.searchText;
    } else {
      name = '';
    }
    // var ignitionStatus = '';
    // if (this.ignitionStatus.value) {
    //   ignitionStatus = '&ignitionStatus=' + this.ignitionStatus.value;
    // } else {
    //   ignitionStatus = '';
    // }
    // var LoadState = '';
    // if (this.LoadState.value) {
    //   LoadState = '&consignmentActive=' + this.LoadState.value;
    // } else {
    //   LoadState = '';
    // }

    let token = localStorage.getItem('auth_key_Carot');
    let access_token = token.replace('bearer ', '');

    // console.log(token)
    let apiUrl = this.url.apiV2url;
    if (this.searchText) {
      apiUrl = this.url.apiV2url + `vs/download?live=true&${this.mainReagionParam}${name}&${this.serialize(this.paramObj)}&access_token=${access_token}`
    } else {
      apiUrl = this.url.apiV2url + `vs/download?live=true&${this.mainReagionParam}&${this.serialize(this.paramObj)}&access_token=${access_token}`

    }
    // console.log(apiUrl)
    // console.log(this.mainReagionParam)
    // console.log(this.paramObj)
    window.open(apiUrl, '_blank');


  }
  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


  selectVehicleMap() {

    this.vehicleList = false;
    this.sharing.setVehicleFlag(this.vehicleList);
    this.chartOnload();
  }
  selectVehicleList() {

    this.vehicleList = true;
    this.sharing.setVehicleFlag(this.vehicleList);

    this.chartOnload();

  }

  getVehicleData(id) {
    let data = this.vehicleListArr.filter(el => {
      return el.vehicleId == id
    });
    console.log(data);
    // this.vehicleReport.transerData(data)
    localStorage.setItem("vehicleData", JSON.stringify(data[0]));
    this.router.navigate([`/dashboard/vehicleMap/${data[0].vehicleName}`])


  }

  recenterMap() {
    // console.log('clicked')
    // console.log(this.mapsApiWrapper)
    // console.log(this.agmMap)
    // // this.defaultLat = Number(25.79891);
    // // this.defaultLng = Number(77.28790);
    // // // this.defaultZoom = 5;
    // // // this.changeDetection.detectChanges();
    // // // console.log(document.getElementById('AgmMap'))
    // // let map:any = document.getElementById('AgmMap')
    // // map.zoom = this.defaultZoom;
    // // map.latitude = this.defaultLat;
    // // map.longitude = this.defaultLng;
    // // this.mapsApiWrapper.setZoom(2);
    // // this.mapsApiWrapper.fitBounds(this.defaultZoom);
    // // this.defaultZoom = 2;
    // this.agmMap.zoom = 5;
    
  }

  centerChange(ev) {
    // var me = this;
    console.log(ev)
    // console.log("centre change called");
    // me.gMaps.setCenter({ lat:ev.lat,lng:ev.lng});
  }

  // changeMapZoom(val:any){
  //   console.log(val)
  //   this.agmMap.zoom = 5;

  // }






}

