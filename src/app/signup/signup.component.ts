import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {RouteConfig, RouterOutlet, Router} from 'angular2/router';

import {SignupExternalComponent} from "./signup-external.component";
import {SignupLocalComponent} from "./signup-local.component";

@Component({
  selector: 'signup',
  template: require('./signup.component.html'),
  directives: [RouterOutlet],
  providers: []
})
@RouteConfig([
  {path: '/', name: 'SignupExternal', component: SignupExternalComponent, useAsDefault: true},
  {path: '/signup-local', name: 'SignupLocal', component: SignupLocalComponent},
])
export class SignupComponent implements OnInit {
  constructor(private _router:Router) {
  }

  ngOnInit() {
  }

  toLogin() {
    this._router.navigate(['Login']);
  }
}