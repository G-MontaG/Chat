import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {LoginLocalComponent} from './login-local.component';
import {LoginExternalComponent} from './login-external.component';

@Component({
  selector: 'login',
  template: require('./login.component.html'),
  directives: [RouterOutlet],
  providers: []
})
@RouteConfig([
  {path: '/', name: 'LoginExternal', component: LoginExternalComponent, useAsDefault: true},
  {path: '/login-local', name: 'LoginLocal', component: LoginLocalComponent},
])
export class LoginComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}