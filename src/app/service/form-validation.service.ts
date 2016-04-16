import {Injectable} from 'angular2/core';
import {Control} from "angular2/common";

@Injectable()
export class FormValidationService {
  constructor() {
  }

  static isEmail(control:Control):{[key:string]:boolean} {
    let emailRegExp = new RegExp("^[-a-z0-9~!$%^&*_=+}{'?]+(.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(.[-a-z0-9_]+)*.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}))(:[0-9]{1,5})?$", 'i');
    if (control.value.match(emailRegExp)) {
      return null;
    }
    return {isEmail: false};
  }

  static isPassword(control:Control):{[key:string]:boolean} {
    let passwordRegExp = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    if (control.value.match(passwordRegExp)) {
      return null;
    }
    return {isPassword: false};
  }

  static isNotNumber(control:Control):{[key:string]:boolean} {
    let numberRegExp = new RegExp("[^\d]");
    if (control.value.match(numberRegExp)) {
      return null;
    }
    return {isNotNumber: false};
  }
  
  static isEqual(control: Control):{[key:string]:boolean} {
    if (control.value) {
      return null;
    }
    return {isEqual: false};
  }
}