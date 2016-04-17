import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {DashboardService} from './dashboard.service';

@Component({
  selector: 'dashboard',
  template: require('./dashboard.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, ROUTER_PROVIDERS, DashboardService]
})
export class DashboardComponent implements OnInit {
  public response:Object;

  constructor(private _router:Router, private _dashboardService:DashboardService) {

  }

  ngOnInit() {
    this._dashboardService.getData().subscribe(
      data => this.response = data
    );
  }

  onLogout() {
    localStorage.removeItem("token");
    this._router.navigate(['Landing']);
  }

  onReset() {
    this._router.navigate(['Reset']);
  }
}