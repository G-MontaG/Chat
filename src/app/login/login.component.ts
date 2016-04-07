import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from "angular2/router";

import {LoginService} from "./login.service";

@Component({
  selector: 'login',
  template: require('./login.component.html'),
  directives: [],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  public loginModel = {
    email: '',
    password:''
  };
  constructor(private _router:Router, private _loginService: LoginService) {
  }

  ngOnInit() {
  }

  onLoginSubmit() {
    console.log(this.loginModel);
    //this._loginService.postLogin({});
  }

  toSignup() {
    this._router.navigate(['Signup']);
  }
}