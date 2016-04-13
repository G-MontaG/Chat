import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {ForgotService} from './forgot.service';
import {Router} from "angular2/router";

@Component({
  selector: 'forgot',
  template: require('./forgot.component.html'),
  directives: [],
  providers: [ForgotService]
})
export class ForgotComponent implements OnInit {
  public forgotModel = {
    email: '',
    token: '',
    password: ''
  };
  public confirmPassword:string = '';

  constructor(private _forgot:ForgotService,
              private _router:Router) {
  }

  ngOnInit() {
  }

  onForgotSubmitEmail() {
    this._forgot.postEmail({email: this.forgotModel.email}).subscribe(

    );
  }

  onForgotSubmitToken() {
    this._forgot.postToken({token: this.forgotModel.token}).subscribe(

    );
  }

  onForgotSubmitPassword() {
    this._forgot.postPassword({password: this.forgotModel.password}).subscribe(

    );
  }

  toLogin() {
    this._router.navigate(['Login']);
  }

  toSignup() {
    this._router.navigate(['Signup']);
  }
}