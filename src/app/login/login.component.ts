import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {ControlGroup, FormBuilder, Control, Validators} from "angular2/common";
import {Router} from "angular2/router";

import {LoginService} from "./login.service";

@Component({
  selector: 'login',
  template: require('./login.component.html'),
  directives: [],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  loginForm:ControlGroup;
  email: Control;
  password: Control;

  constructor(private _router:Router,
              private _loginService:LoginService,
              private _formBuilder:FormBuilder) {
    this.email = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ]));
    this.password = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ]));

    this.loginForm = _formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit() {
  }

  onLoginSubmit() {
    console.log(this.loginForm.value);
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