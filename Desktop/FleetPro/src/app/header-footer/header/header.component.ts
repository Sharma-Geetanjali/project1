import { Component, OnInit } from '@angular/core';
import { ThemeServiceService } from 'src/app/Services/Theme-Service/theme-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public theme: ThemeServiceService) { }

  ngOnInit(): void {
  }

}
