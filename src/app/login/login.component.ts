import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from "angular2/router";

@Component({
  selector: 'login',
  template: require('./login.component.html'),
  directives: [],
  providers: []
})
export class LoginComponent implements OnInit {
  constructor(private _router:Router) {
  }

  ngOnInit() {
  }

  toSignup() {
    this._router.navigate(['Signup']);
  }
}