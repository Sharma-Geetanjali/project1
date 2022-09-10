import { Injectable } from '@angular/core';
import xml2js from 'xml2js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConfigService } from '../Global/global-config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {

  constructor(private http: HttpClient, private global:GlobalConfigService) { }
  xmlData;
  biglogo;
  smallLogo;
  flagOK;
  flagNG;
  flagBlack;
  flagRed;
  flagGreen;
  flagGrey;
  check;
  xmlFileName;

  //Alerts
  overSpeeding;
  engineIdle;
  harshBrake;
  highAcc;
  geoFence;
  engineOn;
  engineOff;
  dtcAlert;
  devicePlugIn;
  disconnected;
  tempSensor;
  coolentTemp;

  // Truck Icon
  onLoaded;
  onUnLoaded;
  offLoaded;
  offUnLoaded;

  // consignment
  receiver;
  dispatcher;
  routeStart;
  routeEnd;
  routeStoppageStart;
  routeStoppageEnd;
  polylineColor;
  polygonColor;
  Consignorcircle;
  Consigneecircle;

  setDashdata: object = {};




  loadXML() {

    if (window.location.hostname === 'fleetproqa.carot.com') {
      this.check = 'assets/xml/'                      // for deployment on qa fleet pro//
      this.xmlFileName = 'fcsdl_theme.xml'                          //  for xml file name //

    } else if (window.location.hostname === 'fleetpro.carot.com') {
      this.check = 'assets/xml/'                         // for deployment  fleet pro//
      this.xmlFileName = 'carot_theme.xml'

    }
    else if (window.location.hostname === 'okinawa.carot.com') {
      this.check = 'assets/xml/'                         // for deployment  okinawa//
      this.xmlFileName = 'okinawa_theme.xml'

    }
    else {
      this.check = 'assets/xml/'                                      // for localhost//
      // this.xmlFileName = 'fcsdl_theme.xml'
      this.xmlFileName = 'okinawa_theme.xml'


    }

    this.http.get(`${this.check}${this.xmlFileName}`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*')
        .append('Cache-Control', 'no-cache')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
      responseType: 'text'
    })
      .subscribe((data) => {
        this.parseXML(data)
          .then((data) => {
            this.xmlData = data;
            console.log(this.check)
            for (let data in this.xmlData.theme) {
              console.log(this.xmlData.theme[data][0]);
              this.setFavicon(this.xmlData.theme[data][0])
               this.setCssVariablesFromThemeObj(this.xmlData.theme[data][0])
               this.setMindaPlantConrdinates(this.xmlData.theme[data][0])
              break;
            }
          });
      });
  }
  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function(err, result) {
        var obj = result;

        resolve(result);
      });
    });
  }


  setCssVariablesFromThemeObj(themeObj: any): void {
    console.log(themeObj);
    document.documentElement.style.setProperty(`--clor`, themeObj.colors[0].primary_color[0]);
    document.documentElement.style.setProperty(`--LightClor`, themeObj.colors[0].secondary_color[0]);
    document.documentElement.style.setProperty(`--topHeader`, themeObj.colors[0].top_header_color[0]);
    document.documentElement.style.setProperty(`--header`, themeObj.colors[0].header_color[0]);
    document.documentElement.style.setProperty(`--topHeaderText`, themeObj.colors[0].top_headerText_color[0]);
    document.documentElement.style.setProperty(`--headerText`, themeObj.colors[0].headerText_color[0]);
    document.documentElement.style.setProperty(`--sideNav`, themeObj.colors[0].side_nav_color[0]);
    document.documentElement.style.setProperty(`--sideNavIcon`, themeObj.colors[0].sideIconNav_color[0]);
    document.documentElement.style.setProperty(`--dropdownColor`, themeObj.colors[0].dropdownColor[0]);
    document.documentElement.style.setProperty(`--dropdownColorText`, themeObj.colors[0].dropdownColorText[0]);
    document.documentElement.style.setProperty(`--dropdownColorTextHover`, themeObj.colors[0].dropdownColorTextHover[0]);
    document.documentElement.style.setProperty(`--dropdownBackgroundHover`, themeObj.colors[0].dropdownBackgroundHover[0]);
    document.documentElement.style.setProperty(`--dropcolor`, themeObj.colors[0].dropdownHeader[0]);
    document.documentElement.style.setProperty(`--dropText`, themeObj.colors[0].dropHeaderText[0]);
    this.flagNG = themeObj.flagImages[0].FlagNG[0];
    this.flagOK = themeObj.flagImages[0].FlagOK[0];
    this.flagBlack = themeObj.flagImages[0].FlagBlack[0];
    this.flagRed = themeObj.flagImages[0].FlagRed[0];
    this.flagGreen = themeObj.flagImages[0].FlagGreen[0];
    this.flagGrey = themeObj.flagImages[0].FlagGrey[0];

    // ALerts map

    this.overSpeeding = themeObj.mapIconsAlert[0].OverSpeeding[0];
    this.engineIdle = themeObj.mapIconsAlert[0].Engine_idle[0];
    this.harshBrake = themeObj.mapIconsAlert[0].Harsh_break[0];
    this.highAcc = themeObj.mapIconsAlert[0].High_Acc[0];
    this.geoFence = themeObj.mapIconsAlert[0].Geo_fence[0];
    this.engineOn = themeObj.mapIconsAlert[0].Engine_On[0];
    this.engineOff = themeObj.mapIconsAlert[0].Engine_Off[0];
    this.dtcAlert = themeObj.mapIconsAlert[0].Dtc[0];
    this.devicePlugIn = themeObj.mapIconsAlert[0].Device_Plug_In[0];
    this.disconnected = themeObj.mapIconsAlert[0].Disconnected[0];
    this.tempSensor = themeObj.mapIconsAlert[0].TempSensor[0];
    this.coolentTemp = themeObj.mapIconsAlert[0].CoolentTemp[0];


    // Truck Icons

    this.onLoaded = themeObj.mapIconTruck[0].OnLoaded[0];
    this.onUnLoaded = themeObj.mapIconTruck[0].OnUnLoaded[0];
    this.offLoaded = themeObj.mapIconTruck[0].OffLoaded[0];
    this.offUnLoaded = themeObj.mapIconTruck[0].OffUnLoaded[0];

    // consignment icons

    this.receiver = themeObj.mapIconsConsignment[0].receiver[0];
    this.dispatcher = themeObj.mapIconsConsignment[0].dispatcher[0];
    this.routeStart = themeObj.mapIconsConsignment[0].routeStart[0];
    this.routeEnd = themeObj.mapIconsConsignment[0].routeEnd[0];
    this.routeStoppageStart = themeObj.mapIconsConsignment[0].routeStoppageStart[0];
    this.routeStoppageEnd = themeObj.mapIconsConsignment[0].routeStoppageEnd[0];

    // polylinr color

    this.polylineColor = themeObj.trackingPolylineColor[0].polyline[0];
    this.polygonColor = themeObj.trackingPolylineColor[0].polygon[0];
    this.Consignorcircle = themeObj.trackingPolylineColor[0].Consignorcircle[0];
    this.Consigneecircle = themeObj.trackingPolylineColor[0].Consigneecircle[0];










    console.log('flag',this.onLoaded)

  }

  setFavicon(val: any): void {
    this.biglogo = val.logo[0].logo_big[0];
    this.smallLogo = val.logo[0].logo_small[0]

    console.log(val.logo[0].logo_big);
    console.log(val.favicon_path)
    document.getElementById('favicon').setAttribute('href', val.favicon_path[0])
    document.title = val.title[0];
  }


  setMindaPlantConrdinates(xmlObj:any){
    let tempArr=[];
    // console.log("xmlObj")
    // console.log(xmlObj.mindaPlantCoordinates[0])
    tempArr = xmlObj.mindaPlantCoordinates[0].coordinate.map(el=>{
      let obj = {
        latitude:el.latitude[0],
        longitude:el.longitude[0],
      }
      return obj;
    })
    // console.log(tempArr)
    this.global.mindaPlantCoordinate = tempArr;
  }

  setDashboardData(data) {
    this.setDashdata = data;
    console.log(data)

  }


}
