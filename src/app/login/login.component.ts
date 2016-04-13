import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {ControlGroup, FormBuilder, Control, Validators, FORM_DIRECTIVES} from "angular2/common";
import {Router} from "angular2/router";

import {LoginService} from "./login.service";
import {FormValidationService} from "../service/form-validation.service";

@Component({
  selector: 'login',
  template: require('./login.component.html'),
  directives: [FORM_DIRECTIVES],
  providers: [LoginService, FormValidationService]
})
export class LoginComponent implements OnInit {
  loginForm:ControlGroup;

  constructor(private _router:Router,
              private _loginService:LoginService,
              private _formBuilder:FormBuilder) {
    this.loginForm = _formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        FormValidationService.isEmail
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        FormValidationService.isPassword
      ])]
    });
  }

  ngOnInit() {
  }

  onLoginSubmit(form) {
    console.log(form);
    this._loginService.postLogin(this.loginForm.value).subscribe(
      data => this._router.navigate(['Dashboard'])
    );
  }

  toSignup() {
    this._router.navigate(['Signup']);
  }

  toForgot() {
    this._router.navigate(['Forgot']);
  }
}