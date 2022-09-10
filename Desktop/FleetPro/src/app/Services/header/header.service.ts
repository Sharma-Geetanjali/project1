import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }

  showDateFilter = false;

  private apiCall = new Subject<boolean>();
  private startDate = new Subject<any>();
  private endDate = new Subject<any>();
  private refresh = new Subject<any>();
  private filterForm = new Subject<any>();
  private groupList2 = new Subject<any>();

  // Observable string streams
  startDate$ = this.startDate.asObservable();
  endDate$ = this.endDate.asObservable();
  apiCall$ = this.apiCall.asObservable();
  refresh$ = this.refresh.asObservable();
  filterForm$ = this.filterForm.asObservable();
  groupList2$ = this.groupList2.asObservable();

  // Service message commands
  setStartDate(dateVal: any) {
    this.startDate.next(dateVal);
  }

  setEndDate(dateVal: any) {
    this.endDate.next(dateVal);
  }

  setApiCAll() {
    this.apiCall.next(true);
  }

  refreshCall() {
    this.refresh.next(true);
  }

  goFilter() {
    this.filterForm.next(true);
  }

  refreshGroupList(){
    this.groupList2.next(true);
  }




}
