import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {DashboardService} from './dashboard.service';

@Component({
  selector: 'dashboard',
  template: require('./dashboard.component.html'),
  directives: [],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  public response: Object;
  constructor(private _dashboardService: DashboardService) {

  }

  ngOnInit() {
    this._dashboardService.getData().subscribe(
      data => this.response = data
  );
  }
}