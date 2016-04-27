import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {GoogleComponent} from './auth/google.component';
import {VerifyComponent} from './verify/verify.component';
import {ForgotComponent} from './forgot/forgot.component';
import {ResetComponent} from './reset/reset.component';
import {DashboardComponent} from './dashboard/dashboard.component';

@Component({
  selector: 'app',
  template: require('./app.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  {path: '/landing', name: 'Landing', component: LandingComponent, useAsDefault: true},
  {path: '/login', name: 'Login', component: LoginComponent},
  {path: '/signup/...', name: 'Signup', component: SignupComponent},
  {path: '/google-auth/code', name: 'Google', component: GoogleComponent},
  {path: '/verify', name: 'Verify', component: VerifyComponent},
  {path: '/forgot', name: 'Forgot', component: ForgotComponent},
  {path: '/reset', name: 'Reset', component: ResetComponent},
  {path: '/dashboard', name: 'Dashboard', component: DashboardComponent},
])
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}