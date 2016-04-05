import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';

@Component({
  selector: 'app',
  template: `<h1>Component Router</h1>
<nav>
  <a [routerLink]="['Login']">Login</a>
  <a [routerLink]="['Signup']">Signup</a>
</nav>
<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  {path: '/login', name: 'Login', component: LoginComponent},
  {path: '/signup', name: 'Signup', component: SignupComponent},
])
export class AppComponent implements OnInit {
  constructor() {

  }

  ngOnInit() {
  }
}