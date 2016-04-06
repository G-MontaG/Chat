import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from "angular2/router";

@Component({
  selector: 'langing',
  template: require('./landing.component.html'),
  directives: [],
  providers: []
})
export class LandingComponent implements OnInit {
  constructor(private _router:Router) {
  }

  ngOnInit() {
  }

  toLogin() {
    this._router.navigate(['Login']);
  }

  toSignup() {
    this._router.navigate(['Signup']);
  }
}