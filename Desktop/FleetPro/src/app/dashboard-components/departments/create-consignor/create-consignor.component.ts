import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsignmentReportService } from 'src/app/Services/Reports/consignmentReport/consignment-report.service';
import { Location } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';
import { GlobalConfigService } from 'src/app/Services/Global/global-config.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ConsignorService } from 'src/app/Services/departments/consignor/consignor.service';
import { Router } from '@angular/router';
// import {} from '@types/googlemaps';
declare const google: any;


@Component({
  selector: 'app-create-consignor',
  templateUrl: './create-consignor.component.html',
  styleUrls: ['./create-consignor.component.css']
})
export class CreateConsignorComponent implements OnInit {


  imgPath = this.global.imgPath;
  private geoCoder;
  latitude: number;
  longitude: number;
  zoom = 20;
  address: string;
  consigneeCirlceRadius = 80;
  radius;
  createForm: FormGroup;
  dataObj: Object;

  pointList: { lat: number; lng: number }[] = [];
  selectedArea = 0;
  drawingManager;
  selectedShape;

  @ViewChild('search')
  public searchElementRef: ElementRef;




  constructor(
    public consignReport: ConsignmentReportService,
    private location: Location,
    public theme: ThemeServiceService,
    public global: GlobalConfigService,
    private mapsAPILoader: MapsAPILoader,
    public fb: FormBuilder,
    public consiService: ConsignorService,
    private spinner: NgxSpinnerService,
    private ngZone: NgZone,
    private router:Router
  ) {

    // console.log(this.latitude)

  }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      addressForm: [''],
      consignorName: ['', [Validators.required]],
      consignorCode: ['', [Validators.required]],
      groupName: [''],
      consignorCoordinates: [''],
      loadingTime: [''],
      geofence: [''],
      radiusForm: ['']
    })
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          // this.zoom = 12;
        });
      });
    });
    this.geofence.setValue('CIRCLE');


    // this.geofence.valueChanges.subscribe(() => this.setGeofence())
  }


  get addressForm() { return this.createForm.get('addressForm'); }
  get consignorName() { return this.createForm.get('consignorName'); }
  get consignorCode() { return this.createForm.get('consignorCode'); }
  get groupName() { return this.createForm.get('groupName'); }
  get consignorCoordinates() { return this.createForm.get('consignorCoordinates'); }
  get loadingTime() { return this.createForm.get('loadingTime'); }
  get geofence() { return this.createForm.get('geofence'); }
  get radiusForm() { return this.createForm.get('radiusForm'); }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    }

    console.log(this.latitude, this.longitude)
  }

  getAddress(latitude, longitude) {
    this.consignorCoordinates.patchValue(this.latitude + ':' + this.longitude);
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          // this.zoom = 12;
          this.address = results[0].formatted_address;
          this.addressForm.patchValue(results[0].formatted_address);

          console.log(this.address)
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }





  back(): void {
    this.location.back()
    console.log("clicked")
  }

  markerDragEnd(val) {
    console.log('dragEnd', val);
    this.longitude = val.coords.lng
    this.latitude = val.coords.lat
    this.getAddress(this.latitude, this.longitude);

  }

  radiusParse() {
    if (this.radiusForm.value === undefined || this.radiusForm.value === null || this.radiusForm.value === '') {
      this.radius = 0;
      return;
    }
    this.radius = parseFloat(this.radiusForm.value)
    console.log(this.radius)

  }

  setGeofence() {
    console.log(this.geofence.value);
  }

  onMapReady(map) {
    this.initDrawingManager(map);
  }

  initDrawingManager = (map: any) => {
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        draggable: false,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  self.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
          }
          self.updatePointList(event.overlay.getPath());
          console.log("pointList", this.pointList)
          // console.log("comment", this.pointList.map(el => { return `${el.lat}:${el.lng}|` }).join(''))
          console.log(event.overlay)
          this.setSelection(event.overlay)
        }
      }
    );
  }

  clearSelection() {
    if (this.selectedShape) {
      this.selectedShape.setEditable(false);
      this.deleteSelectedShape();
      this.selectedShape = null;
      this.pointList = [];
    }
  }
  setSelection(shape) {
    this.clearSelection();
    this.selectedShape = shape;
    shape.setEditable(true);
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show the controls:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  async createConsignor() {

    if (this.geofence.value == "CIRCLE") {
      this.dataObj = {
        name: this.consignorName.value,
        departmentCode: this.consignorCode.value,
        loadingTime: this.loadingTime.value,
        group: this.groupName.value,
        vehicleAvailabilityFenceRadius: 1,
        geoFence: {
          name: this.consignorName.value,
          coordinates: this.consignorCoordinates.value,
          radius: this.radiusForm.value,
          // proximityRadius: proximityRadius,
          landmark: '',
          type: this.geofence.value,
          address: this.addressForm.value,
          latitude: this.latitude,
          longitude: this.longitude
        }
      }
    }
    else if(this.geofence.value == "POLYGON"){
      this.dataObj = {
        name: this.consignorName.value,
        departmentCode: this.consignorCode.value,
        loadingTime: this.loadingTime.value,
        group: this.groupName.value,
        vehicleAvailabilityFenceRadius: 1,
        geoFence: {
          name: this.consignorName.value,
          coordinates: this.pointList.map(el => { return `${el.lat}:${el.lng}|` }).join(''),
          radius: null,
          proximityRadius: 1,
          landmark: '',
          type: this.geofence.value,
          address: this.addressForm.value,
          latitude: this.latitude,
          longitude: this.longitude
        }
      }
    }

    try {
      // this.spinner.show()
      // console.log(this.dataObj);
      const res: any = await this.consiService.createConsignor(this.dataObj);
      this.router.navigate(['/dashboard/departments/consignor'])
    } catch (error) {
      console.log(error);
    }
  }




}

