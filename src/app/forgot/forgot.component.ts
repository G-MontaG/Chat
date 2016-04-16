import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {ForgotService} from './forgot.service';
import {Router} from "angular2/router";
import {ControlGroup, Control, FORM_DIRECTIVES, FormBuilder, Validators} from "angular2/common";
import {FormValidationService} from "../service/form-validation.service";

@Component({
  selector: 'forgot',
  template: require('./forgot.component.html'),
  directives: [FORM_DIRECTIVES],
  providers: [ForgotService, FormValidationService]
})
export class ForgotComponent implements OnInit {
  forgotFormEmail:ControlGroup;
  email: Control;
  forgotFormToken:ControlGroup;
  token: Control;
  forgotFormPassword:ControlGroup;
  password: Control;
  confirm: Control;

  constructor(private _forgot:ForgotService,
              private _router:Router,
              private _formBuilder:FormBuilder) {
    this.email = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      FormValidationService.isEmail
    ]));
    this.token = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
      FormValidationService.isNotNumber
    ]));
    this.password = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.confirm = new Control('', Validators.compose([
      Validators.required
    ]));
    this.forgotFormEmail = _formBuilder.group({
      email: this.email,
    });
    this.forgotFormToken = _formBuilder.group({
      token: this.token,
    });
    this.forgotFormPassword = _formBuilder.group({
      password: this.password,
      confirm: this.confirm
    });
  }

  ngOnInit() {
  }

  onForgotSubmitEmail() {
    this._forgot.postEmail(this.forgotFormEmail.value).subscribe(

    );
  }

  onForgotSubmitToken() {
    this._forgot.postToken(this.forgotFormToken.value).subscribe(

    );
  }

  onForgotSubmitPassword() {
    this._forgot.postPassword(this.forgotFormPassword.value).subscribe(

    );
  }

  toLogin() {
    this._router.navigate(['Login']);
  }

  toSignup() {
    this._router.navigate(['Signup']);
  }
}