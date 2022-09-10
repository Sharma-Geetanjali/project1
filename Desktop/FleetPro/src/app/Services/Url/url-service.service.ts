import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlServiceService {


  apiRestUrl;
  apiV2url;
  apiV3url;
  qaurl;


  constructor() { }


  checkUrl() {

    if (window.location.hostname === 'fleetproqa.carot.com') {

      // this.apiRestUrl = 'https://lucknow.carot.com/api/rest/'           // for qafleet-pro //
      // this.apiV2url = 'https://lucknow.carot.com/v2/'

      this.apiRestUrl = 'https://fcsdl.carot.com/api/rest/'           // for local     //
      this.apiV2url = 'https://fcsdl.carot.com/v2/'
      this.apiV3url = 'https://fcsdl.carot.com/v3/'
    } else if (window.location.hostname === 'fleetpro.carot.com') {
      this.apiRestUrl = 'https://fleet.carot.com/api/rest/'             // for fleetPro //
      this.apiV2url = 'https://fleet.carot.com/v2/'
      this.apiV3url = 'https://fleet.carot.com/v3/'
    } else if (window.location.hostname === 'fcsdl.carot.com') {
      this.apiRestUrl = 'https://lucknow.carot.com/api/rest/'            // for fcsdl //
      this.apiV2url = 'https://lucknow.carot.com/v2/'
      this.apiV3url = 'https://lucknow.carot.com/v3/'
    } else if (window.location.hostname === 'smlsaarthi.com') {
      this.apiRestUrl = 'https://www.smlsaarthi.com/api/rest/'           // for smlsarthi //
      this.apiV2url = 'https://www.smlsaarthi.com/v2/'
      this.apiV3url = 'https://www.smlsaarthi.com/v3/'
    } else if (window.location.hostname === 'adminportal.carot.com') {
      this.apiRestUrl = 'https://fleet.carot.com/api/rest/'           // for adminportal //
      this.apiV2url = 'https://fleet.carot.com/v2/'
      this.apiV3url = 'https://fleet.carot.com/v3/'
    } else if (window.location.hostname === 'okinawa.carot.com') {
      this.apiRestUrl = 'https://okinawa.carot.com/api/rest/'           // for okinawa portal //
      this.apiV2url = 'https://okinawa.carot.com/v2/'
      this.apiV3url = 'https://okinawasmlsaarthi.carot.com/v3/'
    } else {
      // this.apiRestUrl = 'https://qa8.carot.com/api/rest/'           // for local     //
      // this.apiV2url = 'https://qa8.carot.com/v2/'
      // this.apiV3url = 'https://qa8.carot.com/v3/'

      this.apiRestUrl = 'https://fcsdl.carot.com/api/rest/'           // for local     //
      this.apiV2url = 'https://fcsdl.carot.com/v2/'
      this.apiV3url = 'https://fcsdl.carot.com/v3/'

      // this.apiRestUrl = 'https://okinawa.carot.com/api/rest/'           // for okinawa portal //
      // this.apiV2url = 'https://okinawa.carot.com/v2/'
      // this.apiV3url = 'https://okinawasmlsaarthi.carot.com/v3/'

      // this.apiRestUrl = 'https://fleet.carot.com/api/rest/'           // for adminportal //
      // this.apiV2url = 'https://fleet.carot.com/v2/'
      // this.apiV3url = 'https://fleet.carot.com/v3/'

      // this.apiRestUrl = 'https://www.smlsaarthi.com/api/rest/'           // for smlsarthi //
      // this.apiV2url = 'https://www.smlsaarthi.com/v2/'
      // this.apiV3url = 'https://www.smlsaarthi.com/v3/'

      // this.apiRestUrl = 'https://www.carot.com/api/rest/'
      // this.apiV2url = 'https://www.carot.com/v2/'

      // this.apiRestUrl = 'https://lucknow.carot.com/api/rest/'           // for qafleet-pro //
      // this.apiV2url = 'https://lucknow.carot.com/v2/'

      // this.apiRestUrl = 'https://www.smlsaarthi.com/api/rest/'           // for smlsarthi //
      // this.apiV2url = 'https://www.smlsaarthi.com/v2/'
    }



  }


}
