import {Control} from "angular2/common";

export class FormValidationService {
  constructor() {
  }

  static isEmail(control:Control):{[key:string]:boolean} {
    let emailRegExp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (control.value.match(emailRegExp)) {
      return {"isEmail": false};
    }
    return {"isEmail": true};
  }

  static isPassword(control:Control):{[key:string]:boolean} {
    let passwordRegExp = /^(?=\.*?[A-Z])(?=\.*?[a-z])(?=\.*?[0-9])(?=\.*?[#?!@$%^&*-])\.{8,}$/;
    if (control.value.match(passwordRegExp)) {
      return {"isPassword": false};
    }
    return {"isPassword": true}
  }
}