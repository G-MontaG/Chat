import {Injectable} from 'angular2/core';
import {Control} from "angular2/common";

@Injectable()
export class FormValidationService {
  private password;
  constructor() {
    this.password = '';
  }

  static isEmail(control:Control):{[key:string]:boolean} {
    let emailRegExp = new RegExp("^[-a-z0-9~!$%^&*_=+}{'?]+(.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(.[-a-z0-9_]+)*.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}))(:[0-9]{1,5})?$", 'i');
    if (control.value.match(emailRegExp)) {
      return null;
    }
    return {isEmail: false};
  }

  static isPassword(control:Control):{[key:string]:boolean} {
    let passwordRegExp = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()\=_+,./<>?;':\"|{}]).{8,}$");
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

  public isEqual(control: Control) {
    if (control.value === this.password.value) {
      return null;
    }
    return {isEqual: false};
  }
}