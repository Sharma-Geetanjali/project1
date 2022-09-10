import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { Location } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { GoogleMapsAPIWrapper, MapsAPILoader, MouseEvent } from '@agm/core';
import { ConsignorService } from 'src/app/Services/departments/consignor/consignor.service';
import { VehicleListService } from 'src/app/Services/vehicle/vehicle-list.service';
import { Subscription } from 'rxjs';
import { HeaderService } from 'src/app/Services/header/header.service';
import { SharingService } from 'src/app/Services/sharingService/sharing.service';
import { ActivatedRoute } from '@angular/router';
import { RoutesService } from 'src/app/Services/departments/routes/routes.service';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';




@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CreateRouteComponent implements OnInit {


  imgPath = this.global.imgPath;
  private geoCoder;
  latitude: number;
  longitude: number;
  zoom = 20;
  address: string;
  consigneeCirlceRadius = 80;
  radius;
  createRoute: FormGroup;
  dataObj: Object;
  allConsignorData: any = [];
  allConsigneeData: any = [];

  allCnorByGroups: any = [];
  allCneeByGroups: any = [];

  routepath: any = [];
  pathdraw: any = [];
  filteredCneeArr: any = [];
  mainfilteredCneeArr: any = [];
  filteredCnorArr: any = [];
  mainfilteredCnorArr: any = [];
  multipleRoutes: any = [];
  subscription: Subscription;
  startRoute;
  endRoute;
  selectedKmlRouteIndex;
  selectIndex


  lat: number = 28.6139;
  lng: number = 77.2090;
  offset1 = 0;
  limit = 10;
  optionsfilter = [];
  offset2 = 0;
  limit1 = 5;
  options1 = [];
  filename;
  fileToggle = false;
  loadMarker = false;

  public origin: any;
  public destination: any;
  timeValue;
  singleRouteBool: Boolean = true;
  routeLatlng: any = [];
  options = {
    draggable: true,
  };
  startMarkerLat;
  startMarkerLng;
  endMarkerLat;
  endMarkerLng;
  ID;
  routeId;
  routeMasterId;
  editRouteFlag = false;
  editData;
  bufferArr: any = [];
  editRouteMapArr: any = [];
  editStartMarker;
  editEndMarker;
  paths: LatLngLiteral[] = [];
  paths1: any = [];





  @ViewChild('search')
  public searchElementRef: ElementRef;




  constructor(
    private changeDetection: ChangeDetectorRef,
    public consignReport: ConsignmentReportService,
    private location: Location,
    public theme: ThemeServiceService,
    public global: GlobalConfigService,
    private mapsAPILoader: MapsAPILoader,
    public fb: FormBuilder,
    public consiService: ConsignorService,
    private spinner: NgxSpinnerService,
    private ngZone: NgZone,
    public vehicleReport: VehicleListService,
    public headerS: HeaderService,
    private sharing: SharingService,
    private route: ActivatedRoute,
    private routes: RoutesService


  ) {
    this.subscription = this.headerS.refresh$.subscribe((val) => {
      this.ngOnInit();
      // this.global.getGroupListData();
      this.global.getConsignorListData();
      this.global.getConsigneeListData();
    });
    console.log(this.latitude)

  }

  ngOnInit(): void {
    this.ID = this.route.snapshot.params['id'];
    this.routeId = this.route.snapshot.params['routeId'];
    this.routeMasterId = this.route.snapshot.params['routeMasterId'];
    if (this.routeMasterId) {
      this.editRouteFlag = true;
      this.getRouteByMasterId();
      this.editData = this.sharing.getspecificRouteData();
      console.log(this.editData)
    }

    this.createRoute = this.fb.group({
      consignorCode: ['', [Validators.required]],
      consignorCodeFilter: [''],
      consigneeCode: ['', [Validators.required]],
      consigneeCodeFilter: [''],
      distance: ['', [Validators.required]],
      Exdays: [''],
      Exhours: [''],
      Exmins: [''],
      bufferValue: [''],
      changeRoute: [''],
    })

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      this.changeDetection.detectChanges();
    });


    // this.getDirection();

    this.sharing.consignorListDataObservable$.subscribe(() => {
      this.getAllConsignors();

    })

    this.sharing.consigneeListDataObservable$.subscribe(() => {
      this.getAllConsignees();
    })

    if (this.editRouteFlag) {
      this.consignorCode.patchValue(this.editData.consignorName);
      this.consigneeCode.patchValue(this.editData.consigneeName);
      this.distance.patchValue((this.editData.routeMappingModel[0].expectedDistance) / 1000);
      this.convertTimeUnit(this.editData.routeMappingModel[0].expectedTime)

      // console.log(this.editData.consignorCode)
    }





    this.changeRoute.setValue('upload')
    this.consignorCodeFilter.valueChanges.subscribe(() => { this.selectConr() });
    this.consigneeCodeFilter.valueChanges.subscribe(() => { this.selectConee() });
    this.consignorCode.valueChanges.subscribe(() => { this.OnchangeRoute() });
    this.consigneeCode.valueChanges.subscribe(() => { this.OnchangeRoute() });
    this.changeRoute.valueChanges.subscribe(() => { this.OnchangeRoute() });



  }


  get consignorCode() { return this.createRoute.get('consignorCode'); }
  get consignorCodeFilter() { return this.createRoute.get('consignorCodeFilter'); }
  get consigneeCode() { return this.createRoute.get('consigneeCode'); }
  get consigneeCodeFilter() { return this.createRoute.get('consigneeCodeFilter'); }
  get bufferValue() { return this.createRoute.get('bufferValue'); }
  get distance() { return this.createRoute.get('distance'); }
  get Exdays() { return this.createRoute.get('Exdays'); }
  get Exhours() { return this.createRoute.get('Exhours'); }
  get Exmins() { return this.createRoute.get('Exmins'); }
  get changeRoute() { return this.createRoute.get('changeRoute'); }





  private setCurrentLocation() {
    this.changeDetection.detectChanges();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.getAddress(this.latitude, this.longitude);
      });
    }

  }

  getDirection() {
    this.origin = { lat: this.startRoute.metas[0].geoFence.latitude, lng: this.startRoute.metas[0].geoFence.longitude };
    this.destination = { lat: this.endRoute.metas[0].geoFence.latitude, lng: this.endRoute.metas[0].geoFence.longitude };
  }

  getNextBatch() {
    this.changeDetection.detectChanges();
    const result = this.filteredCnorArr.slice(this.offset1, this.offset1 + this.limit);
    this.optionsfilter = this.optionsfilter.concat(result)
    this.offset1 += this.limit;
    console.log(result)
    this.changeDetection.detectChanges();
  }

  getNextConsignee() {
    this.changeDetection.detectChanges();
    const result = this.filteredCneeArr.slice(this.offset2, this.offset2 + this.limit1);
    this.options1 = this.options1.concat(result)
    this.offset2 += this.limit1;
    console.log(result)
    this.changeDetection.detectChanges();
  }


  fetchRoute() {
    this.changeDetection.detectChanges();
    if (this.consignorCode.value == '' || this.consignorCode.value == undefined || this.consigneeCode.value == undefined || this.consigneeCode.value == '') {
      return;
    }

    for (let i = 0; i < this.allConsignorData.length; i++) {
      if (this.consignorCode.value == this.allConsignorData[i].code) {
        this.startRoute = this.allConsignorData[i];
        this.startMarkerLat = this.startRoute.metas[0].geoFence.latitude;
        this.startMarkerLng = this.startRoute.metas[0].geoFence.longitude;

        break;
      }
    }



    for (let j = 0; j < this.allConsigneeData.length; j++) {
      if (this.consigneeCode.value == this.allConsigneeData[j].code) {
        this.endRoute = this.allConsigneeData[j];
        this.endMarkerLat = this.endRoute.metas[0].geoFence.latitude;
        this.endMarkerLng = this.endRoute.metas[0].geoFence.longitude;

        break;
      }
    }

    this.getDirection();
    this.changeDetection.detectChanges();
  }



  markerDragEnd(val) {
    for (var l = 0; l < val.routes.length; l++) {
      var legs = val.routes[0].legs;
      for (let i = 0; i < legs.length; i++) {
        var steps = legs[i].steps;
        this.calculateTime(legs[0].duration.text);
        this.distance.patchValue(legs[0].distance.value / 1000);
        console.log(this.distance.value);
        for (var s = 0; s < steps.length; s++) {
          var latLngs = steps[s].lat_lngs;
          for (var ll = 0; ll < latLngs.length; ll++) {
            var item = latLngs[ll];
            var object = { 'latitude': item.lat(), 'longitude': item.lng() }
            this.routepath.push(object);
          }
        }
      }
    }
  }



  calculateTime(dayStr) {
    this.changeDetection.detectChanges();

    if (dayStr.indexOf('days') > -1) {
      var toRes = (dayStr.indexOf("days") - 3);
      var fromRes = (dayStr.indexOf("days") - 1);
      this.Exdays.patchValue(dayStr.substring(fromRes, toRes));
    } else if (dayStr.indexOf('day') > -1) {
      var toRes = (dayStr.indexOf("day") - 3);
      var fromRes = (dayStr.indexOf("day") - 1);
      this.Exdays.patchValue(dayStr.substring(fromRes, toRes));
    }
    if (dayStr.indexOf('hour') > -1 || dayStr.indexOf('hours') > -1) {
      var hourToRes = (dayStr.indexOf("hour") - 3);
      var hourFromRes = (dayStr.indexOf("hour") - 1);
      this.Exhours.patchValue(dayStr.substring(hourFromRes, hourToRes));
    }
    if (dayStr.indexOf('mins') > -1) {
      var minToRes = (dayStr.indexOf("mins") - 3);
      var minFromRes = (dayStr.indexOf("mins") - 1);
      this.Exmins.patchValue(dayStr.substring(minFromRes, minToRes));
    }
    this.timeValue = (this.Exdays.value * 24 * 60 * 60) + (this.Exhours.value * 60 * 60) + (this.Exmins.value * 60);
  }

  back(): void {
    this.location.back()
    console.log("clicked")
  }

  calculateDistance() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      const mexicoCity = new google.maps.LatLng(this.lat, this.lng);
      const jacksonville = new google.maps.LatLng(24.799524, 120.975017);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(mexicoCity, jacksonville);
      console.log(distance)
      this.distance.patchValue(distance)
    })

  }

  getmarkers() {
    this.changeDetection.detectChanges();
    if (this.consignorCode.value == '' || this.consignorCode.value == undefined || this.consigneeCode.value == undefined || this.consigneeCode.value == '') {
      return;
    }

    for (let i = 0; i < this.allConsignorData.length; i++) {
      if (this.consignorCode.value == this.allConsignorData[i].code) {
        let startRoutemarker = this.allConsignorData[i];
        this.startMarkerLat = startRoutemarker.metas[0].geoFence.latitude;
        this.startMarkerLng = startRoutemarker.metas[0].geoFence.longitude;

        break;
      }
    }



    for (let j = 0; j < this.allConsigneeData.length; j++) {
      if (this.consigneeCode.value == this.allConsigneeData[j].code) {
        let endRouteMarker = this.allConsigneeData[j];
        this.endMarkerLat = endRouteMarker.metas[0].geoFence.latitude;
        this.endMarkerLng = endRouteMarker.metas[0].geoFence.longitude;

        break;
      }
    }

    this.changeDetection.detectChanges();
  }

  OnchangeRoute() {
    this.changeDetection.detectChanges();
    if (this.changeRoute.value == 'create') {
      // this.pathdraw = [];
      this.distance.patchValue('');
      this.Exdays.patchValue('');
      this.Exhours.patchValue('');
      this.Exmins.patchValue('');
      this.fetchRoute();
    }

    if (this.changeRoute.value == 'upload') {
      this.distance.patchValue('');
      this.Exdays.patchValue('');
      this.Exhours.patchValue('');
      this.Exmins.patchValue('');
      this.getmarkers();
    }
    this.changeDetection.detectChanges();
  }


  async createRouteCall() {


    if (this.changeRoute.value == 'create') {
      this.dataObj = {
        consignorCode: this.consignorCode.value,
        consigneeCode: this.consigneeCode.value,
        route: this.routepath,
        expectedTime: this.timeValue,
        expectedTimeUnit: "SECOND",
        expectedDistance: (this.distance.value) * 1000,
        expectedDistanceUnit: "METER",
        routeBuffer: this.bufferValue.value,
        routeBufferUnit: "METER"
      }
    } else if (this.changeRoute.value == 'upload') {
      let time = (this.Exdays.value * 24 * 60 * 60) + (this.Exhours.value * 60 * 60) + (this.Exmins.value * 60)
      this.dataObj = {
        consignorCode: this.consignorCode.value,
        consigneeCode: this.consigneeCode.value,
        route: this.routeLatlng,
        expectedTime: time,
        expectedTimeUnit: "SECOND",
        expectedDistance: (this.distance.value) * 1000,
        expectedDistanceUnit: "METER",
        routeBuffer: this.bufferValue.value,
        routeBufferUnit: "METER"
      }
    }

    try {
      // this.spinner.show()
      console.log(this.dataObj);
      const res: any = await this.consiService.createRoute(this.dataObj);
    } catch (error) {
      console.log(error);
    }
  }

  dispalyFileName(file) {

    this.filename = null;
    this.filename = file[0].name.slice(0, 25);
    this.fileToggle = true;
  }

  onSelectKmlFile(files) {

    this.changeDetection.detectChanges();
    // var fileInput = document.querySelector('#file-upload');
    var reader = new FileReader();
    console.log(files[0])

    var extension = files[0].name.split('.').pop().toLowerCase();
    if (extension == "kml" || extension == "xml") {
      reader.readAsDataURL(files[0]);
      reader.onload = function () {
        let fileContent = reader.result;
      }
      this.parseDocument(files[0]);

    } else {
      alert("Please select a valid KML file ");
    }


    this.changeDetection.detectChanges();
  }
  parseDocument(file) {
    this.changeDetection.detectChanges();
    let fileReader = new FileReader()


    fileReader.onload = async (e) => {
      let result = await this.extractGoogleCoords(e.target.result);
      console.log(result)
      if (this.singleRouteBool) {
        this.routeLatlng = result.linestringArr;
        this.pathdraw = result.uploadString
        console.log(this.pathdraw)
        this.changeDetection.detectChanges();
      } else {
        this.routeLatlng = result[0].linestringArr;
        this.pathdraw = result[0].uploadString
        console.log(this.pathdraw)
        this.changeDetection.detectChanges();
        this.selectedKmlRouteIndex = 0;
      }


    }
    fileReader.readAsText(file);
    this.changeDetection.detectChanges();
  }

  async extractGoogleCoords(plainText) {
    this.changeDetection.detectChanges();
    let parser = new DOMParser()
    let xmlDoc = parser.parseFromString(plainText, "text/xml")
    let linestringArr = [];
    let uploadString = [];

    if (xmlDoc.documentElement.nodeName == "kml") {
      let FolderArr = xmlDoc.getElementsByTagName('Folder');
      if (FolderArr.length == 0) {
        this.singleRouteBool = true;
        const placemark: HTMLCollectionOf<Element> = xmlDoc.getElementsByTagName('Placemark')
        for (let i = 0; i < placemark.length; i++) {
          this.changeDetection.detectChanges();
          let lineStrings = placemark[i].getElementsByTagName('LineString')
          for (let j = 0; j < lineStrings.length; j++) {
            this.changeDetection.detectChanges();
            var coords = lineStrings[j].getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim()
            let vars = coords.split("\n")
            for (const ele of vars) {

              let coord = ele.split(",")

              linestringArr.push({ latitude: +coord[1], longitude: +coord[0] });
              uploadString.push({ lat: +coord[1], lng: +coord[0] });
            }
          }
        }
        console.log(this.singleRouteBool)
        this.lat = uploadString[0].lat
        this.lng = uploadString[0].lng
      } else {
        this.singleRouteBool = false;
        this.multipleRoutes = [];
        let index = 0;
        const FolderArr: HTMLCollectionOf<Element> = xmlDoc.getElementsByTagName('Folder');
        for (let i = 0; i < FolderArr.length; i++) {
          this.changeDetection.detectChanges();
          var placemarks: HTMLCollectionOf<Element> = FolderArr[i].getElementsByTagName('Placemark')
          let obj = {
            name: 'Route_' + (index + 1),
            linestringArr: [],
            uploadString: [],
          }
          for (let j = 0; j < placemarks.length; j++) {
            this.changeDetection.detectChanges();
            let lineStrings: HTMLCollectionOf<Element> = placemarks[j].getElementsByTagName('LineString')
            for (let k = 0; k < lineStrings.length; k++) {
              var coords = lineStrings[k].getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim()
              let vars = coords.split("\n")
              for (const ele of vars) {

                let coord = ele.split(",")

                obj.linestringArr.push({ latitude: +coord[1], longitude: +coord[0] });
                obj.uploadString.push({ lat: +coord[1], lng: +coord[0] });
              }
            }
            this.changeDetection.detectChanges();
          }
          this.multipleRoutes.push(obj);
          index++;
          this.changeDetection.detectChanges();
        }
        this.changeDetection.detectChanges();
        console.log(this.multipleRoutes)
      }

      this.changeDetection.detectChanges();


    } else {
      throw "error while parsing"
    }
    if (this.singleRouteBool) {
      return { linestringArr: linestringArr, uploadString: uploadString }

    } else {
      return (this.multipleRoutes)

    }

  }


  kmlChangeRoute(index) {
    this.changeDetection.detectChanges();
    console.log(this.multipleRoutes)
    console.log(index)
    this.routeLatlng = this.multipleRoutes[index].linestringArr;
    // this.pathdraw = [];
    this.pathdraw = this.multipleRoutes[index].uploadString;
    // this.lat = this.multipleRoutes[index].uploadString[0].lat;
    // this.lng = this.multipleRoutes[index].uploadString[0].lng;
    this.changeDetection.detectChanges();
  }

  async getAllConsignors() {
    try {
      let dataFromService = this.sharing.getConsignorListData();
      if (dataFromService != undefined) {
        this.allConsignorData = dataFromService;
        if (this.allConsignorData) {
          let tempArr = [];
          for (let i = 0; i < this.allConsignorData.length; i++) {
            let depttGroupIndex = tempArr.indexOf(this.allConsignorData[i].departmentGroup);
            if (depttGroupIndex == -1) {
              tempArr.push(this.allConsignorData[i].departmentGroup);
              this.allCnorByGroups.push({
                'departmentGroup': this.allConsignorData[i].departmentGroup,
                'detail': [{
                  'id': this.allConsignorData[i].id,
                  'code': this.allConsignorData[i].code,
                  'name': this.allConsignorData[i].name,
                  'departmentGroup': this.allConsignorData[i].departmentGroup
                }]
              })
            } else {
              for (var j = 0; j < this.allCnorByGroups.length; j++) {
                if (this.allCnorByGroups[j]['departmentGroup'] == this.allConsignorData[i].departmentGroup) {
                  this.allCnorByGroups[j]['detail'].push({
                    'id': this.allConsignorData[i].id,
                    'code': this.allConsignorData[i].code,
                    'name': this.allConsignorData[i].name,
                    'departmentGroup': this.allConsignorData[i].departmentGroup
                  });
                }
              }
            }
          }
          console.log(this.allCnorByGroups)
          this.filteredCnorArr = this.allCnorByGroups;
          this.changeDetection.detectChanges();
        }
        this.getNextBatch();

        this.changeDetection.detectChanges();


      }


    } catch (err) {
      console.log(err);
    }


  }


  async getAllConsignees() {

    try {
      let dataFromService = this.sharing.getConsigneeListData();
      if (dataFromService != undefined) {
        this.allConsigneeData = dataFromService;
        this.changeDetection.detectChanges();

        if (this.allConsigneeData) {
          let tempArr = [];
          for (let i = 0; i < this.allConsigneeData.length; i++) {
            let depttGroupIndex = tempArr.indexOf(this.allConsigneeData[i].departmentGroup);
            if (depttGroupIndex == -1) {
              tempArr.push(this.allConsigneeData[i].departmentGroup);
              this.allCneeByGroups.push({
                'departmentGroup': this.allConsigneeData[i].departmentGroup,
                'detail': [{
                  'id': this.allConsigneeData[i].id,
                  'code': this.allConsigneeData[i].code,
                  'name': this.allConsigneeData[i].name,
                  'departmentGroup': this.allConsigneeData[i].departmentGroup,

                }]
              })
            } else {
              for (var j = 0; j < this.allCneeByGroups.length; j++) {
                if (this.allCneeByGroups[j]['departmentGroup'] == this.allConsigneeData[i].departmentGroup) {
                  this.allCneeByGroups[j]['detail'].push({
                    'id': this.allConsigneeData[i].id,
                    'code': this.allConsigneeData[i].code,
                    'name': this.allConsigneeData[i].name,
                    'departmentGroup': this.allConsigneeData[i].departmentGroup
                  });
                }
              }
            }
          }
          console.log(this.allCneeByGroups)
          this.filteredCneeArr = this.allCneeByGroups;

        }
        this.getNextConsignee()
        this.changeDetection.detectChanges();


      }
    } catch (err) {
      console.log(err);
      this.spinner.hide();

    }


  }



  selectConee() {
    if (this.consigneeCodeFilter.value != '') {
      this.filteredCneeArr.forEach(el => {
        el.detail = el.detail.filter(elx => elx.name.toLowerCase().indexOf(this.consigneeCodeFilter.value.toLowerCase()) !== -1)
      })
    } else {
      this.filteredCneeArr = this.allCneeByGroups;
    }


    this.options1 = [];
    this.offset2 = 0;
    this.getNextConsignee();


  }

  selectConr() {
    // this.filteredCnorArr = this.mainfilteredCnorArr.filter(el =>  el.name.toLowerCase().indexOf(this.receiverCodeFilter.value.toLowerCase()) > -1)
    if (this.consignorCodeFilter.value != '') {
      this.filteredCnorArr.forEach(el => {
        el.detail = el.detail.filter(elx => elx.name.toLowerCase().indexOf(this.consignorCodeFilter.value.toLowerCase()) !== -1)

      })
    } else {
      this.filteredCnorArr = this.allCnorByGroups;
    }

    this.optionsfilter = []
    this.offset1 = 0;
    this.getNextBatch();

  }


  getRouteByMasterId() {
    // if (this.routeMasterId) {
    //   this.getRouteById(this.ID, this.routeMasterId);
    // }
    if (this.routeId == 'null') {
      return;
    }
    this.routeDetailByRouteId(this.routeId);
  }

  async routeDetailByRouteId(routeid) {

    try {
      const res: any = await this.routes.routeDetailByRouteId(routeid);
      this.editRouteMapArr = res.route;
      this.editStartMarker = this.editRouteMapArr[0];
      this.editEndMarker = this.editRouteMapArr[this.editRouteMapArr.length - 1];
      this.changeDetection.detectChanges();

      console.log(this.editRouteMapArr)
      this.getBufferById(res.id);
      console.log(res);
      this.spinner.hide();
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }

  }

  // async getRouteById(id,routeMasterId) {

  //   try {
  //     const res: any = await this.routes.routeDetailByRouteId(routeid);
  //     console.log(res);
  //     this.spinner.hide();
  //   }
  //   catch (err) {
  //     console.log(err)
  //     this.spinner.hide();
  //   }

  // }


    async getBufferById(id) {

    try {
      const res: any = await this.routes.getBufferById(id);
      this.bufferArr = res;
      this.paths = this.bufferArr
      console.log(res);
      this.spinner.hide();
    }
    catch (err) {
      console.log(err)
      this.spinner.hide();
    }

    }

     convertTimeUnit(timeObject){
       if (this.editData.routeMappingModel[0].expectedTimeUnit == 'MILLISECOND') {

          let seconds = timeObject / 1000;
          let minutes = seconds / 60;

          let hours = minutes / 60;
          let days;
          if(hours>24){
              days = hours / 24;
          } else {
              days = 0;
          }
          this.Exmins.patchValue(Math.floor(minutes % 60))
          this.Exhours.patchValue(Math.floor(hours % 24  ))
          this.Exdays.patchValue(Math.floor(days));
      } else if(this.editData.routeMappingModel[0].expectedTimeUnit == 'SECOND'){
          let minutes  = timeObject / 60;
          let hours = minutes / 60;
          let days = hours / 24;
          this.Exmins.patchValue(Math.floor(minutes % 60))
          this.Exhours.patchValue(Math.floor(hours % 24  ))
          this.Exdays.patchValue(Math.floor(days));
      } else if (this.editData.routeMappingModel[0].expectedTimeUnit == 'DAY') {
        this.Exdays.patchValue(parseInt(timeObject));

      }
  }

}



