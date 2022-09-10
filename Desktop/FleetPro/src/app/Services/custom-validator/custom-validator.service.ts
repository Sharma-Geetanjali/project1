import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CustomValidatorService {

  constructor() { }
}


export class UsernameValidator {
  static cannotContainSpace(control: AbstractControl)  {
      if((control.value as string).indexOf(' ') >= 0){
          return {cannotContainSpace: true}
      }


    return null;
  }

  static frontSpace(control: AbstractControl)  {
    if((control.value || '' ).trim().length === 0){
        return {frontSpace: true}
    }


  return null;
}

}
