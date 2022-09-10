import { Component } from '@angular/core';
import { GlobalConfigService } from './Services/Global/global-config.service';
import { ThemeServiceService } from './Services/Theme-Service/theme-service.service';
import { UrlServiceService } from './Services/Url/url-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fleet-Pro';


  constructor(private theme: ThemeServiceService, private url: UrlServiceService, private global: GlobalConfigService) {
    theme.loadXML();
    url.checkUrl();
    global.changeImgpath();
    // global.getGroupListData();
    // global.getConsignorListData();
    // global.getConsigneeListData();
   }
}
